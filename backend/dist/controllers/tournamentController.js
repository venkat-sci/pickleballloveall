"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveTournament = exports.joinTournament = exports.deleteTournament = exports.updateTournament = exports.createTournament = exports.getTournamentById = exports.getAllTournaments = void 0;
const data_source_1 = require("../data-source");
const Tournament_1 = require("../entity/Tournament");
const User_1 = require("../entity/User");
const Player_1 = require("../entity/Player");
const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const playerRepository = data_source_1.AppDataSource.getRepository(Player_1.Player);
const getAllTournaments = async (req, res) => {
    try {
        const tournaments = await tournamentRepository.find({
            relations: ["organizer", "participants", "courts", "matches"],
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
            relations: ["organizer", "participants", "courts", "matches"],
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
        const existingPlayer = await playerRepository.findOne({
            where: { userId, tournamentId: id },
        });
        if (existingPlayer) {
            res.status(400).json({ error: "Already joined this tournament" });
            return;
        }
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Create player entry
        const player = playerRepository.create({
            userId,
            name: user.name,
            rating: user.rating,
            tournamentId: id,
        });
        await playerRepository.save(player);
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
        const player = await playerRepository.findOne({
            where: { userId, tournamentId: id },
        });
        if (!player) {
            res.status(400).json({ error: "Not a participant in this tournament" });
            return;
        }
        await playerRepository.remove(player);
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
