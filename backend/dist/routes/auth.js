"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const auth_1 = require("../middleware/auth");
exports.authRouter = (0, express_1.Router)();
// Public routes
exports.authRouter.post("/register", validation_1.validateRegister, authController_1.register);
exports.authRouter.post("/login", validation_1.validateLogin, authController_1.login);
exports.authRouter.post("/forgot-password", validation_1.validateForgotPassword, authController_1.forgotPassword);
exports.authRouter.post("/reset-password", validation_1.validateResetPassword, authController_1.resetPassword);
// Protected routes
exports.authRouter.get("/profile", auth_1.authenticateToken, authController_1.getProfile);
exports.authRouter.post("/logout", auth_1.authenticateToken, authController_1.logout);
