import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

/** The language control is ONE menu button (globe + code): open it, then pick the language from the menu. */
async function pickLanguage(page: import("@playwright/test").Page, code: "ar" | "en") {
  await page.locator('[data-kx-control="language"]').first().click();
  await page.locator(`[role="menuitemradio"][data-kx-lang="${code}"]`).click();
}

/**
 * Founder, 24 Nov 2026 (ADR-038 amendment): Kiorly Pharmacy by Kiorex sign-in = Kiorly Home design language for ONE product, and the preselected method is decided
 * per organisation. Runs against the dev stack (web http://localhost:5192, API http://localhost:3100) through `playwright.signin.config.ts`; nothing is deployed.
 * Order of the preselected method: remembered last method > org default (`?org=`, remembered org) > deployment default.
 */
const SHOTS = process.env.SIGNIN_SHOTS_DIR ?? "";
const LOGIN = "/login";
const METHOD_KEY = "kiorly.signin.method";
const ORG_KEY = "kiorly.signin.org";
const CFG = "**/api/v1/auth/config*";
const PASSPORT_OFFER = { issuer: "http://localhost:4400", clientId: "x", authorizationEndpoint: "http://localhost:4400/auth", scope: "openid", endSession: true };
const passportBody = (defaultMethod: "PASSWORD" | "PASSPORT") => ({ localLogin: true, passport: PASSPORT_OFFER, passportAvailable: true, defaultMethod });

/** Answers like the API: PASSPORT for ?org=pp-org, PASSWORD for ?org=pw-org, the deployment default (PASSPORT here) otherwise; records the org it was asked about. */
async function mockConfig(page: Page, opts: { passport?: boolean; deployment?: "PASSWORD" | "PASSPORT" } = {}) {
  const asked: Array<string | null> = [];
  await page.route(CFG, (r) => {
    const org = new URL(r.request().url()).searchParams.get("org");
    asked.push(org);
    const m = org === "pp-org" ? "PASSPORT" : org === "pw-org" ? "PASSWORD" : (opts.deployment ?? "PASSPORT");
    return r.fulfill({ json: passportBody(m), ...(opts.passport === false ? { json: { localLogin: true, passport: null, passportAvailable: false, defaultMethod: "PASSWORD" } } : {}) });
  });
  return asked;
}
const selected = (page: Page, m: "passport" | "password") => expect(page.getByTestId(`signin-method-${m}`)).toHaveAttribute("aria-selected", "true");
const tabs = (page: Page) => page.getByRole("tab");

test.describe("preselected method: remembered > org default > deployment default", () => {
  test("no org, nothing remembered: the deployment default", async ({ page }) => {
    await mockConfig(page, { deployment: "PASSWORD" });
    await page.goto(LOGIN);
    await selected(page, "password"); await expect(tabs(page)).toHaveCount(2);
    const p2 = await page.context().newPage(); await mockConfig(p2, { deployment: "PASSPORT" }); await p2.goto(LOGIN); await selected(p2, "passport");
  });
  test("?org= PASSWORD vs PASSPORT preselects accordingly, and both methods stay available", async ({ page }) => {
    const asked = await mockConfig(page);
    await page.goto(`${LOGIN}?org=pw-org`); await selected(page, "password"); await expect(tabs(page)).toHaveCount(2);
    await page.goto(`${LOGIN}?org=pp-org`); await selected(page, "passport"); await expect(tabs(page)).toHaveCount(2);
    expect(asked).toContain("pw-org"); expect(asked).toContain("pp-org");
  });
  test("the org remembered on this browser is used when the URL has none", async ({ page }) => {
    await mockConfig(page);
    await page.addInitScript(([k]) => { try { if (!localStorage.getItem(k!)) localStorage.setItem(k!, "pw-org"); } catch { /* ignore */ } }, [ORG_KEY]);
    await page.goto(LOGIN); await selected(page, "password");
  });
  test("the remembered last method beats the org default; garbage is ignored", async ({ page }) => {
    await mockConfig(page);
    await page.goto(`${LOGIN}?org=pp-org`); await selected(page, "passport");
    await page.evaluate((k) => localStorage.setItem(k, "password"), METHOD_KEY);
    await page.reload(); await selected(page, "password");
    await page.evaluate((k) => localStorage.setItem(k, "carrier-pigeon"), METHOD_KEY);
    await page.reload(); await selected(page, "passport");
  });
  test("an unknown org gets the deployment default, same shape (no enumeration)", async ({ page }) => {
    await mockConfig(page, { deployment: "PASSWORD" });
    await page.goto(`${LOGIN}?org=no-such-org`); await selected(page, "password");
  });
  test("Passport not offered: only the password form, no tabs", async ({ page }) => {
    await mockConfig(page, { passport: false });
    await page.goto(`${LOGIN}?org=pp-org`);
    await expect(page.getByTestId("signin-password-panel")).toBeVisible(); await expect(tabs(page)).toHaveCount(0);
  });
  test("?sso=passport still starts Passport by itself", async ({ page }) => {
    await mockConfig(page);
    await page.route("http://localhost:4400/**", (r) => r.fulfill({ status: 200, contentType: "text/html", body: "passport" }));
    await page.goto(`${LOGIN}?sso=passport`).catch(() => {});
    await page.waitForURL(/localhost:4400\/auth/, { timeout: 15_000 });
  });
});

