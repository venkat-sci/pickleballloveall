import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";
import { TournamentParticipant } from "../entity/TournamentParticipant";
import { BracketService } from "../services/BracketService";
import { AuthenticatedRequest } from "../middleware/auth";

const tournamentRepository = AppDataSource.getRepository(Tournament);
const userRepository = AppDataSource.getRepository(User);
const tournamentParticipantRepository = AppDataSource.getRepository(
  TournamentParticipant
);

export const getAllTournaments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("🏆 Fetching all tournaments...");

    const tournaments = await tournamentRepository.find({
      relations: ["organizer", "winner"],
    });

    console.log(`✅ Found ${tournaments.length} tournaments`);
    res.json({ data: tournaments });
  } catch (error) {
    console.error("❌ Error fetching tournaments:", error);
    res.status(500).json({
      error: "Failed to fetch tournaments",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export const getTournamentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(`🏆 Fetching tournament by ID: ${id}`);

    const tournament = await tournamentRepository.findOne({
      where: { id },
      relations: ["organizer", "winner", "participants", "participants.user"],
    });

    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    console.log(`✅ Found tournament: ${tournament.name}`);
    console.log(
      `📊 Tournament has ${tournament.participants?.length || 0} participants`
    );
    res.json({ data: tournament });
  } catch (error) {
    console.error("❌ Error fetching tournament by ID:", error);
    res.status(500).json({
      error: "Failed to fetch tournament",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export const createTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      description,
      type,
      format,
      startDate,
      endDate,
      location,
      maxParticipants,
      entryFee,
      prizePool,
    } = req.body;

    const userId = (req as any).user.userId;

    // Verify that the user exists
    const userRepository = AppDataSource.getRepository(User);
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
      relations: ["organizer", "winner", "participants", "participants.user"],
    });

    console.log(`✅ Created tournament: ${savedTournament.name}`);
    res.status(201).json({ data: fullTournament });
  } catch (error) {
    console.error("❌ Error creating tournament:", error);
    res.status(500).json({
      error: "Failed to create tournament",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export const updateTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userId = (req as any).user.userId;
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
  } catch (error) {
    res.status(500).json({ error: "Failed to update tournament" });
  }
};

export const deleteTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userId = (req as any).user.userId;
    if (tournament.organizerId !== userId) {
      res
        .status(403)
        .json({ error: "Not authorized to delete this tournament" });
      return;
    }

    await tournamentRepository.remove(tournament);
    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tournament" });
  }
};

export const joinTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Check if user is authenticated
    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Validate tournament ID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({ error: "Invalid tournament ID format" });
      return;
    }

    const tournament = await tournamentRepository.findOne({
      where: { id },
      relations: ["participants"],
    });

    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    // Check if tournament is in upcoming status (can only join upcoming tournaments)
    if (tournament.status !== "upcoming") {
      res.status(400).json({
        error: "Cannot join tournament that has already started or ended",
      });
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

    // Check if user has player or organizer role
    if (user.role !== "player" && user.role !== "organizer") {
      res
        .status(403)
        .json({ error: "Only players and organizers can join tournaments" });
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

    // Return updated tournament data with participants
    const updatedTournament = await tournamentRepository.findOne({
      where: { id },
      relations: ["organizer", "winner", "participants", "participants.user"],
    });

    res.json({
      message: "Successfully joined tournament",
      data: updatedTournament,
    });
  } catch (error) {
    console.error("❌ Error joining tournament:", error);

    // Handle specific database constraint violations
    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        res.status(400).json({ error: "Already joined this tournament" });
        return;
      }
      if (error.message.includes("foreign key constraint")) {
        res.status(400).json({ error: "Invalid tournament or user reference" });
        return;
      }
    }

    res.status(500).json({
      error: "Failed to join tournament",
      details:
        process.env.NODE_ENV === "development"
          ? (error as Error).message
          : undefined,
    });
  }
};

