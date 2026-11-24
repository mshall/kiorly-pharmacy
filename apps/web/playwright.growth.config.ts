import { defineConfig } from "@playwright/test";

/**
 * Growth & links web page against an ALREADY RUNNING dev stack (web :5192, its API behind the Vite proxy); starts nothing, so it never collides with another checkout's ports.
 *   GROWTH_BASE_URL=http://localhost:5192 GROWTH_SHOTS_DIR=/path/to/shots npx playwright test -c playwright.growth.config.ts
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: /growth\.spec\.ts/,
  timeout: 90_000,
  workers: 1,
  retries: 1,
  reporter: [["list"]],
  use: { baseURL: process.env.GROWTH_BASE_URL ?? "http://localhost:5192", channel: "chrome", locale: "en", trace: "retain-on-failure" },
});
