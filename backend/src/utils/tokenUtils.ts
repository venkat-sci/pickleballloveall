import crypto from "crypto";

/**
 * Generate a secure random token for email verification or password reset
 * @returns A secure random token string
 */
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Create expiration date for email verification (24 hours from now)
 * @returns Date object 24 hours in the future
 */
export const createEmailVerificationExpiry = (): Date => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24); // 24 hours
  return expiryDate;
};

/**
 * Create expiration date for password reset (1 hour from now)
 * @returns Date object 1 hour in the future
 */
export const createPasswordResetExpiry = (): Date => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 1); // 1 hour
  return expiryDate;
};

/**
 * Check if a token has expired
 * @param expiryDate The expiration date to check
 * @returns True if the token has expired, false otherwise
 */
export const isTokenExpired = (expiryDate: Date): boolean => {
  return new Date() > expiryDate;
};
