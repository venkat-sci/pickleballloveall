// Quick diagnostic to check common 500 error causes
console.log("🔍 Tournament API Diagnostic Check");
console.log("==================================");

try {
  // Check if required modules can be loaded
  console.log("📦 Checking module imports...");
  const tournamentController = require("./dist/controllers/tournamentController");
  console.log("✅ Tournament controller loaded");

  const Tournament = require("./dist/entity/Tournament");
  console.log("✅ Tournament entity loaded");

  const BracketService = require("./dist/services/BracketService");
  console.log("✅ Bracket service loaded");

  // Check environment variables that might be missing
  console.log("\n🔧 Checking environment...");
  console.log("NODE_ENV:", process.env.NODE_ENV || "not set");
  console.log(
    "Database connection string exists:",
    !!process.env.DATABASE_URL || !!process.env.DB_HOST
  );

  // Check for common issues
  console.log("\n⚠️  Common 500 error causes to check:");
  console.log("1. Database connection issues");
  console.log("2. Missing JWT_SECRET environment variable");
  console.log("3. Authentication middleware failing");
  console.log("4. Invalid date format in request body");
  console.log("5. Missing required fields in tournament creation request");

  console.log(
    "\n✅ All modules loaded successfully - check server logs for runtime errors"
  );
} catch (error) {
  console.error("❌ Module loading failed:", error.message);
  console.error("Stack:", error.stack);
}
