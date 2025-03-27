import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets", // ✅ Ensures styles & fonts in `/assets/`
  },
  plugins: [react()],
  base: "/", // ✅ Ensures correct paths for assets
});
