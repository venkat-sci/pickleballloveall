import { AppDataSource } from "../scripts/data-source";
import { Match } from "../entity/Match";
import { Tournament } from "../entity/Tournament";
import { TournamentParticipant } from "../entity/TournamentParticipant";

export class BracketService {
  /**
   * After group stage, advance top N from each group and generate knockout bracket.
   */
  static async advanceGroupsToKnockout(tournamentId: string): Promise<Match[]> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
    const matchRepository = AppDataSource.getRepository(Match);

    // Get tournament and participants
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (
      !tournament ||
      !tournament.knockoutEnabled ||
      !tournament.advanceCount ||
      !tournament.numGroups
    )
      return [];

    // Get all group matches
    const allMatches = await matchRepository.find({ where: { tournamentId } });
    // Group matches are round 1, with notes or by distribution
    // Build groupings
    const participants = await participantRepository.find({
      where: { tournamentId },
      relations: ["user"],
    });
    const groups: TournamentParticipant[][] = Array.from(
      { length: tournament.numGroups },
      () => []
    );
    participants.forEach((p, idx) => {
      groups[idx % tournament.numGroups].push(p);
    });

    // For each group, calculate standings
    function getWins(userId: string, group: TournamentParticipant[]): number {
      return allMatches.filter(
        (m) =>
          m.round === 1 &&
          group.some((g) => g.userId === userId) &&
          ((m.player1Id === userId && m.winner === userId) ||
            (m.player2Id === userId && m.winner === userId))
      ).length;
    }

    let advancing: TournamentParticipant[] = [];
    groups.forEach((group) => {
      // Sort group by wins (simple logic, can be extended)
      const sorted = [...group].sort(
        (a, b) => getWins(b.userId, group) - getWins(a.userId, group)
      );
      advancing.push(...sorted.slice(0, tournament.advanceCount));
    });

