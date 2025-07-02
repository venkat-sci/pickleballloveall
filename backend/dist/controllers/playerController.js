"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerRankings = exports.updatePlayer = exports.getPlayerStats = exports.getPlayerById = exports.getAllPlayers = void 0;
const data_source_1 = require("../data-source");
const Player_1 = require("../entity/Player");
const User_1 = require("../entity/User");
const playerRepository = data_source_1.AppDataSource.getRepository(Player_1.Player);
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
const getAllPlayers = async (req, res) => {
    try {
        const players = await playerRepository.find({
            relations: ["user", "tournament"],
        });
        res.json({ data: players });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch players" });
    }
};
exports.getAllPlayers = getAllPlayers;
const getPlayerById = async (req, res) => {
    try {
        const { id } = req.params;
        const player = await playerRepository.findOne({
            where: { id },
            relations: ["user", "tournament"],
        });
        if (!player) {
            res.status(404).json({ error: "Player not found" });
            return;
        }
        res.json({ data: player });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch player" });
    }
};
exports.getPlayerById = getPlayerById;
const getPlayerStats = async (req, res) => {
    try {
        const { id } = req.params;
        const player = await playerRepository.findOne({
            where: { id },
            relations: ["user"],
        });
        if (!player) {
            res.status(404).json({ error: "Player not found" });
            return;
        }
        const winRate = player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0;
        const stats = {
            wins: player.wins,
            losses: player.losses,
            gamesPlayed: player.gamesPlayed,
            winRate: Math.round(winRate * 100) / 100,
            rating: player.rating,
        };
        res.json({ data: stats });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch player stats" });
    }
};
exports.getPlayerStats = getPlayerStats;
const updatePlayer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const player = await playerRepository.findOne({
            where: { id },
        });
        if (!player) {
            res.status(404).json({ error: "Player not found" });
            return;
        }
        // Check if user is updating their own player profile
        const userId = req.user.userId;
        if (player.userId !== userId) {
            res.status(403).json({ error: "Not authorized to update this player" });
            return;
        }
        await playerRepository.update(id, updateData);
        const updatedPlayer = await playerRepository.findOne({
            where: { id },
            relations: ["user", "tournament"],
        });
        res.json({ data: updatedPlayer });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update player" });
    }
};
exports.updatePlayer = updatePlayer;
const getPlayerRankings = async (req, res) => {
    try {
        const players = await playerRepository.find({
            relations: ["user"],
            order: { rating: "DESC" },
        });
        const rankings = players.map((player, index) => ({
            rank: index + 1,
            ...player,
            winRate: player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0,
        }));
        res.json({ data: rankings });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch player rankings" });
    }
};
exports.getPlayerRankings = getPlayerRankings;
