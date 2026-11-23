import { expect, test, type Page } from "@playwright/test";

/** Founder, 24 Nov 2026: exactly two sign-in methods, Kiorex Passport first and the default, Password behind a toggle on the same screen. */
const KEY = "kiorly.signin.method";
const PASSPORT = { issuer: "http://localhost:4400", clientId: "x", authorizationEndpoint: "http://localhost:4400/auth", scope: "openid", endSession: true };
const config = (page: Page, passport: boolean) => page.route("**/api/v1/auth/config*", (r) => r.fulfill({ json: { localLogin: true, passport: passport ? PASSPORT : null, passportAvailable: passport, defaultMethod: passport ? "PASSPORT" : "PASSWORD" } }));

test.describe("Login: Passport default, password toggle, last-method memory", () => {
  test("a fresh browser lands on Kiorex Passport; Password is one click away", async ({ page }) => {
    await config(page, true);
    await page.goto("/login");
    await expect(page.getByTestId("signin-method-passport")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab")).toHaveCount(2);
    await expect(page.getByTestId("signin-passport")).toBeVisible();
    await expect(page.getByTestId("signin-password-panel")).toHaveCount(0);
    await page.getByTestId("signin-method-password").click();
    await expect(page.getByTestId("signin-password-panel")).toBeVisible();
    await expect(page.getByTestId("signin-passport")).toHaveCount(0);
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
    await page.getByTestId("signin-method-password").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByTestId("signin-method-passport")).toHaveAttribute("aria-selected", "true");
  });

  test("the last method used is preselected next time; garbage falls back to Passport", async ({ page }) => {
    await config(page, true);
    await page.goto("/login");
    await page.evaluate((k) => localStorage.setItem(k, "password"), KEY);
    await page.reload();
    await expect(page.getByTestId("signin-method-password")).toHaveAttribute("aria-selected", "true");
    await expect(page.getByTestId("signin-password-panel")).toBeVisible();
    await page.evaluate((k) => localStorage.setItem(k, "carrier-pigeon"), KEY);
    await page.reload();
    await expect(page.getByTestId("signin-method-passport")).toHaveAttribute("aria-selected", "true");
  });

  test("when Passport is not offered only the password sign-in shows (no tabs)", async ({ page }) => {
    await config(page, false);
    await page.goto("/login");
    await expect(page.getByTestId("signin-password-panel")).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(page.getByTestId("signin-passport")).toHaveCount(0);
  });

  test("?sso=passport still starts Passport by itself", async ({ page }) => {
    await config(page, true);
    await page.route("http://localhost:4400/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "passport" }));
    await page.goto("/login?sso=passport").catch(() => {});
    await page.waitForURL(/localhost:4400\/auth/, { timeout: 15_000 });
  });
});