export const leaveTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

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

    // Return updated tournament data with participants
    const updatedTournament = await tournamentRepository.findOne({
      where: { id },
      relations: ["organizer", "winner", "participants", "participants.user"],
    });

    res.json({
      message: "Successfully left tournament",
      data: updatedTournament,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave tournament" });
  }
};

export const startTournament = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authenticatedUser = (req as AuthenticatedRequest).user;

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

    // Organizer can start tournament at any time (no minimum participant requirement)
    console.log(
      `🚀 Starting tournament with ${tournament.currentParticipants} participants`
    );

    // Generate bracket based on tournament format
    let matches;
    if (tournament.format === "knockout") {
      matches = await BracketService.generateFullTournamentBracket(id);
    } else if (tournament.format === "round-robin") {
      matches = await BracketService.generateRoundRobinBracket(id);
    } else {
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
  } catch (error) {
    console.error("Error starting tournament:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTournamentBracketView = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const matchesByRound = tournament.matches.reduce((acc: any, match: any) => {
      if (!acc[match.round]) {
        acc[match.round] = [];
      }
      acc[match.round].push(match);
      return acc;
    }, {});

    // Calculate tournament progress
    const totalMatches = tournament.matches.length;
    const completedMatches = tournament.matches.filter(
      (m: any) => m.status === "completed"
    ).length;
    const inProgressMatches = tournament.matches.filter(
      (m: any) => m.status === "in-progress"
    ).length;
    const scheduledMatches = tournament.matches.filter(
      (m: any) => m.status === "scheduled"
    ).length;

    const currentRound =
      tournament.matches.length > 0
        ? Math.min(
            ...tournament.matches
              .filter((m: any) => m.status !== "completed")
              .map((m: any) => m.round)
          ) || Math.max(...tournament.matches.map((m: any) => m.round))
        : 0;

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
          progress:
            totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching tournament bracket:", error);
    res.status(500).json({ error: "Failed to fetch tournament bracket" });
  }
};

export const updateMatchSchedule = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const userId = (req as any).user?.userId;
    if (tournament.organizerId !== userId) {
      res.status(403).json({
        error: "Only tournament organizer can update match schedules",
      });
      return;
    }

    // Find and update the specific match
    const { Match } = require("../entity/Match");
    const matchRepository = AppDataSource.getRepository(Match);
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
      data: match,
    });
  } catch (error) {
    console.error("Error updating match schedule:", error);
    res.status(500).json({ error: "Failed to update match schedule" });
  }
};

// Set tournament winner
export const setTournamentWinner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { winnerId, winnerName, winnerPartner } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const tournament = await tournamentRepository.findOne({
      where: { id },
      relations: ["organizer", "participants", "participants.user"],
    });

    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    // Only tournament organizer can set winner
    if (tournament.organizerId !== userId) {
      res.status(403).json({
        error: "Only tournament organizer can set the winner",
      });
      return;
    }

    // Verify winner exists (if winnerId provided)
    let winner = null;
    if (winnerId) {
      winner = await userRepository.findOne({ where: { id: winnerId } });
      if (!winner) {
        res.status(404).json({ error: "Winner user not found" });
        return;
      }
    }

    // Update tournament with winner information
    tournament.winnerId = winnerId || null;
    tournament.winnerName = winnerName || winner?.name || null;
    tournament.winnerPartner = winnerPartner || null;
    tournament.status = "completed";

    await tournamentRepository.save(tournament);

    // Fetch updated tournament with relations
    const updatedTournament = await tournamentRepository.findOne({
      where: { id },
      relations: [
        "organizer",
        "participants",
        "participants.user",
        "winner",
        "matches",
        "matches.player1",
        "matches.player2",
      ],
    });

    res.json({
      message: "Tournament winner set successfully",
      data: updatedTournament,
    });
  } catch (error) {
    console.error("Error setting tournament winner:", error);
    res.status(500).json({ error: "Failed to set tournament winner" });
  }
};
