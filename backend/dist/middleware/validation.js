"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePasswordChange = exports.validateSettingsUpdate = exports.validateCreateUser = exports.validateUpdateProfile = exports.validateResetPassword = exports.validateForgotPassword = exports.validateLogin = exports.validateRegister = void 0;
const express_validator_1 = require("express-validator");
exports.validateRegister = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s\-'.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["player", "organizer", "viewer"])
        .withMessage("Role must be player, organizer, or viewer"),
];
exports.validateLogin = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
exports.validateForgotPassword = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
];
exports.validateResetPassword = [
    (0, express_validator_1.body)("token").notEmpty().withMessage("Reset token is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
];
exports.validateUpdateProfile = [
    (0, express_validator_1.body)("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s\-'.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
    // Email is not updatable for security reasons
    (0, express_validator_1.body)("rating")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Rating must be between 0 and 5"),
    (0, express_validator_1.body)("profileImage")
        .optional()
        .isURL()
        .withMessage("Profile image must be a valid URL"),
    (0, express_validator_1.body)("phone")
        .optional()
        .isMobilePhone("any", { strictMode: false })
        .withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("location")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Location must be between 2 and 100 characters"),
    (0, express_validator_1.body)("bio")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Bio must be less than 500 characters"),
    (0, express_validator_1.body)("dateOfBirth")
        .optional()
        .isISO8601()
        .withMessage("Please provide a valid date"),
    (0, express_validator_1.body)("preferredHand")
        .optional()
        .isIn(["left", "right", "ambidextrous"])
        .withMessage("Preferred hand must be left, right, or ambidextrous"),
    (0, express_validator_1.body)("yearsPlaying")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Years playing cannot be empty"),
    (0, express_validator_1.body)("favoriteShot")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Favorite shot cannot be empty"),
];
exports.validateCreateUser = [
    (0, express_validator_1.body)("email")
        .isEmail()
        .withMessage("Please provide a valid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .matches(/^[a-zA-Z\s\-'.]+$/)
        .withMessage("Name can only contain letters, spaces, hyphens, apostrophes, and periods"),
    (0, express_validator_1.body)("role")
        .optional()
        .isIn(["player", "organizer", "viewer"])
        .withMessage("Role must be player, organizer, or viewer"),
    (0, express_validator_1.body)("rating")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("Rating must be between 0 and 5"),
];
exports.validateSettingsUpdate = [
    (0, express_validator_1.body)("notificationSettings")
        .optional()
        .isObject()
        .withMessage("Notification settings must be an object"),
    (0, express_validator_1.body)("privacySettings")
        .optional()
        .isObject()
        .withMessage("Privacy settings must be an object"),
    (0, express_validator_1.body)("preferences")
        .optional()
        .isObject()
        .withMessage("Preferences must be an object"),
    (0, express_validator_1.body)("gameSettings")
        .optional()
        .isObject()
        .withMessage("Game settings must be an object"),
    (0, express_validator_1.body)("preferences.theme")
        .optional()
        .isIn(["light", "dark", "auto"])
        .withMessage("Theme must be light, dark, or auto"),
    (0, express_validator_1.body)("preferences.language")
        .optional()
        .isIn(["en", "es", "fr", "de"])
        .withMessage("Language must be a supported language code"),
    (0, express_validator_1.body)("gameSettings.defaultTournamentType")
        .optional()
        .isIn(["singles", "doubles", "mixed"])
        .withMessage("Tournament type must be singles, doubles, or mixed"),
    (0, express_validator_1.body)("gameSettings.preferredCourtSurface")
        .optional()
        .isIn(["outdoor", "indoor", "both"])
        .withMessage("Court surface must be outdoor, indoor, or both"),
];
exports.validatePasswordChange = [
    (0, express_validator_1.body)("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    (0, express_validator_1.body)("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("New password must contain at least one lowercase letter, one uppercase letter, and one number"),
];
