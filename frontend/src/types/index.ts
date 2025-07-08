export interface User {
  id: string;
  email: string;
  name: string;
  role: "player" | "organizer" | "viewer";
  rating?: number;
  profileImage?: string;

  // Game statistics
  totalWins?: number;
  totalLosses?: number;
  totalGamesPlayed?: number;

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
  type?: "singles" | "doubles" | "mixed";
  format?: "round-robin" | "knockout" | "swiss";
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  status?: "upcoming" | "ongoing" | "completed";
  organizerId: string;
  organizer?: User;
  entryFee?: number;
  prizePool?: number;
  rules?: string;
  courts?: Court[];
  participants?: TournamentParticipant[];
  matches?: Match[];
  // Winner information
  winnerId?: string;
  winnerName?: string;
  winnerPartner?: string; // For doubles tournaments
  winner?: User;
}

export interface TournamentParticipant {
  id: string;
  user?: User;
  userId: string;
  tournamentId: string;
  tournamentWins: number;
  tournamentLosses: number;
  tournamentGamesPlayed: number;
  partnerName?: string;
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
  tournament?: Tournament;
  round?: number;
  player1?: User;
  player2?: User;
  player1Id?: string;
  player2Id?: string;
  score?: {
    player1: number[];
    player2: number[];
  };
  status: "scheduled" | "in-progress" | "completed";
  startTime?: string;
  actualStartTime?: string;
  court?: Court;
  courtId?: string;
  winner?: string;
  canStartEarly?: boolean;
  authorizedScoreKeepers?: string[];
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

export interface RegisterResponse {
  user: User;
  message: string;
  emailSent: boolean;
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
