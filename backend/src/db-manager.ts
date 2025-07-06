import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Tournament } from "./entity/Tournament";
import { Match } from "./entity/Match";
import { Player } from "./entity/Player";
import { Court } from "./entity/Court";
import { TournamentParticipant } from "./entity/TournamentParticipant";
import bcrypt from "bcryptjs";

// Node.js globals
declare const process: any;

type UserRole = "player" | "organizer" | "viewer";
type TournamentType = "singles" | "doubles" | "mixed";
type TournamentFormat = "round-robin" | "knockout" | "swiss";
type TournamentStatus = "upcoming" | "ongoing" | "completed";

class DatabaseManager {
  private async ensureConnection(): Promise<void> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database connected successfully");
    }
  }

  private async closeConnection(): Promise<void> {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("🔌 Database connection closed");
    }
  }

  async closeDb(): Promise<void> {
    await this.closeConnection();
  }

  /**
   * Drop all tables in the database
   */
  async dropTables(): Promise<void> {
    try {
      await this.ensureConnection();

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        console.log("🗑️  Dropping all tables...");

        // Drop tables in correct order (reverse of dependencies)
        const dropQueries = [
          'DROP TABLE IF EXISTS "match" CASCADE;',
          'DROP TABLE IF EXISTS "player" CASCADE;',
          'DROP TABLE IF EXISTS "tournament_participant" CASCADE;',
          'DROP TABLE IF EXISTS "court" CASCADE;',
          'DROP TABLE IF EXISTS "tournament" CASCADE;',
          'DROP TABLE IF EXISTS "user" CASCADE;',
          'DROP TABLE IF EXISTS "migrations" CASCADE;',
        ];

        for (const query of dropQueries) {
          await queryRunner.query(query);
        }

        console.log("✅ All tables dropped successfully");
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error("❌ Error dropping tables:", error);
      throw error;
    }
  }

  /**
   * Create all tables with proper schema and relationships
   */
  async createTables(): Promise<void> {
    try {
      await this.ensureConnection();

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        console.log("🏗️  Creating tables...");

        // Enable UUID extension
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

        // Create User table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "user" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "email" varchar UNIQUE NOT NULL,
            "password" varchar NOT NULL,
            "name" varchar NOT NULL,
            "role" varchar DEFAULT 'player',
            "rating" float DEFAULT 3.0,
            "profileImage" varchar,
            "totalWins" integer DEFAULT 0,
            "totalLosses" integer DEFAULT 0,
            "totalGamesPlayed" integer DEFAULT 0,
            "phone" varchar,
            "location" varchar,
            "bio" text,
            "dateOfBirth" date,
            "preferredHand" varchar DEFAULT 'right',
            "yearsPlaying" varchar,
            "favoriteShot" varchar,
            "notificationSettings" jsonb,
            "privacySettings" jsonb,
            "preferences" jsonb,
            "gameSettings" jsonb,
            "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Create Tournament table (before Court since Court references Tournament)
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "tournament" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" varchar NOT NULL,
            "description" text,
            "type" varchar NOT NULL DEFAULT 'singles',
            "format" varchar NOT NULL DEFAULT 'knockout',
            "startDate" timestamp NOT NULL,
            "endDate" timestamp NOT NULL,
            "location" varchar NOT NULL,
            "maxParticipants" integer NOT NULL,
            "currentParticipants" integer DEFAULT 0,
            "status" varchar DEFAULT 'upcoming',
            "organizerId" uuid NOT NULL,
            "entryFee" decimal(10,2),
            "prizePool" decimal(10,2),
            "rules" text,
            "winnerId" uuid,
            "winnerName" varchar,
            "winnerPartner" varchar,
            "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "FK_tournament_organizer" FOREIGN KEY ("organizerId") REFERENCES "user"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_tournament_winner" FOREIGN KEY ("winnerId") REFERENCES "user"("id") ON DELETE SET NULL
          );
        `);

        // Create Court table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "court" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "name" varchar NOT NULL,
            "location" varchar,
            "surface" varchar DEFAULT 'outdoor',
            "isAvailable" boolean DEFAULT true,
            "tournamentId" uuid,
            "maintenanceNotes" text,
            "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "FK_court_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE SET NULL
          );
        `);

        // Create Player table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "player" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "userId" uuid NOT NULL,
            "tournamentId" uuid NOT NULL,
            "partnerId" uuid,
            "seedNumber" integer,
            "status" varchar DEFAULT 'active',
            "wins" integer DEFAULT 0,
            "losses" integer DEFAULT 0,
            "gamesPlayed" integer DEFAULT 0,
            "totalScore" integer DEFAULT 0,
            "averageScore" decimal(5,2) DEFAULT 0,
            "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "FK_player_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_player_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_player_partner" FOREIGN KEY ("partnerId") REFERENCES "user"("id") ON DELETE SET NULL,
            UNIQUE("userId", "tournamentId")
          );
        `);

        // Create Match table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "match" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "tournamentId" uuid NOT NULL,
            "player1Id" uuid,
            "player2Id" uuid,
            "courtId" uuid,
            "startTime" timestamp,
            "endTime" timestamp,
            "actualStartTime" timestamp,
            "actualEndTime" timestamp,
            "score" jsonb DEFAULT '{"player1": [], "player2": []}',
            "player1Score" integer DEFAULT 0,
            "player2Score" integer DEFAULT 0,
            "winnerId" uuid,
            "round" integer DEFAULT 1,
            "matchNumber" integer,
            "status" varchar DEFAULT 'scheduled',
            "notes" text,
            "scoreKeepers" uuid[],
            "officialScore" boolean DEFAULT false,
            "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "FK_match_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_match_player1" FOREIGN KEY ("player1Id") REFERENCES "player"("id") ON DELETE SET NULL,
            CONSTRAINT "FK_match_player2" FOREIGN KEY ("player2Id") REFERENCES "player"("id") ON DELETE SET NULL,
            CONSTRAINT "FK_match_court" FOREIGN KEY ("courtId") REFERENCES "court"("id") ON DELETE SET NULL,
            CONSTRAINT "FK_match_winner" FOREIGN KEY ("winnerId") REFERENCES "player"("id") ON DELETE SET NULL
          );
        `);

        // Create Tournament Participant table
        await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "tournament_participant" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "tournamentId" uuid NOT NULL,
            "userId" uuid NOT NULL,
            "partnerId" uuid,
            "registeredAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "status" varchar DEFAULT 'registered',
            "paymentStatus" varchar DEFAULT 'pending',
            "tournamentWins" integer DEFAULT 0,
            "tournamentLosses" integer DEFAULT 0,
            "tournamentGamesPlayed" integer DEFAULT 0,
            "seedRanking" integer,
            "checkInTime" timestamp,
            "emergencyContact" varchar,
            "medicalInfo" text,
            "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "FK_participant_tournament" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_participant_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_participant_partner" FOREIGN KEY ("partnerId") REFERENCES "user"("id") ON DELETE SET NULL,
            UNIQUE("tournamentId", "userId")
          );
        `);

        console.log("✅ All tables created successfully");
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error("❌ Error creating tables:", error);
      throw error;
    }
  }

  /**
   * Create optimized indexes for better performance
   */
  async createIndexes(): Promise<void> {
    try {
      await this.ensureConnection();

      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();

      try {
        console.log("📊 Creating performance indexes...");

        const indexes = [
          // User indexes
          'CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user"("email");',
          'CREATE INDEX IF NOT EXISTS "IDX_user_role" ON "user"("role");',
          'CREATE INDEX IF NOT EXISTS "IDX_user_rating" ON "user"("rating");',

          // Tournament indexes
          'CREATE INDEX IF NOT EXISTS "IDX_tournament_organizer" ON "tournament"("organizerId");',
          'CREATE INDEX IF NOT EXISTS "IDX_tournament_status" ON "tournament"("status");',
          'CREATE INDEX IF NOT EXISTS "IDX_tournament_start_date" ON "tournament"("startDate");',
          'CREATE INDEX IF NOT EXISTS "IDX_tournament_location" ON "tournament"("location");',
          'CREATE INDEX IF NOT EXISTS "IDX_tournament_type" ON "tournament"("type");',

          // Match indexes
          'CREATE INDEX IF NOT EXISTS "IDX_match_tournament" ON "match"("tournamentId");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_player1" ON "match"("player1Id");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_player2" ON "match"("player2Id");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_court" ON "match"("courtId");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_status" ON "match"("status");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_round" ON "match"("round");',

          // Player indexes
          'CREATE INDEX IF NOT EXISTS "IDX_player_user" ON "player"("userId");',
          'CREATE INDEX IF NOT EXISTS "IDX_player_tournament" ON "player"("tournamentId");',
          'CREATE INDEX IF NOT EXISTS "IDX_player_status" ON "player"("status");',

          // Tournament Participant indexes
          'CREATE INDEX IF NOT EXISTS "IDX_participant_tournament" ON "tournament_participant"("tournamentId");',
          'CREATE INDEX IF NOT EXISTS "IDX_participant_user" ON "tournament_participant"("userId");',
          'CREATE INDEX IF NOT EXISTS "IDX_participant_status" ON "tournament_participant"("status");',

          // Court indexes
          'CREATE INDEX IF NOT EXISTS "IDX_court_available" ON "court"("isAvailable");',

          // Composite indexes for common queries
          'CREATE INDEX IF NOT EXISTS "IDX_tournament_status_date" ON "tournament"("status", "startDate");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_tournament_round" ON "match"("tournamentId", "round");',
          'CREATE INDEX IF NOT EXISTS "IDX_match_tournament_status" ON "match"("tournamentId", "status");',
        ];

        for (const indexQuery of indexes) {
          await queryRunner.query(indexQuery);
        }

        console.log("✅ All indexes created successfully");
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      console.error("❌ Error creating indexes:", error);
      throw error;
    }
  }

  /**
   * Create seed data for testing
   */
  async seedData(): Promise<void> {
    try {
      await this.ensureConnection();
      console.log("🌱 Seeding database with test data...");

      const userRepository = AppDataSource.getRepository(User);
      const tournamentRepository = AppDataSource.getRepository(Tournament);
      const courtRepository = AppDataSource.getRepository(Court);
      const participantRepository = AppDataSource.getRepository(
        TournamentParticipant
      );

      // Create users with proper typing
      const hashedPassword = await bcrypt.hash("Password@123", 10);

      const usersData = [
        {
          email: "admin@pickleballloveall.com",
          name: "Admin User",
          role: "organizer" as UserRole,
          rating: 4.5,
        },
        {
          email: "organizer1@example.com",
          name: "Sarah Wilson",
          role: "organizer" as UserRole,
          rating: 4.2,
        },
        {
          email: "player1@example.com",
          name: "John Doe",
          role: "player" as UserRole,
          rating: 3.5,
        },
        {
          email: "player2@example.com",
          name: "Jane Smith",
          role: "player" as UserRole,
          rating: 4.0,
        },
        {
          email: "player3@example.com",
          name: "Mike Johnson",
          role: "player" as UserRole,
          rating: 3.8,
        },
        {
          email: "player4@example.com",
          name: "Emily Davis",
          role: "player" as UserRole,
          rating: 4.1,
        },
      ];

      const createdUsers: User[] = [];
      for (const userData of usersData) {
        let user = await userRepository.findOne({
          where: { email: userData.email },
        });
        if (!user) {
          user = userRepository.create({
            ...userData,
            password: hashedPassword,
          });
          user = await userRepository.save(user);
          console.log(`👤 Created user: ${userData.name}`);
        }
        createdUsers.push(user);
      }

      // Create courts
      const courtsData = [
        { name: "Court 1", location: "Main Area", surface: "outdoor" },
        { name: "Court 2", location: "Main Area", surface: "outdoor" },
        { name: "Court 3", location: "Side Area", surface: "indoor" },
        { name: "Court 4", location: "Side Area", surface: "indoor" },
      ];

      for (const courtData of courtsData) {
        let court = await courtRepository.findOne({
          where: { name: courtData.name },
        });
        if (!court) {
          court = courtRepository.create(courtData);
          await courtRepository.save(court);
          console.log(`🏟️  Created court: ${courtData.name}`);
        }
      }

      console.log("✅ Database seeded successfully");
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      throw error;
    }
  }

  /**
   * Reset entire database (drop + create + seed)
   */
  async resetDatabase(): Promise<void> {
    try {
      console.log("🔄 Resetting entire database...");
      await this.dropTables();
      await this.createTables();
      await this.createIndexes();
      await this.seedData();
      console.log("✅ Database reset completed successfully");
    } catch (error) {
      console.error("❌ Error resetting database:", error);
      throw error;
    }
  }

  /**
   * Show help menu
   */
  showHelp(): void {
    console.log(`
🗄️  Database Management Tool
============================

Available commands:
  drop     - Drop all tables
  create   - Create all tables and relationships
  indexes  - Create performance indexes
  seed     - Insert test data
  reset    - Drop, create, index, and seed (full reset)
  help     - Show this help menu

Usage examples:
  node dist/db-manager.js drop
  node dist/db-manager.js create
  node dist/db-manager.js seed
  node dist/db-manager.js reset
    `);
  }
}

// CLI handling
async function main(): Promise<void> {
  const dbManager = new DatabaseManager();
  const command = process.argv[2];

  try {
    switch (command) {
      case "drop":
        await dbManager.dropTables();
        break;
      case "create":
        await dbManager.createTables();
        break;
      case "indexes":
        await dbManager.createIndexes();
        break;
      case "seed":
        await dbManager.seedData();
        break;
      case "reset":
        await dbManager.resetDatabase();
        break;
      case "help":
      default:
        dbManager.showHelp();
        break;
    }
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  } finally {
    await dbManager.closeDb();
    process.exit(0);
  }
}

// Only run main if this is the entry point
if (require.main === module) {
  main();
}

export default DatabaseManager;
