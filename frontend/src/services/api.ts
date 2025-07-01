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

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

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
};

// Tournament API
export const tournamentAPI = {
  getAll: async (): Promise<{ data: Tournament[] }> => {
    const response = await api.get<Tournament[]>("/tournaments");
    return response;
  },

  getById: async (id: string): Promise<{ data: Tournament }> => {
    const response = await api.get<Tournament>(`/tournaments/${id}`);
    return response;
  },

  create: async (
    tournament: Partial<Tournament>
  ): Promise<{ data: Tournament }> => {
    const response = await api.post<Tournament>("/tournaments", tournament);
    return response;
  },

  update: async (
    id: string,
    tournament: Partial<Tournament>
  ): Promise<{ data: Tournament }> => {
    const response = await api.put<Tournament>(
      `/tournaments/${id}`,
      tournament
    );
    return response;
  },

  delete: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.delete<{ message: string }>(
      `/tournaments/${id}`
    );
    return response;
  },

  join: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ message: string }>(
      `/tournaments/${id}/join`
    );
    return response;
  },

  leave: async (id: string): Promise<{ data: { message: string } }> => {
    const response = await api.post<{ message: string }>(
      `/tournaments/${id}/leave`
    );
    return response;
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
    const response = await api.get<Player[]>("/players");
    return response;
  },

  getById: async (id: string): Promise<{ data: Player }> => {
    const response = await api.get<Player>(`/players/${id}`);
    return response;
  },

  getStats: async (id: string): Promise<{ data: Record<string, unknown> }> => {
    const response = await api.get<Record<string, unknown>>(
      `/players/${id}/stats`
    );
    return response;
  },

  update: async (
    id: string,
    player: Partial<Player>
  ): Promise<{ data: Player }> => {
    const response = await api.put<Player>(`/players/${id}`, player);
    return response;
  },

  getRankings: async (): Promise<{ data: Player[] }> => {
    const response = await api.get<Player[]>("/players/rankings");
    return response;
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
