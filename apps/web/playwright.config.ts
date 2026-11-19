import { defineConfig, devices } from "@playwright/test";

/**
 * E2E against the seeded demo tenant (`npm run seed`). Starts the API (swc, port 3100) and the Vite dev server (5190) unless already running.
 * Browser: Playwright's chromium, or the system Chrome with PW_CHANNEL=chrome.
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5190";
export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL, trace: "retain-on-failure", ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    { command: "npm run start:swc -w api", cwd: "../..", url: "http://127.0.0.1:3100/api/v1/health/ready", reuseExistingServer: true, timeout: 120_000, env: { SWAGGER_ENABLED: "false", NODE_ENV: "development" } },
    { command: "npm run dev -w web", cwd: "../..", url: baseURL, reuseExistingServer: true, timeout: 60_000 },
  ],
});
