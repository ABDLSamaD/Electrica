  import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  uild: { manifest: true, outDir: "./dist" },
  base: "/",
  root: "./src",
  plugins: [react()],
});
