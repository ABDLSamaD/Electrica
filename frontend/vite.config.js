import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Adjust this if deploying to a subdirectory
  build: {
    outDir: "dist", // Default is 'dist', make sure it matches
  },
});
