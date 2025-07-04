import { AppDataSource } from "../data-source";
import { Match } from "../entity/Match";
import { Tournament } from "../entity/Tournament";
import { TournamentParticipant } from "../entity/TournamentParticipant";

export class BracketService {
  static async generateKnockoutBracket(tournamentId: string): Promise<Match[]> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
    const matchRepository = AppDataSource.getRepository(Match);

    // Get tournament and participants
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    const participants = await participantRepository.find({
      where: { tournamentId },
      relations: ["user"],
    });

    if (participants.length < 2) {
      throw new Error("Not enough participants to generate bracket");
    }

    // Seed participants based on their rating (highest rating gets best seed)
    const seededParticipants = participants.sort(
      (a, b) => b.user.rating - a.user.rating
    );

    // Generate first round matches
    const matches: Partial<Match>[] = [];

    for (let i = 0; i < seededParticipants.length; i += 2) {
      if (seededParticipants[i + 1]) {
        matches.push({
          tournamentId: tournamentId,
          round: 1,
          player1Id: seededParticipants[i].userId,
          player2Id: seededParticipants[i + 1].userId,
          status: "scheduled",
          startTime: tournament.startDate,
        });
      }
    }

    // Handle odd number of participants (bye for highest seed)
    if (seededParticipants.length % 2 === 1) {
      const byePlayer = seededParticipants[0]; // Highest seed gets bye
      matches.push({
        tournamentId: tournamentId,
        round: 1,
        player1Id: byePlayer.userId,
        player2Id: byePlayer.userId, // Same player for bye
        status: "completed",
        winner: byePlayer.userId,
        startTime: tournament.startDate,
      });
    }

    // Save matches to database
    const savedMatches = await matchRepository.save(matches);

    // Update tournament status to "ongoing"
    await tournamentRepository.update(tournamentId, { status: "ongoing" });

    return savedMatches as Match[];
  }

  static async generateRoundRobinBracket(
    tournamentId: string
  ): Promise<Match[]> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
    const matchRepository = AppDataSource.getRepository(Match);

    // Get tournament
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    const participants = await participantRepository.find({
      where: { tournamentId },
      relations: ["user"],
    });

    if (participants.length < 2) {
      throw new Error("Not enough participants for round robin");
    }

    const matches: Partial<Match>[] = [];

    // Generate all possible pairings
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        matches.push({
          tournamentId: tournamentId,
          round: 1, // All matches in round 1 for round robin
          player1Id: participants[i].userId,
          player2Id: participants[j].userId,
          status: "scheduled",
          startTime: tournament.startDate,
        });
      }
    }

    const savedMatches = await matchRepository.save(matches);

    // Update tournament status to "ongoing"
    await tournamentRepository.update(tournamentId, { status: "ongoing" });

    return savedMatches as Match[];
  }

  static calculateRounds(participantCount: number, format: string): number {
    if (format === "knockout") {
      return Math.ceil(Math.log2(participantCount));
    } else if (format === "round_robin") {
      return 1; // All matches in one "round"
    }
    return 1;
  }
}
