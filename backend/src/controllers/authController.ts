import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../services/emailService";
import {
  generateSecureToken,
  createEmailVerificationExpiry,
  createPasswordResetExpiry,
  isTokenExpired,
} from "../utils/tokenUtils";

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

    // Generate email verification token
    const emailVerificationToken = generateSecureToken();
    const emailVerificationExpires = createEmailVerificationExpiry();

    // Create new user
    const user = new User();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;
    user.role = role;
    user.rating = role === "player" ? 3.5 : 4.0;
    user.isEmailVerified = false;
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;

    const savedUser = await userRepository.save(user);

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      name,
      emailVerificationToken
    );

    if (!emailSent) {
      console.error("Failed to send verification email for user:", email);
      // Continue with registration even if email fails
    }

    // Remove sensitive data from response
    const {
      password: _,
      emailVerificationToken: __,
      ...userWithoutSensitiveData
    } = savedUser;

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: userWithoutSensitiveData,
      emailSent,
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

    // Check if email is verified
    if (!user.isEmailVerified) {
      res.status(401).json({
        message:
          "Please verify your email before logging in. Check your inbox for the verification link.",
        requiresVerification: true,
        email: user.email,
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

// Email Verification Endpoint
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({
        message: "Invalid or missing verification token",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid verification token",
      });
      return;
    }

    // Check if token has expired
    if (
      user.emailVerificationExpires &&
      isTokenExpired(user.emailVerificationExpires)
    ) {
      res.status(400).json({
        message:
          "Verification token has expired. Please request a new verification email.",
        expired: true,
      });
      return;
    }

    // Check if already verified
    if (user.isEmailVerified) {
      res.status(200).json({
        message: "Email is already verified. You can now log in.",
        alreadyVerified: true,
      });
      return;
    }

    // Verify the user
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await userRepository.save(user);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      message: "Email verified successfully! You can now log in.",
      verified: true,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Resend Verification Email
export const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: "Email is required",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    if (user.isEmailVerified) {
      res.status(400).json({
        message: "Email is already verified",
      });
      return;
    }

    // Generate new verification token
    const emailVerificationToken = generateSecureToken();
    const emailVerificationExpires = createEmailVerificationExpiry();

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;

    await userRepository.save(user);

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      user.name,
      emailVerificationToken
    );

    if (!emailSent) {
      res.status(500).json({
        message: "Failed to send verification email. Please try again later.",
      });
      return;
    }

    res.status(200).json({
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Forgot Password
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        message: "Email is required",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists or not for security
      res.status(200).json({
        message:
          "If an account with that email exists, we've sent a password reset link.",
      });
      return;
    }

    if (!user.isEmailVerified) {
      res.status(400).json({
        message:
          "Please verify your email first before resetting your password.",
      });
      return;
    }

    // Generate password reset token
    const passwordResetToken = generateSecureToken();
    const passwordResetExpires = createPasswordResetExpiry();

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;

    await userRepository.save(user);

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      email,
      user.name,
      passwordResetToken
    );

    if (!emailSent) {
      console.error("Failed to send password reset email for user:", email);
    }

    // Always return success for security (don't reveal if user exists)
    res.status(200).json({
      message:
        "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Reset Password
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        message: "Token and new password are required",
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { passwordResetToken: token },
    });

    if (!user) {
      res.status(400).json({
        message: "Invalid or expired reset token",
      });
      return;
    }

    // Check if token has expired
    if (
      user.passwordResetExpires &&
      isTokenExpired(user.passwordResetExpires)
    ) {
      res.status(400).json({
        message:
          "Reset token has expired. Please request a new password reset.",
        expired: true,
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset tokens
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await userRepository.save(user);

    res.status(200).json({
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
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
