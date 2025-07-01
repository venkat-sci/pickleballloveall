import { Router } from "express";
import {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
  getAvailableCourts,
} from "../controllers/courtController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Public routes
router.get("/", getAllCourts);
router.get("/available", getAvailableCourts);
router.get("/:id", getCourtById);

// Protected routes
router.use(authenticateToken);
router.post("/", createCourt);
router.put("/:id", updateCourt);
router.delete("/:id", deleteCourt);

export { router as courtRouter };
