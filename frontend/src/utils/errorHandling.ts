import toast from "react-hot-toast";

export interface APIError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
      field?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
}

export interface FormError {
  field: string;
  message: string;
}

/**
 * Enhanced error handler for API responses
 */
export const handleAPIError = (
  error: unknown
): {
  message: string;
  fieldErrors: Record<string, string>;
  shouldRetry: boolean;
} => {
  // Default response
  const defaultResponse = {
    message: "An unexpected error occurred. Please try again.",
    fieldErrors: {},
    shouldRetry: true,
  };

  if (!error) return defaultResponse;

  const apiError = error as APIError;

  // Handle network errors
  if (!apiError.response) {
    return {
      message: "Network error. Please check your connection and try again.",
      fieldErrors: {},
      shouldRetry: true,
    };
  }

  const { status, data } = apiError.response;
  const fieldErrors: Record<string, string> = {};

  // Handle validation errors (422)
  if (status === 422 && data?.errors) {
    Object.entries(data.errors).forEach(([field, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0];
      }
    });

    return {
      message: "Please correct the highlighted fields",
      fieldErrors,
      shouldRetry: false,
    };
  }

  // Handle authentication errors (401)
  if (status === 401) {
    return {
      message: "Invalid credentials. Please check your email and password.",
      fieldErrors: {},
      shouldRetry: false,
    };
  }

  // Handle forbidden errors (403)
  if (status === 403) {
    return {
      message:
        "Access denied. You do not have permission to perform this action.",
      fieldErrors: {},
      shouldRetry: false,
    };
  }

  // Handle conflict errors (409)
  if (status === 409) {
    const message = data?.message || "This resource already exists";
    if (data?.field) {
      fieldErrors[data.field] = message;
    }

    return {
      message,
      fieldErrors,
      shouldRetry: false,
    };
  }

  // Handle rate limiting (429)
  if (status === 429) {
    return {
      message: "Too many attempts. Please wait a moment before trying again.",
      fieldErrors: {},
      shouldRetry: true,
    };
  }

  // Handle server errors (5xx)
  if (status && status >= 500) {
    return {
      message: "Server error. Please try again in a few moments.",
      fieldErrors: {},
      shouldRetry: true,
    };
  }

  // Use custom message from API if available
  const customMessage = data?.message;
  if (customMessage && typeof customMessage === "string") {
    return {
      message: customMessage,
      fieldErrors,
      shouldRetry: status !== 400, // Don't retry bad requests
    };
  }

  return defaultResponse;
};

/**
 * Show error toast with appropriate styling
 */
export const showErrorToast = (
  error: unknown,
  fallbackMessage?: string
): void => {
  const { message } = handleAPIError(error);

  toast.error(message || fallbackMessage || "Something went wrong", {
    duration: 5000,
    style: {
      background: "#FEF2F2",
      color: "#B91C1C",
      border: "1px solid #FECACA",
    },
    iconTheme: {
      primary: "#EF4444",
      secondary: "#FEF2F2",
    },
  });
};

/**
 * Show success toast
 */
export const showSuccessToast = (message: string): void => {
  toast.success(message, {
    duration: 4000,
    style: {
      background: "#F0FDF4",
      color: "#166534",
      border: "1px solid #BBF7D0",
    },
    iconTheme: {
      primary: "#22C55E",
      secondary: "#F0FDF4",
    },
  });
};

/**
 * Show warning toast
 */
export const showWarningToast = (message: string): void => {
  toast(message, {
    duration: 4000,
    style: {
      background: "#FFFBEB",
      color: "#D97706",
      border: "1px solid #FED7AA",
    },
    iconTheme: {
      primary: "#F59E0B",
      secondary: "#FFFBEB",
    },
  });
};

/**
 * Validate form data and return errors
 */
export const validateFormData = <T extends Record<string, any>>(
  data: T,
  validators: Record<keyof T, (value: any) => string | null>
): Record<keyof T, string> => {
  const errors = {} as Record<keyof T, string>;

  Object.entries(validators).forEach(([field, validator]) => {
    const error = validator(data[field]);
    if (error) {
      errors[field as keyof T] = error;
    }
  });

  return errors;
};

/**
 * Debounce function for input validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};
