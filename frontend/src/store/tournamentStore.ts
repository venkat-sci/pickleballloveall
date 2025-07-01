import { create } from 'zustand';
import { Tournament, Match, Player } from '../types';

interface TournamentStore {
  tournaments: Tournament[];
  currentTournament: Tournament | null;
  matches: Match[];
  players: Player[];
  setTournaments: (tournaments: Tournament[]) => void;
  setCurrentTournament: (tournament: Tournament | null) => void;
  setMatches: (matches: Match[]) => void;
  setPlayers: (players: Player[]) => void;
  addTournament: (tournament: Tournament) => void;
  updateMatch: (match: Match) => void;
}

export const useTournamentStore = create<TournamentStore>((set) => ({
  tournaments: [],
  currentTournament: null,
  matches: [],
  players: [],
  setTournaments: (tournaments) => set({ tournaments }),
  setCurrentTournament: (tournament) => set({ currentTournament: tournament }),
  setMatches: (matches) => set({ matches }),
  setPlayers: (players) => set({ players }),
  addTournament: (tournament) =>
    set((state) => ({ tournaments: [...state.tournaments, tournament] })),
  updateMatch: (match) =>
    set((state) => ({
      matches: state.matches.map((m) => (m.id === match.id ? match : m)),
    })),
}));