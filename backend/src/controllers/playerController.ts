import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Player } from "../entity/Player";
import { User } from "../entity/User";

const playerRepository = AppDataSource.getRepository(Player);
const userRepository = AppDataSource.getRepository(User);

export const getAllPlayers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const players = await playerRepository.find({
      relations: ["user", "tournament"],
    });
    res.json({ data: players });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

export const getPlayerById = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
};

export const getPlayerStats = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const winRate =
      player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0;

    const stats = {
      wins: player.wins,
      losses: player.losses,
      gamesPlayed: player.gamesPlayed,
      winRate: Math.round(winRate * 100) / 100,
      rating: player.rating,
    };

    res.json({ data: stats });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player stats" });
  }
};

export const updatePlayer = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userId = (req as any).user.userId;
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
  } catch (error) {
    res.status(500).json({ error: "Failed to update player" });
  }
};

export const getPlayerRankings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const players = await playerRepository.find({
      relations: ["user"],
      order: { rating: "DESC" },
    });

    const rankings = players.map((player, index) => ({
      rank: index + 1,
      ...player,
      winRate:
        player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed) * 100 : 0,
    }));

    res.json({ data: rankings });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player rankings" });
  }
};
