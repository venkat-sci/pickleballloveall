"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
exports.userRouter = (0, express_1.Router)();
// Create user (organizers only - for administrative purposes)
exports.userRouter.post("/", auth_1.authenticateToken, (0, auth_1.authorize)("organizer"), validation_1.validateCreateUser, userController_1.createUser);
// Get all users (optional auth - some data might be filtered based on auth status)
exports.userRouter.get("/", auth_1.optionalAuth, userController_1.getAllUsers);
// Search users (authenticated users only)
exports.userRouter.get("/search", auth_1.authenticateToken, userController_1.searchUsers);
// Upload profile picture (authenticated users can only update their own profile picture)
exports.userRouter.post("/:id/profile-picture", auth_1.authenticateToken, upload_1.profilePictureUpload.single("profileImage"), userController_1.uploadProfilePicture);
// Get user by ID (public)
exports.userRouter.get("/:id", userController_1.getUserById);
// Get user stats (public)
exports.userRouter.get("/:id/stats", userController_1.getUserStats);
// Update user (authenticated users can update their own profile, organizers can update any)
exports.userRouter.put("/:id", auth_1.authenticateToken, validation_1.validateUpdateProfile, userController_1.updateUser);
// Update user settings (authenticated users can only update their own settings)
exports.userRouter.put("/:id/settings", auth_1.authenticateToken, validation_1.validateSettingsUpdate, userController_1.updateUserSettings);
// Change password (authenticated users can only change their own password)
exports.userRouter.put("/:id/password", auth_1.authenticateToken, validation_1.validatePasswordChange, userController_1.changePassword);
// Delete user (organizers only, or users can delete their own account)
exports.userRouter.delete("/:id", auth_1.authenticateToken, userController_1.deleteUser);
