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
} from "../controllers/tournamentController";
import { authenticateToken } from "../middleware/auth";

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

export { router as tournamentRouter };
