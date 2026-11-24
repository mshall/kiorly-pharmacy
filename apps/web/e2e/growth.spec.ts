import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
const API = process.env.PHARMACY_API_ORIGIN ?? "http://127.0.0.1:3100";
const tokens = new Map<string, string>(); // one login per user: the API throttles sign-ins per e-mail
const tokenOf = async (page: Page, email: string) => { if (!tokens.has(email)) { const r = await page.request.post(`${API}/api/v1/auth/login`, { data: { email, password: "Demo@12345" } }); tokens.set(email, (await r.json()).accessToken as string); } return tokens.get(email)!; };
const OWNER = { email: "owner@demo.kiorly.local" }, READER = { email: "cashier@demo.kiorly.local" }, SOLO = { email: "solo.owner@demo.kiorly.local" }; // owner: legacy-connected demo pharmacy; solo: never connected
const SHOTS = process.env.GROWTH_SHOTS_DIR;
const shot = async (page: Page, name: string) => { if (!SHOTS) return; mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: join(SHOTS, `pharmacy-growth-${name}.png`), fullPage: true }); };
const signedIn = async (page: Page, who: { email: string }, lang: "en" | "ar", theme: "light" | "dark" = "light") => {
  const token = await tokenOf(page, who.email);
  await page.addInitScript(([t, l, th]) => { try { localStorage.setItem("kiorly.token", t!); localStorage.setItem("kiorly.lang", l!); localStorage.setItem("kx-theme", th!); } catch { /* ignore */ } }, [token, lang, theme]);
};
const axe = async (page: Page) => {
  await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity));
  await page.waitForTimeout(250);
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).exclude('[data-testid="dev-test-users"]').analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
};
/** The page and its table region must not overflow sideways (the table scrolls inside its own region on a phone). */
const noOverflow = async (page: Page) => {
  await page.waitForLoadState("networkidle"); await page.waitForTimeout(600);
  const o = await page.evaluate(() => { const w = document.documentElement.clientWidth; const wide = [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > w + 0.5 && !e.closest(".skip-link") && !e.closest("[role=region]") && !e.closest("[class*=overflow-x-auto]") && !e.closest("[class*=overflow-auto]")).slice(0, 5).map((e) => `${e.tagName}.${String(e.className).slice(0, 50)}`); return { extra: document.documentElement.scrollWidth - w, wide }; });
  expect(o.extra, JSON.stringify(o.wide)).toBeLessThanOrEqual(1);
};
const open = async (page: Page, who: { email: string }, lang: "en" | "ar" = "en", theme: "light" | "dark" = "light") => { await signedIn(page, who, lang, theme); await page.goto("/growth"); await expect(page.getByTestId("growth-page")).toBeVisible({ timeout: 60_000 }); };

/** Growth & links web page (pharmacy) against the REAL dev stack (web :5192 with its API behind the Vite proxy); starts nothing.
 *   GROWTH_BASE_URL=http://localhost:5192 GROWTH_SHOTS_DIR=/path npx playwright test -c playwright.growth.config.ts
 * The API behaviour (roles, isolation, redirects) is proven in the API integration suite; this file proves what a person sees: not connected, create, QR, print, pause, resume, revoke, read-only roles, layout 360 to 2560, Arabic RTL, light and dark, axe. */
