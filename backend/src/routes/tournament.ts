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
import { authenticateToken, authorize } from "../middleware/auth";
import { validateTournamentWinner } from "../middleware/validation";

const router = Router();

// Public routes
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);
router.get("/:id/bracket", getTournamentBracketView);

// Protected routes
router.use(authenticateToken);
router.post("/", authorize("organizer"), createTournament);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);
router.post("/:id/join", authorize("player", "organizer"), joinTournament);
router.post("/:id/leave", authorize("player", "organizer"), leaveTournament);
router.post("/:id/start", startTournament);
router.put("/:id/match-schedule", updateMatchSchedule);
router.post("/:id/winner", setTournamentWinner);

export { router as tournamentRouter };
