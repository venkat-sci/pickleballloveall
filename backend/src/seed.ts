import "dotenv/config";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Tournament } from "./entity/Tournament";
import { TournamentParticipant } from "./entity/TournamentParticipant";
import { Court } from "./entity/Court";
import { Match } from "./entity/Match";
import bcrypt from "bcryptjs";

async function seedData() {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established for seeding.");

    const userRepository = AppDataSource.getRepository(User);
    const tournamentRepository = AppDataSource.getRepository(Tournament);
    const tournamentParticipantRepository = AppDataSource.getRepository(
      TournamentParticipant
    );
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

    const existingParticipants = await tournamentParticipantRepository.find();
    if (existingParticipants.length > 0) {
      await tournamentParticipantRepository.remove(existingParticipants);
      console.log(
        `Removed ${existingParticipants.length} existing tournament participants`
      );
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

    // Create users with game statistics
    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = await userRepository.save([
      {
        email: "john.smith@example.com",
        password: hashedPassword,
        name: "John Smith",
        role: "organizer" as const,
        rating: 4.2,
        totalWins: 15,
        totalLosses: 3,
        totalGamesPlayed: 18,
        profileImage:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0001",
        location: "New York, NY",
        bio: "Tournament organizer with 10+ years of pickleball experience",
        dateOfBirth: new Date("1985-03-15"),
        preferredHand: "right" as const,
        yearsPlaying: "10+",
        favoriteShot: "drive",
      },
      {
        email: "sarah.wilson@example.com",
        password: hashedPassword,
        name: "Sarah Wilson",
        role: "player" as const,
        rating: 4.5,
        totalWins: 20,
        totalLosses: 2,
        totalGamesPlayed: 22,
        profileImage:
          "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0002",
        location: "Los Angeles, CA",
        bio: "Passionate pickleball player who loves doubles games",
        dateOfBirth: new Date("1990-07-22"),
        preferredHand: "left" as const,
        yearsPlaying: "3",
        favoriteShot: "dink",
      },
      {
        email: "mike.johnson@example.com",
        password: hashedPassword,
        name: "Mike Johnson",
        role: "player" as const,
        rating: 4.0,
        totalWins: 12,
        totalLosses: 6,
        totalGamesPlayed: 18,
        profileImage:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0003",
        location: "Chicago, IL",
        bio: "Competitive player focusing on singles tournaments",
        preferredHand: "right" as const,
        yearsPlaying: "5",
        favoriteShot: "smash",
      },
      {
        email: "emma.davis@example.com",
        password: hashedPassword,
        name: "Emma Davis",
        role: "player" as const,
        rating: 4.1,
        totalWins: 14,
        totalLosses: 8,
        totalGamesPlayed: 22,
        profileImage:
          "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0004",
        location: "Austin, TX",
        bio: "Strategic player with excellent court awareness",
        preferredHand: "right" as const,
        yearsPlaying: "4",
        favoriteShot: "serve",
      },
      {
        email: "david.brown@example.com",
        password: hashedPassword,
        name: "David Brown",
        role: "player" as const,
        rating: 3.8,
        totalWins: 10,
        totalLosses: 5,
        totalGamesPlayed: 15,
        profileImage:
          "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0005",
        location: "Seattle, WA",
        bio: "Weekend warrior with a passion for the game",
        preferredHand: "ambidextrous" as const,
        yearsPlaying: "2",
        favoriteShot: "drop",
      },
      {
        email: "lisa.garcia@example.com",
        password: hashedPassword,
        name: "Lisa Garcia",
        role: "player" as const,
        rating: 4.3,
        totalWins: 18,
        totalLosses: 4,
        totalGamesPlayed: 22,
        profileImage:
          "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0006",
        location: "Miami, FL",
        bio: "Former tennis player transitioning to pickleball",
        preferredHand: "right" as const,
        yearsPlaying: "3",
        favoriteShot: "lob",
      },
      {
        email: "alex.chen@example.com",
        password: hashedPassword,
        name: "Alex Chen",
        role: "organizer" as const,
        rating: 3.9,
        totalWins: 11,
        totalLosses: 7,
        totalGamesPlayed: 18,
        profileImage:
          "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0007",
        location: "Denver, CO",
        bio: "Event organizer and pickleball enthusiast",
        preferredHand: "right" as const,
        yearsPlaying: "6",
        favoriteShot: "drive",
      },
      {
        email: "maria.rodriguez@example.com",
        password: hashedPassword,
        name: "Maria Rodriguez",
        role: "player" as const,
        rating: 4.4,
        totalWins: 19,
        totalLosses: 3,
        totalGamesPlayed: 22,
        profileImage:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
        phone: "+1-555-0008",
        location: "Phoenix, AZ",
        bio: "Aggressive player with powerful serves",
        preferredHand: "left" as const,
        yearsPlaying: "4",
        favoriteShot: "smash",
      },
    ]);

    console.log("Created users:", users.length);
    console.log("User IDs created:");
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email}): ${user.id}`);
    });

    // Create tournaments
    const tournaments = await tournamentRepository.save([
      {
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
        rules: `## Tournament Rules

