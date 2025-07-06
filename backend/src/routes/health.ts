import { Router } from "express";
import { AppDataSource } from "../data-source";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    // Check database connection
    await AppDataSource.query("SELECT 1");

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        server: "running",
      },
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      services: {
        database: "disconnected",
        server: "running",
      },
    });
  }
});

export { router as healthRouter };
