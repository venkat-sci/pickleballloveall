export interface User {
  id: string;
  email: string;
  name: string;
  role: "player" | "organizer" | "viewer";
  rating?: number;
  profileImage?: string;

  // Extended profile fields
  phone?: string;
  location?: string;
  bio?: string;
  dateOfBirth?: string;
  preferredHand?: "left" | "right" | "ambidextrous";
  yearsPlaying?: string;
  favoriteShot?: string;

  // Settings
  notificationSettings?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    matchReminders?: boolean;
    tournamentUpdates?: boolean;
    scoreUpdates?: boolean;
    weeklyDigest?: boolean;
  };

  privacySettings?: {
    profileVisibility?: string;
    showRating?: boolean;
    showStats?: boolean;
    showLocation?: boolean;
    allowMessages?: boolean;
  };

  preferences?: {
    theme?: string;
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
  };

  gameSettings?: {
    defaultTournamentType?: string;
    autoJoinWaitlist?: boolean;
    preferredCourtSurface?: string;
    availableDays?: string[];
    preferredTimeSlots?: string[];
  };
}

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  type: "singles" | "doubles" | "mixed";
  format: "round-robin" | "knockout" | "swiss";
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status: "upcoming" | "ongoing" | "completed";
  organizerId: string;
  entryFee?: number;
  prizePool?: number;
  courts: Court[];
  participants: Player[];
}

export interface Player {
  id: string;
  userId: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  gamesPlayed: number;
  profileImage?: string;
  partnerName?: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  player1: Player;
  player2: Player;
  score?: {
    player1: number[];
    player2: number[];
  };
  status: "scheduled" | "in-progress" | "completed";
  startTime: string;
  court?: Court;
  winner?: string;
}

export interface Court {
  id: string;
  name: string;
  location?: string;
  isAvailable: boolean;
}

export interface Bracket {
  id: string;
  tournamentId: string;
  matches: Match[];
  currentRound: number;
  totalRounds: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: "player" | "organizer" | "viewer";
}

export interface LoginData {
  email: string;
  password: string;
}
