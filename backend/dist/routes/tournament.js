"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tournamentRouter = void 0;
const express_1 = require("express");
const tournamentController_1 = require("../controllers/tournamentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.tournamentRouter = router;
// Public routes
router.get("/", tournamentController_1.getAllTournaments);
router.get("/:id", tournamentController_1.getTournamentById);
router.get("/:id/bracket", tournamentController_1.getTournamentBracketView);
// Protected routes
router.use(auth_1.authenticateToken);
router.post("/", tournamentController_1.createTournament);
router.put("/:id", tournamentController_1.updateTournament);
router.delete("/:id", tournamentController_1.deleteTournament);
router.post("/:id/join", tournamentController_1.joinTournament);
router.post("/:id/leave", tournamentController_1.leaveTournament);
router.post("/:id/start", tournamentController_1.startTournament);
router.put("/:id/match-schedule", tournamentController_1.updateMatchSchedule);
router.post("/:id/winner", tournamentController_1.setTournamentWinner);
