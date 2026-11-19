import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const API = "http://127.0.0.1:3100";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { host: "127.0.0.1", port: 5190, strictPort: true, proxy: { "/api": { target: API, changeOrigin: true } } },
  preview: { host: "127.0.0.1", port: 5190, strictPort: true, proxy: { "/api": { target: API, changeOrigin: true } } },
});
