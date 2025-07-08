import { Router, Request, Response } from "express";
import {
  testEmailConfiguration,
  sendVerificationEmail,
} from "../services/emailService";

export const testRouter = Router();

// Test email configuration endpoint
testRouter.get("/test-email", async (req: Request, res: Response) => {
  try {
    const isConfigValid = await testEmailConfiguration();

    if (isConfigValid) {
      res.json({
        message: "Email configuration is valid!",
        status: "success",
      });
    } else {
      res.status(500).json({
        message: "Email configuration failed",
        status: "error",
      });
    }
  } catch (error) {
    console.error("Email test error:", error);
    res.status(500).json({
      message: "Error testing email configuration",
      error: (error as Error).message,
    });
  }
});

// Test send verification email endpoint (for development only)
testRouter.post("/send-test-email", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      res.status(400).json({
        message: "Email and name are required",
      });
      return;
    }

    const success = await sendVerificationEmail(email, name, "test-token-123");

    if (success) {
      res.json({
        message: "Test email sent successfully!",
        status: "success",
      });
    } else {
      res.status(500).json({
        message: "Failed to send test email",
        status: "error",
      });
    }
  } catch (error) {
    console.error("Send test email error:", error);
    res.status(500).json({
      message: "Error sending test email",
      error: (error as Error).message,
    });
  }
});
