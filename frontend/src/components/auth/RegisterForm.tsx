import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Trophy,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { sanitizeInput, validatePassword } from "../../utils/security";
import { debounce } from "../../utils/errorHandling";

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "player" as "player" | "organizer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({});
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    errors: string[];
  }>({ isValid: false, errors: [] });

  const {
    register,
    loading,
    errors,
    generalError,
    clearErrors,
    validateField,
  } = useAuth();

  // Password strength validation
  const debouncedPasswordValidation = debounce((password: string) => {
    setPasswordStrength(validatePassword(password));
  }, 300);

  // Clear errors when component mounts
  useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  // Clear field error when user fixes input
  const handleInputChange = (field: string, value: string) => {
    const sanitizedValue =
      field === "password" || field === "confirmPassword"
        ? value
        : sanitizeInput(value);

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));

    // Always validate on change
    validateField(field, sanitizedValue);

    // Special handling for password strength
    if (field === "password") {
      debouncedPasswordValidation(value);
    }

    // Validate confirm password when password changes
    if (field === "password" && formData.confirmPassword) {
      validateField("confirmPassword", formData.confirmPassword);
    }
  };

  const handleFieldBlur = (field: string) => {
    setFieldTouched((prev) => ({ ...prev, [field]: true }));
    const value = formData[field as keyof typeof formData];
    validateField(field, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setFieldTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // Check if terms are accepted
    if (!acceptedTerms) {
      return;
    }

    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });

    // Success handling is done in the useAuth hook
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    acceptedTerms &&
    !errors.name &&
    !errors.email &&
    !errors.password &&
    passwordStrength.isValid;

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
            Join Pickleballloveall Today
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500 transition-colors"
            >
              Sign in here
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
                      Registration Failed
                    </p>
                    <p className="text-sm text-red-600">{generalError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security indicator */}
            <div className="mb-6 flex items-center justify-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-green-600" />
              <span>Secure registration with enhanced validation</span>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                type="text"
                icon={User}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                error={fieldTouched.name ? errors.name : undefined}
                placeholder="Enter your full name"
                disabled={loading}
                autoComplete="name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                error={fieldTouched.email ? errors.email : undefined}
                placeholder="Enter your email"
                disabled={loading}
                autoComplete="email"
                required
              />

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("role", "player")}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
                      formData.role === "player"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Trophy className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Player</div>
                    <div className="text-xs text-gray-500">
                      Join tournaments
                    </div>
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleInputChange("role", "organizer")}
                    disabled={loading}
                    className={`p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
                      formData.role === "organizer"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Organizer</div>
                    <div className="text-xs text-gray-500">
                      Create tournaments
                    </div>
                  </motion.button>
                </div>
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("password")}
                  error={fieldTouched.password ? errors.password : undefined}
                  placeholder="Create a strong password"
                  disabled={loading}
                  autoComplete="new-password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Password Strength
                    </span>
                    {passwordStrength.isValid && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    {passwordStrength.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-xs text-red-600 flex items-center"
                      >
                        <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                        {error}
                      </div>
                    ))}
                    {passwordStrength.isValid && (
                      <div className="text-xs text-green-600 flex items-center">
                        <CheckCircle2 className="h-3 w-3 mr-2" />
                        Strong password
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleFieldBlur("confirmPassword")}
                  error={
                    fieldTouched.confirmPassword &&
                    formData.password !== formData.confirmPassword
                      ? "Passwords do not match"
                      : undefined
                  }
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  disabled={loading}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-0.5 disabled:opacity-50"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-green-600 hover:text-green-500 underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-green-600 hover:text-green-500 underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!isFormValid}
                className="w-full"
              >
                {loading ? "Creating Account..." : "Create Account"}
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
