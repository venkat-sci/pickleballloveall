import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { AppDataSource } from "./data-source";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";
import { tournamentRouter } from "./routes/tournament";
import { matchRouter } from "./routes/match";
import { playerRouter } from "./routes/player";
import { courtRouter } from "./routes/court";
import { healthRouter } from "./routes/health";

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint (before other routes)
app.use("/", healthRouter);

// API routes (directly at root level)
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/tournaments", tournamentRouter);
app.use("/matches", matchRouter);
app.use("/players", playerRouter);
app.use("/courts", courtRouter);

const PORT = process.env.PORT || 3000;

// Export app for production startup and testing
export default app;

// Development auto-start (only if not imported as module)
if (require.main === module && process.env.NODE_ENV !== "production") {
  AppDataSource.initialize()
    .then(() => {
      console.log("✅ Database connected successfully");
      console.log(
        `🔄 Running in ${process.env.NODE_ENV || "development"} mode`
      );

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("❌ Error during database connection:", error);
      process.exit(1);
    });
}
