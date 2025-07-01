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

    res.json(usersWithStringId);
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
      where: { id: parseInt(id) },
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
      String(authenticatedUser.userId) !== id &&
      authenticatedUser.role !== "organizer"
    ) {
      res.status(403).json({
        message: "You can only update your own profile",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    const { name, email, rating, profileImage } = req.body;

    // Update only provided fields
    if (name) user.name = name;
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await userRepository.findOne({
        where: { email, id: user.id },
      });
      if (existingUser && existingUser.id !== user.id) {
        res.status(400).json({
          message: "Email already exists",
        });
        return;
      }
      user.email = email;
    }
    if (rating !== undefined) user.rating = rating;
    if (profileImage !== undefined) user.profileImage = profileImage;

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
      String(authenticatedUser.userId) !== id
    ) {
      res.status(403).json({
        message: "Insufficient permissions",
      });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(id) } });

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
      where: { id: parseInt(id) },
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
