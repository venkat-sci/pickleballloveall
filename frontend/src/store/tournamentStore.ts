import { create } from "zustand";
import { Tournament, Match, Player } from "../types";

interface BracketRound {
  [round: number]: Match[];
}

interface TournamentStats {
  totalMatches: number;
  completedMatches: number;
  inProgressMatches: number;
  scheduledMatches: number;
  currentRound: number;
  totalRounds: number;
  progress: number;
}

interface TournamentStore {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  matches: Match[];
  players: Player[];
  bracket: BracketRound;
  tournamentStats: TournamentStats | null;
  setTournaments: (tournaments: Tournament[]) => void;
  setCurrentTournament: (tournament: Tournament | null) => void;
  setMatches: (matches: Match[]) => void;
  setPlayers: (players: Player[]) => void;
  setBracket: (bracket: BracketRound) => void;
  setTournamentStats: (stats: TournamentStats) => void;
  addTournament: (tournament: Tournament) => void;
  updateMatch: (match: Match) => void;
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  tournaments: [],
  currentTournament: null,
  matches: [],
  players: [],
  bracket: {},
  tournamentStats: null,
  setTournaments: (tournaments) => set({ tournaments }),
  setCurrentTournament: (tournament) => set({ currentTournament: tournament }),
  setMatches: (matches) => set({ matches }),
  setPlayers: (players) => set({ players }),
  setBracket: (bracket) => set({ bracket }),
  setTournamentStats: (tournamentStats) => set({ tournamentStats }),
  addTournament: (tournament) =>
    set((state) => ({ tournaments: [...state.tournaments, tournament] })),
  updateMatch: (match) =>
    set((state) => ({
      matches: state.matches.map((m) => (m.id === match.id ? match : m)),
    })),
}));
