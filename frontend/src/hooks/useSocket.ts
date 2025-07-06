import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { useTournamentStore } from "../store/tournamentStore";
// import { config } from "../config/environment";
// import { io } from 'socket.io-client';
// import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();
  const { updateMatch } = useTournamentStore();

  useEffect(() => {
    // Temporarily disable socket connection until backend is set up
    // TODO: Enable when backend has socket.io support
    /*
    if (token && !socketRef.current) {
      socketRef.current = io(config.wsUrl, {
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
    */

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, updateMatch]);

  return socketRef.current;
};
