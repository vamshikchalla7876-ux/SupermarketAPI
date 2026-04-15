import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/customers": "http://localhost:8080",
      "/inventory": "http://localhost:8080",
      "/orders": "http://localhost:8080",
      "/billing": "http://localhost:8080",
      "/shipping": "http://localhost:8080",
      "/supermarket": "http://localhost:8080"
    }
  }
});
