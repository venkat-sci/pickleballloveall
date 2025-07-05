import DOMPurify from "dompurify";
import validator from "validator";

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== "string") return "";

  // Remove any potential script tags and malicious content
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
  });

  // Additional cleaning: remove any remaining special characters that could be harmful
  return sanitized.trim();
};

/**
 * Sanitize HTML content (for cases where some HTML is allowed)
 */
export const sanitizeHTML = (
  html: string,
  allowedTags: string[] = []
): string => {
  if (typeof html !== "string") return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOW_DATA_ATTR: false,
  });
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== "string") return false;
  return validator.isEmail(email) && email.length <= 254; // RFC 5321 limit
};

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!password || typeof password !== "string") {
    errors.push("Password is required");
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common weak passwords
  const commonPasswords = [
    "password",
    "password123",
    "123456",
    "qwerty",
    "abc123",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "123456789",
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("Password is too common. Please choose a stronger password");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate name input
 */
export const validateName = (
  name: string
): {
  isValid: boolean;
  error?: string;
} => {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Name is required" };
  }

  const sanitizedName = sanitizeInput(name);

  if (sanitizedName.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (sanitizedName.length > 50) {
    return { isValid: false, error: "Name must be less than 50 characters" };
  }

  // Allow letters, numbers, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z0-9\s\-']+$/.test(sanitizedName)) {
    return {
      isValid: false,
      error:
        "Name can only contain letters, numbers, spaces, hyphens, and apostrophes",
    };
  }

  return { isValid: true };
};

/**
 * Rate limiting helper for client-side
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}

  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(
      (time) => now - time < this.windowMs
    );

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return true;
  }

  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(
      (time) => now - time < this.windowMs
    );

    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }

  getTimeUntilReset(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    const resetTime = oldestAttempt + this.windowMs;

    return Math.max(0, resetTime - now);
  }
}

/**
 * Escape HTML to prevent XSS in text display
 */
export const escapeHTML = (text: string): string => {
  if (typeof text !== "string") return "";

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Generate a secure random string for CSRF tokens or nonces
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
};
