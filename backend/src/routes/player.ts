import { Router } from "express";
import {
  getAllPlayers,
  getAllPlayersWithStats,
  getPlayerById,
  getPlayerStats,
  updatePlayer,
  getPlayerRankings,
} from "../controllers/playerController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllPlayers);
router.get("/with-stats", getAllPlayersWithStats);
router.get("/rankings", getPlayerRankings);
router.get("/:id", getPlayerById);
router.get("/:id/stats", getPlayerStats);

// Protected routes
router.use(authenticateToken);
router.put("/:id", updatePlayer);

export { router as playerRouter };
