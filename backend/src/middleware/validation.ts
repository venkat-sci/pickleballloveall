import { body } from "express-validator";

export const validateRegister = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-'.]+$/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    ),
  body("role")
    .optional()
    .isIn(["player", "organizer", "viewer"])
    .withMessage("Role must be player, organizer, or viewer"),
];

export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateForgotPassword = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

export const validateResetPassword = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];

export const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-'.]+$/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    ),
  // Email is not updatable for security reasons
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
  body("profileImage")
    .optional()
    .custom((value) => {
      // Allow full URLs or relative paths that start with /uploads/
      if (
        typeof value === "string" &&
        (value.match(/^https?:\/\//) || // Full URL
          value.match(/^\/uploads\//) || // Relative upload path
          value === "" || // Empty string (to clear profile image)
          value === null) // Null value (to clear profile image)
      ) {
        return true;
      }
      throw new Error("Profile image must be a valid URL or upload path");
    }),
  body("phone")
    .optional()
    .isMobilePhone("any", { strictMode: false })
    .withMessage("Please provide a valid phone number"),
  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must be less than 500 characters"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date"),
  body("preferredHand")
    .optional()
    .isIn(["left", "right", "ambidextrous"])
    .withMessage("Preferred hand must be left, right, or ambidextrous"),
  body("yearsPlaying")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Years playing cannot be empty"),
  body("favoriteShot")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Favorite shot cannot be empty"),
];

export const validateCreateUser = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-'.]+$/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    ),
  body("role")
    .optional()
    .isIn(["player", "organizer", "viewer"])
    .withMessage("Role must be player, organizer, or viewer"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),
];

export const validateSettingsUpdate = [
  body("notificationSettings")
    .optional()
    .isObject()
    .withMessage("Notification settings must be an object"),
  body("privacySettings")
    .optional()
    .isObject()
    .withMessage("Privacy settings must be an object"),
  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),
  body("gameSettings")
    .optional()
    .isObject()
    .withMessage("Game settings must be an object"),
  body("preferences.theme")
    .optional()
    .isIn(["light", "dark", "auto"])
    .withMessage("Theme must be light, dark, or auto"),
  body("preferences.language")
    .optional()
    .isIn(["en", "es", "fr", "de"])
    .withMessage("Language must be a supported language code"),
  body("gameSettings.defaultTournamentType")
    .optional()
    .isIn(["singles", "doubles", "mixed"])
    .withMessage("Tournament type must be singles, doubles, or mixed"),
  body("gameSettings.preferredCourtSurface")
    .optional()
    .isIn(["outdoor", "indoor", "both"])
    .withMessage("Court surface must be outdoor, indoor, or both"),
];

export const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
];
