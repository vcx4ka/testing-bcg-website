import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: replace "bcg-website" with your actual GitHub repo name.
// GitHub Pages serves project sites from https://<user>.github.io/<repo>/,
// so Vite needs to know that sub-path at build time.
export default defineConfig({
  plugins: [react()],
  base: "/bcg-website/",
});
