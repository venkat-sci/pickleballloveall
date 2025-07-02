import "dotenv/config";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Tournament } from "./entity/Tournament";
import { Player } from "./entity/Player";
import { Court } from "./entity/Court";
import { Match } from "./entity/Match";
import bcrypt from "bcryptjs";

async function seedData() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established for seeding.");

    const userRepository = AppDataSource.getRepository(User);
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const playerRepository = AppDataSource.getRepository(Player);
    const courtRepository = AppDataSource.getRepository(Court);
    const matchRepository = AppDataSource.getRepository(Match);

    // Clear existing data in correct order (child tables first)
    console.log("Clearing existing data...");

    // Delete all records using remove() instead of clear() to handle foreign keys
    const existingMatches = await matchRepository.find();
    if (existingMatches.length > 0) {
      await matchRepository.remove(existingMatches);
      console.log(`Removed ${existingMatches.length} existing matches`);
    }

    const existingPlayers = await playerRepository.find();
    if (existingPlayers.length > 0) {
      await playerRepository.remove(existingPlayers);
      console.log(`Removed ${existingPlayers.length} existing players`);
    }

    const existingCourts = await courtRepository.find();
    if (existingCourts.length > 0) {
      await courtRepository.remove(existingCourts);
      console.log(`Removed ${existingCourts.length} existing courts`);
    }

    const existingTournaments = await tournamentRepository.find();
    if (existingTournaments.length > 0) {
      await tournamentRepository.remove(existingTournaments);
      console.log(`Removed ${existingTournaments.length} existing tournaments`);
    }

    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      await userRepository.remove(existingUsers);
      console.log(`Removed ${existingUsers.length} existing users`);
    }

    // Create users
    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = await userRepository.save([
      {
        email: "john.doe@example.com",
        password: hashedPassword,
        name: "John Doe",
        role: "organizer" as const,
        rating: 4.5,
        phone: "+1-555-0001",
        location: "New York, NY",
        bio: "Tournament organizer with 10+ years of pickleball experience",
        dateOfBirth: new Date("1985-03-15"),
        preferredHand: "right" as const,
        yearsPlaying: "10+",
        favoriteShot: "drive",
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: true,
          matchReminders: true,
          tournamentUpdates: true,
          scoreUpdates: false,
          weeklyDigest: true,
        },
        privacySettings: {
          profileVisibility: "public",
          showRating: true,
          showStats: true,
          showLocation: true,
          allowMessages: true,
        },
        preferences: {
          theme: "light",
          language: "en",
          timezone: "America/New_York",
          dateFormat: "MM/dd/yyyy",
          timeFormat: "12h",
        },
        gameSettings: {
          defaultTournamentType: "singles",
          autoJoinWaitlist: true,
          preferredCourtSurface: "outdoor",
          availableDays: ["monday", "wednesday", "friday", "saturday"],
          preferredTimeSlots: ["morning", "evening"],
        },
      },
      {
        email: "jane.smith@example.com",
        password: hashedPassword,
        name: "Jane Smith",
        role: "player" as const,
        rating: 3.8,
        phone: "+1-555-0002",
        location: "Los Angeles, CA",
        bio: "Passionate pickleball player who loves doubles games",
        dateOfBirth: new Date("1990-07-22"),
        preferredHand: "left" as const,
        yearsPlaying: "3",
        favoriteShot: "dink",
        notificationSettings: {
          emailNotifications: true,
          pushNotifications: false,
          matchReminders: true,
          tournamentUpdates: true,
          scoreUpdates: true,
          weeklyDigest: false,
        },
        privacySettings: {
          profileVisibility: "players",
          showRating: true,
          showStats: false,
          showLocation: false,
          allowMessages: true,
        },
        preferences: {
          theme: "dark",
          language: "en",
          timezone: "America/Los_Angeles",
          dateFormat: "MM/dd/yyyy",
          timeFormat: "12h",
        },
        gameSettings: {
          defaultTournamentType: "doubles",
          autoJoinWaitlist: false,
          preferredCourtSurface: "both",
          availableDays: ["tuesday", "thursday", "saturday", "sunday"],
          preferredTimeSlots: ["afternoon", "evening"],
        },
      },
      {
        email: "mike.wilson@example.com",
        password: hashedPassword,
        name: "Mike Wilson",
        role: "player" as const,
        rating: 4.2,
        phone: "+1-555-0003",
        location: "Chicago, IL",
        bio: "Competitive player focusing on singles tournaments",
        preferredHand: "right" as const,
        yearsPlaying: "5",
        favoriteShot: "smash",
      },
      {
        email: "sarah.jones@example.com",
        password: hashedPassword,
        name: "Sarah Jones",
        role: "player" as const,
        rating: 3.5,
        phone: "+1-555-0004",
        location: "Austin, TX",
        bio: "New to pickleball but loving every game!",
        preferredHand: "right" as const,
        yearsPlaying: "1",
        favoriteShot: "serve",
      },
      {
        email: "alex.brown@example.com",
        password: hashedPassword,
        name: "Alex Brown",
        role: "player" as const,
        rating: 4.0,
        phone: "+1-555-0005",
        location: "Seattle, WA",
        bio: "Weekend warrior with a passion for the game",
        preferredHand: "ambidextrous" as const,
        yearsPlaying: "4",
        favoriteShot: "drop",
      },
      {
        email: "lisa.davis@example.com",
        password: hashedPassword,
        name: "Lisa Davis",
        role: "player" as const,
        rating: 3.9,
        phone: "+1-555-0006",
        location: "Miami, FL",
        bio: "Former tennis player transitioning to pickleball",
        preferredHand: "right" as const,
        yearsPlaying: "2",
        favoriteShot: "lob",
      },
      {
        email: "tom.miller@example.com",
        password: hashedPassword,
        name: "Tom Miller",
        role: "organizer" as const,
        rating: 4.3,
        phone: "+1-555-0007",
        location: "Denver, CO",
        bio: "Event organizer and pickleball enthusiast",
        preferredHand: "right" as const,
        yearsPlaying: "8",
        favoriteShot: "drive",
      },
      {
        email: "amy.taylor@example.com",
        password: hashedPassword,
        name: "Amy Taylor",
        role: "player" as const,
        rating: 3.7,
        phone: "+1-555-0008",
        location: "Phoenix, AZ",
        bio: "Casual player who enjoys social games",
        preferredHand: "left" as const,
        yearsPlaying: "2",
        favoriteShot: "dink",
      },
    ]);

    console.log("Created users:", users.length);

    // Create tournaments
    const tournament1 = tournamentRepository.create({
      name: "Summer Singles Championship",
      description: "Annual summer singles tournament for advanced players",
      type: "singles" as const,
      format: "knockout" as const,
      startDate: new Date("2025-08-15"),
      endDate: new Date("2025-08-17"),
      location: "Downtown Sports Complex",
      maxParticipants: 16,
      currentParticipants: 8,
      status: "upcoming" as const,
      organizerId: users[0].id,
      entryFee: 25.0,
      prizePool: 400.0,
    });

    const tournament2 = tournamentRepository.create({
      name: "Doubles Fun Tournament",
      description: "Casual doubles tournament for all skill levels",
      type: "doubles" as const,
      format: "round-robin" as const,
      startDate: new Date("2025-07-20"),
      endDate: new Date("2025-07-21"),
      location: "City Park Courts",
      maxParticipants: 12,
      currentParticipants: 6,
      status: "upcoming" as const,
      organizerId: users[6].id,
      entryFee: 15.0,
      prizePool: 180.0,
    });

    const tournament3 = tournamentRepository.create({
      name: "Mixed Doubles Mayhem",
      description: "Competitive mixed doubles tournament",
      type: "mixed" as const,
      format: "swiss" as const,
      startDate: new Date("2025-09-10"),
      endDate: new Date("2025-09-12"),
      location: "Riverside Recreation Center",
      maxParticipants: 20,
      currentParticipants: 12,
      status: "upcoming" as const,
      organizerId: users[0].id,
      entryFee: 30.0,
      prizePool: 600.0,
    });

    const tournament4 = tournamentRepository.create({
      name: "Spring League Finals",
      description: "Final tournament of the spring league season",
      type: "singles" as const,
      format: "knockout" as const,
      startDate: new Date("2025-06-15"),
      endDate: new Date("2025-06-16"),
      location: "Athletic Club Courts",
      maxParticipants: 8,
      currentParticipants: 8,
      status: "completed" as const,
      organizerId: users[6].id,
      entryFee: 20.0,
      prizePool: 160.0,
    });

    const tournaments = await tournamentRepository.save([
      tournament1,
      tournament2,
      tournament3,
      tournament4,
    ]);

    console.log("Created tournaments:", tournaments.length);

    // Create courts
    const courts = await courtRepository.save([
      {
        name: "Court 1",
        location: "Downtown Sports Complex",
        isAvailable: true,
        tournamentId: tournaments[0].id,
      },
      {
        name: "Court 2",
        location: "Downtown Sports Complex",
        isAvailable: true,
        tournamentId: tournaments[0].id,
      },
      {
        name: "Court A",
        location: "City Park Courts",
        isAvailable: true,
        tournamentId: tournaments[1].id,
      },
      {
        name: "Court B",
        location: "City Park Courts",
        isAvailable: true,
        tournamentId: tournaments[1].id,
      },
      {
        name: "Center Court",
        location: "Riverside Recreation Center",
        isAvailable: true,
        tournamentId: tournaments[2].id,
      },
      {
        name: "Side Court",
        location: "Riverside Recreation Center",
        isAvailable: true,
        tournamentId: tournaments[2].id,
      },
      {
        name: "Main Court",
        location: "Athletic Club Courts",
        isAvailable: true,
        tournamentId: tournaments[3].id,
      },
      {
        name: "Practice Court",
        location: "Athletic Club Courts",
        isAvailable: true,
      },
    ]);

    console.log("Created courts:", courts.length);

    // Create players for tournaments
    const playersData = [
      // Summer Singles Championship players
      {
        userId: users[1].id,
        name: users[1].name,
        rating: users[1].rating,
        tournamentId: tournaments[0].id,
      },
      {
        userId: users[2].id,
        name: users[2].name,
        rating: users[2].rating,
        tournamentId: tournaments[0].id,
      },
      {
        userId: users[3].id,
        name: users[3].name,
        rating: users[3].rating,
        tournamentId: tournaments[0].id,
      },
      {
        userId: users[4].id,
        name: users[4].name,
        rating: users[4].rating,
        tournamentId: tournaments[0].id,
      },
      {
        userId: users[5].id,
        name: users[5].name,
        rating: users[5].rating,
        tournamentId: tournaments[0].id,
      },
      {
        userId: users[7].id,
        name: users[7].name,
        rating: users[7].rating,
        tournamentId: tournaments[0].id,
      },

      // Doubles Fun Tournament players
      {
        userId: users[1].id,
        name: users[1].name,
        rating: users[1].rating,
        tournamentId: tournaments[1].id,
        partnerName: "Partner 1",
      },
      {
        userId: users[2].id,
        name: users[2].name,
        rating: users[2].rating,
        tournamentId: tournaments[1].id,
        partnerName: "Partner 2",
      },
      {
        userId: users[4].id,
        name: users[4].name,
        rating: users[4].rating,
        tournamentId: tournaments[1].id,
        partnerName: "Partner 3",
      },

      // Mixed Doubles Mayhem players
      {
        userId: users[1].id,
        name: users[1].name,
        rating: users[1].rating,
        tournamentId: tournaments[2].id,
        partnerName: "Mike Wilson",
      },
      {
        userId: users[3].id,
        name: users[3].name,
        rating: users[3].rating,
        tournamentId: tournaments[2].id,
        partnerName: "Alex Brown",
      },
      {
        userId: users[5].id,
        name: users[5].name,
        rating: users[5].rating,
        tournamentId: tournaments[2].id,
        partnerName: "Tom Miller",
      },

      // Spring League Finals players (completed tournament)
      {
        userId: users[1].id,
        name: users[1].name,
        rating: users[1].rating,
        wins: 3,
        losses: 1,
        gamesPlayed: 4,
        tournamentId: tournaments[3].id,
      },
      {
        userId: users[2].id,
        name: users[2].name,
        rating: users[2].rating,
        wins: 2,
        losses: 2,
        gamesPlayed: 4,
        tournamentId: tournaments[3].id,
      },
      {
        userId: users[3].id,
        name: users[3].name,
        rating: users[3].rating,
        wins: 1,
        losses: 3,
        gamesPlayed: 4,
        tournamentId: tournaments[3].id,
      },
      {
        userId: users[4].id,
        name: users[4].name,
        rating: users[4].rating,
        wins: 4,
        losses: 0,
        gamesPlayed: 4,
        tournamentId: tournaments[3].id,
      },
    ];

    const players = [];
    for (const playerData of playersData) {
      const player = playerRepository.create(playerData);
      players.push(await playerRepository.save(player));
    }

    console.log("Created players:", players.length);

    // Create some matches for the completed tournament
    const matches = await matchRepository.save([
      {
        tournamentId: tournaments[3].id,
        round: 1,
        player1Id: players[12].id, // Jane Smith
        player2Id: players[13].id, // Mike Wilson
        startTime: new Date("2025-06-15T09:00:00"),
        courtId: courts[6].id,
        status: "completed" as const,
        score: { player1: [11, 8, 11], player2: [9, 11, 6] },
        winner: players[12].id,
      },
      {
        tournamentId: tournaments[3].id,
        round: 1,
        player1Id: players[14].id, // Sarah Jones
        player2Id: players[15].id, // Alex Brown
        startTime: new Date("2025-06-15T10:00:00"),
        courtId: courts[6].id,
        status: "completed" as const,
        score: { player1: [7, 11, 9], player2: [11, 9, 11] },
        winner: players[15].id,
      },
      {
        tournamentId: tournaments[3].id,
        round: 2,
        player1Id: players[12].id, // Jane Smith
        player2Id: players[15].id, // Alex Brown
        startTime: new Date("2025-06-15T14:00:00"),
        courtId: courts[6].id,
        status: "completed" as const,
        score: { player1: [9, 11, 8], player2: [11, 8, 11] },
        winner: players[15].id,
      },

      // Upcoming matches for Summer Singles Championship
      {
        tournamentId: tournaments[0].id,
        round: 1,
        player1Id: players[0].id, // Jane Smith
        player2Id: players[1].id, // Mike Wilson
        startTime: new Date("2025-08-15T09:00:00"),
        courtId: courts[0].id,
        status: "scheduled" as const,
      },
      {
        tournamentId: tournaments[0].id,
        round: 1,
        player1Id: players[2].id, // Sarah Jones
        player2Id: players[3].id, // Alex Brown
        startTime: new Date("2025-08-15T10:00:00"),
        courtId: courts[1].id,
        status: "scheduled" as const,
      },
    ]);

    console.log("Created matches:", matches.length);

    console.log("✅ Data seeding completed successfully!");
    console.log("\nSeeded data summary:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Tournaments: ${tournaments.length}`);
    console.log(`- Courts: ${courts.length}`);
    console.log(`- Players: ${players.length}`);
    console.log(`- Matches: ${matches.length}`);

    console.log("\nTest credentials:");
    console.log("Organizer: john.doe@example.com / password123");
    console.log("Player: jane.smith@example.com / password123");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedData();
