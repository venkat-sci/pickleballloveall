import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";
import { Court } from "../entity/Court";
import {
  determineMatchWinner,
  validateScores,
} from "../utils/pickleballScoring";

const matchRepository = AppDataSource.getRepository(Match);
const tournamentRepository = AppDataSource.getRepository(Tournament);
const userRepository = AppDataSource.getRepository(User);
const courtRepository = AppDataSource.getRepository(Court);

export const getAllMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const matches = await matchRepository.find({
      relations: ["tournament", "player1", "player2", "court"],
    });
    res.json({ data: matches });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

export const getMatchesByTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    const matches = await matchRepository.find({
      where: { tournamentId },
      relations: ["tournament", "player1", "player2", "court"],
      order: { round: "ASC", startTime: "ASC" },
    });
    res.json({ data: matches });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tournament matches" });
  }
};

export const getMatchById = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch match" });
  }
};

export const updateMatchScore = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    if (!score || !score.player1 || !score.player2) {
      res.status(400).json({ error: "Score data is required" });
      return;
    }

    // Validate scores
    const validation = validateScores(score.player1, score.player2);
    if (!validation.isValid) {
      res.status(400).json({
        error: "Invalid scores",
        details: validation.errors,
      });
      return;
    }

    // Update match score
    match.score = {
      player1: score.player1,
      player2: score.player2,
    };

    // Automatically determine winner and match status using proper pickleball rules
    const matchResult = determineMatchWinner(
      score.player1,
      score.player2,
      match.player1Id || "",
      match.player2Id || ""
    );

    if (matchResult.isComplete && matchResult.winner) {
      match.status = "completed";
      match.winner = matchResult.winner;
    } else {
      // Check if any games have been played
      const hasAnyScore =
        score.player1.some((s: number) => s > 0) ||
        score.player2.some((s: number) => s > 0);
      if (hasAnyScore) {
        match.status = "in-progress";
      }
    }

    await matchRepository.save(match);

    // Update player statistics if match is completed
    if (
      matchResult.isComplete &&
      matchResult.winner &&
      match.player1 &&
      match.player2
    ) {
      const winnerPlayer =
        matchResult.winner === match.player1Id ? match.player1 : match.player2;
      const loserPlayer =
        matchResult.winner === match.player1Id ? match.player2 : match.player1;

      // Safely handle potential null values
      const winnerWins = (winnerPlayer.totalWins || 0) + 1;
      const winnerGames = (winnerPlayer.totalGamesPlayed || 0) + 1;
      const loserLosses = (loserPlayer.totalLosses || 0) + 1;
      const loserGames = (loserPlayer.totalGamesPlayed || 0) + 1;

      await userRepository.update(winnerPlayer.id, {
        totalWins: winnerWins,
        totalGamesPlayed: winnerGames,
      });

      await userRepository.update(loserPlayer.id, {
        totalLosses: loserLosses,
        totalGamesPlayed: loserGames,
      });
    }

    res.json({
      message: "Score updated successfully",
      match: {
        ...match,
        isComplete: matchResult.isComplete,
        gamesWon: matchResult.gamesWon,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update match score" });
  }
};

export const createMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tournamentId, round, player1Id, player2Id, startTime, courtId } =
      req.body;

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
  } catch (error) {
    res.status(500).json({ error: "Failed to create match" });
  }
};

export const updateMatchStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
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
  } catch (error) {
    res.status(500).json({ error: "Failed to update match status" });
  }
};

export const deleteMatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const match = await matchRepository.findOne({ where: { id } });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    await matchRepository.remove(match);

    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete match" });
  }
};
