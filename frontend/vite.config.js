import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ✅ Ensure correct base path for assets
  build: {
    outDir: "dist", // Ensure output is in 'dist/'
    emptyOutDir: true, // Clears old builds
    assetsDir: "assets", // Ensure assets go inside /assets/
  },
  plugins: [react()],
});
