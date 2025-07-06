// Test environment variable usage
import { config } from "../src/config/environment.js";

console.log("=== Environment Variable Test ===");
console.log("config.apiUrl:", config.apiUrl);
console.log("config.wsUrl:", config.wsUrl);
console.log("config.environment:", config.environment);

// Simulate what api.ts does
const API_BASE_URL = config.apiUrl; // Fixed - no longer adds extra /api
console.log("API_BASE_URL (used by api.ts):", API_BASE_URL);

// Test URL construction
const testEndpoint = "/auth/register";
const fullUrl = `${API_BASE_URL}${testEndpoint}`;
console.log("Full API URL example:", fullUrl);

console.log("\n=== Expected vs Actual ===");
console.log(
  "Expected: http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api/auth/register"
);
console.log("Actual  :", fullUrl);
console.log(
  "Match   :",
  fullUrl ===
    "http://qw80so04oc0wkcwg0cw8woko.46.202.89.24.sslip.io/api/auth/register"
);
