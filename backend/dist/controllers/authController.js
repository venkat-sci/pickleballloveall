"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";
const register = async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation failed",
                errors: errors.array(),
            });
            return;
        }
        const { email, password, name, role = "player" } = req.body;
        // Check if user already exists
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                message: "Email already exists",
            });
            return;
        }
        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // Create new user
        const user = new User_1.User();
        user.email = email;
        user.password = hashedPassword;
        user.name = name;
        user.role = role;
        user.rating = role === "player" ? 3.5 : 4.0;
        const savedUser = await userRepository.save(user);
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = savedUser;
        res.status(201).json({
            message: "User registered successfully",
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: "Validation failed",
                errors: errors.array(),
            });
            return;
        }
        const { email, password } = req.body;
        // Find user by email
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(400).json({
                message: "Invalid email or password",
            });
            return;
        }
        // Check password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                message: "Invalid email or password",
            });
            return;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            message: "Login successful",
            user: userWithoutPassword,
            token,
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.login = login;
const logout = async (req, res) => {
    res.json({
        message: "Logged out successfully",
    });
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    // Implementation for password reset would go here
    // For now, just return success message
    res.json({
        message: "Password reset email sent",
    });
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    // Implementation for password reset would go here
    // For now, just return success message
    res.json({
        message: "Password reset successfully",
    });
};
exports.resetPassword = resetPassword;
const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            user: {
                ...userWithoutPassword,
                id: String(userWithoutPassword.id),
            },
        });
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};
exports.getProfile = getProfile;
