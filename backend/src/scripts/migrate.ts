import { AppDataSource } from "./data-source";

async function runMigrations() {
  try {
    console.log("🔄 Initializing database connection...");
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");

    console.log("🔄 Running migrations...");
    const migrations = await AppDataSource.runMigrations();

    if (migrations.length === 0) {
      console.log("✅ No new migrations to run");
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migrations:`);
      migrations.forEach((migration) => {
        console.log(`   - ${migration.name}`);
      });
    }

    await AppDataSource.destroy();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
