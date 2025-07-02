import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Trophy, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { debounce } from "../../utils/errorHandling";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});

  const { login, loading, errors, generalError, clearErrors, validateField } =
    useAuth();

  // Debounced validation
  const debouncedValidateField = debounce((field: string, value: string) => {
    if (fieldTouched[field]) {
      validateField(field, value);
    }
  }, 300);

  // Clear errors when component mounts
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Don't sanitize during typing
    setEmail(value);
    debouncedValidateField("email", value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // Don't sanitize password input
    setPassword(value);
    debouncedValidateField("password", value);
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === "email" ? email : password;
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFieldTouched({ email: true, password: true });

    const success = await login(email, password);

    if (success && rememberMe) {
      // Store remember me preference (could be used for extended token expiry)
      localStorage.setItem("rememberMe", "true");
    }
  };

  const isFormValid = email && password && !errors.email && !errors.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back to PicklePro
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>

        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* General error from backend */}
            {generalError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Login Failed
                    </p>
                    <p className="text-sm text-red-600">{generalError}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                icon={Mail}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleFieldBlur("email")}
                error={fieldTouched.email ? errors.email : undefined}
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => handleFieldBlur("password")}
                  error={fieldTouched.password ? errors.password : undefined}
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:opacity-50"
                    disabled={loading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!isFormValid}
                className="w-full"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
