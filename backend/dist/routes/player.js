"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRouter = void 0;
const express_1 = require("express");
const playerController_1 = require("../controllers/playerController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.playerRouter = router;
// Public routes
router.get("/", playerController_1.getAllPlayers);
router.get("/with-stats", playerController_1.getAllPlayersWithStats);
router.get("/rankings", playerController_1.getPlayerRankings);
router.get("/:id", playerController_1.getPlayerById);
router.get("/:id/stats", playerController_1.getPlayerStats);
// Protected routes
router.use(auth_1.authenticateToken);
router.put("/:id", playerController_1.updatePlayer);
