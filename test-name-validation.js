// Quick test to verify name validation allows numbers
const testNames = [
  "John Doe", // Basic name (should pass)
  "Mary-Jane", // Name with hyphen (should pass)
  "O'Connor", // Name with apostrophe (should pass)
  "John Doe Jr.", // Name with period (should pass)
  "Player1", // Name with number (should pass)
  "Team2Player", // Name with number (should pass)
  "User123", // Name with numbers (should pass)
  "Alex2000", // Name with numbers (should pass)
  "John@Doe", // Name with special char (should fail)
  "Test#123", // Name with special char (should fail)
];

// Simple regex test that matches our updated validation
const nameRegex = /^[a-zA-Z0-9\s\-'.]+$/;

console.log("Testing name validation with numbers allowed:\n");

testNames.forEach((name) => {
  const isValid = nameRegex.test(name);
  const status = isValid ? "✅ PASS" : "❌ FAIL";
  console.log(`${status} "${name}"`);
});

console.log("\nValidation complete!");
