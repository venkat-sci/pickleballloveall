import { config } from "../config/environment";

// Helper function to create full API URLs
export const createApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${config.apiUrl}/${cleanPath}`;
};

// Helper function for authenticated fetch requests
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith("/api") ? createApiUrl(url) : url;

  return fetch(fullUrl, {
    ...options,
    headers,
  });
};
