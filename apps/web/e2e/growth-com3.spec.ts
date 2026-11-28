import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { createServer, type Server } from "node:http";
import pg from "pg";

/**
 * COM-3 (pharmacy) on a private stack: counsel status chip, disclosure blocks only when set, collection parameters, settlement statement (cards, reconciliation, payouts, CSV) from the signed Kiorex statement API
 * (an in-spec fake), roles. English and Arabic (RTL) at 320, 640x450, 1440 and 2560. All texts and figures are TEST placeholders.
 */
const API = process.env.PHARMACY_E2E_API ?? "http://127.0.0.1:5751";
const DB = process.env.DATABASE_URL ?? "";
if (!/\/(gap_|e2e_|test_)[a-z0-9_]+(\?|$)/.test(DB)) throw new Error("DATABASE_URL must be a private database (gap_*, e2e_* or test_*)");
const OWNER = "owner@demo.kiorly.local", CASHIER = "cashier@demo.kiorly.local", REF = "pr_com3_fixture";
const tokens = new Map<string, string>();
const tokenOf = async (page: Page, email: string) => { if (!tokens.has(email)) { const r = await page.request.post(`${API}/api/v1/auth/login`, { data: { email, password: "Demo@12345" } }); tokens.set(email, (await r.json()).accessToken as string); } return tokens.get(email)!; };
const signedIn = async (page: Page, email: string, lang: "en" | "ar") => { const token = await tokenOf(page, email); await page.addInitScript(([t, l]) => { try { localStorage.setItem("kiorly.token", t!); localStorage.setItem("kiorly.lang", l!); localStorage.setItem("kx-theme", "light"); } catch { /* ignore */ } }, [token, lang]); };
const statement = { orgRef: REF, period: { from: "2026-12-01T00:00:00.000Z", to: "2027-01-01T00:00:00.000Z" }, currency: "EGP", payoutMethod: "BANK_TRANSFER", onlineCollectionsMinor: 9000, cashVisitCommissionAccruedMinor: 0, cashVisitCommissionNettedMinor: 0, cashVisitCommissionOpenMinor: 0, cashVisitCharges: 0, deductions: { commissionMinor: 900, feesMinor: 100, refundsMinor: 0, chargebacksMinor: 0 }, commission: { totalMinor: 900, collectedMinor: 900, openMinor: 0, disputedOpen: 0 }, netPayableMinor: 8000, paidByBankTransferMinor: 8000, payouts: [{ payoutRef: "po-com3-1", paidAt: "2026-12-04T00:00:00.000Z", cashMinor: 8000, commissionDeductedMinor: 900, bankReference: "po-com3-1", reconciliation: "MATCHED" }], reconciliation: "MATCHED" };
const spec = { feeType: "PERCENT", percentBps: 800, flatMinor: null, minMinor: null, maxMinor: null, mode: null, disputeWindowDays: 9, invoiceDueDays: 11, graceDays: 6, retryDays: [2, 6], reminderDays: [-4, 0], savedMethodChargeAllowed: false };
const SET = { orgRef: REF, history: [{ version: 1, scope: "DEFAULT", kind: "RATE", effectiveFrom: "2026-01-01T00:00:00.000Z", reason: null, spec }], mode: null, disclosure: { rateDisclosure: { en: "TEST rate disclosure written by Kiorex", ar: "نص تجريبي للإفصاح كتبته كيوريكس" }, termsSummary: { en: "TEST terms summary", ar: "" }, showOverrideReason: false, wordingSet: true }, counsel: { status: "APPROVED_WITH_CONDITIONS" } };
const UNSET = { ...SET, disclosure: { rateDisclosure: { en: "", ar: "" }, termsSummary: { en: "", ar: "" }, showOverrideReason: false, wordingSet: false }, counsel: { status: "NOT_REVIEWED" } };

