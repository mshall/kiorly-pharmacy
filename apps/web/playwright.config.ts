import { defineConfig, devices } from "@playwright/test";

/**
 * E2E against the seeded demo tenant (`npm run seed`). Starts the API (swc, port 3100) and the Vite dev server (5190) unless already running.
 * Browser: Playwright's chromium, or the system Chrome with PW_CHANNEL=chrome.
 */
/** Override the ports to run beside a dev stack: PHARMACY_E2E_API_PORT / PHARMACY_E2E_WEB_PORT (default 3100 / 5190). */
const API_PORT = process.env.PHARMACY_E2E_API_PORT ?? "3100";
const WEB_PORT = process.env.PHARMACY_E2E_WEB_PORT ?? "5190";
process.env.PHARMACY_API_ORIGIN = `http://127.0.0.1:${API_PORT}`;
process.env.PHARMACY_WEB_PORT = WEB_PORT;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${WEB_PORT}`;
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
    { command: "npm run start:swc -w api", cwd: "../..", url: `http://127.0.0.1:${API_PORT}/api/v1/health/ready`, reuseExistingServer: true, timeout: 120_000, env: { PORT: API_PORT, SWAGGER_ENABLED: "false", NODE_ENV: "development" } },
    { command: "npm run dev -w web", cwd: "../..", url: baseURL, reuseExistingServer: true, timeout: 60_000 },
  ],
});
