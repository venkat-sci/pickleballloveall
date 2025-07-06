import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { AuthenticatedRequest } from "../middleware/auth";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const { email, password, name, role = "player", rating } = req.body;

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
    user.rating = rating !== undefined ? rating : role === "player" ? 3.5 : 4.0;

    const savedUser = await userRepository.save(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    res.status(201).json({
      message: "User created successfully",
      user: {
        ...userWithoutPassword,
        id: String(userWithoutPassword.id),
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: [
        "id",
        "email",
        "name",
        "role",
        "rating",
        "profileImage",
        "createdAt",
        "updatedAt",
      ],
    });

    // Convert id to string for frontend compatibility
    const usersWithStringId = users.map((user) => ({
      ...user,
      id: String(user.id),
    }));

    res.json({ data: usersWithStringId });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      select: [
        "id",
        "email",
        "name",
        "role",
        "rating",
        "profileImage",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      ...user,
      id: String(user.id),
    });
  } catch (error) {
    console.error("Get user by id error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    const { id } = req.params;
    const authenticatedUser = (req as AuthenticatedRequest).user;

    // Users can only update their own profile unless they are organizers
    if (
      authenticatedUser.userId !== id &&
      authenticatedUser.role !== "organizer"
    ) {
      res.status(403).json({
        message: "You can only update your own profile",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const {
      name,
      rating,
      profileImage,
      phone,
      location,
      bio,
      dateOfBirth,
      preferredHand,
      yearsPlaying,
      favoriteShot,
    } = req.body;

    // Update only provided fields (email is not updatable for security)
    if (name) user.name = name;
    if (rating !== undefined) user.rating = rating;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;
    if (dateOfBirth !== undefined) user.dateOfBirth = new Date(dateOfBirth);
    if (preferredHand !== undefined) user.preferredHand = preferredHand;
    if (yearsPlaying !== undefined) user.yearsPlaying = yearsPlaying;
    if (favoriteShot !== undefined) user.favoriteShot = favoriteShot;

    const updatedUser = await userRepository.save(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: "User updated successfully",
      user: {
        ...userWithoutPassword,
        id: String(userWithoutPassword.id),
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authenticatedUser = (req as AuthenticatedRequest).user;

    // Only organizers can delete users, or users can delete their own account
    if (
      authenticatedUser.role !== "organizer" &&
      authenticatedUser.userId !== id
    ) {
      res.status(403).json({
        message: "Insufficient permissions",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    await userRepository.remove(user);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id },
      select: ["id", "name", "rating", "role"],
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // In a real application, you would calculate these from match/tournament data
    const stats = {
      userId: String(user.id),
      name: user.name,
      rating: user.rating,
      role: user.role,
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      tournamentsWon: 0,
      tournamentsPlayed: 0,
      currentStreak: 0,
      bestStreak: 0,
      averageGameScore: 0,
    };

    res.json(stats);
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateUserSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { id } = req.params;
    const authenticatedUser = (req as AuthenticatedRequest).user;

    if (authenticatedUser.userId !== id) {
      res.status(403).json({
        message: "You can only update your own settings",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const { notificationSettings, privacySettings, preferences, gameSettings } =
      req.body;

    if (notificationSettings !== undefined) {
      user.notificationSettings = {
        ...user.notificationSettings,
        ...notificationSettings,
      };
    }
    if (privacySettings !== undefined) {
      user.privacySettings = {
        ...user.privacySettings,
        ...privacySettings,
      };
    }
    if (preferences !== undefined) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }
    if (gameSettings !== undefined) {
      user.gameSettings = {
        ...user.gameSettings,
        ...gameSettings,
      };
    }

    const updatedUser = await userRepository.save(user);

    const { password: _, ...userWithoutPassword } = updatedUser;

    res.json({
      message: "Settings updated successfully",
      user: {
        ...userWithoutPassword,
        id: String(userWithoutPassword.id),
      },
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      });
      return;
    }

    const { id } = req.params;
    const authenticatedUser = (req as AuthenticatedRequest).user;
    const { currentPassword, newPassword } = req.body;

    if (authenticatedUser.userId !== id) {
      res.status(403).json({
        message: "You can only change your own password",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      res.status(400).json({
        message: "Current password is incorrect",
      });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;

    await userRepository.save(user);

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const uploadProfilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Upload profile picture called");
    console.log("Request params:", req.params);
    console.log("Request file:", req.file);
    console.log("Authenticated user:", (req as AuthenticatedRequest).user);

    const { id } = req.params;
    const authenticatedUser = (req as AuthenticatedRequest).user;

    // Users can only update their own profile picture unless they are organizers
    if (
      authenticatedUser.userId !== id &&
      authenticatedUser.role !== "organizer"
    ) {
      console.log(
        "Permission denied: user can only update own profile picture"
      );
      res.status(403).json({
        message: "You can only update your own profile picture",
      });
      return;
    }

    if (!req.file) {
      console.log("No file uploaded");
      res.status(400).json({
        message: "No file uploaded",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    // Delete old profile picture if it exists
    if (user.profileImage) {
      const oldImagePath = user.profileImage.replace("/uploads/", "");
      const fs = require("fs");
      const path = require("path");
      const fullPath = path.join(__dirname, "../../uploads", oldImagePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // Update user with new profile picture path
    const profileImageUrl = `/uploads/profile-pictures/${req.file.filename}`;
    user.profileImage = profileImageUrl;

    await userRepository.save(user);

    res.json({
      message: "Profile picture uploaded successfully",
      data: {
        profileImage: profileImageUrl,
      },
    });
  } catch (error) {
    console.error("Upload profile picture error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q: query } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({
        message: "Search query is required",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    // Search by email or name (case-insensitive)
    const users = await userRepository
      .createQueryBuilder("user")
      .where("LOWER(user.email) LIKE LOWER(:query)", { query: `%${query}%` })
      .orWhere("LOWER(user.name) LIKE LOWER(:query)", { query: `%${query}%` })
      .select(["user.id", "user.email", "user.name", "user.role"])
      .limit(10) // Limit results to prevent large response
      .getMany();

    res.json({
      message: "Search completed successfully",
      data: users,
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
