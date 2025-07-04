import axios from "axios";
import { useAuthStore } from "../store/authStore";
import {
  AuthResponse,
  RegisterData,
  User,
  Tournament,
  Match,
  Player,
  Court,
} from "../types";
import { sanitizeInput, generateSecureToken } from "../utils/security";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", // CSRF protection
  },
  timeout: 10000, // 10 second timeout
});

// Generate a nonce for each request to prevent replay attacks
const generateRequestNonce = () => generateSecureToken(16);

// Request interceptor to add auth token and security headers
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add security headers
    config.headers["X-Request-ID"] = generateRequestNonce();
    config.headers["X-Client-Version"] = "1.0.0";

    // Sanitize string data in the request body
    if (config.data && typeof config.data === "object") {
      config.data = sanitizeRequestData(config.data);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Sanitize request data to prevent XSS
const sanitizeRequestData = (data: unknown): unknown => {
  if (typeof data === "string") {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeRequestData);
  }

  if (data && typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      // Don't sanitize password fields
      if (key.toLowerCase().includes("password")) {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeRequestData(value);
      }
    }
    return sanitized;
  }

  return data;
};

// Response interceptor to handle auth errors and validate responses
api.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (response.data && typeof response.data === "object") {
      response.data = sanitizeResponseData(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state on unauthorized
      useAuthStore.getState().logout();
      // Optionally redirect to login
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Sanitize response data to prevent XSS from compromised backend
const sanitizeResponseData = (data: unknown): unknown => {
  if (typeof data === "string") {
    return sanitizeInput(data);
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeResponseData);
  }

  if (data && typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      data as Record<string, unknown>
    )) {
      // Don't sanitize token or other sensitive fields that need exact values
      if (key === "token" || key === "id") {
        sanitized[key] = value;
      } else {
        sanitized[key] = sanitizeResponseData(value);
      }
    }
    return sanitized;
  }

  return data;
};

// Auth API
export const authAPI = {
  login: async (
    email: string,
    password: string
  ): Promise<{ data: AuthResponse }> => {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response;
  },

  register: async (userData: RegisterData): Promise<{ data: AuthResponse }> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response;
  },

  logout: async (): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response;
  },

  getProfile: async (): Promise<{ data: User }> => {
    const response = await api.get<User>("/auth/profile");
    return response;
  },

  forgotPassword: async (
    email: string
  ): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response;
  },

  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      { token, password }
    );
    return response;
  },
};

// User API
export const userAPI = {
  getAll: async (): Promise<{ data: User[] }> => {
    const response = await api.get<User[]>("/users");
    return response;
  },

  getById: async (id: string): Promise<{ data: User }> => {
    const response = await api.get<User>(`/users/${id}`);
    return response;
  },

  update: async (
    id: string,
    userData: Partial<User>
  ): Promise<{ data: User }> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response;
  },

  delete: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.delete<{ message: string }>(`/users/${id}`);
    return response;
  },

  create: async (userData: Partial<User>): Promise<{ data: User }> => {
    const response = await api.post<User>("/users", userData);
    return response;
  },

  getStats: async (id: string): Promise<{ data: Record<string, unknown> }> => {
    const response = await api.get<Record<string, unknown>>(
      `/users/${id}/stats`
    );
    return response;
  },

  // API for user profile and settings
  updateUserProfile: async (userId: string, profileData: Partial<User>) => {
    const response = await api.put(`/users/${userId}`, profileData);
    return response.data;
  },

  updateUserSettings: async (
    userId: string,
    settings: Record<string, unknown>
  ) => {
    const response = await api.put(`/users/${userId}/settings`, settings);
    return response.data;
  },

  changeUserPassword: async (
    userId: string,
    passwordData: { currentPassword: string; newPassword: string }
  ) => {
    const response = await api.put(`/users/${userId}/password`, passwordData);
    return response.data;
  },
};

