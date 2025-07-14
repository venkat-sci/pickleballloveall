import { Request, Response } from "express";
import { AppDataSource } from "../scripts/data-source";
import { Match } from "../entity/Match";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";
import { Court } from "../entity/Court";
import { AuthenticatedRequest } from "../middleware/auth";
import {
  determineMatchWinner,
  validateScores,
} from "../utils/pickleballScoring";
import { BracketService } from "../services/BracketService";

const matchRepository = AppDataSource.getRepository(Match);
const tournamentRepository = AppDataSource.getRepository(Tournament);
const userRepository = AppDataSource.getRepository(User);
const courtRepository = AppDataSource.getRepository(Court);

// Helper function to check if user can update match scores
const checkScoreUpdatePermission = async (
  match: Match,
  userId: string
): Promise<{ allowed: boolean; reason?: string }> => {
  if (!userId) {
    return { allowed: false, reason: "User not authenticated" };
  }

  // Get tournament info
  const tournament = await tournamentRepository.findOne({
    where: { id: match.tournamentId },
  });

  if (!tournament) {
    return { allowed: false, reason: "Tournament not found" };
  }

  // Tournament organizer can always update scores
  if (tournament.organizerId === userId) {
    return { allowed: true };
  }

  // Players in the match can update scores
  if (match.player1Id === userId || match.player2Id === userId) {
    return { allowed: true };
  }

  // Authorized score keepers can update scores
  if (
    match.authorizedScoreKeepers &&
    match.authorizedScoreKeepers.includes(userId)
  ) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason:
      "Only tournament organizers, match players, or authorized score keepers can update scores",
  };
};