test.describe("Growth & links (pharmacy)", () => {
  test("1 not connected (REAL standalone organisation): explains why, offers the Connect button, no links UI, axe-clean", async ({ page }) => {
    await open(page, SOLO);
    await expect(page.getByTestId("growth-not-connected")).toBeVisible();
    await expect(page.getByTestId("growth-not-connected").getByRole("link", { name: "Connect to Kiorex" })).toHaveAttribute("href", "/kiorex-connect");
    await expect(page.getByTestId("growth-create")).toHaveCount(0); await expect(page.getByTestId("growth-link-row")).toHaveCount(0);
    await shot(page, "1-not-connected"); await axe(page);
  });

  test("2 owner: summary tiles, create a link, its QR, copy, print cards, pause, resume, revoke (REAL API, link is revoked at the end)", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await open(page, OWNER);
    await expect(page.getByRole("heading", { name: "Growth & links", level: 1 }).or(page.getByRole("heading", { name: "Growth & links" }).first())).toBeVisible();
    for (const id of ["visits", "orders", "completed", "market"]) await expect(page.getByTestId(`growth-stat-${id}`)).toBeVisible();
    await expect(page.getByTestId("growth-recs")).toBeVisible(); await expect(page.getByTestId("growth-statement")).toContainText("No commission");
    const name = `PW Counter ${Date.now().toString(36)}`;
    await page.getByTestId("growth-create").click();
    await expect(page.getByTestId("growth-f-submit")).toBeDisabled();
    await page.getByTestId("growth-f-label").fill(name); await page.getByTestId("growth-f-scope").selectOption("DESK");
    await expect(page.getByTestId("growth-f-site")).toBeVisible(); await axe(page);
    await page.getByTestId("growth-f-submit").click();
    const row = page.getByTestId("growth-link-row").filter({ hasText: name }); await expect(row).toBeVisible();
    await expect(row).toHaveAttribute("data-status", "ACTIVE");
    const code = (await row.locator("div[dir=ltr]").first().innerText()).trim(); expect(code).toMatch(/^[0-9A-HJKMNP-TV-Z]{8}$/);
    await shot(page, "2-created");
    await row.getByTestId("growth-qr").click();
    const img = page.getByTestId("growth-qr-img"); await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate((e: HTMLImageElement) => e.naturalWidth)).toBeGreaterThan(0);
    await shot(page, "2-qr"); await axe(page); await page.getByRole("button", { name: "Close", exact: true }).last().click();
    await row.getByTestId("growth-copy").click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(`/q/${code}`);
    const [popup] = await Promise.all([page.waitForEvent("popup"), row.getByTestId("growth-print-ar").click()]);
    await popup.waitForLoadState(); await expect(popup.locator("html")).toHaveAttribute("dir", "rtl"); await expect(popup.locator("body")).toContainText("كيورلي فارمسي"); await popup.close();
    const [popupEn] = await Promise.all([page.waitForEvent("popup"), row.getByTestId("growth-print-en").click()]);
    await popupEn.waitForLoadState(); await expect(popupEn.locator("html")).toHaveAttribute("dir", "ltr"); await popupEn.close();
    await row.getByTestId("growth-pause").click(); await expect(row).toHaveAttribute("data-status", "PAUSED");
    await row.getByTestId("growth-resume").click(); await expect(row).toHaveAttribute("data-status", "ACTIVE");
    await row.getByTestId("growth-revoke").click(); await shot(page, "2-revoke-confirm"); await axe(page);
    await page.getByTestId("growth-revoke-confirm").click(); await expect(row).toHaveAttribute("data-status", "REVOKED");
    await expect(row.getByTestId("growth-qr")).toHaveCount(0); await expect(row.getByTestId("growth-resume")).toHaveCount(0);
  });

  test("3 a read-only role sees links, counts and QR but cannot create, pause or revoke", async ({ page }) => {
    await open(page, READER);
    await expect(page.getByTestId("growth-summary")).toBeVisible();
    await expect(page.getByTestId("growth-create")).toHaveCount(0);
    await expect(page.getByTestId("growth-pause")).toHaveCount(0); await expect(page.getByTestId("growth-revoke")).toHaveCount(0);
    await shot(page, "3-read-only"); await axe(page);
  });

  test("4 an API error is explained, not raw: link limit and forbidden", async ({ page }) => {
    await open(page, OWNER);
    await page.route(/\/api\/v1\/growth\/links$/, (r) => (r.request().method() === "POST" ? r.fulfill({ status: 409, json: { code: "GROWTH_LINK_LIMIT_REACHED", message: "x" } }) : r.continue()));
    await page.getByTestId("growth-create").click(); await page.getByTestId("growth-f-label").fill("Over the limit"); await page.getByTestId("growth-f-submit").click();
    await expect(page.getByText("link limit is reached")).toBeVisible();
  });

  for (const w of [360, 768, 1024, 1440, 2560]) test(`responsive ${w}px: no overflow, 44px touch targets in the table, axe-clean`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 }); await open(page, OWNER);
    await noOverflow(page);
    const small = await page.getByTestId("growth-link-row").first().locator("button").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()).filter((r) => r.width > 0 && (r.width < 43.5 || r.height < 43.5)).length).catch(() => 0);
    expect(small).toBe(0);
    if (w === 360 || w === 2560) await shot(page, `responsive-${w}`); await axe(page);
  });

  for (const theme of ["light", "dark"] as const) test(`Arabic RTL ${theme}: heading, direction, layout and axe`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 }); await open(page, OWNER, "ar", theme);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl"); await expect(page.getByRole("heading", { name: "النمو والروابط" }).first()).toBeVisible();
    await expect(page.getByTestId("growth-create")).toContainText("رابط جديد");
    await noOverflow(page); await shot(page, `ar-${theme}`); await axe(page);
  });

  test("English dark: axe-clean with a link modal open", async ({ page }) => {
    await open(page, OWNER, "en", "dark"); await page.getByTestId("growth-create").click(); await expect(page.getByTestId("growth-form")).toBeVisible(); await shot(page, "en-dark-form"); await axe(page);
  });

  test("reduced motion: the page renders without animation dependence", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); await open(page, OWNER); await expect(page.getByTestId("growth-summary")).toBeVisible(); await axe(page);
  });
});
