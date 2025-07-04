import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";
import { tournamentRouter } from "./routes/tournament";
import { matchRouter } from "./routes/match";
import { playerRouter } from "./routes/player";
import { courtRouter } from "./routes/court";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tournaments", tournamentRouter);
app.use("/api/matches", matchRouter);
app.use("/api/players", playerRouter);
app.use("/api/courts", courtRouter);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {});
  })
  .catch((error) => {
    console.error("Error during database connection:", error);
    process.exit(1);
  });
