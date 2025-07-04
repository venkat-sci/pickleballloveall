"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracketService = void 0;
const data_source_1 = require("../data-source");
const Match_1 = require("../entity/Match");
const Tournament_1 = require("../entity/Tournament");
const TournamentParticipant_1 = require("../entity/TournamentParticipant");
class BracketService {
    static async generateKnockoutBracket(tournamentId) {
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
        // Seed participants based on their rating (highest rating gets best seed)
        const seededParticipants = participants.sort((a, b) => b.user.rating - a.user.rating);
        // Generate first round matches
        const matches = [];
        for (let i = 0; i < seededParticipants.length; i += 2) {
            if (seededParticipants[i + 1]) {
                matches.push({
                    tournamentId: tournamentId,
                    round: 1,
                    player1Id: seededParticipants[i].userId,
                    player2Id: seededParticipants[i + 1].userId,
                    status: "scheduled",
                    startTime: tournament.startDate,
                });
            }
        }
        // Handle odd number of participants (bye for highest seed)
        if (seededParticipants.length % 2 === 1) {
            const byePlayer = seededParticipants[0]; // Highest seed gets bye
            matches.push({
                tournamentId: tournamentId,
                round: 1,
                player1Id: byePlayer.userId,
                player2Id: byePlayer.userId, // Same player for bye
                status: "completed",
                winner: byePlayer.userId,
                startTime: tournament.startDate,
            });
        }
        // Save matches to database
        const savedMatches = await matchRepository.save(matches);
        // Update tournament status to "ongoing"
        await tournamentRepository.update(tournamentId, { status: "ongoing" });
        return savedMatches;
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
}
exports.BracketService = BracketService;
