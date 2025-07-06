export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  environment: import.meta.env.VITE_ENVIRONMENT || "development",
  wsUrl: import.meta.env.VITE_WS_URL || "ws://localhost:3001",
};
