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
} from "../controllers/tournamentController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllTournaments);
router.get("/:id", getTournamentById);

// Protected routes
router.use(authenticateToken);
router.post("/", createTournament);
router.put("/:id", updateTournament);
router.delete("/:id", deleteTournament);
router.post("/:id/join", joinTournament);
router.post("/:id/leave", leaveTournament);
router.post("/:id/start", startTournament);

export { router as tournamentRouter };
