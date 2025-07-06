#!/usr/bin/env node

// Production startup script that handles migrations and starts the server
const { AppDataSource } = require("./data-source");
const app = require("./index").default;

async function startApplication() {
  try {
    console.log("🔄 Initializing database connection...");
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");

    // Run migrations in production
    if (process.env.NODE_ENV === "production") {
      console.log("🔄 Running migrations...");
      const migrations = await AppDataSource.runMigrations();

      if (migrations.length === 0) {
        console.log("✅ No new migrations to run");
      } else {
        console.log(`✅ Successfully ran ${migrations.length} migrations:`);
        migrations.forEach((migration: any) => {
          console.log(`   - ${migration.name}`);
        });
      }
    }

    const PORT = process.env.PORT || 3001;
    console.log(`🔄 Running in ${process.env.NODE_ENV || "development"} mode`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error("❌ Error during application startup:", error);
    console.error("Error details:", error.message);
    if (error.stack) {
      console.error("Stack trace:", error.stack);
    }
    process.exit(1);
  }
}

startApplication();
