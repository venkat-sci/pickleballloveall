import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  updateUserSettings,
  changePassword,
} from "../controllers/userController";
import { authenticateToken, authorize, optionalAuth } from "../middleware/auth";
import {
  validateCreateUser,
  validateUpdateProfile,
  validateSettingsUpdate,
  validatePasswordChange,
} from "../middleware/validation";

export const userRouter = Router();

// Create user (organizers only - for administrative purposes)
userRouter.post(
  "/",
  authenticateToken,
  authorize("organizer"),
  validateCreateUser,
  createUser
);

// Get all users (optional auth - some data might be filtered based on auth status)
userRouter.get("/", optionalAuth, getAllUsers);

// Get user by ID (public)
userRouter.get("/:id", getUserById);

// Get user stats (public)
userRouter.get("/:id/stats", getUserStats);

// Update user (authenticated users can update their own profile, organizers can update any)
userRouter.put("/:id", authenticateToken, validateUpdateProfile, updateUser);

// Update user settings (authenticated users can only update their own settings)
userRouter.put(
  "/:id/settings",
  authenticateToken,
  validateSettingsUpdate,
  updateUserSettings
);

// Change password (authenticated users can only change their own password)
userRouter.put(
  "/:id/password",
  authenticateToken,
  validatePasswordChange,
  changePassword
);

// Delete user (organizers only, or users can delete their own account)
userRouter.delete("/:id", authenticateToken, deleteUser);
