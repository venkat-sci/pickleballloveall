import dotenv from "dotenv";

// Load test environment variables
dotenv.config({ path: ".env.test" });

// Set NODE_ENV to test if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}

// Set default test database URL if not provided
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
}

// Set default JWT secret for tests
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-jwt-secret-for-testing-only-32chars";
}
