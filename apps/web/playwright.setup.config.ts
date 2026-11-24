import { defineConfig, devices } from "@playwright/test";

/** Quick-setup E2E against the already running workspace stack (web :5192, API :3100). Fresh organisations only; never starts servers. */
const WEB = process.env.PHARMACY_SETUP_WEB ?? "http://127.0.0.1:5192";
process.env.PHARMACY_API_ORIGIN = process.env.PHARMACY_API_ORIGIN ?? "http://127.0.0.1:3100";
export default defineConfig({
  testDir: "./e2e",
  testMatch: /quick-setup\.spec\.ts/,
  timeout: 240_000,
  expect: { timeout: 20_000 },
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: WEB, trace: "retain-on-failure", actionTimeout: 20_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
