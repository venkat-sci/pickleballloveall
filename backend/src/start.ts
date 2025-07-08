import "dotenv/config";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import app from "./index";
import path from "path";
import fs from "fs";

const PORT = process.env.PORT || 3000;

/**
 * Ensure uploads directory exists
 */
function ensureUploadsDirectory(): void {
  const uploadsPath = path.join(__dirname, "uploads");
  const profilePicturesPath = path.join(uploadsPath, "profile-pictures");

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log("📁 Created uploads directory");
  }

  if (!fs.existsSync(profilePicturesPath)) {
    fs.mkdirSync(profilePicturesPath, { recursive: true });
    console.log("📁 Created profile-pictures directory");
  }
}

/**
 * Production server startup with proper error handling and graceful shutdown
 */
async function startServer(): Promise<void> {
  try {
    console.log("🚀 Starting Pickleball Love All Backend Server...");
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "production"}`);
    console.log(`🔌 Port: ${PORT}`);

    // Ensure uploads directory exists
    ensureUploadsDirectory();

    // Initialize database connection
    console.log("🔄 Connecting to database...");
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");

    // Handle migrations in production with a safer approach
    if (process.env.NODE_ENV === "production") {
      console.log("🔄 Handling database migrations...");
      try {
        // Check if migrations table exists
        const migrationTableExists = await AppDataSource.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'migrations'
          );
        `);

        if (!migrationTableExists[0].exists) {
          console.log("📋 Creating migrations table...");
          await AppDataSource.query(`
            CREATE TABLE "migrations" (
              "id" SERIAL NOT NULL,
              "timestamp" bigint NOT NULL,
              "name" character varying NOT NULL,
              CONSTRAINT "PK_migrations" PRIMARY KEY ("id")
            )
          `);
        }

        // Check if user table exists (to determine if we need to mark initial migration as done)
        const userTableExists = await AppDataSource.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'user'
          );
        `);

        if (userTableExists[0].exists) {
          // Check if initial migration is already recorded
          const initialMigrationExists = await AppDataSource.query(`
            SELECT * FROM "migrations" WHERE "name" = 'InitialSchema1704534000000'
          `);

          if (initialMigrationExists.length === 0) {
            console.log("📝 Marking initial migration as completed...");
            await AppDataSource.query(`
              INSERT INTO "migrations" ("timestamp", "name") 
              VALUES (1704534000000, 'InitialSchema1704534000000')
            `);
          }
        }

        // Handle email verification fields
        const emailVerificationColumnsExist = await AppDataSource.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'user' 
          AND column_name IN ('isEmailVerified', 'emailVerificationToken', 'emailVerificationExpires', 'passwordResetToken', 'passwordResetExpires')
        `);

        const existingColumns = emailVerificationColumnsExist.map(
          (c: any) => c.column_name
        );
        const requiredColumns = [
          "isEmailVerified",
          "emailVerificationToken",
          "emailVerificationExpires",
          "passwordResetToken",
          "passwordResetExpires",
        ];

        for (const column of requiredColumns) {
          if (!existingColumns.includes(column)) {
            console.log(`📝 Adding missing column: ${column}`);

            switch (column) {
              case "isEmailVerified":
                await AppDataSource.query(
                  `ALTER TABLE "user" ADD COLUMN "isEmailVerified" boolean NOT NULL DEFAULT false`
                );
                break;
              case "emailVerificationToken":
                await AppDataSource.query(
                  `ALTER TABLE "user" ADD COLUMN "emailVerificationToken" character varying`
                );
                break;
              case "emailVerificationExpires":
                await AppDataSource.query(
                  `ALTER TABLE "user" ADD COLUMN "emailVerificationExpires" TIMESTAMP`
                );
                break;
              case "passwordResetToken":
                await AppDataSource.query(
                  `ALTER TABLE "user" ADD COLUMN "passwordResetToken" character varying`
                );
                break;
              case "passwordResetExpires":
                await AppDataSource.query(
                  `ALTER TABLE "user" ADD COLUMN "passwordResetExpires" TIMESTAMP`
                );
                break;
            }
          }
        }

        // Mark email verification migration as completed if needed
        const emailMigrationExists = await AppDataSource.query(`
          SELECT * FROM "migrations" WHERE "name" = 'AddEmailVerificationFields1704534002000'
        `);

        if (emailMigrationExists.length === 0) {
          console.log(
            "📝 Marking email verification migration as completed..."
          );
          await AppDataSource.query(`
            INSERT INTO "migrations" ("timestamp", "name") 
            VALUES (1704534002000, 'AddEmailVerificationFields1704534002000')
          `);
        }

        console.log("✅ Database migrations handled successfully");
      } catch (migrationError) {
        console.error("❌ Migration handling failed:", migrationError);
        throw migrationError;
      }
    }

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log("🎾 Pickleball Love All Backend is ready!");
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n📢 Received ${signal}, starting graceful shutdown...`);

      // Close server first
      server.close(async () => {
        console.log("🔌 HTTP server closed");

        // Close database connection
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          console.log("💾 Database connection closed");
        }

        console.log("✅ Graceful shutdown completed");
        process.exit(0);
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        console.error("⚠️  Forceful shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Register signal handlers
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("💥 Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (reason, promise) => {
      console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    // Try to close database connection if it was opened
    if (AppDataSource.isInitialized) {
      try {
        await AppDataSource.destroy();
        console.log("💾 Database connection closed after error");
      } catch (dbError) {
        console.error("❌ Error closing database:", dbError);
      }
    }

    process.exit(1);
  }
}

// Start the server
startServer();
