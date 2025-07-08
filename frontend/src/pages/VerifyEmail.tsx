import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertCircle,
  Mail,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { config } from "../config/environment";

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage(
          "Invalid verification link. Please check your email for the correct link."
        );
        return;
      }

      try {
        const response = await fetch(
          `${config.apiUrl}/auth/verify-email?token=${encodeURIComponent(
            token
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(
            data.message || "Your email has been successfully verified!"
          );
          setUserEmail(data.email || "");
        } else {
          setStatus("error");
          setMessage(
            data.message ||
              "Verification failed. The link may be expired or invalid."
          );
        }
      } catch {
        setStatus("error");
        setMessage(
          "Something went wrong. Please try again or contact support."
        );
      }
    };

    verifyEmail();
  }, [token]);

  const handleGoToLogin = () => {
    navigate("/login", {
      state: {
        message:
          "Your email has been verified! You can now sign in to your account.",
        email: userEmail,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            {status === "loading" && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Verifying Your Email
                </h2>
                <p className="text-gray-600">
                  Please wait while we verify your email address...
                </p>
              </div>
            )}

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-6">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Email Verified Successfully! 🎉
                  </h2>
                  <p className="text-gray-600 mb-4">{message}</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-green-400 mr-2" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-green-800">
                        Welcome to PickleballLoveAll!
                      </p>
                      <p className="text-sm text-green-600">
                        You can now access all features including tournaments,
                        match tracking, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleGoToLogin}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    Sign In to Your Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Return to Homepage
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-6">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Verification Failed
                  </h2>
                  <p className="text-gray-600 mb-4">{message}</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      What you can do:
                    </p>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Check if the link is complete and try again</li>
                      <li>• Request a new verification email</li>
                      <li>• Contact support if the problem persists</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="w-full"
                  >
                    Go to Login Page
                  </Button>

                  <div className="text-center">
                    <Link
                      to="/register"
                      className="text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      Create a New Account
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <Link to="/contact" className="text-green-600 hover:text-green-700">
              Contact Support
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
