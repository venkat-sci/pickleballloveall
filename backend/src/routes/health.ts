import { Router } from "express";
import { AppDataSource } from "../data-source";

const router = Router();

router.get("/health", async (req: any, res: any) => {
  try {
    // Check if DataSource is initialized
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database not initialized",
        services: {
          database: "not_initialized",
          server: "running",
        },
        debug: {
          database_url: process.env.DATABASE_URL ? "set" : "not_set",
          node_env: process.env.NODE_ENV || "development",
        },
      });
    }

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
      debug: {
        database_url: process.env.DATABASE_URL ? "set" : "not_set",
        error_code:
          error instanceof Error && "code" in error
            ? (error as any).code
            : "unknown",
        hostname:
          error instanceof Error && "hostname" in error
            ? (error as any).hostname
            : "unknown",
      },
    });
  }
});

export { router as healthRouter };
