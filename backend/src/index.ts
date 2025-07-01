import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";
// import other routers...

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
// app.use('/api/tournaments', tournamentRouter);
// app.use('/api/matches', matchRouter);

const PORT = process.env.PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error during database connection:", error);
    process.exit(1);
  });
