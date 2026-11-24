import { defineConfig, devices } from "@playwright/test";

/** Crash sweep against the running workspace stack (web :5192); never starts servers. */
export default defineConfig({
  testDir: "./e2e",
  testMatch: /crash-sweep\.spec\.ts/,
  timeout: 600_000,
  workers: 2,
  reporter: [["list"]],
  use: { baseURL: process.env.SWEEP_WEB ?? "http://127.0.0.1:5192", locale: "en" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
