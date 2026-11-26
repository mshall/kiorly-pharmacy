import { defineConfig } from "@playwright/test";

/**
 * COM-3 provider side (pharmacy) against a PRIVATE stack the caller started: API on a private port and database, web on a private port, KIOREX_MODE=real with KIOREX_BASE_URL / KIOREX_WEBHOOK_URL pointing at the in-spec fake
 * Kiorex (127.0.0.1:5753), so nothing reaches a real Kiorex. The spec writes and removes its own rate-view row in that database (DATABASE_URL must be gap_*, e2e_* or test_*).
 *   DATABASE_URL=postgresql://…/gap_w9fin_pharmacy PHARMACY_E2E_API=http://127.0.0.1:5751 PRIVATE_BASE_URL=http://127.0.0.1:5750 npx playwright test -c playwright.com3.config.ts
 */
export default defineConfig({
  testDir: "./e2e",
  testMatch: /growth-com3\.spec\.ts/,
  timeout: 90_000,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: process.env.PRIVATE_BASE_URL ?? "http://127.0.0.1:5750", channel: "chrome", locale: "en", trace: "retain-on-failure" },
});
