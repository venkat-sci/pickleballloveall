"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMatchStatus = exports.updateMatchScore = exports.createMatch = exports.getMatchById = exports.getMatchesByTournament = exports.getAllMatches = void 0;
const data_source_1 = require("../data-source");
const Match_1 = require("../entity/Match");
const Tournament_1 = require("../entity/Tournament");
const Player_1 = require("../entity/Player");
const Court_1 = require("../entity/Court");
const matchRepository = data_source_1.AppDataSource.getRepository(Match_1.Match);
const tournamentRepository = data_source_1.AppDataSource.getRepository(Tournament_1.Tournament);
const playerRepository = data_source_1.AppDataSource.getRepository(Player_1.Player);
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
        const player1 = await playerRepository.findOne({
            where: { id: player1Id },
        });
        const player2 = await playerRepository.findOne({
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
const updateMatchScore = async (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;
        const match = await matchRepository.findOne({
            where: { id },
            relations: ["player1", "player2"],
        });
        if (!match) {
            res.status(404).json({ error: "Match not found" });
            return;
        }
        // Determine winner based on score
        let winner;
        if (score && score.player1 && score.player2) {
            const player1Sets = score.player1.reduce((total, set, index) => {
                return set > score.player2[index] ? total + 1 : total;
            }, 0);
            const player2Sets = score.player2.reduce((total, set, index) => {
                return set > score.player1[index] ? total + 1 : total;
            }, 0);
            if (player1Sets > player2Sets) {
                winner = match.player1Id;
            }
            else if (player2Sets > player1Sets) {
                winner = match.player2Id;
            }
        }
        await matchRepository.update(id, {
            score,
            winner,
            status: winner ? "completed" : "in-progress",
        });
        // Update player stats if match is completed
        if (winner) {
            const winnerPlayer = winner === match.player1Id ? match.player1 : match.player2;
            const loserPlayer = winner === match.player1Id ? match.player2 : match.player1;
            await playerRepository.update(winnerPlayer.id, {
                wins: winnerPlayer.wins + 1,
                gamesPlayed: winnerPlayer.gamesPlayed + 1,
            });
            await playerRepository.update(loserPlayer.id, {
                losses: loserPlayer.losses + 1,
                gamesPlayed: loserPlayer.gamesPlayed + 1,
            });
        }
        res.json({ message: "Score updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update match score" });
    }
};
exports.updateMatchScore = updateMatchScore;
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
        await matchRepository.update(id, { status });
        res.json({ message: "Match status updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update match status" });
    }
};
exports.updateMatchStatus = updateMatchStatus;
