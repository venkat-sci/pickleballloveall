"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMatch = exports.updateMatchStatus = exports.createMatch = exports.updateMatchScore = exports.getMatchById = exports.getMatchesByTournament = exports.getAllMatches = void 0;
const data_source_1 = require("../data-source");
const Match_1 = require("../entity/Match");
const Tournament_1 = require("../entity/Tournament");
const User_1 = require("../entity/User");
const Court_1 = require("../entity/Court");
const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const courtRepository = data_source_1.AppDataSource.getRepository(Court_1.Court);
const getAllMatches = async (req, res) => {
    try {
        const matches = await matchRepository.find({
            relations: ["tournament", "player1", "player2", "court"],
        });
        res.json({ data: matches });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch matches" });
    }
};
exports.getAllMatches = getAllMatches;
const getMatchesByTournament = async (req, res) => {
    try {
        const { tournamentId } = req.params;
        const matches = await matchRepository.find({
            where: { tournamentId },
            relations: ["tournament", "player1", "player2", "court"],
            order: { round: "ASC", startTime: "ASC" },
        });
        res.json({ data: matches });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch tournament matches" });
    }
};
exports.getMatchesByTournament = getMatchesByTournament;
const getMatchById = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await matchRepository.findOne({
            where: { id },
            relations: ["tournament", "player1", "player2", "court"],
        });
        if (!match) {
            res.status(404).json({ error: "Match not found" });
            return;
        }
        res.json({ data: match });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch match" });
    }
};
exports.getMatchById = getMatchById;
const updateMatchScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { score, winner } = req.body;
        const match = await matchRepository.findOne({
            where: { id },
            relations: ["player1", "player2"],
        });
        if (!match) {
            res.status(404).json({ error: "Match not found" });
            return;
        }
        // Update match score and status
        match.score = score;
        match.status = "completed";
        match.winner = winner;
        await matchRepository.save(match);
        // Update player statistics
        if (winner) {
            const winnerPlayer = winner === match.player1Id ? match.player1 : match.player2;
            const loserPlayer = winner === match.player1Id ? match.player2 : match.player1;
            await userRepository.update(winnerPlayer.id, {
                totalWins: winnerPlayer.totalWins + 1,
                totalGamesPlayed: winnerPlayer.totalGamesPlayed + 1,
            });
            await userRepository.update(loserPlayer.id, {
                totalLosses: loserPlayer.totalLosses + 1,
                totalGamesPlayed: loserPlayer.totalGamesPlayed + 1,
            });
        }
        res.json({ message: "Score updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update match score" });
    }
};
exports.updateMatchScore = updateMatchScore;
const createMatch = async (req, res) => {
    try {
        const { tournamentId, round, player1Id, player2Id, startTime, courtId } = req.body;
        const tournament = await tournamentRepository.findOne({
            where: { id: tournamentId },
        });
        if (!tournament) {
            res.status(404).json({ error: "Tournament not found" });
            return;
        }
        const player1 = await userRepository.findOne({
            where: { id: player1Id },
        });
        const player2 = await userRepository.findOne({
            where: { id: player2Id },
        });
        if (!player1 || !player2) {
            res.status(404).json({ error: "One or both players not found" });
            return;
        }
        const match = matchRepository.create({
            tournamentId,
            round,
            player1Id,
            player2Id,
            startTime: new Date(startTime),
            courtId,
        });
        const savedMatch = await matchRepository.save(match);
        const fullMatch = await matchRepository.findOne({
            where: { id: savedMatch.id },
            relations: ["tournament", "player1", "player2", "court"],
        });
        res.status(201).json({ data: fullMatch });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create match" });
    }
};
exports.createMatch = createMatch;
const updateMatchStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const match = await matchRepository.findOne({
            where: { id },
        });
        if (!match) {
            res.status(404).json({ error: "Match not found" });
            return;
        }
        match.status = status;
        await matchRepository.save(match);
        const updatedMatch = await matchRepository.findOne({
            where: { id },
            relations: ["tournament", "player1", "player2", "court"],
        });
        res.json({ data: updatedMatch });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update match status" });
    }
};
exports.updateMatchStatus = updateMatchStatus;
const deleteMatch = async (req, res) => {
    try {
        const { id } = req.params;
        const match = await matchRepository.findOne({ where: { id } });
        if (!match) {
            res.status(404).json({ error: "Match not found" });
            return;
        }
        await matchRepository.remove(match);
        res.json({ message: "Match deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete match" });
    }
};
exports.deleteMatch = deleteMatch;
