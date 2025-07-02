import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { authAPI } from "../services/api";
import { RegisterData } from "../types";
import { handleAPIError, showSuccessToast } from "../utils/errorHandling";
import {
  sanitizeInput,
  isValidEmail,
  validatePassword,
  validateName,
} from "../utils/security";

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  errors: Record<string, string>;
  generalError: string | null;
  clearErrors: () => void;
  validateField: (field: string, value: string) => string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { login: storeLogin, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const clearErrors = useCallback(() => {
    setErrors({});
    setGeneralError(null);
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Validate individual fields
  const validateField = useCallback(
    (field: string, value: string): string | null => {
      switch (field) {
        case "email":
          if (!value) return "Email is required";
          if (!isValidEmail(value)) return "Please enter a valid email address";
          return null;

        case "password": {
          if (!value) return "Password is required";
          const { isValid, errors: passwordErrors } = validatePassword(value);
          return isValid ? null : passwordErrors[0];
        }

        case "name": {
          const { isValid: nameValid, error } = validateName(value);
          return nameValid ? null : error || "Invalid name";
        }

        case "confirmPassword":
          if (!value) return "Please confirm your password";
          return null;

        default:
          return null;
      }
    },
    []
  );

  // Login function with enhanced security
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      // Clear previous errors
      clearErrors();

      // Validate inputs
      const emailError = validateField("email", email);
      const passwordError = validateField("password", password);

      if (emailError || passwordError) {
        if (emailError) setFieldError("email", emailError);
        if (passwordError) setFieldError("password", passwordError);
        return false;
      }

      setLoading(true);

      try {
        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email.toLowerCase().trim());
        const sanitizedPassword = password; // Don't sanitize password as it might remove valid special chars

        const response = await authAPI.login(sanitizedEmail, sanitizedPassword);
        const { user, token } = response.data;

        // Validate response data
        if (!user || !token) {
          throw new Error("Invalid response from server");
        }

        // Store auth data
        storeLogin(user, token);

        showSuccessToast(`Welcome back, ${user.name}!`);

        // Navigate to dashboard
        navigate("/app/dashboard");

        return true;
      } catch (error) {
        const { message, fieldErrors } = handleAPIError(error);

        // Set field-specific errors
        Object.entries(fieldErrors).forEach(([field, error]) => {
          setFieldError(field, error);
        });

        // Set general error for display in the form
        if (Object.keys(fieldErrors).length === 0) {
          setGeneralError(message);
        }

        return false;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, navigate, clearErrors, setFieldError, validateField]
  );

  // Register function with enhanced security
  const register = useCallback(
    async (data: RegisterData): Promise<boolean> => {
      // Clear previous errors
      clearErrors();

      // Validate all fields
      const nameError = validateField("name", data.name);
      const emailError = validateField("email", data.email);
      const passwordError = validateField("password", data.password);

      if (nameError || emailError || passwordError) {
        if (nameError) setFieldError("name", nameError);
        if (emailError) setFieldError("email", emailError);
        if (passwordError) setFieldError("password", passwordError);
        return false;
      }

      setLoading(true);

      try {
        // Sanitize inputs
        const sanitizedData: RegisterData = {
          name: sanitizeInput(data.name.trim()),
          email: sanitizeInput(data.email.toLowerCase().trim()),
          password: data.password, // Don't sanitize password
          role: data.role,
        };

        // Additional validation
        if (sanitizedData.name.length < 2) {
          setFieldError("name", "Name must be at least 2 characters");
          return false;
        }

        const response = await authAPI.register(sanitizedData);
        const { user, token } = response.data;

        // Validate response data
        if (!user || !token) {
          throw new Error("Invalid response from server");
        }

        // Store auth data
        storeLogin(user, token);

        showSuccessToast(`Welcome to PicklePro, ${user.name}!`);

        // Navigate to dashboard
        navigate("/app/dashboard");

        return true;
      } catch (error) {
        const { message, fieldErrors } = handleAPIError(error);

        // Set field-specific errors
        Object.entries(fieldErrors).forEach(([field, error]) => {
          setFieldError(field, error);
        });

        // Set general error for display in the form
        if (Object.keys(fieldErrors).length === 0) {
          setGeneralError(message);
        }

        return false;
      } finally {
        setLoading(false);
      }
    },
    [storeLogin, navigate, clearErrors, setFieldError, validateField]
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      storeLogout();
      navigate("/");
      showSuccessToast("You have been logged out successfully");
    }
  }, [storeLogout, navigate]);

  // Rate limiting status
  return {
    login,
    register,
    logout,
    loading,
    errors,
    generalError,
    clearErrors,
    validateField,
  };
};
