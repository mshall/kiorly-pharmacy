import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** Override beside a dev stack: PHARMACY_API_ORIGIN / PHARMACY_WEB_PORT (defaults 3100 / 5190). */
const API = process.env.PHARMACY_API_ORIGIN ?? "http://127.0.0.1:3100";
const WEB_PORT = Number(process.env.PHARMACY_WEB_PORT ?? 5190);

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { host: "127.0.0.1", port: WEB_PORT, strictPort: true, proxy: { "/api": { target: API, changeOrigin: true } } },
  preview: { host: "127.0.0.1", port: WEB_PORT, strictPort: true, proxy: { "/api": { target: API, changeOrigin: true } } },
});
