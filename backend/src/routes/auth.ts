import { Router } from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getProfile,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/authController";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validation";
import { authenticateToken } from "../middleware/auth";

export const authRouter = Router();

// Public routes
authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/resend-verification", resendVerificationEmail);
authRouter.post("/forgot-password", validateForgotPassword, forgotPassword);
authRouter.post("/reset-password", validateResetPassword, resetPassword);

// Protected routes
authRouter.get("/profile", authenticateToken, getProfile);
authRouter.post("/logout", authenticateToken, logout);
