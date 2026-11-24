import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { API, apiLogin, DEMO_PASSWORD } from "./helpers";
const tokens = new Map<string, string>(); // one login per user: the API throttles sign-ins per e-mail
const signedIn = async (page: Page, email: string, lang: "en" | "ar") => {
  if (!tokens.has(email)) { const r = await page.request.post(`${API}/api/v1/auth/login`, { data: { email, password: DEMO_PASSWORD } }); tokens.set(email, (await r.json()).accessToken as string); }
  const token = tokens.get(email)!;
  await page.addInitScript(([t, l]) => { try { localStorage.setItem("kiorly.token", t!); localStorage.setItem("kiorly.lang", l!); } catch { /* ignore */ } }, [token, lang]);
};
void apiLogin;

/** The "Connect to Kiorex" nav item is a state-aware front door (ADR-040). States are driven by mocking the front-door and wizard endpoints on a real owner session; backend flows: e2e/test/24-kiorex-front-door.e2e.ts in the workspace repo. */
const SHOTS = process.env.KIOREX_TAB_SHOTS_DIR;
const shot = async (page: Page, name: string) => { if (!SHOTS) return; mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: join(SHOTS, `pharmacy-${name}.png`), fullPage: true }); };
const KEYS = ["subscription", "branch_optin", "catalogue", "hours_delivery", "licence", "payout", "terms", "request", "live"];
const steps = (done: number, extra: Record<string, string> = {}) => KEYS.map((key, i) => ({ key, status: extra[key] ?? (i < done ? "done" : i === done ? "action_needed" : "blocked") }));
const door = (state: string, status: string, doneN: number, o: Record<string, unknown> = {}, extra: Record<string, string> = {}) => ({ state, status, legacy: false, started: state !== "NOT_CONNECTED", interestedAt: null, leadAt: null, month: null, recent: [], connect: { legacy: false, status, progress: Math.round((doneN / (KEYS.length - 1)) * 100), steps: steps(doneN, extra) }, ...o });
const axe = async (page: Page) => { const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).exclude('[data-testid="dev-test-users"]').analyze(); expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]); };
/** The front door itself must not overflow. (The pharmacy shell's own scrolling mobile nav adds 4px to the document width at 360px; that is outside this page.) */
const noOverflow = async (page: Page) => { await page.waitForLoadState("networkidle"); const d = await page.getByTestId("kiorex-front-door").evaluate((e) => [e.scrollWidth, e.clientWidth]); expect(d[0]!, JSON.stringify(d)).toBeLessThanOrEqual(d[1]! + 1); };
const mock = async (page: Page, d: unknown) => { await page.route(/\/api\/v1\/kiorex-connect\/front-door$/, (r) => r.fulfill({ json: d })); await page.route(/\/api\/v1\/kiorex-connect\/front-door\/(interest|start)$/, (r) => r.fulfill({ json: d })); };
const open = async (page: Page, lang: "en" | "ar" = "en") => { await signedIn(page, "owner@demo.kiorly.local", lang); await page.goto("/kiorex-connect"); await expect(page.getByTestId("kiorex-state")).toBeVisible({ timeout: 60_000 }); };

