import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";
import { TournamentParticipant } from "../entity/TournamentParticipant";

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
    const tournaments = await tournamentRepository.find({
      relations: ["organizer", "participants", "participants.user"],
    });
    res.json({ data: tournaments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
};

export const getTournamentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const tournament = await tournamentRepository.findOne({
      where: { id },
      relations: ["organizer", "participants", "participants.user"],
    });

    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }

    res.json({ data: tournament });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tournament" });
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
    console.log("Creating tournament with organizerId:", userId);

    // Verify that the user exists
    const userRepository = AppDataSource.getRepository(User);
    const organizer = await userRepository.findOne({
      where: { id: userId },
    });

    if (!organizer) {
      console.log("User not found for ID:", userId);
      res.status(404).json({ error: "Organizer not found" });
      return;
    }

    console.log("Found organizer:", organizer.name, organizer.email);

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
  } catch (error) {
    console.error("Error creating tournament:", error);
    res.status(500).json({ error: "Failed to create tournament" });
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
    const userId = (req as any).user.userId;

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

    res.json({ message: "Successfully joined tournament" });
  } catch (error) {
    res.status(500).json({ error: "Failed to join tournament" });
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

    res.json({ message: "Successfully left tournament" });
  } catch (error) {
    res.status(500).json({ error: "Failed to leave tournament" });
  }
};