// Tournament API
export const tournamentAPI = {
  getAll: async (): Promise<{ data: Tournament[] }> => {
    const response = await api.get<{ data: Tournament[] }>("/tournaments");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Tournament }> => {
    const response = await api.get<{ data: Tournament }>(`/tournaments/${id}`);
    return response.data;
  },

  create: async (
    tournament: Partial<Tournament>
  ): Promise<{ data: Tournament }> => {
    const response = await api.post<{ data: Tournament }>(
      "/tournaments",
      tournament
    );
    return response.data;
  },

  update: async (
    id: string,
    tournament: Partial<Tournament>
  ): Promise<{ data: Tournament }> => {
    const response = await api.put<{ data: Tournament }>(
      `/tournaments/${id}`,
      tournament
    );
    return response.data;
  },

  delete: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.delete<{ data: { message: string } }>(
      `/tournaments/${id}`
    );
    return response.data;
  },

  join: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ data: { message: string } }>(
      `/tournaments/${id}/join`
    );
    return response.data;
  },

  leave: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ data: { message: string } }>(
      `/tournaments/${id}/leave`
    );
    return response.data;
  },

  start: async (
    id: string
  ): Promise<{ data: { tournament: Tournament; matches: Match[] } }> => {
    const response = await api.post<{
      data: { tournament: Tournament; matches: Match[] };
    }>(`/tournaments/${id}/start`);
    return response.data;
  },
};

// Match API
export const matchAPI = {
  getAll: async (): Promise<{ data: Match[] }> => {
    const response = await api.get<Match[]>("/matches");
    return response;
  },

  getByTournament: async (tournamentId: string): Promise<{ data: Match[] }> => {
    const response = await api.get<Match[]>(
      `/matches/tournament/${tournamentId}`
    );
    return response;
  },

  updateScore: async (
    id: string,
    score: { player1: number[]; player2: number[] }
  ): Promise<{ data: { message: string } }> => {
    const response = await api.put<{ message: string }>(
      `/matches/${id}/score`,
      { score }
    );
    return response;
  },

  updateStatus: async (
    id: string,
    status: string
  ): Promise<{ data: { message: string } }> => {
    const response = await api.put<{ message: string }>(
      `/matches/${id}/status`,
      { status }
    );
    return response;
  },

  getById: async (id: string): Promise<{ data: Match }> => {
    const response = await api.get<Match>(`/matches/${id}`);
    return response;
  },

  create: async (match: Partial<Match>): Promise<{ data: Match }> => {
    const response = await api.post<Match>("/matches", match);
    return response;
  },
};

// Player API
export const playerAPI = {
  getAll: async (): Promise<{ data: Player[] }> => {
    const response = await api.get<{ data: Player[] }>("/players/with-stats");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Player }> => {
    const response = await api.get<{ data: Player }>(`/players/${id}`);
    return response.data;
  },

  getStats: async (id: string): Promise<{ data: Record<string, unknown> }> => {
    const response = await api.get<{ data: Record<string, unknown> }>(
      `/players/${id}/stats`
    );
    return response.data;
  },

  update: async (
    id: string,
    player: Partial<Player>
  ): Promise<{ data: Player }> => {
    const response = await api.put<{ data: Player }>(`/players/${id}`, player);
    return response.data;
  },

  getRankings: async (): Promise<{ data: Player[] }> => {
    const response = await api.get<{ data: Player[] }>("/players/rankings");
    return response.data;
  },
};

// Court API
export const courtAPI = {
  getAll: async (): Promise<{ data: Court[] }> => {
    const response = await api.get<Court[]>("/courts");
    return response;
  },

  getAvailable: async (): Promise<{ data: Court[] }> => {
    const response = await api.get<Court[]>("/courts/available");
    return response;
  },

  getById: async (id: string): Promise<{ data: Court }> => {
    const response = await api.get<Court>(`/courts/${id}`);
    return response;
  },

  create: async (court: Partial<Court>): Promise<{ data: Court }> => {
    const response = await api.post<Court>("/courts", court);
    return response;
  },

  update: async (
    id: string,
    court: Partial<Court>
  ): Promise<{ data: Court }> => {
    const response = await api.put<Court>(`/courts/${id}`, court);
    return response;
  },

  delete: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.delete<{ message: string }>(`/courts/${id}`);
    return response;
  },
};

export default api;