let db: pg.Client; let fake: Server; let orgId = "";
const writeView = async (view: object) => { await db.query('DELETE FROM "KiorexCommissionRateView" WHERE "orgId"=$1', [orgId]); await db.query('INSERT INTO "KiorexCommissionRateView" (id,"orgId",product,version,view,"updatedAt") VALUES ($1,$2,$3,$4,$5,now())', [`com3fx${Date.now()}`, orgId, "PHARMACY", Date.now(), JSON.stringify(view)]); };
test.beforeAll(async () => {
  db = new pg.Client({ connectionString: DB.replace(/\?.*$/, "") }); await db.connect();
  orgId = (await db.query('SELECT "orgId" FROM "StaffUser" WHERE email=$1', [OWNER])).rows[0].orgId as string;
  await writeView(SET);
  fake = createServer((req, res) => { const csv = (req.url ?? "").includes("/export"); res.setHeader("content-type", csv ? "text/csv" : "application/json"); res.end(csv ? "item,amount,deducted,bankReference,status\r\nnetPayable,80.00,,,\r\n" : JSON.stringify(statement)); });
  await new Promise<void>((r) => fake.listen(5753, "127.0.0.1", r));
});
test.afterAll(async () => { await db?.query('DELETE FROM "KiorexCommissionRateView" WHERE "orgId"=$1', [orgId]); await db?.end(); await new Promise((r) => fake?.close(r)); });
const axe = async (page: Page, scope: string) => { await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity)); await page.waitForTimeout(300); const r = await new AxeBuilder({ page }).include(scope).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze(); expect(r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]); };
const SIZES: [number, number][] = [[320, 900], [640, 450], [1440, 1000], [2560, 1300]];

for (const lang of ["en", "ar"] as const) for (const [w, h] of SIZES) {
  test(`COM-3 pharmacy (${lang}, ${w}x${h}): counsel chip, disclosure, parameters, settlement statement; no overflow; axe clean`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width: w, height: h });
    await signedIn(page, OWNER, lang);
    await page.goto("/growth");
    const card = page.getByTestId("growth-statement");
    await expect(card).toBeVisible({ timeout: 30_000 });
    await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    await expect(page.getByTestId("growth-counsel")).toHaveAttribute("data-status", "APPROVED_WITH_CONDITIONS");
    await expect(page.getByTestId("growth-disclosure-rateDisclosure")).toContainText(lang === "ar" ? "نص تجريبي" : "TEST rate disclosure written by Kiorex");
    const terms = page.getByTestId("growth-disclosure-termsSummary").locator("p");
    await expect(terms).toHaveAttribute("lang", "en"); await expect(terms).toHaveAttribute("dir", "ltr");
    await expect(page.getByTestId("growth-rate-params")).toBeVisible();
    await axe(page, '[data-testid="growth-statement"]');
    await page.getByTestId("growth-tab-statement").click();
    await page.getByTestId("growth-stmt-period").fill("2026-12");
    await expect(page.getByTestId("growth-stmt-cards")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("growth-stmt-recon")).toHaveAttribute("data-status", "MATCHED");
    await expect(page.getByTestId("growth-stmt-cNet")).toContainText("80");
    await expect(page.getByTestId("growth-stmt-cDedFees")).toContainText("1");
    await expect(card).toContainText(lang === "ar" ? "تحويل بنكي" : "bank transfer");
    const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("growth-stmt-csv").click()]);
    expect(dl.suggestedFilename()).toBe("settlement-2026-12.csv");
    await axe(page, '[data-testid="growth-statement"]');
    expect(await card.innerText()).not.toMatch(/growth\.(rate|stmt)\.[a-zA-Z]+/);
    expect(await card.innerText()).not.toMatch(/reviewer|DOC-/i);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}

test("wording not set: no disclosure block; the counsel chip and numbers remain", async ({ page }) => {
  await writeView(UNSET);
  try {
    await page.setViewportSize({ width: 1440, height: 900 });
    await signedIn(page, OWNER, "en"); await page.goto("/growth");
    await expect(page.getByTestId("growth-rate-effective")).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId("growth-disclosure")).toHaveCount(0);
    await expect(page.getByTestId("growth-counsel")).toHaveAttribute("data-status", "NOT_REVIEWED");
  } finally { await writeView(SET); }
});

test("a cashier does not see the statement or the rate (one line says why)", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await signedIn(page, CASHIER, "en"); await page.goto("/growth");
  await expect(page.getByTestId("growth-rate-role")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId("growth-tab-statement")).toHaveCount(0);
  const r = await page.request.get(`${API}/api/v1/growth/commission-statement?period=2026-12`, { headers: { Authorization: `Bearer ${await tokenOf(page, CASHIER)}` } });
  expect(r.status()).toBe(403);
});
