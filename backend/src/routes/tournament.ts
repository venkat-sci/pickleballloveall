import { Router } from "express";
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  joinTournament,
  leaveTournament,
  startTournament,
  getTournamentBracketView,
  updateMatchSchedule,
  setTournamentWinner,
} from "../controllers/tournamentController";
import { authenticateToken } from "../middleware/auth";
import { validateTournamentWinner } from "../middleware/validation";

const router = Router();

// Public routes
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);
router.get("/:id/bracket", getTournamentBracketView);

// Protected routes
router.use(authenticateToken);
router.post("/", createTournament);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);
router.post("/:id/join", joinTournament);
router.post("/:id/leave", leaveTournament);
router.post("/:id/start", startTournament);
router.put("/:id/match-schedule", updateMatchSchedule);
router.post("/:id/winner", setTournamentWinner);

export { router as tournamentRouter };