export const getAllMatches = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("⚾ Fetching all matches...");

    const matches = await matchRepository.find({
      relations: ["tournament", "player1", "player2", "court"],
    });

    console.log(`✅ Found ${matches.length} matches`);
    res.json({ data: matches });
  } catch (error) {
    console.error("❌ Error fetching matches:", error);
    res.status(500).json({
      error: "Failed to fetch matches",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export const getMatchesByTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tournamentId } = req.params;
    console.log(`⚾ Fetching matches for tournament: ${tournamentId}`);

    const matches = await matchRepository.find({
      where: { tournamentId },
      relations: ["tournament", "player1", "player2", "court"],
      order: { round: "ASC", startTime: "ASC" },
    });

    console.log(
      `✅ Found ${matches.length} matches for tournament ${tournamentId}`
    );
    res.json({ data: matches });
  } catch (error) {
    console.error("❌ Error fetching tournament matches:", error);
    res.status(500).json({
      error: "Failed to fetch tournament matches",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export const getMatchById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`⚾ Fetching match by ID: ${id}`);

    const match = await matchRepository.findOne({
      where: { id },
      relations: ["tournament", "player1", "player2", "court"],
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    console.log(`✅ Found match: ${match.id}`);
    res.json({ data: match });
  } catch (error) {
    console.error("❌ Error fetching match by ID:", error);
    res.status(500).json({
      error: "Failed to fetch match",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
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

    // Check authorization for score updates
    const userId = (req as AuthenticatedRequest).user?.userId;
    const canUpdateScore = await checkScoreUpdatePermission(match, userId);

    if (!canUpdateScore.allowed) {
      res.status(403).json({
        error: "Not authorized to update match score",
        details: canUpdateScore.reason,
      });
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

    // Check if we need to generate the next round for knockout tournaments
    let nextRoundInfo = null;
    if (matchResult.isComplete && matchResult.winner) {
      try {
        const result = await BracketService.checkAndGenerateNextRound(
          match.tournamentId
        );
        if (result.nextRoundGenerated) {
          nextRoundInfo = {
            message: "Next round generated automatically",
            newMatches: result.matches,
          };
        }
      } catch (error) {
        console.log(
          "Next round generation info:",
          error instanceof Error ? error.message : "Unknown error"
        );
        // Don't throw error here as match update was successful
      }
    }

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
      nextRound: nextRoundInfo,
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

export const updateMatchDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { startTime, courtId } = req.body;

    const match = await matchRepository.findOne({
      where: { id },
      relations: ["tournament"],
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Check if user is tournament organizer
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (match.tournament.organizerId !== userId) {
      res
        .status(403)
        .json({ error: "Only tournament organizer can update match details" });
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

    const updatedMatch = await matchRepository.findOne({
      where: { id },
      relations: ["tournament", "player1", "player2", "court"],
    });

    res.json({
      message: "Match details updated successfully",
      data: updatedMatch,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update match details" });
  }
};

export const getTournamentBracket = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tournamentId } = req.params;

    const matches = await matchRepository.find({
      where: { tournamentId },
      relations: ["player1", "player2", "court"],
      order: { round: "ASC", startTime: "ASC" },
    });

    // Group matches by round
    const bracket = matches.reduce((acc: any, match) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {});

    // Calculate tournament statistics
    const totalRounds = Math.max(...Object.keys(bracket).map(Number), 0);
    const completedMatches = matches.filter(
      (m) => m.status === "completed"
    ).length;
    const totalMatches = matches.length;
    const currentRound =
      Math.max(
        ...matches.filter((m) => m.status !== "completed").map((m) => m.round),
        0
      ) || totalRounds;

    res.json({
      data: {
        bracket,
        stats: {
          totalRounds,
          currentRound,
          completedMatches,
          totalMatches,
          progress:
            totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tournament bracket" });
  }
};

export const generateNextRound = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tournamentId } = req.params;

    // Verify user is tournament organizer
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    const userId = (req as AuthenticatedRequest).user?.userId;
    if (tournament.organizerId !== userId) {
      res
        .status(403)
        .json({ error: "Only tournament organizer can generate next round" });
      return;
    }

    const result = await BracketService.checkAndGenerateNextRound(tournamentId);

    if (result.nextRoundGenerated) {
      res.json({
        message: "Next round generated successfully",
        data: result.matches,
      });
    } else {
      res.status(400).json({
        error:
          "Cannot generate next round. Current round may not be complete or tournament may be finished.",
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({ error: `Failed to generate next round: ${errorMessage}` });
  }
};

export const addScoreKeeper = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId: scoreKeeperUserId } = req.body;

    const match = await matchRepository.findOne({
      where: { id },
      relations: ["tournament"],
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Check if user is tournament organizer
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (match.tournament.organizerId !== userId) {
      res
        .status(403)
        .json({ error: "Only tournament organizer can add score keepers" });
      return;
    }

    // Verify the score keeper user exists
    const scoreKeeperUser = await userRepository.findOne({
      where: { id: scoreKeeperUserId },
    });

    if (!scoreKeeperUser) {
      res.status(404).json({ error: "Score keeper user not found" });
      return;
    }

    // Add user to authorized score keepers
    const currentKeepers = match.authorizedScoreKeepers || [];
    if (!currentKeepers.includes(scoreKeeperUserId)) {
      match.authorizedScoreKeepers = [...currentKeepers, scoreKeeperUserId];
      await matchRepository.save(match);
    }

    res.json({
      message: "Score keeper added successfully",
      data: {
        matchId: match.id,
        scoreKeeper: {
          id: scoreKeeperUser.id,
          name: scoreKeeperUser.name,
          email: scoreKeeperUser.email,
        },
        authorizedScoreKeepers: match.authorizedScoreKeepers,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add score keeper" });
  }
};

export const removeScoreKeeper = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId: scoreKeeperUserId } = req.body;

    const match = await matchRepository.findOne({
      where: { id },
      relations: ["tournament"],
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Check if user is tournament organizer
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (match.tournament.organizerId !== userId) {
      res
        .status(403)
        .json({ error: "Only tournament organizer can remove score keepers" });
      return;
    }

    // Remove user from authorized score keepers
    if (match.authorizedScoreKeepers) {
      match.authorizedScoreKeepers = match.authorizedScoreKeepers.filter(
        (keeperId) => keeperId !== scoreKeeperUserId
      );
      await matchRepository.save(match);
    }

    res.json({
      message: "Score keeper removed successfully",
      data: {
        matchId: match.id,
        authorizedScoreKeepers: match.authorizedScoreKeepers,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove score keeper" });
  }
};

export const startMatchEarly = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const match = await matchRepository.findOne({
      where: { id },
      relations: ["tournament"],
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Check if user is tournament organizer
    const userId = (req as AuthenticatedRequest).user?.userId;
    if (match.tournament.organizerId !== userId) {
      res
        .status(403)
        .json({ error: "Only tournament organizer can start matches early" });
      return;
    }

    // Check if match can be started early
    if (match.status === "completed") {
      res.status(400).json({ error: "Match is already completed" });
      return;
    }

    if (match.status === "in-progress") {
      res.status(400).json({ error: "Match is already in progress" });
      return;
    }

    // Update match to allow early start and set actual start time
    match.canStartEarly = true;
    match.actualStartTime = new Date();
    match.status = "in-progress";

    await matchRepository.save(match);

    res.json({
      message: "Match started early successfully",
      data: {
        matchId: match.id,
        actualStartTime: match.actualStartTime,
        status: match.status,
        canStartEarly: match.canStartEarly,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to start match early" });
  }
};

export const getMatchScoreKeepers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const match = await matchRepository.findOne({
      where: { id },
    });

    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }

    // Get score keeper details
    const scoreKeepers = [];
    if (
      match.authorizedScoreKeepers &&
      match.authorizedScoreKeepers.length > 0
    ) {
      const users = await userRepository.findByIds(
        match.authorizedScoreKeepers
      );
      scoreKeepers.push(
        ...users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
        }))
      );
    }

    res.json({
      data: {
        matchId: match.id,
        scoreKeepers,
        authorizedScoreKeeperIds: match.authorizedScoreKeepers || [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get match score keepers" });
  }
};