    // Generate knockout matches for advancing participants
    // Use standard knockout bracket logic
    const seededParticipants = advancing.sort(
      (a, b) => (b.user.rating || 0) - (a.user.rating || 0)
    );
    const knockoutMatches: Partial<Match>[] = [];
    let currentRoundParticipants = [...seededParticipants];
    let currentRound = 2; // Knockout starts after group stage (round 1)
    while (currentRoundParticipants.length > 1) {
      const roundMatches: Partial<Match>[] = [];
      const nextRoundParticipants: any[] = [];
      // Schedule each round on a new day at 8:00 AM
      const roundDate = new Date(tournament.startDate || new Date());
      roundDate.setDate(roundDate.getDate() + (currentRound - 2));
      roundDate.setHours(8, 0, 0, 0);
      for (let i = 0; i < currentRoundParticipants.length; i += 2) {
        const matchStartTime = new Date(roundDate);
        if (currentRoundParticipants[i + 1]) {
          roundMatches.push({
            tournamentId,
            round: currentRound,
            player1Id: currentRoundParticipants[i].userId,
            player2Id: currentRoundParticipants[i + 1].userId,
            status: "scheduled",
            startTime: matchStartTime,
            canStartEarly: true,
          });
          nextRoundParticipants.push({
            userId: `winner_of_match_${currentRound}_${i / 2 + 1}`,
            isPlaceholder: true,
          });
        } else {
          roundMatches.push({
            tournamentId,
            round: currentRound,
            player1Id: currentRoundParticipants[i].userId,
            player2Id: currentRoundParticipants[i].userId,
            status: "completed",
            winner: currentRoundParticipants[i].userId,
            startTime: matchStartTime,
            canStartEarly: false,
          });
          nextRoundParticipants.push(currentRoundParticipants[i]);
        }
      }
      knockoutMatches.push(...roundMatches);
      currentRoundParticipants = nextRoundParticipants.filter(
        (p) => !p.isPlaceholder
      );
      currentRound++;
      if (currentRound > 2) break; // Only generate first knockout round, rest handled by existing logic
    }
    const savedKnockoutMatches = await matchRepository.save(knockoutMatches);
    return savedKnockoutMatches as Match[];
  }
  /**
   * Generate group-based round robin matches and optionally knockout stage.
   */
  static async generateGroupStageBracket(
    tournamentId: string
  ): Promise<Match[]> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
    const matchRepository = AppDataSource.getRepository(Match);

    // Get tournament and participants
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (!tournament) throw new Error("Tournament not found");
    const participants = await participantRepository.find({
      where: { tournamentId },
      relations: ["user"],
    });
    if (participants.length < 2) return [];

    // Split participants into groups
    const numGroups = tournament.numGroups || 1;
    const groups: TournamentParticipant[][] = Array.from(
      { length: numGroups },
      () => []
    );
    participants.forEach((p, idx) => {
      groups[idx % numGroups].push(p);
    });

    let allMatches: Partial<Match>[] = [];
    // Generate round robin matches within each group
    groups.forEach((group, groupIdx) => {
      // All group matches scheduled on startDate at 8:00 AM
      const matchDate = new Date(tournament.startDate || new Date());
      matchDate.setHours(8, 0, 0, 0);
      for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
          allMatches.push({
            tournamentId,
            round: 1,
            player1Id: group[i].userId,
            player2Id: group[j].userId,
            status: "scheduled",
            startTime: matchDate,
            canStartEarly: true,
            // Optionally, you can add a custom property to indicate group, if needed
          });
        }
      }
    });

    // Save group matches
    const savedGroupMatches = await matchRepository.save(allMatches);

    // If knockout is enabled, generate knockout bracket after group stage
    if (
      tournament.knockoutEnabled &&
      tournament.advanceCount &&
      tournament.advanceCount > 0
    ) {
      // This part should be called after group matches are completed and top players are determined
      // For now, just placeholder logic: select first N from each group
      let knockoutParticipants: TournamentParticipant[] = [];
      groups.forEach((group) => {
        knockoutParticipants.push(...group.slice(0, tournament.advanceCount));
      });
      // Generate knockout matches for these participants
      // You may want to call generateKnockoutBracket with a custom participant list
      // For now, just log and skip actual knockout match creation
      // TODO: Implement knockout match generation after group stage completion
    }

    await tournamentRepository.update(tournamentId, { status: "ongoing" });
    return savedGroupMatches as Match[];
  }
  static async generateKnockoutBracket(tournamentId: string): Promise<Match[]> {
    // Use the new full bracket generation method
    return this.generateFullTournamentBracket(tournamentId);
  }

  /**
   * Generate Swiss system pairings for the first round.
   * Later rounds should be generated after each round is completed, pairing players with similar scores.
   */
  static async generateSwissBracket(tournamentId: string): Promise<Match[]> {
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
    const matchRepository = AppDataSource.getRepository(Match);

    // Get tournament and participants
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (!tournament) throw new Error("Tournament not found");

    const participants = await participantRepository.find({
      where: { tournamentId },
      relations: ["user"],
    });
    if (participants.length < 2) {
      console.log(
        `⚠️ Swiss tournament started with ${participants.length} participants - no matches generated`
      );
      return [];
    }

    // Shuffle participants for first round
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const matches: Partial<Match>[] = [];
    // All Swiss round 1 matches scheduled on startDate at 8:00 AM
    const matchDate = new Date(tournament.startDate || new Date());
    matchDate.setHours(8, 0, 0, 0);
    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        matches.push({
          tournamentId,
          round: 1,
          player1Id: shuffled[i].userId,
          player2Id: shuffled[i + 1].userId,
          status: "scheduled",
          startTime: matchDate,
          canStartEarly: true,
        });
      } else {
        // Odd participant gets a bye
        matches.push({
          tournamentId,
          round: 1,
          player1Id: shuffled[i].userId,
          player2Id: shuffled[i].userId,
          status: "completed",
          winner: shuffled[i].userId,
          startTime: matchDate,
          canStartEarly: false,
        });
      }
    }
    const savedMatches = await matchRepository.save(matches);
    await tournamentRepository.update(tournamentId, { status: "ongoing" });
    return savedMatches as Match[];
  }

  static async generateRoundRobinBracket(
    tournamentId: string
  ): Promise<Match[]> {
    // If tournament has groups, use group stage logic
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });
    if (tournament && tournament.numGroups && tournament.numGroups > 1) {
      return this.generateGroupStageBracket(tournamentId);
    }
    // Otherwise, use standard round robin
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
    const matchRepository = AppDataSource.getRepository(Match);
    const participants = await participantRepository.find({
      where: { tournamentId },
      relations: ["user"],
    });
    if (participants.length < 2) return [];
    const matches: Partial<Match>[] = [];
    // All round robin matches scheduled on startDate at 8:00 AM
    const matchDate = new Date(tournament?.startDate || new Date());
    matchDate.setHours(8, 0, 0, 0);
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        matches.push({
          tournamentId,
          round: 1,
          player1Id: participants[i].userId,
          player2Id: participants[j].userId,
          status: "scheduled",
          startTime: matchDate,
          canStartEarly: true,
        });
      }
    }
    const savedMatches = await matchRepository.save(matches);
    await tournamentRepository.update(tournamentId, { status: "ongoing" });
    return savedMatches as Match[];
  }

  static calculateRounds(participantCount: number, format: string): number {
    if (participantCount < 2) {
      return 0; // No rounds needed for tournaments with fewer than 2 participants
    }

    if (format === "knockout") {
      return Math.ceil(Math.log2(participantCount));
    } else if (format === "round_robin") {
      return 1; // All matches in one "round"
    }
    return 1;
  }

  static async generateNextRound(tournamentId: string): Promise<Match[]> {
    const matchRepository = AppDataSource.getRepository(Match);
    const tournamentRepository = AppDataSource.getRepository(Tournament);

    const tournament = await tournamentRepository.findOne({
      where: { id: tournamentId },
    });

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    if (tournament.format === "knockout") {
      return this.generateNextKnockoutRound(tournamentId);
    } else if (tournament.format === "round-robin") {
      // Round robin doesn't have progressive rounds
      throw new Error("Round robin tournaments don't have progressive rounds");
    }

    return [];
  }

  static async generateNextKnockoutRound(
    tournamentId: string
  ): Promise<Match[]> {
    const matchRepository = AppDataSource.getRepository(Match);

    // Get all matches for this tournament
    const allMatches = await matchRepository.find({
      where: { tournamentId },
      order: { round: "DESC", createdAt: "ASC" },
    });

    if (allMatches.length === 0) {
      throw new Error("No matches found for tournament");
    }

    // Find the current highest round
    const currentRound = allMatches[0].round;

    // Get all completed matches from the current round
    const currentRoundMatches = allMatches.filter(
      (match) => match.round === currentRound && match.status === "completed"
    );

    // Get all matches from the current round (to check if round is complete)
    const totalCurrentRoundMatches = allMatches.filter(
      (match) => match.round === currentRound
    );

    // Check if current round is complete
    if (currentRoundMatches.length !== totalCurrentRoundMatches.length) {
      throw new Error("Current round is not complete yet");
    }

    // Get winners from current round
    const winners = currentRoundMatches
      .map((match) => match.winner)
      .filter((winner) => winner !== null && winner !== undefined);

    // Check if we have enough winners for next round
    if (winners.length < 2) {
      // Tournament is complete
      throw new Error("Tournament is complete - only one winner remains");
    }

    // Generate next round matches
    const nextRound = currentRound + 1;
    const nextRoundMatches: Partial<Match>[] = [];

    // Get tournament start time for scheduling
    const tournament = await AppDataSource.getRepository(Tournament).findOne({
      where: { id: tournamentId },
    });

    // Schedule each knockout round on a new day at 8:00 AM
    const baseStartDate = tournament?.startDate || new Date();
    const nextRoundDate = new Date(baseStartDate);
    nextRoundDate.setDate(nextRoundDate.getDate() + (currentRound - 1));
    nextRoundDate.setHours(8, 0, 0, 0);

    // Pair winners for next round
    for (let i = 0; i < winners.length; i += 2) {
      if (winners[i + 1]) {
        const matchStartTime = new Date(nextRoundDate);
        nextRoundMatches.push({
          tournamentId: tournamentId,
          round: nextRound,
          player1Id: winners[i],
          player2Id: winners[i + 1],
          status: "scheduled",
          startTime: matchStartTime,
          canStartEarly: true, // Allow early start for all matches
        });
      }
    }

    // Handle odd number of winners (bye)
    if (winners.length % 2 === 1) {
      const byeWinner = winners[winners.length - 1];
      const matchStartTime = new Date(nextRoundDate);
      nextRoundMatches.push({
        tournamentId: tournamentId,
        round: nextRound,
        player1Id: byeWinner,
        player2Id: byeWinner, // Same player for bye
        status: "completed",
        winner: byeWinner,
        startTime: matchStartTime,
        canStartEarly: false, // Bye matches don't need early start
      });
    }

    // Save new matches
    const savedMatches = await matchRepository.save(nextRoundMatches);

    return savedMatches as Match[];
  }

  static async checkAndGenerateNextRound(
    tournamentId: string
  ): Promise<{ nextRoundGenerated: boolean; matches?: Match[] }> {
    try {
      const matchRepository = AppDataSource.getRepository(Match);

      // Get tournament
      const tournament = await AppDataSource.getRepository(Tournament).findOne({
        where: { id: tournamentId },
      });

      if (!tournament || tournament.format !== "knockout") {
        return { nextRoundGenerated: false };
      }

      // Get all matches for this tournament
      const allMatches = await matchRepository.find({
        where: { tournamentId },
        order: { round: "DESC", createdAt: "ASC" },
      });

      if (allMatches.length === 0) {
        return { nextRoundGenerated: false };
      }

      const currentRound = allMatches[0].round;

      // Get all matches from the current round
      const currentRoundMatches = allMatches.filter(
        (match) => match.round === currentRound
      );

      // Check if all matches in current round are completed
      const completedMatches = currentRoundMatches.filter(
        (match) => match.status === "completed"
      );

      if (completedMatches.length === currentRoundMatches.length) {
        // Current round is complete, check if we can generate next round
        const winners = completedMatches
          .map((match) => match.winner)
          .filter((winner) => winner !== null && winner !== undefined);

        if (winners.length === 1) {
          // Tournament is complete
          await AppDataSource.getRepository(Tournament).update(tournamentId, {
            status: "completed",
          });
          return { nextRoundGenerated: false };
        } else if (winners.length >= 2) {
          // Generate next round
          const nextRoundMatches = await this.generateNextKnockoutRound(
            tournamentId
          );
          return { nextRoundGenerated: true, matches: nextRoundMatches };
        }
      }

      return { nextRoundGenerated: false };
    } catch (error) {
      console.error("Error checking/generating next round:", error);
      return { nextRoundGenerated: false };
    }
  }

  static async generateFullTournamentBracket(
    tournamentId: string
  ): Promise<Match[]> {
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
      console.log(
        `⚠️ Knockout tournament started with ${participants.length} participants - no matches generated`
      );
      return []; // Return empty array instead of throwing error
    }

    if (tournament.format !== "knockout") {
      // For non-knockout tournaments, use existing methods
      if (tournament.format === "round-robin") {
        return this.generateRoundRobinBracket(tournamentId);
      }
      if (tournament.format === "swiss") {
        return this.generateSwissBracket(tournamentId);
      }
      throw new Error("Unsupported tournament format");
    }

    // For knockout tournaments, generate all rounds at once
    const seededParticipants = participants.sort(
      (a, b) => b.user.rating - a.user.rating
    );

    const totalRounds = Math.ceil(Math.log2(seededParticipants.length));
    const allMatches: Partial<Match>[] = [];

    let currentRoundParticipants = [...seededParticipants];
    let currentRound = 1;

    while (currentRoundParticipants.length > 1) {
      const roundMatches: Partial<Match>[] = [];
      const nextRoundParticipants: any[] = [];

      // Schedule each round on a new day at 8:00 AM
      const roundDate = new Date(tournament.startDate);
      roundDate.setDate(roundDate.getDate() + (currentRound - 1));
      roundDate.setHours(8, 0, 0, 0);

      // Generate matches for current round
      for (let i = 0; i < currentRoundParticipants.length; i += 2) {
        const matchStartTime = new Date(roundDate);

        if (currentRoundParticipants[i + 1]) {
          // Regular match
          roundMatches.push({
            tournamentId: tournamentId,
            round: currentRound,
            player1Id: currentRoundParticipants[i].userId,
            player2Id: currentRoundParticipants[i + 1].userId,
            status: "scheduled",
            startTime: matchStartTime,
            canStartEarly: true, // Allow early start for all matches
          });

          // For subsequent rounds, we'll use placeholder logic
          // The actual winner will be determined when matches are played
          nextRoundParticipants.push({
            userId: `winner_of_match_${currentRound}_${i / 2 + 1}`,
            isPlaceholder: true,
          });
        } else {
          // Bye match
          roundMatches.push({
            tournamentId: tournamentId,
            round: currentRound,
            player1Id: currentRoundParticipants[i].userId,
            player2Id: currentRoundParticipants[i].userId,
            status: "completed",
            winner: currentRoundParticipants[i].userId,
            startTime: matchStartTime,
            canStartEarly: false, // Bye matches don't need early start
          });

          nextRoundParticipants.push(currentRoundParticipants[i]);
        }
      }

      allMatches.push(...roundMatches);
      currentRoundParticipants = nextRoundParticipants.filter(
        (p) => !p.isPlaceholder
      );
      currentRound++;

      // For now, only generate the first round with real participants
      // Subsequent rounds will be generated automatically as matches complete
      if (currentRound > 1) {
        break;
      }
    }

    // Save only the first round matches
    const savedMatches = await matchRepository.save(allMatches);

    // Update tournament status to "ongoing"
    await tournamentRepository.update(tournamentId, { status: "ongoing" });

    return savedMatches as Match[];
  }
}
