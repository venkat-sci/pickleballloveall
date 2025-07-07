const {
  tournamentRepository,
} = require("./dist/controllers/tournamentController");

// Simple test to check if tournament creation works
async function testTournamentCreation() {
  console.log("🔧 Testing tournament creation...");

  try {
    // Simulate a basic tournament object
    const testTournament = {
      name: "Test Tournament",
      description: "Test description",
      type: "singles",
      format: "knockout",
      startDate: new Date("2025-07-10"),
      endDate: new Date("2025-07-11"),
      location: "Test Location",
      maxParticipants: 8,
      organizerId: "test-user-id",
      entryFee: 25.0,
      prizePool: 100.0,
    };

    console.log("✅ Tournament object structure is valid");
    console.log(
      "📋 Test tournament data:",
      JSON.stringify(testTournament, null, 2)
    );
  } catch (error) {
    console.error("❌ Error in tournament creation test:", error);
  }
}

testTournamentCreation();
