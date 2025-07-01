import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";
import { Tournament } from "../entity/Tournament";
import { Player } from "../entity/Player";
import { Court } from "../entity/Court";

const matchRepository = AppDataSource.getRepository(Match);
const tournamentRepository = AppDataSource.getRepository(Tournament);
const playerRepository = AppDataSource.getRepository(Player);
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
  } catch (error) {
    res.status(500).json({ error: "Failed to create match" });
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

    // Determine winner based on score
    let winner: string | undefined;
    if (score && score.player1 && score.player2) {
      const player1Sets = score.player1.reduce(
        (total: number, set: number, index: number) => {
          return set > score.player2[index] ? total + 1 : total;
        },
        0
      );

      const player2Sets = score.player2.reduce(
        (total: number, set: number, index: number) => {
          return set > score.player1[index] ? total + 1 : total;
        },
        0
      );

      if (player1Sets > player2Sets) {
        winner = match.player1Id;
      } else if (player2Sets > player1Sets) {
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
      const winnerPlayer =
        winner === match.player1Id ? match.player1 : match.player2;
      const loserPlayer =
        winner === match.player1Id ? match.player2 : match.player1;

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
  } catch (error) {
    res.status(500).json({ error: "Failed to update match score" });
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

    await matchRepository.update(id, { status });
    res.json({ message: "Match status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update match status" });
  }
};
