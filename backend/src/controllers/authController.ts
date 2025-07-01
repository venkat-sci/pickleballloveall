import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { email, password, name, role = "player" } = req.body;

    // Check if user already exists
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({
        message: "Email already exists",
      });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;
    user.role = role;
    user.rating = role === "player" ? 3.5 : 4.0;

    const savedUser = await userRepository.save(user);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { email, password } = req.body;

    // Find user by email
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(400).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({
        message: "Invalid email or password",
      });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Implementation for password reset would go here
  // For now, just return success message
  res.json({
    message: "Password reset email sent",
  });
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Implementation for password reset would go here
  // For now, just return success message
  res.json({
    message: "Password reset successfully",
  });
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user.userId;

    const userRepository = AppDataSource.getRepository(User);
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
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