### General Rules
1. All matches must be played according to official pickleball rules
2. Players must arrive 15 minutes before their scheduled match time
3. Late arrivals may result in forfeit (grace period of 10 minutes)
4. All equipment must meet tournament standards

### Scoring
- Games played to 11 points, win by 2
- Best of 3 games format
- Rally scoring system

### Conduct
- Good sportsmanship is expected at all times
- Disputes should be resolved respectfully
- Tournament director's decisions are final

### Equipment
- Approved paddles only
- Tournament-provided balls will be used
- Appropriate court shoes required

### Weather Policy
- Tournament may be postponed due to severe weather
- Indoor alternatives will be provided when possible

Contact the organizer for any rule clarifications.`,
      },
      {
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
        rules: `## Doubles Tournament Rules

### Format
- Round-robin format with all teams playing each other
- Each match consists of 3 games to 11 points
- Teams switch sides after each game

### Partnerships
- Teams are randomly assigned
- No switching partners during tournament
- Mixed doubles encouraged

### Scoring
- Rally scoring (point on every serve)
- Games to 11, win by 2
- Match winner determined by games won

### Fun Elements
- Prize for most improved team
- Sportsmanship award
- Post-tournament social gathering

Contact organizer for more details!`,
      },
    ]);

    console.log("Created tournaments:", tournaments.length);

    // Create courts
    const courts = await courtRepository.save([
      {
        name: "Court 1",
        location: "Downtown Sports Complex",
        surface: "outdoor" as const,
        isAvailable: true,
      },
      {
        name: "Court 2",
        location: "Downtown Sports Complex",
        surface: "outdoor" as const,
        isAvailable: true,
      },
      {
        name: "Court 3",
        location: "City Park Courts",
        surface: "outdoor" as const,
        isAvailable: true,
      },
      {
        name: "Court 4",
        location: "City Park Courts",
        surface: "outdoor" as const,
        isAvailable: false,
      },
    ]);

    console.log("Created courts:", courts.length);

    // Create tournament participants
    const participants = await tournamentParticipantRepository.save([
      {
        userId: users[1].id,
        tournamentId: tournaments[0].id,
        tournamentWins: 2,
        tournamentLosses: 1,
        tournamentGamesPlayed: 3,
      },
      {
        userId: users[2].id,
        tournamentId: tournaments[0].id,
        tournamentWins: 1,
        tournamentLosses: 2,
        tournamentGamesPlayed: 3,
      },
      {
        userId: users[3].id,
        tournamentId: tournaments[1].id,
        partnerName: "Alex Chen",
        tournamentWins: 3,
        tournamentLosses: 0,
        tournamentGamesPlayed: 3,
      },
    ]);

    console.log("Created tournament participants:", participants.length);

    // Create some matches
    const matches = await matchRepository.save([
      {
        tournamentId: tournaments[0].id,
        round: 1,
        player1Id: users[1].id,
        player2Id: users[2].id,
        startTime: new Date("2025-08-15T09:00:00"),
        courtId: courts[0].id,
        status: "scheduled" as const,
      },
    ]);

    console.log("Created matches:", matches.length);

    console.log("✅ Data seeding completed successfully!");
    console.log("\nSeeded data summary:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Tournaments: ${tournaments.length}`);
    console.log(`- Courts: ${courts.length}`);
    console.log(`- Tournament Participants: ${participants.length}`);
    console.log(`- Matches: ${matches.length}`);
    console.log("\nTest credentials:");
    console.log("Player: sarah.wilson@example.com / password123");
    console.log("Organizer: john.smith@example.com / password123");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedData();
