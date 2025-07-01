import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useTournamentStore } from '../store/tournamentStore';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();
  const { updateMatch } = useTournamentStore();

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
        auth: {
          token,
        },
      });

      socketRef.current.on('match-updated', (match) => {
        updateMatch(match);
        toast.success('Match updated!');
      });

      socketRef.current.on('tournament-updated', () => {
        toast.success('Tournament updated!');
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, updateMatch]);

  return socketRef.current;
};