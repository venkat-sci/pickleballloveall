import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { AppDataSource } from "../scripts/data-source";

let app: any;

beforeAll(async () => {
  // Initialize database connection for testing
  await AppDataSource.initialize();

  // Import app after database initialization
  const { default: testApp } = await import("../index");
  app = testApp;
});

afterAll(async () => {
  // Close database connection
  await AppDataSource.destroy();
});

describe("Health Check API", () => {
  it("should return healthy status", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toMatchObject({
      status: "healthy",
      services: {
        database: "connected",
        server: "running",
      },
    });
    expect(response.body.timestamp).toBeDefined();
  });
});

describe("Authentication API", () => {
  it("should handle user registration", async () => {
    const userData = {
      email: `test_${Date.now()}@example.com`,
      password: "testPassword123",
      name: "Test User",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201);

    expect(response.body.user).toMatchObject({
      email: userData.email,
      name: userData.name,
      role: "player",
    });
    expect(response.body.token).toBeDefined();
  });

  it("should handle user login", async () => {
    // First register a user
    const userData = {
      email: `test_login_${Date.now()}@example.com`,
      password: "testPassword123",
      name: "Test Login User",
    };

    await request(app).post("/api/auth/register").send(userData);

    // Then login
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    expect(response.body.user).toMatchObject({
      email: userData.email,
      name: userData.name,
    });
    expect(response.body.token).toBeDefined();
  });
});

describe("Tournament API", () => {
  let authToken: string;

  beforeAll(async () => {
    // Create a test user and get auth token
    const userData = {
      email: `organizer_${Date.now()}@example.com`,
      password: "testPassword123",
      name: "Test Organizer",
      role: "organizer",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);

    authToken = response.body.token;
  });

  it("should create a tournament", async () => {
    const tournamentData = {
      name: `Test Tournament ${Date.now()}`,
      description: "A test tournament",
      startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      endDate: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
      maxParticipants: 16,
      entryFee: 25.0,
    };

    const response = await request(app)
      .post("/api/tournaments")
      .set("Authorization", `Bearer ${authToken}`)
      .send(tournamentData)
      .expect(201);

    expect(response.body).toMatchObject({
      name: tournamentData.name,
      description: tournamentData.description,
      maxParticipants: tournamentData.maxParticipants,
      entryFee: tournamentData.entryFee,
      status: "upcoming",
    });
  });

  it("should get tournaments list", async () => {
    const response = await request(app).get("/api/tournaments").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("Court API", () => {
  it("should get courts list", async () => {
    const response = await request(app).get("/api/courts").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("Error Handling", () => {
  it("should handle 404 for non-existent routes", async () => {
    const response = await request(app)
      .get("/api/non-existent-route")
      .expect(404);
  });

  it("should handle unauthorized access", async () => {
    const response = await request(app)
      .post("/api/tournaments")
      .send({
        name: "Unauthorized Tournament",
        description: "Should fail",
      })
      .expect(401);
  });
});

describe("Database Migrations", () => {
  it("should have all required tables", async () => {
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tableNames = tables.map((t: any) => t.table_name);

    expect(tableNames).toEqual(
      expect.arrayContaining([
        "user",
        "tournament",
        "match",
        "court",
        "tournament_participant",
        "migrations",
      ])
    );
  });

  it("should have migration records", async () => {
    const migrations = await AppDataSource.query(`
      SELECT name FROM migrations ORDER BY timestamp
    `);

    expect(migrations.length).toBeGreaterThan(0);
    expect(migrations[0].name).toContain("InitialSchema");
  });
});
