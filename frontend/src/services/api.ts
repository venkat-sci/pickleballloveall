import axios from "axios";
import { useAuthStore } from "../store/authStore";
import {
  AuthResponse,
  RegisterData,
  RegisterResponse,
  User,
  Tournament,
  Match,
  Player,
  Court,
} from "../types";
import { sanitizeInput, generateSecureToken } from "../utils/security";
import { config } from "../config/environment";

const API_BASE_URL = config.apiUrl;

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

    // Don't sanitize FormData (used for file uploads)
    if (
      config.data &&
      typeof config.data === "object" &&
      !(config.data instanceof FormData)
    ) {
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

  register: async (
    userData: RegisterData
  ): Promise<{ data: RegisterResponse }> => {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
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
    const response = await api.get<{ data: User[] }>("/users");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: User }> => {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (
    id: string,
    profileData: Partial<User>
  ): Promise<{ data: User }> => {
    const response = await api.put<{ data: User }>(`/users/${id}`, profileData);
    return response.data;
  },

  uploadProfilePicture: async (
    id: string,
    file: File
  ): Promise<{ data: { profileImage: string } }> => {
    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await api.post<{ data: { profileImage: string } }>(
      `/users/${id}/profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": undefined, // Remove the default Content-Type to let browser set multipart/form-data
        },
      }
    );
    return response.data;
  },

  updateSettings: async (
    id: string,
    settings: Partial<
      Pick<
        User,
        | "notificationSettings"
        | "privacySettings"
        | "preferences"
        | "gameSettings"
      >
    >
  ): Promise<{ data: User }> => {
    const response = await api.put<{ data: User }>(
      `/users/${id}/settings`,
      settings
    );
    return response.data;
  },

  changePassword: async (
    id: string,
    passwordData: {
      currentPassword: string;
      newPassword: string;
    }
  ): Promise<{ data: { message: string } }> => {
    const response = await api.put<{ data: { message: string } }>(
      `/users/${id}/password`,
      passwordData
    );
    return response.data;
  },

  search: async (query: string): Promise<{ data: User[] }> => {
    const response = await api.get<{ data: User[] }>(
      `/users/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};

// Tournament API
export const tournamentAPI = {
  /**
   * Get all matches for a tournament (for TournamentDetails matches tab)
   */
  getMatches: async (id: string): Promise<{ data: Match[] }> => {
    // Use matchAPI.getByTournament for consistency
    return await matchAPI.getByTournament(id);
  },
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

  join: async (id: string): Promise<{ message: string; data?: Tournament }> => {
    const response = await api.post<{ message: string; data?: Tournament }>(
      `/tournaments/${id}/join`
    );
    return response.data;
  },

  leave: async (
    id: string
  ): Promise<{ message: string; data?: Tournament }> => {
    const response = await api.post<{ message: string; data?: Tournament }>(
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

  getBracket: async (
    id: string
  ): Promise<{
    data: {
      tournament: Tournament;
      bracket: Record<number, Match[]>;
      participants: Array<{ id: string; userId: string; user: User }>;
      stats: {
        totalMatches: number;
        completedMatches: number;
        inProgressMatches: number;
        scheduledMatches: number;
        currentRound: number;
        totalRounds: number;
        progress: number;
      };
    };
  }> => {
    const response = await api.get(`/tournaments/${id}/bracket`);
    return response.data;
  },

  updateMatchSchedule: async (
    id: string,
    matchData: { matchId: string; startTime?: string; courtId?: string }
  ): Promise<{ data: { message: string; data: Match } }> => {
    const response = await api.put(
      `/tournaments/${id}/match-schedule`,
      matchData
    );
    return response.data;
  },

  setWinner: async (
    id: string,
    winnerData: {
      winnerId?: string;
      winnerName?: string;
      winnerPartner?: string;
    }
  ): Promise<{ data: Tournament }> => {
    const response = await api.post<{
      message: string;
      data: Tournament;
    }>(`/tournaments/${id}/winner`, winnerData);
    return { data: response.data.data };
  },
};

// Match API
export const matchAPI = {
  getAll: async (): Promise<{ data: Match[] }> => {
    const response = await api.get<{ data: Match[] }>("/matches");
    return response.data; // Return the parsed data from the backend
  },

  getByTournament: async (tournamentId: string): Promise<{ data: Match[] }> => {
    const response = await api.get<{ data: Match[] }>(
      `/matches/tournament/${tournamentId}`
    );
    return response.data; // Return the parsed data from the backend
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

  updateDetails: async (
    id: string,
    details: { startTime?: string; courtId?: string }
  ): Promise<{ data: { message: string; data: Match } }> => {
    const response = await api.put(`/matches/${id}/details`, details);
    return response.data;
  },

  getTournamentBracket: async (
    tournamentId: string
  ): Promise<{
    data: {
      bracket: Record<number, Match[]>;
      stats: {
        totalMatches: number;
        completedMatches: number;
        inProgressMatches: number;
        scheduledMatches: number;
        currentRound: number;
        totalRounds: number;
        progress: number;
      };
    };
  }> => {
    const response = await api.get(
      `/matches/tournament/${tournamentId}/bracket`
    );
    return response.data;
  },

  generateNextRound: async (
    tournamentId: string
  ): Promise<{
    data: { message: string; data: Match[] };
  }> => {
    const response = await api.post(
      `/matches/tournament/${tournamentId}/next-round`
    );
    return response.data;
  },

  addScoreKeeper: async (
    matchId: string,
    userId: string
  ): Promise<{ data: { message: string; data: unknown } }> => {
    const response = await api.post(`/matches/${matchId}/score-keepers`, {
      userId,
    });
    return response.data;
  },

  removeScoreKeeper: async (
    matchId: string,
    userId: string
  ): Promise<{ data: { message: string; data: unknown } }> => {
    const response = await api.delete(`/matches/${matchId}/score-keepers`, {
      data: { userId },
    });
    return response.data;
  },

  getScoreKeepers: async (
    matchId: string
  ): Promise<{
    data: {
      matchId: string;
      scoreKeepers: Array<{ id: string; name: string; email: string }>;
      authorizedScoreKeeperIds: string[];
    };
  }> => {
    const response = await api.get(`/matches/${matchId}/score-keepers`);
    return response.data;
  },

  startEarly: async (
    matchId: string
  ): Promise<{
    data: {
      message: string;
      data: {
        matchId: string;
        actualStartTime: string;
        status: string;
        canStartEarly: boolean;
      };
    };
  }> => {
    const response = await api.post(`/matches/${matchId}/start-early`);
    return response.data;
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
    const response = await api.get<{ data: Court[] }>("/courts");
    return response.data;
  },

  getAvailable: async (): Promise<{ data: Court[] }> => {
    const response = await api.get<{ data: Court[] }>("/courts/available");
    return response.data;
  },

  getById: async (id: string): Promise<{ data: Court }> => {
    const response = await api.get<{ data: Court }>(`/courts/${id}`);
    return response.data;
  },

  create: async (court: Partial<Court>): Promise<{ data: Court }> => {
    const response = await api.post<{ data: Court }>("/courts", court);
    return response.data;
  },

  update: async (
    id: string,
    court: Partial<Court>
  ): Promise<{ data: Court }> => {
    const response = await api.put<{ data: Court }>(`/courts/${id}`, court);
    return response.data;
  },

  delete: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.delete<{ data: { message: string } }>(
      `/courts/${id}`
    );
    return response.data;
  },
};

export default api;
