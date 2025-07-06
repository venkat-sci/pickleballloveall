import { AppDataSource } from "../data-source";
import { Tournament } from "../entity/Tournament";
import { User } from "../entity/User";

async function addSampleTournamentWithWinner() {
  try {
    await AppDataSource.initialize();

    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const userRepository = AppDataSource.getRepository(User);

    // Create or find a user to be the organizer and winner
    let user = await userRepository.findOne({
      where: { email: "test@example.com" },
    });

    if (!user) {
      user = userRepository.create({
        email: "test@example.com",
        name: "John Doe",
        role: "organizer",
        rating: 4.2,
      });
      await userRepository.save(user);
      console.log("Created test user:", user.name);
    }

    // Create a completed tournament with a winner
    const completedTournament = tournamentRepository.create({
      name: "Summer Championship 2024",
      description: "Annual summer pickleball championship tournament",
      type: "singles",
      format: "knockout",
      startDate: new Date("2024-06-15T09:00:00Z"),
      endDate: new Date("2024-06-16T18:00:00Z"),
      location: "Central Park Tennis Courts",
      maxParticipants: 16,
      currentParticipants: 16,
      status: "completed",
      organizerId: user.id,
      entryFee: 50,
      prizePool: 500,
      rules: "Standard pickleball tournament rules apply",
      // Winner information
      winnerId: user.id,
      winnerName: "John Doe",
      winnerPartner: undefined, // Singles tournament
    });

    await tournamentRepository.save(completedTournament);
    console.log(
      "Created completed tournament with winner:",
      completedTournament.name
    );

    // Create a doubles tournament with winners
    const doublesUser = userRepository.create({
      email: "jane@example.com",
      name: "Jane Smith",
      role: "player",
      rating: 4.0,
    });
    await userRepository.save(doublesUser);

    const doublesTournament = tournamentRepository.create({
      name: "Doubles Masters Cup",
      description: "Premier doubles tournament for advanced players",
      type: "doubles",
      format: "round-robin",
      startDate: new Date("2024-07-01T08:00:00Z"),
      endDate: new Date("2024-07-03T20:00:00Z"),
      location: "Riverside Sports Complex",
      maxParticipants: 24,
      currentParticipants: 24,
      status: "completed",
      organizerId: user.id,
      entryFee: 75,
      prizePool: 1000,
      rules: "Doubles tournament rules with best of 3 sets",
      // Winner information
      winnerId: doublesUser.id,
      winnerName: "Jane Smith",
      winnerPartner: "Mike Johnson",
    });

    await tournamentRepository.save(doublesTournament);
    console.log(
      "Created doubles tournament with winners:",
      doublesTournament.name
    );

    console.log("Sample tournaments with winners created successfully!");

    // List all tournaments
    const tournaments = await tournamentRepository.find({
      relations: ["organizer", "winner"],
    });

    console.log("\nAll tournaments:");
    tournaments.forEach((t) => {
      console.log(
        `- ${t.name} (${t.status}) - Winner: ${t.winnerName || "None"}`
      );
    });
  } catch (error) {
    console.error("Error creating sample tournaments:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

addSampleTournamentWithWinner();
