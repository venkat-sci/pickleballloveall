"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRouter = void 0;
const express_1 = require("express");
const matchController_1 = require("../controllers/matchController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.matchRouter = router;
// Public routes
router.get("/", matchController_1.getAllMatches);
router.get("/tournament/:tournamentId", matchController_1.getMatchesByTournament);
router.get("/tournament/:tournamentId/bracket", matchController_1.getTournamentBracket);
router.get("/:id", matchController_1.getMatchById);
// Protected routes
router.use(auth_1.authenticateToken);
router.post("/", matchController_1.createMatch);
router.put("/:id/score", matchController_1.updateMatchScore);
router.put("/:id/status", matchController_1.updateMatchStatus);
router.put("/:id/details", matchController_1.updateMatchDetails);
router.post("/tournament/:tournamentId/next-round", matchController_1.generateNextRound);
