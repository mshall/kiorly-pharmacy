import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { API, apiLogin, demo, login } from "./helpers";

/** SUB-01 plan and renewal screen on the seeded demo tenant (CHAIN edition, auto-renew ON by default). */
const axe = async (page: Page) => {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
};
const noOverflow = async (page: Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
const pin = (page: Page, lang: string, theme: string) => page.addInitScript(([l, th]) => { try { localStorage.setItem("kiorly.lang", l!); localStorage.setItem("kx-theme", th!); } catch { /* ignore */ } }, [lang, theme]);

test.describe.configure({ mode: "serial" });
for (const lang of ["en", "ar"] as const) {
  for (const width of [320, 1440]) {
    test(`plan page (${lang}, ${width}px): current plan, usage, auto-renew, comparison; no overflow; axe clean`, async ({ page }) => {
      await page.setViewportSize({ width, height: width === 320 ? 740 : 900 });
      await pin(page, lang, "light");
      await login(page, demo.owner, lang);
      await page.goto("/plan");
      await expect(page.getByTestId("upgrade-plan")).toBeVisible({ timeout: 30_000 });
      await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
      await expect(page.getByTestId("auto-renew-state")).toBeVisible();
      await expect(page.getByTestId("plan-table")).toBeVisible();
      for (const e of ["LITE", "PRO", "CHAIN"]) await expect(page.getByTestId(`plan-col-${e}`)).toBeVisible();
      await expect(page.getByTestId("cell-purchasing-LITE")).toHaveAttribute("data-on", "0");
      await expect(page.getByTestId("cell-purchasing-PRO")).toHaveAttribute("data-on", "1");
      const text = await page.getByTestId("upgrade-plan").innerText();
      expect(text).not.toMatch(/\bsub\.[a-zA-Z_]+/);
      if (lang === "ar") expect(text).toMatch(/[؀-ۿ]/);
      await noOverflow(page);
      await axe(page);
      if (width === 1440) await page.screenshot({ path: `e2e/screenshots/sub01-plan-${lang}.png`, fullPage: true });
    });
  }
}

test("dark mode axe", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await pin(page, "en", "dark");
  await login(page, demo.owner, "en");
  await page.goto("/plan");
  await expect(page.getByTestId("plan-table")).toBeVisible({ timeout: 30_000 });
  await axe(page);
});

test("turn auto-renew off: the dialog lists what Lite loses before confirming; confirmation needed; then ends on the period end; back on", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await login(page, demo.owner, "en");
  await page.goto("/plan");
  const sw = page.getByRole("switch", { name: "Automatic renewal" });
  await expect(sw).toBeVisible({ timeout: 30_000 });
  await expect(sw).toHaveAttribute("aria-checked", "true");
  await sw.click();
  await expect(page.getByTestId("auto-renew-impact-lost")).toContainText("Purchasing");
  const confirm = page.getByTestId("auto-renew-confirm");
  await expect(confirm).toBeDisabled();
  await page.getByTestId("auto-renew-understood").check();
  await confirm.click();
  await expect(page.getByTestId("auto-renew-state")).toContainText("moves to the free plan", { timeout: 15_000 });
  await sw.click({ force: true });
  await expect(sw).toHaveAttribute("aria-checked", "true", { timeout: 15_000 });
});

test("API: switching off needs the confirmation; a cashier cannot change renewal", async ({ request }) => {
  const owner = await apiLogin(request, demo.owner);
  const bad = await request.post(`${API}/api/v1/subscription/auto-renew`, { data: { enabled: false }, headers: { authorization: `Bearer ${owner}` } });
  expect(bad.status()).toBe(400);
  expect((await bad.json()).code).toBe("AUTO_RENEW_CONFIRMATION_REQUIRED");
  const cashier = await apiLogin(request, demo.cashier);
  const r = await request.post(`${API}/api/v1/subscription/auto-renew`, { data: { enabled: false, confirmDowngrade: true }, headers: { authorization: `Bearer ${cashier}` } });
  expect([401, 403]).toContain(r.status());
});
