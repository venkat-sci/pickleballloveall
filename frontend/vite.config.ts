import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://localhost:3001",
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
  },
}));
