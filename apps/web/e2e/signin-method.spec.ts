import { expect, test, type Page } from "@playwright/test";

/** Founder, 24 Nov 2026: exactly two sign-in methods, Kiorex Passport first and the default, Password behind a toggle on the same screen. */
const KEY = "kiorly.signin.method";
const PASSPORT = { issuer: "http://localhost:4400", clientId: "x", authorizationEndpoint: "http://localhost:4400/auth", scope: "openid", endSession: true };
const config = (page: Page, passport: boolean) => page.route("**/api/v1/auth/config*", (r) => r.fulfill({ json: { localLogin: true, passport: passport ? PASSPORT : null, passportAvailable: passport, defaultMethod: passport ? "PASSPORT" : "PASSWORD" } }));

test.describe("Login: Passport default, password toggle, last-method memory", () => {
  test("a fresh browser shows Kiorex Passport and the password form together (unified card, ADR-061: no tabs, no toggle)", async ({ page }) => {
    await config(page, true);
    await page.goto("/login");
    await expect(page.getByTestId("unified-signin")).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(page.getByTestId("signin-passport")).toBeVisible();
    await expect(page.getByTestId("signin-password-panel")).toBeVisible();
    expect(await page.evaluate((k) => localStorage.getItem(k), KEY)).toBeNull();
  });

  test("a remembered method (old key) or garbage never hides a method", async ({ page }) => {
    await config(page, true);
    await page.goto("/login");
    for (const v of ["password", "carrier-pigeon"]) {
      await page.evaluate(([k, x]) => localStorage.setItem(k!, x!), [KEY, v]);
      await page.reload();
      await expect(page.getByTestId("signin-passport")).toBeVisible();
      await expect(page.getByTestId("signin-password-panel")).toBeVisible();
    }
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
