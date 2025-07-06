"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracketService = void 0;
const data_source_1 = require("../data-source");
const Match_1 = require("../entity/Match");
const Tournament_1 = require("../entity/Tournament");
const TournamentParticipant_1 = require("../entity/TournamentParticipant");
class BracketService {
    static async generateKnockoutBracket(tournamentId) {
        // Use the new full bracket generation method
        return this.generateFullTournamentBracket(tournamentId);
    }
    static async generateRoundRobinBracket(tournamentId) {
        const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
        const participantRepository = data_source_1.AppDataSource.getRepository(TournamentParticipant_1.TournamentParticipant);
        const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
        // Get tournament
        const tournament = await tournamentRepository.findOne({
            where: { id: tournamentId },
        });
        if (!tournament) {
            throw new Error("Tournament not found");
        }
        const participants = await participantRepository.find({
            where: { tournamentId },
            relations: ["user"],
        });
        if (participants.length < 2) {
            throw new Error("Not enough participants for round robin");
        }
        const matches = [];
        // Generate all possible pairings
        for (let i = 0; i < participants.length; i++) {
            for (let j = i + 1; j < participants.length; j++) {
                matches.push({
                    tournamentId: tournamentId,
                    round: 1, // All matches in round 1 for round robin
                    player1Id: participants[i].userId,
                    player2Id: participants[j].userId,
                    status: "scheduled",
                    startTime: tournament.startDate,
                    canStartEarly: true, // Allow early start for all matches
                });
            }
        }
        const savedMatches = await matchRepository.save(matches);
        // Update tournament status to "ongoing"
        await tournamentRepository.update(tournamentId, { status: "ongoing" });
        return savedMatches;
    }
    static calculateRounds(participantCount, format) {
        if (format === "knockout") {
            return Math.ceil(Math.log2(participantCount));
        }
        else if (format === "round_robin") {
            return 1; // All matches in one "round"
        }
        return 1;
    }
    static async generateNextRound(tournamentId) {
        const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
        const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
        const tournament = await tournamentRepository.findOne({
            where: { id: tournamentId },
        });
        if (!tournament) {
            throw new Error("Tournament not found");
        }
        if (tournament.format === "knockout") {
            return this.generateNextKnockoutRound(tournamentId);
        }
        else if (tournament.format === "round-robin") {
            // Round robin doesn't have progressive rounds
            throw new Error("Round robin tournaments don't have progressive rounds");
        }
        return [];
    }
    static async generateNextKnockoutRound(tournamentId) {
        const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
        // Get all matches for this tournament
        const allMatches = await matchRepository.find({
            where: { tournamentId },
            order: { round: "DESC", createdAt: "ASC" },
        });
        if (allMatches.length === 0) {
            throw new Error("No matches found for tournament");
        }
        // Find the current highest round
        const currentRound = allMatches[0].round;
        // Get all completed matches from the current round
        const currentRoundMatches = allMatches.filter((match) => match.round === currentRound && match.status === "completed");
        // Get all matches from the current round (to check if round is complete)
        const totalCurrentRoundMatches = allMatches.filter((match) => match.round === currentRound);
        // Check if current round is complete
        if (currentRoundMatches.length !== totalCurrentRoundMatches.length) {
            throw new Error("Current round is not complete yet");
        }
        // Get winners from current round
        const winners = currentRoundMatches
            .map((match) => match.winner)
            .filter((winner) => winner !== null && winner !== undefined);
        // Check if we have enough winners for next round
        if (winners.length < 2) {
            // Tournament is complete
            throw new Error("Tournament is complete - only one winner remains");
        }
        // Generate next round matches
        const nextRound = currentRound + 1;
        const nextRoundMatches = [];
        // Get tournament start time for scheduling
        const tournament = await data_source_1.AppDataSource.getRepository(Tournament_1.Tournament).findOne({
            where: { id: tournamentId },
        });
        const baseStartTime = tournament?.startDate || new Date();
        const nextRoundStartTime = new Date(baseStartTime);
        nextRoundStartTime.setHours(baseStartTime.getHours() + currentRound * 2); // Space rounds 2 hours apart
        // Pair winners for next round
        for (let i = 0; i < winners.length; i += 2) {
            if (winners[i + 1]) {
                const matchStartTime = new Date(nextRoundStartTime);
                matchStartTime.setMinutes(nextRoundStartTime.getMinutes() + (i / 2) * 30); // Space matches 30 minutes apart
                nextRoundMatches.push({
                    tournamentId: tournamentId,
                    round: nextRound,
                    player1Id: winners[i],
                    player2Id: winners[i + 1],
                    status: "scheduled",
                    startTime: matchStartTime,
                    canStartEarly: true, // Allow early start for all matches
                });
            }
        }
        // Handle odd number of winners (bye)
        if (winners.length % 2 === 1) {
            const byeWinner = winners[winners.length - 1];
            const matchStartTime = new Date(nextRoundStartTime);
            matchStartTime.setMinutes(nextRoundStartTime.getMinutes() + Math.floor(winners.length / 2) * 30);
            nextRoundMatches.push({
                tournamentId: tournamentId,
                round: nextRound,
                player1Id: byeWinner,
                player2Id: byeWinner, // Same player for bye
                status: "completed",
                winner: byeWinner,
                startTime: matchStartTime,
                canStartEarly: false, // Bye matches don't need early start
            });
        }
        // Save new matches
        const savedMatches = await matchRepository.save(nextRoundMatches);
        return savedMatches;
    }
    static async checkAndGenerateNextRound(tournamentId) {
        try {
            const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
            // Get tournament
            const tournament = await data_source_1.AppDataSource.getRepository(Tournament_1.Tournament).findOne({
                where: { id: tournamentId },
            });
            if (!tournament || tournament.format !== "knockout") {
                return { nextRoundGenerated: false };
            }
            // Get all matches for this tournament
            const allMatches = await matchRepository.find({
                where: { tournamentId },
                order: { round: "DESC", createdAt: "ASC" },
            });
            if (allMatches.length === 0) {
                return { nextRoundGenerated: false };
            }
            const currentRound = allMatches[0].round;
            // Get all matches from the current round
            const currentRoundMatches = allMatches.filter((match) => match.round === currentRound);
            // Check if all matches in current round are completed
            const completedMatches = currentRoundMatches.filter((match) => match.status === "completed");
            if (completedMatches.length === currentRoundMatches.length) {
                // Current round is complete, check if we can generate next round
                const winners = completedMatches
                    .map((match) => match.winner)
                    .filter((winner) => winner !== null && winner !== undefined);
                if (winners.length === 1) {
                    // Tournament is complete
                    await data_source_1.AppDataSource.getRepository(Tournament_1.Tournament).update(tournamentId, {
                        status: "completed",
                    });
                    return { nextRoundGenerated: false };
                }
                else if (winners.length >= 2) {
                    // Generate next round
                    const nextRoundMatches = await this.generateNextKnockoutRound(tournamentId);
                    return { nextRoundGenerated: true, matches: nextRoundMatches };
                }
            }
            return { nextRoundGenerated: false };
        }
        catch (error) {
            console.error("Error checking/generating next round:", error);
            return { nextRoundGenerated: false };
        }
    }
    static async generateFullTournamentBracket(tournamentId) {
        const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
        const participantRepository = data_source_1.AppDataSource.getRepository(TournamentParticipant_1.TournamentParticipant);
        const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
        // Get tournament and participants
        const tournament = await tournamentRepository.findOne({
            where: { id: tournamentId },
        });
        if (!tournament) {
            throw new Error("Tournament not found");
        }
        const participants = await participantRepository.find({
            where: { tournamentId },
            relations: ["user"],
        });
        if (participants.length < 2) {
            throw new Error("Not enough participants to generate bracket");
        }
        if (tournament.format !== "knockout") {
            // For non-knockout tournaments, use existing methods
            if (tournament.format === "round-robin") {
                return this.generateRoundRobinBracket(tournamentId);
            }
            throw new Error("Unsupported tournament format");
        }
        // For knockout tournaments, generate all rounds at once
        const seededParticipants = participants.sort((a, b) => b.user.rating - a.user.rating);
        const totalRounds = Math.ceil(Math.log2(seededParticipants.length));
        const allMatches = [];
        let currentRoundParticipants = [...seededParticipants];
        let currentRound = 1;
        while (currentRoundParticipants.length > 1) {
            const roundMatches = [];
            const nextRoundParticipants = [];
            // Calculate start time for this round
            const roundStartTime = new Date(tournament.startDate);
            roundStartTime.setHours(tournament.startDate.getHours() + (currentRound - 1) * 2);
            // Generate matches for current round
            for (let i = 0; i < currentRoundParticipants.length; i += 2) {
                const matchStartTime = new Date(roundStartTime);
                matchStartTime.setMinutes(roundStartTime.getMinutes() + (i / 2) * 30);
                if (currentRoundParticipants[i + 1]) {
                    // Regular match
                    roundMatches.push({
                        tournamentId: tournamentId,
                        round: currentRound,
                        player1Id: currentRoundParticipants[i].userId,
                        player2Id: currentRoundParticipants[i + 1].userId,
                        status: "scheduled",
                        startTime: matchStartTime,
                        canStartEarly: true, // Allow early start for all matches
                    });
                    // For subsequent rounds, we'll use placeholder logic
                    // The actual winner will be determined when matches are played
                    nextRoundParticipants.push({
                        userId: `winner_of_match_${currentRound}_${i / 2 + 1}`,
                        isPlaceholder: true,
                    });
                }
                else {
                    // Bye match
                    roundMatches.push({
                        tournamentId: tournamentId,
                        round: currentRound,
                        player1Id: currentRoundParticipants[i].userId,
                        player2Id: currentRoundParticipants[i].userId,
                        status: "completed",
                        winner: currentRoundParticipants[i].userId,
                        startTime: matchStartTime,
                        canStartEarly: false, // Bye matches don't need early start
                    });
                    nextRoundParticipants.push(currentRoundParticipants[i]);
                }
            }
            allMatches.push(...roundMatches);
            currentRoundParticipants = nextRoundParticipants.filter((p) => !p.isPlaceholder);
            currentRound++;
            // For now, only generate the first round with real participants
            // Subsequent rounds will be generated automatically as matches complete
            if (currentRound > 1) {
                break;
            }
        }
        // Save only the first round matches
        const savedMatches = await matchRepository.save(allMatches);
        // Update tournament status to "ongoing"
        await tournamentRepository.update(tournamentId, { status: "ongoing" });
        return savedMatches;
    }
}
exports.BracketService = BracketService;
