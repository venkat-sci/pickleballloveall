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

    // Run migrations in production
    if (process.env.NODE_ENV === "production") {
      console.log("🔄 Running database migrations...");
      try {
        const migrations = await AppDataSource.runMigrations();

        if (migrations.length === 0) {
          console.log("✅ No new migrations to run");
        } else {
          console.log(`✅ Successfully ran ${migrations.length} migrations:`);
          migrations.forEach((migration: any) => {
            console.log(`   - ${migration.name}`);
          });
        }
      } catch (migrationError) {
        console.error("❌ Migration failed:", migrationError);
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
