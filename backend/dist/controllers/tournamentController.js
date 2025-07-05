"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchSchedule = exports.getTournamentBracketView = exports.startTournament = exports.leaveTournament = exports.joinTournament = exports.deleteTournament = exports.updateTournament = exports.createTournament = exports.getTournamentById = exports.getAllTournaments = void 0;
const data_source_1 = require("../data-source");
const Tournament_1 = require("../entity/Tournament");
const User_1 = require("../entity/User");
const TournamentParticipant_1 = require("../entity/TournamentParticipant");
const BracketService_1 = require("../services/BracketService");
const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const tournamentParticipantRepository = data_source_1.AppDataSource.getRepository(TournamentParticipant_1.TournamentParticipant);
const getAllTournaments = async (req, res) => {
    try {
        const tournaments = await tournamentRepository.find({
            relations: [
                "organizer",
                "participants",
                "participants.user",
                "matches",
                "matches.player1",
                "matches.player2",
            ],
        });
        res.json({ data: tournaments });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch tournaments" });
    }
};
exports.getAllTournaments = getAllTournaments;
const getTournamentById = async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await tournamentRepository.findOne({
            where: { id },
            relations: [
                "organizer",
                "participants",
                "participants.user",
                "matches",
                "matches.player1",
                "matches.player2",
                "courts",
            ],
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        res.json({ data: tournament });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch tournament" });
    }
};
exports.getTournamentById = getTournamentById;
const createTournament = async (req, res) => {
    try {
        const { name, description, type, format, startDate, endDate, location, maxParticipants, entryFee, prizePool, } = req.body;
        const userId = req.user.userId;
        // Verify that the user exists
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const organizer = await userRepository.findOne({
            where: { id: userId },
        });
        if (!organizer) {
            res.status(404).json({ error: "Organizer not found" });
            return;
        }
        const tournament = tournamentRepository.create({
            name,
            description,
            type,
            format,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            location,
            maxParticipants,
            organizerId: userId,
            entryFee,
            prizePool,
        });
        const savedTournament = await tournamentRepository.save(tournament);
        const fullTournament = await tournamentRepository.findOne({
            where: { id: savedTournament.id },
            relations: ["organizer", "participants", "courts", "matches"],
        });
        res.status(201).json({ data: fullTournament });
    }
    catch (error) {
        console.error("Error creating tournament:", error);
        res.status(500).json({ error: "Failed to create tournament" });
    }
};
exports.createTournament = createTournament;
const updateTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const tournament = await tournamentRepository.findOne({
            where: { id },
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        // Check if user is the organizer
        const userId = req.user.userId;
        if (tournament.organizerId !== userId) {
            res
                .status(403)
                .json({ error: "Not authorized to update this tournament" });
            return;
        }
        await tournamentRepository.update(id, updateData);
        const updatedTournament = await tournamentRepository.findOne({
            where: { id },
            relations: ["organizer", "participants", "courts", "matches"],
        });
        res.json({ data: updatedTournament });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update tournament" });
    }
};
exports.updateTournament = updateTournament;
const deleteTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await tournamentRepository.findOne({
            where: { id },
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        // Check if user is the organizer
        const userId = req.user.userId;
        if (tournament.organizerId !== userId) {
            res
                .status(403)
                .json({ error: "Not authorized to delete this tournament" });
            return;
        }
        await tournamentRepository.remove(tournament);
        res.json({ message: "Tournament deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete tournament" });
    }
};
exports.deleteTournament = deleteTournament;
const joinTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const tournament = await tournamentRepository.findOne({
            where: { id },
            relations: ["participants"],
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        if (tournament.currentParticipants >= tournament.maxParticipants) {
            res.status(400).json({ error: "Tournament is full" });
            return;
        }
        // Check if user is already a participant
        const existingParticipant = await tournamentParticipantRepository.findOne({
            where: { userId, tournamentId: id },
        });
        if (existingParticipant) {
            res.status(400).json({ error: "Already joined this tournament" });
            return;
        }
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Create tournament participant entry
        const participant = tournamentParticipantRepository.create({
            userId,
            tournamentId: id,
            tournamentWins: 0,
            tournamentLosses: 0,
            tournamentGamesPlayed: 0,
        });
        await tournamentParticipantRepository.save(participant);
        // Update participant count
        await tournamentRepository.update(id, {
            currentParticipants: tournament.currentParticipants + 1,
        });
        res.json({ message: "Successfully joined tournament" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to join tournament" });
    }
};
exports.joinTournament = joinTournament;
const leaveTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const tournament = await tournamentRepository.findOne({
            where: { id },
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        const participant = await tournamentParticipantRepository.findOne({
            where: { userId, tournamentId: id },
        });
        if (!participant) {
            res.status(400).json({ error: "Not a participant in this tournament" });
            return;
        }
        await tournamentParticipantRepository.remove(participant);
        // Update participant count
        await tournamentRepository.update(id, {
            currentParticipants: tournament.currentParticipants - 1,
        });
        res.json({ message: "Successfully left tournament" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to leave tournament" });
    }
};
exports.leaveTournament = leaveTournament;
const startTournament = async (req, res) => {
    try {
        const { id } = req.params;
        const authenticatedUser = req.user;
        const tournament = await tournamentRepository.findOne({
            where: { id },
            relations: ["organizer"],
        });
        if (!tournament) {
            res.status(404).json({
                message: "Tournament not found",
            });
            return;
        }
        // Only organizer can start tournament
        if (tournament.organizerId !== authenticatedUser.userId) {
            res.status(403).json({
                message: "Only the tournament organizer can start the tournament",
            });
            return;
        }
        // Check if tournament can be started
        if (tournament.status !== "upcoming") {
            res.status(400).json({
                message: "Tournament can only be started if it's in 'upcoming' status",
            });
            return;
        }
        if (tournament.currentParticipants < 2) {
            res.status(400).json({
                message: "Tournament needs at least 2 participants to start",
            });
            return;
        }
        // Generate bracket based on tournament format
        let matches;
        if (tournament.format === "knockout") {
            matches = await BracketService_1.BracketService.generateFullTournamentBracket(id);
        }
        else if (tournament.format === "round-robin") {
            matches = await BracketService_1.BracketService.generateRoundRobinBracket(id);
        }
        else {
            res.status(400).json({
                message: "Unsupported tournament format",
            });
            return;
        }
        // Get updated tournament
        const updatedTournament = await tournamentRepository.findOne({
            where: { id },
            relations: ["organizer", "participants", "matches"],
        });
        res.status(200).json({
            message: "Tournament started successfully",
            data: {
                tournament: updatedTournament,
                matches,
            },
        });
    }
    catch (error) {
        console.error("Error starting tournament:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.startTournament = startTournament;
const getTournamentBracketView = async (req, res) => {
    try {
        const { id } = req.params;
        const tournament = await tournamentRepository.findOne({
            where: { id },
            relations: [
                "organizer",
                "participants",
                "participants.user",
                "matches",
                "matches.player1",
                "matches.player2",
                "matches.court",
            ],
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        // Group matches by round
        const matchesByRound = tournament.matches.reduce((acc, match) => {
            if (!acc[match.round]) {
                acc[match.round] = [];
            }
            acc[match.round].push(match);
            return acc;
        }, {});
        // Calculate tournament progress
        const totalMatches = tournament.matches.length;
        const completedMatches = tournament.matches.filter((m) => m.status === "completed").length;
        const inProgressMatches = tournament.matches.filter((m) => m.status === "in-progress").length;
        const scheduledMatches = tournament.matches.filter((m) => m.status === "scheduled").length;
        const currentRound = tournament.matches.length > 0 ?
            Math.min(...tournament.matches
                .filter((m) => m.status !== "completed")
                .map((m) => m.round)) ||
                Math.max(...tournament.matches.map((m) => m.round)) : 0;
        res.json({
            data: {
                tournament: {
                    id: tournament.id,
                    name: tournament.name,
                    type: tournament.type,
                    format: tournament.format,
                    status: tournament.status,
                    organizer: tournament.organizer,
                    startDate: tournament.startDate,
                    endDate: tournament.endDate,
                    location: tournament.location,
                    currentParticipants: tournament.currentParticipants,
                    maxParticipants: tournament.maxParticipants,
                },
                bracket: matchesByRound,
                participants: tournament.participants,
                stats: {
                    totalMatches,
                    completedMatches,
                    inProgressMatches,
                    scheduledMatches,
                    currentRound,
                    totalRounds: Math.max(...Object.keys(matchesByRound).map(Number), 0),
                    progress: totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0,
                },
            },
        });
    }
    catch (error) {
        console.error("Error fetching tournament bracket:", error);
        res.status(500).json({ error: "Failed to fetch tournament bracket" });
    }
};
exports.getTournamentBracketView = getTournamentBracketView;
const updateMatchSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { matchId, startTime, courtId } = req.body;
        const tournament = await tournamentRepository.findOne({
            where: { id },
            relations: ["matches"],
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        // Check if user is the organizer
        const userId = req.user?.userId;
        if (tournament.organizerId !== userId) {
            res.status(403).json({
                error: "Only tournament organizer can update match schedules"
            });
            return;
        }
        // Find and update the specific match
        const { Match } = require("../entity/Match");
        const matchRepository = data_source_1.AppDataSource.getRepository(Match);
        const match = await matchRepository.findOne({
            where: { id: matchId, tournamentId: id },
        });
        if (!match) {
            res.status(404).json({ error: "Match not found in this tournament" });
            return;
        }
        // Update match details
        if (startTime) {
            match.startTime = new Date(startTime);
        }
        if (courtId !== undefined) {
            match.courtId = courtId;
        }
        await matchRepository.save(match);
        res.json({
            message: "Match schedule updated successfully",
            data: match
        });
    }
    catch (error) {
        console.error("Error updating match schedule:", error);
        res.status(500).json({ error: "Failed to update match schedule" });
    }
};
exports.updateMatchSchedule = updateMatchSchedule;
