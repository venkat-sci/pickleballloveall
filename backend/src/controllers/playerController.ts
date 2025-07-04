import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { TournamentParticipant } from "../entity/TournamentParticipant";

const userRepository = AppDataSource.getRepository(User);
const tournamentParticipantRepository = AppDataSource.getRepository(
  TournamentParticipant
);

export const getAllPlayers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all users who are players (role = "player" or "organizer" who also play)
    const users = await userRepository.find({
      where: [{ role: "player" }, { role: "organizer" }],
    });

    // Transform users to player format for frontend compatibility
    const players = users.map((user) => ({
      id: user.id,
      userId: user.id,
      name: user.name,
      rating: user.rating,
      wins: user.totalWins,
      losses: user.totalLosses,
      gamesPlayed: user.totalGamesPlayed,
      profileImage: user.profileImage,
    }));

    res.json({ data: players });
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

export const getAllPlayersWithStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all users who can play (exclude viewers)
    const users = await userRepository.find({
      where: [{ role: "player" }, { role: "organizer" }],
    });

    // Transform to player format with calculated win rate
    const players = users.map((user) => ({
      id: user.id,
      userId: user.id,
      name: user.name,
      rating: user.rating,
      wins: user.totalWins,
      losses: user.totalLosses,
      gamesPlayed: user.totalGamesPlayed,
      profileImage: user.profileImage,
      winRate:
        user.totalGamesPlayed > 0
          ? Math.round((user.totalWins / user.totalGamesPlayed) * 100)
          : 0,
    }));

    res.json({ data: players });
  } catch (error) {
    console.error("Error fetching players with stats:", error);
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

export const getPlayerById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    // Transform user to player format
    const player = {
      id: user.id,
      userId: user.id,
      name: user.name,
      rating: user.rating,
      wins: user.totalWins,
      losses: user.totalLosses,
      gamesPlayed: user.totalGamesPlayed,
      profileImage: user.profileImage,
    };

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
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    const winRate =
      user.totalGamesPlayed > 0
        ? (user.totalWins / user.totalGamesPlayed) * 100
        : 0;

    const stats = {
      wins: user.totalWins,
      losses: user.totalLosses,
      gamesPlayed: user.totalGamesPlayed,
      winRate: Math.round(winRate * 100) / 100,
      rating: user.rating,
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

    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    // Check if user is updating their own profile
    const userId = (req as any).user?.userId;
    if (user.id !== userId) {
      res.status(403).json({ error: "Not authorized to update this player" });
      return;
    }

    await userRepository.update(id, updateData);
    const updatedUser = await userRepository.findOne({
      where: { id },
    });

    // Transform to player format
    const player = {
      id: updatedUser!.id,
      userId: updatedUser!.id,
      name: updatedUser!.name,
      rating: updatedUser!.rating,
      wins: updatedUser!.totalWins,
      losses: updatedUser!.totalLosses,
      gamesPlayed: updatedUser!.totalGamesPlayed,
      profileImage: updatedUser!.profileImage,
    };

    res.json({ data: player });
  } catch (error) {
    res.status(500).json({ error: "Failed to update player" });
  }
};

export const getPlayerRankings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get all users who can play
    const users = await userRepository.find({
      where: [{ role: "player" }, { role: "organizer" }],
      order: { rating: "DESC" },
    });

    // Transform to rankings format
    const rankings = users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      userId: user.id,
      name: user.name,
      rating: user.rating,
      wins: user.totalWins,
      losses: user.totalLosses,
      gamesPlayed: user.totalGamesPlayed,
      profileImage: user.profileImage,
      winRate:
        user.totalGamesPlayed > 0
          ? Math.round((user.totalWins / user.totalGamesPlayed) * 100)
          : 0,
    }));

    res.json({ data: rankings });
  } catch (error) {
    console.error("Error fetching player rankings:", error);
    res.status(500).json({ error: "Failed to fetch player rankings" });
  }
};
