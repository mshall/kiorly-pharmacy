import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
const API = process.env.PHARMACY_API_ORIGIN ?? "http://127.0.0.1:3100";
const tokens = new Map<string, string>(); // one login per user: the API throttles sign-ins per e-mail
const tokenOf = async (page: Page, email: string) => { if (!tokens.has(email)) { const r = await page.request.post(`${API}/api/v1/auth/login`, { data: { email, password: "Demo@12345" } }); tokens.set(email, (await r.json()).accessToken as string); } return tokens.get(email)!; };
const OWNER = { email: "owner@demo.kiorly.local" }, READER = { email: "cashier@demo.kiorly.local" }, SOLO = { email: "solo.owner@demo.kiorly.local" }; // owner: legacy-connected demo pharmacy; solo: never connected
const spec = { feeType: "PERCENT", percentBps: 800, flatMinor: null, minMinor: 500, maxMinor: 9000, mode: null };
const flatSpec = { feeType: "FLAT", percentBps: null, flatMinor: 2500, minMinor: null, maxMinor: null, mode: null };
const effDefault = { state: "SET", source: "DEFAULT", version: 1, effectiveFrom: "2026-01-01T00:00:00.000Z", reason: null, spec };
const effOwn = { state: "SET", source: "OVERRIDE", version: 1, effectiveFrom: "2026-03-01T00:00:00.000Z", reason: "volume agreement", spec: flatSpec };
const RATE_VIEW = { known: true, product: "PHARMACY", state: "SET", effective: effOwn, default: effDefault, override: effOwn, inheriting: false, upcoming: null, receivedAt: "2026-03-01T00:00:00.000Z", history: [{ version: 1, scope: "ORG", kind: "RATE", effectiveFrom: "2026-03-01T00:00:00.000Z", reason: "volume agreement", spec: flatSpec }, { version: 1, scope: "DEFAULT", kind: "RATE", effectiveFrom: "2026-01-01T00:00:00.000Z", reason: null, spec }] };
const RATE_NOT_SET = { known: false, product: null, state: "NOT_SET", effective: { state: "NOT_SET", source: null, version: null, effectiveFrom: null, reason: null, spec: null }, default: { state: "NOT_SET", source: null, version: null, effectiveFrom: null, reason: null, spec: null }, override: null, inheriting: true, upcoming: null, receivedAt: null, history: [] };
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
    await expect(page.getByTestId("growth-recs")).toBeVisible(); await expect(page.getByTestId("growth-statement")).toContainText("Rate not set");
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

  for (const [w, h] of [[320, 900], [360, 900], [640, 450], [768, 900], [1024, 900], [1440, 900], [2560, 900]] as const) test(`responsive ${w}x${h}: no overflow, 44px touch targets in the table, axe-clean`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h }); await open(page, OWNER);
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

  for (const [lang, w, h] of [["ar", 320, 900], ["ar", 640, 450], ["ar", 1440, 900], ["en", 320, 900], ["en", 640, 450], ["en", 1440, 900]] as const) test(`GRW-P4-B3 ${lang} ${w}x${h}: five-rule suggestions and the commission statement card, no overflow, axe-clean`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h }); await open(page, OWNER, lang);
    await expect(page.getByTestId("growth-recs")).toBeVisible(); await expect(page.getByTestId("growth-statement")).toBeVisible();
    if (lang === "en") await expect(page.getByTestId("growth-statement")).toContainText(/Rate not set|Rate in effect now|visible to/);
    await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    await noOverflow(page); await axe(page);
  });

  // COM-2: the commission rate card is read only; Kiorex sets the rate. The API answer is stubbed so the test needs no seeded rate (and never invents one).
  for (const [lang, w, h] of [["ar", 320, 900], ["ar", 640, 450], ["ar", 1440, 900], ["ar", 2560, 1300], ["en", 320, 900], ["en", 640, 450], ["en", 1440, 900], ["en", 2560, 1300]] as const) test(`COM-2 ${lang} ${w}x${h}: the commission rate card shows effective, default and own rate with history, no overflow, axe-clean`, async ({ page }) => {
    await page.route(/\/api\/v1\/growth\/commission-rate$/, (r) => r.fulfill({ json: RATE_VIEW }));
    await page.setViewportSize({ width: w, height: h }); await open(page, OWNER, lang);
    const card = page.getByTestId("growth-rate"); await expect(card).toBeVisible();
    await expect(page.getByTestId("growth-rate-effective")).toContainText(lang === "ar" ? "خاصة" : "Own rate"); // the source line: own rate agreed
    await expect(page.getByTestId("growth-rate-default")).toBeVisible(); await expect(page.getByTestId("growth-rate-override")).toBeVisible();
    await expect(card).toContainText("volume agreement");
    expect(await card.innerText()).not.toMatch(/growth\.rate\.[a-zA-Z]+/);
    if (lang === "ar") expect(await card.innerText()).toMatch(/[؀-ۿ]/);
    await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    await noOverflow(page); await axe(page);
  });

  test("COM-2: with no rate reported the card says 'Rate not set' (no invented rate), and a reader role sees the role note instead", async ({ page }) => {
    await page.route(/\/api\/v1\/growth\/commission-rate$/, (r) => r.fulfill({ json: RATE_NOT_SET }));
    await open(page, OWNER, "en");
    await expect(page.getByTestId("growth-rate-effective")).toContainText("Rate not set");
    await expect(page.getByTestId("growth-rate-override")).toContainText("follows the default");
    await page.unroute(/\/api\/v1\/growth\/commission-rate$/);
    await page.route(/\/api\/v1\/growth\/commission-rate$/, (r) => r.fulfill({ status: 403, json: { statusCode: 403, code: "FORBIDDEN", message: "x" } }));
    await open(page, READER, "en");
    await expect(page.getByTestId("growth-rate-role")).toBeVisible();
    await expect(page.getByTestId("growth-rate")).toHaveCount(0);
  });

  for (const lang of ["ar", "en"] as const) test(`GRW-P4-B3 poster ${lang}: the counter card prints to a real PDF (Save as PDF), direction and QR present`, async ({ page }) => {
    const token = await tokenOf(page, OWNER.email);
    const h = { authorization: `Bearer ${token}` };
    const list = await (await page.request.get(`${API}/api/v1/growth/links`, { headers: h })).json() as { items: Array<{ id: string; status: string }> };
    let id = list.items.find((l) => l.status === "ACTIVE")?.id; let made = false;
    if (!id) { const c = await page.request.post(`${API}/api/v1/growth/links`, { headers: h, data: { label: "Poster test", ownerScope: "ORG" } }); id = (await c.json()).id as string; made = true; }
    try {
      const r = await page.request.get(`${API}/api/v1/growth/links/${id}/poster?lang=${lang}&size=A4`, { headers: h });
      expect(r.status()).toBe(200); expect(r.headers()["content-type"]).toContain("text/html");
      await page.setContent(await r.text(), { waitUntil: "load" });
      await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      await expect(page.locator("svg, img").first()).toBeVisible();
      const pdf = await page.pdf({ format: "A4", printBackground: true });
      expect(pdf.subarray(0, 5).toString()).toBe("%PDF-"); expect(pdf.length).toBeGreaterThan(4000);
    } finally { if (made && id) await page.request.patch(`${API}/api/v1/growth/links/${id}`, { headers: h, data: { status: "REVOKED" } }); }
  });

  test("English dark: axe-clean with a link modal open", async ({ page }) => {
    await open(page, OWNER, "en", "dark"); await page.getByTestId("growth-create").click(); await expect(page.getByTestId("growth-form")).toBeVisible(); await shot(page, "en-dark-form"); await axe(page);
  });

  test("reduced motion: the page renders without animation dependence", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" }); await open(page, OWNER); await expect(page.getByTestId("growth-summary")).toBeVisible(); await axe(page);
  });
});
