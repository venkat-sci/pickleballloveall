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
  searchUsers,
  uploadProfilePicture,
} from "../controllers/userController";
import { authenticateToken, authorize, optionalAuth } from "../middleware/auth";
import {
  validateCreateUser,
  validateUpdateProfile,
  validateSettingsUpdate,
  validatePasswordChange,
} from "../middleware/validation";
import { profilePictureUpload, handleUploadError } from "../middleware/upload";

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

// Search users (authenticated users only)
userRouter.get("/search", authenticateToken, searchUsers);

// Upload profile picture (authenticated users can only update their own profile picture)
userRouter.post(
  "/:id/profile-picture",
  authenticateToken,
  profilePictureUpload.single("profileImage"),
  uploadProfilePicture
);

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