const WIDTHS = [360, 768, 1024, 1440, 1920, 2560];
test.describe("layout and accessibility", () => {
  for (const w of WIDTHS) {
    test(`light English at ${w}px: split panel only from 1024, centred card, no overflow, Switch product, axe-clean`, async ({ page }) => {
      await mockConfig(page);
      await page.setViewportSize({ width: w, height: w < 768 ? 740 : 900 });
      await page.goto(`${LOGIN}?org=pp-org`);
      if ((await page.locator("html").getAttribute("dir")) === "rtl") await pickLanguage(page, "en"); // the screenshots for this case are English
      await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
      await expect(page.getByTestId("signin-method")).toBeVisible();
      const panel = page.getByTestId("login-brand-panel");
      if (w >= 1024) await expect(panel).toBeVisible(); else await expect(panel).toBeHidden();
      if (w >= 1024) await expect(panel).toContainText(/Kiorly Pharmacy|كيورلي|الصيدل/i);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.getByTestId("switch-product")).toBeVisible();
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
      if (SHOTS) { mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: `${SHOTS}/pharmacy-${w}-en-light.png` }); }
    });
  }
  for (const [lang, theme] of [["ar", "light"], ["en", "dark"], ["ar", "dark"]] as const) {
    test(`${lang} ${theme}: direction, theme control, axe-clean, 1440 and 360`, async ({ page }) => {
      await mockConfig(page);
      for (const w of [1440, 360]) {
        await page.setViewportSize({ width: w, height: w < 768 ? 740 : 900 });
        await page.goto(`${LOGIN}?org=pp-org`);
        if (lang === "ar" && (await page.locator("html").getAttribute("dir")) !== "rtl") await pickLanguage(page, "ar");
        if (lang === "en" && (await page.locator("html").getAttribute("dir")) === "rtl") await pickLanguage(page, "en");
        await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        const themeBtn = page.locator('[data-kx-control="theme"]').first();
        if (theme === "dark" && (await themeBtn.getAttribute("data-theme-mode")) !== "dark") await themeBtn.click();
        if (theme === "dark") { await expect(themeBtn).toHaveAttribute("data-theme-mode", "dark"); await page.waitForTimeout(500); } // let the 240 ms theme cross-fade finish before axe measures contrast
        await expect(page.getByTestId("signin-method")).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
        const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        expect(r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
        if (SHOTS) { mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: `${SHOTS}/pharmacy-${w}-${lang}-${theme}.png` }); }
      }
    });
  }
  test("light is the default and the choice persists across a reload", async ({ page }) => {
    await mockConfig(page);
    await page.goto(LOGIN);
    const themeBtn = page.locator('[data-kx-control="theme"]').first();
    await expect(themeBtn).toHaveAttribute("data-theme-mode", "light");
    await themeBtn.click(); await expect(themeBtn).toHaveAttribute("data-theme-mode", "dark");
    await page.reload(); await expect(page.locator('[data-kx-control="theme"]').first()).toHaveAttribute("data-theme-mode", "dark");
  });
});

test.describe("live stack: the org setting drives the real login", () => {
const EMAIL = "owner@demo.kiorly.local", PW = "Demo@12345";
  const session = async (request: APIRequestContext) => {
    const r = await request.post("/api/v1/auth/login", { data: { email: EMAIL, password: PW } });
    expect(r.ok(), await r.text()).toBe(true);
    const token = ((await r.json()) as { accessToken: string }).accessToken;
    const headers = { Authorization: `Bearer ${token}` };
    const me = (await (await request.get("/api/v1/auth/me", { headers })).json()) as { tenant: { id: string } };
    return { token, headers, org: me.tenant.id };
  };
  const setDefault = async (request: APIRequestContext, v: "PASSWORD" | "PASSPORT" | null) => {
    const { headers } = await session(request);
    const r = await request.patch("/api/v1/settings", { headers, data: { defaultSignInMethod: v } });
    expect(r.ok(), await r.text()).toBe(true);
  };
  test.afterAll(async ({ request }) => { await setDefault(request, null); });
  test("org set to PASSWORD vs PASSPORT preselects accordingly (real API)", async ({ page, request }) => {
    const { org } = await session(request);
    await setDefault(request, "PASSWORD");
    await page.goto(`${LOGIN}?org=${org}`); await selected(page, "password");
    await setDefault(request, "PASSPORT");
    await page.goto(`${LOGIN}?org=${org}`); await selected(page, "passport");
    await expect(tabs(page)).toHaveCount(2);
  });
  test("an unknown org answers exactly like no org", async ({ request }) => {
    const a = await (await request.get("/api/v1/auth/config?org=no-such-org-xyz")).json();
    const b = await (await request.get("/api/v1/auth/config")).json();
    expect(a).toEqual(b);
  });
  test("settings screen: the owner changes the default, it is saved and shown", async ({ page, request }) => {
    await setDefault(request, null);
    const { token } = await session(request);
    await page.addInitScript((t) => localStorage.setItem("kiorly.token", t), token);
    await page.goto("/settings");
    const card = page.getByTestId("signin-default-card"); await expect(card).toBeVisible();
    await page.getByTestId("signin-default-password").check();
    await page.getByTestId("signin-default-save").click();
    await expect(page.getByTestId("signin-default-effective")).toContainText(/password|كلمة المرور/i);
    expect((await (await request.get("/api/v1/settings", { headers: { Authorization: `Bearer ${token}` } })).json()).defaultSignInMethod).toBe("PASSWORD");
  });
});