test.describe("Connect to Kiorex front door (pharmacy)", () => {
  test("1 not connected: landing, true benefits, how it works, readiness, reassurance, fees confirmed by the team, Start and Talk to us", async ({ page }) => {
    await mock(page, door("NOT_CONNECTED", "STANDALONE", 2)); await open(page);
    await expect(page.getByRole("heading", { name: /Reach more (customers|patients) with Kiorex/ })).toBeVisible();
    await expect(page.locator('[data-testid^="benefit-"]')).toHaveCount(5);
    await expect(page.getByTestId("landing-how").locator("li")).toHaveCount(4);
    await expect(page.getByTestId("landing-readiness-count")).toContainText("2 of");
    await expect(page.getByTestId("landing-fee")).toContainText("confirmed by the Kiorex team");
    await expect(page.getByTestId("landing-reassure")).toContainText("reversible");
    await expect(page.getByTestId("landing-start")).toBeVisible();
    await shot(page, "1-not-connected-1440"); await axe(page);
  });
  test("1c Talk to us: inline form, consent and a contact required, payload", async ({ page }) => {
    await mock(page, door("NOT_CONNECTED", "STANDALONE", 2)); let sent: Record<string, unknown> | undefined;
    await page.route(/\/front-door\/talk$/, async (r) => { sent = r.request().postDataJSON(); await r.fulfill({ json: door("NOT_CONNECTED", "STANDALONE", 2, { leadAt: new Date().toISOString() }) }); });
    await open(page); await page.getByTestId("landing-talk").click();
    await expect(page.getByTestId("talk-form")).toBeVisible(); await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByTestId("talk-send")).toBeDisabled();
    await page.getByTestId("talk-phone").fill("+201000000123"); await page.getByTestId("talk-time").selectOption("EVENING");
    await expect(page.getByTestId("talk-send")).toBeDisabled(); await page.getByTestId("talk-consent").check(); await expect(page.getByTestId("talk-send")).toBeEnabled();
    await shot(page, "1-talk-form"); await axe(page); await page.getByTestId("talk-send").click();
    await expect(page.getByTestId("landing-lead-sent")).toBeVisible(); expect(sent).toMatchObject({ phone: "+201000000123", preferredTime: "EVENING", consent: true });
  });
  test("2 in progress: progress bar and the next step highlighted", async ({ page }) => {
    await mock(page, door("IN_PROGRESS", "STANDALONE", 3)); await open(page);
    await expect(page.getByTestId("kiorex-progress")).toBeVisible(); await expect(page.getByTestId("next-step")).toHaveAttribute("data-step", KEYS[3]!);
    await expect(page.getByTestId("panel-open-wizard")).toHaveAttribute("href", "/kiorex-connect/steps"); await shot(page, "2-in-progress-1440"); await axe(page);
  });
  test("3 waiting for review: status and what happens next", async ({ page }) => {
    await mock(page, door("WAITING", "REQUESTED", KEYS.length - 2, {}, { request: "waiting_kiorex", live: "blocked" })); await open(page);
    await expect(page.getByTestId("waiting-card").locator("li")).toHaveCount(3); await shot(page, "3-waiting-1440"); await axe(page);
  });
  for (const s of ["CHANGES_REQUESTED", "REJECTED", "PAUSED"]) test(`5 attention ${s}: decision banner and what is missing`, async ({ page }) => {
    await mock(page, door("ATTENTION", s, 3)); await open(page); await expect(page.getByTestId("connect-decision")).toBeVisible();
    if (s !== "PAUSED") await expect(page.getByTestId("attention-missing")).toBeVisible(); await shot(page, `5-attention-${s.toLowerCase()}-1440`); await axe(page);
  });
  test("4 live: dashboard with this month, listings, recent, settings link: branch pause and resume", async ({ page }) => {
    await mock(page, door("LIVE", "APPROVED", KEYS.length - 1, { month: { orders: 12, completed: 9, rejected: 1, value: 4300 }, recent: [{ id: "o1", createdAt: new Date().toISOString(), status: "DISPENSED", branch: "Main", delivery: "PICKUP", value: 120 }], branches: [{ id: "b1", name: "Main", optedIn: true }, { id: "b2", name: "Annex", optedIn: false }] })); const calls: string[] = []; await page.route(/\/kiorex-connect\/branches\/[^/]+$/, (r) => { calls.push(`${r.request().url()} ${r.request().postData()}`); return r.fulfill({ json: [] }); }); await open(page);
    await expect(page.getByTestId("kiorex-live-dashboard")).toBeVisible(); await expect(page.getByTestId("live-recent")).toBeVisible(); await expect(page.getByTestId("live-settings")).toHaveAttribute("href", "/kiorex-connect/steps");
    await page.getByTestId("live-pause-b1").click(); await page.getByTestId("live-resume-b2").click(); await expect.poll(() => calls.length).toBe(2); expect(calls[0]).toContain("/b1"); expect(calls[0]).toContain("false"); expect(calls[1]).toContain("true");
    await shot(page, "4-live-1440"); await axe(page);
  });
  for (const w of [360, 768, 1024, 1440, 2560]) test(`responsive ${w}px: no overflow, axe-clean`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 }); await mock(page, door("NOT_CONNECTED", "STANDALONE", 2)); await open(page); await noOverflow(page);
    if (w === 360 || w === 2560) await shot(page, `1-not-connected-${w}`); await axe(page);
  });
  for (const theme of ["light", "dark"]) test(`Arabic RTL ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 }); await mock(page, door("NOT_CONNECTED", "STANDALONE", 2)); if (theme === "dark") await page.addInitScript(() => { try { localStorage.setItem("kx-theme", "dark"); } catch { /* ignore */ } });
    await open(page, "ar"); await expect(page.locator("html")).toHaveAttribute("dir", "rtl"); await expect(page.getByRole("heading", { name: /اوصل إلى (عملاء|مرضى) أكثر مع كيوريكس/ })).toBeVisible();
    await noOverflow(page); await shot(page, `not_connected-ar-${theme}`); await axe(page);
  });
  test("home card: standalone only, dismissible, remembered, returns only on request", async ({ page }) => {
    await mock(page, door("NOT_CONNECTED", "STANDALONE", 2)); await signedIn(page, "owner@demo.kiorly.local", "en"); await page.goto("/");
    await expect(page.getByTestId("kiorex-home-card")).toBeVisible({ timeout: 60_000 }); await shot(page, "home-card"); await axe(page);
    await page.getByTestId("home-card-dismiss").click(); await page.reload(); await page.waitForLoadState("networkidle"); await expect(page.getByTestId("kiorex-home-card")).toHaveCount(0);
    await page.goto("/kiorex-connect"); await page.getByTestId("home-card-show").click(); await page.goto("/"); await expect(page.getByTestId("kiorex-home-card")).toBeVisible();
  });
  test("a role without settings access does not see the nav item", async ({ page }) => {
    await signedIn(page, "cashier@demo.kiorly.local", "en"); await page.goto("/"); await expect(page.getByRole("navigation").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('a[href="/kiorex-connect"]')).toHaveCount(0);
  });
});
