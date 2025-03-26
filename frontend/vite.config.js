  import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: ".", // Ensure Vite uses the correct root
  build: {
    outDir: "dist", // Ensure output is in 'dist/'
    emptyOutDir: true, // Clears old builds
  },
  plugins: [react({ babel: { plugins: ["babel-plugin-styled-components"] } })],
  base: "./",
});
