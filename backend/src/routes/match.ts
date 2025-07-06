import { Router } from "express";
import {
  getAllMatches,
  getMatchesByTournament,
  getMatchById,
  createMatch,
  updateMatchScore,
  updateMatchStatus,
  updateMatchDetails,
  getTournamentBracket,
  generateNextRound,
  addScoreKeeper,
  removeScoreKeeper,
  startMatchEarly,
  getMatchScoreKeepers,
} from "../controllers/matchController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllMatches);
router.get("/tournament/:tournamentId", getMatchesByTournament);
router.get("/tournament/:tournamentId/bracket", getTournamentBracket);
router.get("/:id", getMatchById);
router.get("/:id/score-keepers", getMatchScoreKeepers);

// Protected routes
router.use(authenticateToken);
router.post("/", createMatch);
router.put("/:id/score", updateMatchScore);
router.put("/:id/status", updateMatchStatus);
router.put("/:id/details", updateMatchDetails);
router.post("/tournament/:tournamentId/next-round", generateNextRound);
router.post("/:id/score-keepers", addScoreKeeper);
router.delete("/:id/score-keepers", removeScoreKeeper);
router.post("/:id/start-early", startMatchEarly);

export { router as matchRouter };
