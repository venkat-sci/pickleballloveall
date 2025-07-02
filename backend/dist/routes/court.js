"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courtRouter = void 0;
const express_1 = require("express");
const courtController_1 = require("../controllers/courtController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.courtRouter = router;
// Public routes
router.get("/", courtController_1.getAllCourts);
router.get("/available", courtController_1.getAvailableCourts);
router.get("/:id", courtController_1.getCourtById);
// Protected routes
router.use(auth_1.authenticateToken);
router.post("/", courtController_1.createCourt);
router.put("/:id", courtController_1.updateCourt);
router.delete("/:id", courtController_1.deleteCourt);
