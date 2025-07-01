import { Router } from "express";
import {
  getAllMatches,
  getMatchesByTournament,
  getMatchById,
  createMatch,
  updateMatchScore,
  updateMatchStatus,
} from "../controllers/matchController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllMatches);
router.get("/tournament/:tournamentId", getMatchesByTournament);
router.get("/:id", getMatchById);

// Protected routes
router.use(authenticateToken);
router.post("/", createMatch);
router.put("/:id/score", updateMatchScore);
router.put("/:id/status", updateMatchStatus);

export { router as matchRouter };
