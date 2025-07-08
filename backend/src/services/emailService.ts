import nodemailer from "nodemailer";
import {
  createVerificationEmailTemplate,
  createPasswordResetEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT || "587");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
): Promise<boolean> => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const emailOptions: EmailOptions = {
    to: email,
    subject: "Verify Your Email - PickleballLoveAll",
    html: createVerificationEmailTemplate(name, verificationUrl),
    text: `Hi ${name},\n\nPlease verify your email by clicking this link: ${verificationUrl}\n\nIf you didn't create an account, please ignore this email.\n\nBest regards,\nPickleballLoveAll Team`,
  };

  return await sendEmail(emailOptions);
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<boolean> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const emailOptions: EmailOptions = {
    to: email,
    subject: "Reset Your Password - PickleballLoveAll",
    html: createPasswordResetEmailTemplate(name, resetUrl),
    text: `Hi ${name},\n\nYou can reset your password by clicking this link: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.\n\nBest regards,\nPickleballLoveAll Team`,
  };

  return await sendEmail(emailOptions);
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  const emailOptions: EmailOptions = {
    to: email,
    subject: "Welcome to PickleballLoveAll! 🎾",
    html: createWelcomeEmailTemplate(name),
    text: `Hi ${name},\n\nWelcome to PickleballLoveAll! Your email has been verified successfully.\n\nYou can now start joining tournaments, tracking your matches, and connecting with other pickleball players.\n\nGet started: ${process.env.FRONTEND_URL}/dashboard\n\nBest regards,\nPickleballLoveAll Team`,
  };

  return await sendEmail(emailOptions);
};

// Test email configuration
export const testEmailConfiguration = async (): Promise<boolean> => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("Email configuration is valid");
    return true;
  } catch (error) {
    console.error("Email configuration error:", error);
    return false;
  }
};
