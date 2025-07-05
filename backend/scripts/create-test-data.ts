import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { Tournament } from "../src/entity/Tournament";
import { TournamentParticipant } from "../src/entity/TournamentParticipant";
import bcrypt from "bcryptjs";

async function createTestData() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    const userRepository = AppDataSource.getRepository(User);
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const participantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );

    // Create test users
    const testUsers = [
      {
        email: "organizer@test.com",
        name: "Tournament Organizer",
        rating: 4.5,
      },
      { email: "player1@test.com", name: "Alice Johnson", rating: 5.0 },
      { email: "player2@test.com", name: "Bob Smith", rating: 4.8 },
      { email: "player3@test.com", name: "Carol Williams", rating: 4.6 },
      { email: "player4@test.com", name: "David Brown", rating: 4.4 },
      { email: "player5@test.com", name: "Emma Davis", rating: 4.2 },
      { email: "player6@test.com", name: "Frank Miller", rating: 4.0 },
      { email: "player7@test.com", name: "Grace Wilson", rating: 3.8 },
      { email: "player8@test.com", name: "Henry Taylor", rating: 3.6 },
    ];

    const createdUsers: User[] = [];
    const hashedPassword = await bcrypt.hash("Password@123", 10);

    for (const userData of testUsers) {
      // Check if user already exists
      let user = await userRepository.findOne({
        where: { email: userData.email },
      });

      if (!user) {
        user = userRepository.create({
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          rating: userData.rating,
          totalWins: 0,
          totalLosses: 0,
          totalGamesPlayed: 0,
        });
        user = await userRepository.save(user);
        console.log(`Created user: ${userData.name} (${userData.email})`);
      } else {
        console.log(
          `User already exists: ${userData.name} (${userData.email})`
        );
      }

      createdUsers.push(user);
    }

    // Create test tournaments
    const organizer = createdUsers[0]; // First user is organizer
    const startDate = new Date();
    startDate.setHours(startDate.getHours() + 1); // Start in 1 hour
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + 8); // End in 8 hours

    // Knockout Tournament
    let knockoutTournament = await tournamentRepository.findOne({
      where: { name: "Test Knockout Tournament" },
    });

    if (!knockoutTournament) {
      knockoutTournament = tournamentRepository.create({
        name: "Test Knockout Tournament",
        description:
          "A test knockout tournament for testing the bracket system",
        type: "singles",
        format: "knockout",
        startDate: startDate,
        endDate: endDate,
        location: "Test Sports Center",
        maxParticipants: 8,
        organizerId: organizer.id,
        entryFee: 10.0,
        prizePool: 80.0,
        status: "upcoming",
        currentParticipants: 0,
      });
      knockoutTournament = await tournamentRepository.save(knockoutTournament);
      console.log("Created knockout tournament");
    } else {
      console.log("Knockout tournament already exists");
    }

    // Round Robin Tournament
    let roundRobinTournament = await tournamentRepository.findOne({
      where: { name: "Test Round Robin Tournament" },
    });

    if (!roundRobinTournament) {
      const rrStartDate = new Date();
      rrStartDate.setDate(rrStartDate.getDate() + 1); // Tomorrow
      const rrEndDate = new Date();
      rrEndDate.setDate(rrEndDate.getDate() + 1);
      rrEndDate.setHours(rrEndDate.getHours() + 6);

      roundRobinTournament = tournamentRepository.create({
        name: "Test Round Robin Tournament",
        description: "A test round robin tournament with 4 players",
        type: "singles",
        format: "round-robin",
        startDate: rrStartDate,
        endDate: rrEndDate,
        location: "Test Sports Center",
        maxParticipants: 4,
        organizerId: organizer.id,
        entryFee: 5.0,
        prizePool: 20.0,
        status: "upcoming",
        currentParticipants: 0,
      });
      roundRobinTournament = await tournamentRepository.save(
        roundRobinTournament
      );
      console.log("Created round robin tournament");
    } else {
      console.log("Round robin tournament already exists");
    }

    // Add participants to knockout tournament (6 players for testing odd numbers)
    const playersToAdd = createdUsers.slice(1, 7); // Skip organizer, take 6 players

    for (const player of playersToAdd) {
      const existingParticipant = await participantRepository.findOne({
        where: {
          userId: player.id,
          tournamentId: knockoutTournament.id,
        },
      });

      if (!existingParticipant) {
        const participant = participantRepository.create({
          userId: player.id,
          tournamentId: knockoutTournament.id,
          tournamentWins: 0,
          tournamentLosses: 0,
          tournamentGamesPlayed: 0,
        });
        await participantRepository.save(participant);
        console.log(`Added ${player.name} to knockout tournament`);
      }
    }

    // Update participant count for knockout tournament
    const knockoutParticipantCount = await participantRepository.count({
      where: { tournamentId: knockoutTournament.id },
    });
    await tournamentRepository.update(knockoutTournament.id, {
      currentParticipants: knockoutParticipantCount,
    });

    // Add participants to round robin tournament (4 players)
    const rrPlayers = createdUsers.slice(1, 5); // Take first 4 players

    for (const player of rrPlayers) {
      const existingParticipant = await participantRepository.findOne({
        where: {
          userId: player.id,
          tournamentId: roundRobinTournament.id,
        },
      });

      if (!existingParticipant) {
        const participant = participantRepository.create({
          userId: player.id,
          tournamentId: roundRobinTournament.id,
          tournamentWins: 0,
          tournamentLosses: 0,
          tournamentGamesPlayed: 0,
        });
        await participantRepository.save(participant);
        console.log(`Added ${player.name} to round robin tournament`);
      }
    }

    // Update participant count for round robin tournament
    const rrParticipantCount = await participantRepository.count({
      where: { tournamentId: roundRobinTournament.id },
    });
    await tournamentRepository.update(roundRobinTournament.id, {
      currentParticipants: rrParticipantCount,
    });

    console.log("\n=== Test Data Created Successfully ===");
    console.log("Login credentials for all users: Password@123");
    console.log("\nTest Users Created:");
    testUsers.forEach((user, index) => {
      console.log(
        `${index + 1}. ${user.name} (${user.email}) - Rating: ${user.rating}`
      );
    });

    console.log("\nTournaments Created:");
    console.log(
      `1. ${knockoutTournament.name} - ${knockoutParticipantCount} participants`
    );
    console.log(
      `2. ${roundRobinTournament.name} - ${rrParticipantCount} participants`
    );

    console.log("\nNext Steps:");
    console.log("1. Start your backend server: npm run dev");
    console.log("2. Start your frontend server: npm run dev");
    console.log("3. Login as organizer@test.com to start tournaments");
    console.log("4. Login as any player to view tournament progress");
  } catch (error) {
    console.error("Error creating test data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Run the script
createTestData();
