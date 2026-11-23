import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { demo, login, showPasswordForm } from "./helpers";

async function audit(page: Page, name: string) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(bad.map((v) => `${name}: ${v.id} (${v.nodes.length})`), JSON.stringify(bad.map((v) => ({ id: v.id, n: v.nodes.slice(0, 2).map((x) => x.html) })))).toEqual([]);
}

for (const [lang, theme] of [["en", "light"], ["ar", "light"], ["en", "dark"], ["ar", "dark"]] as const) {
  test(`a11y (axe, serious+critical) and direction in ${lang} ${theme}`, async ({ page }) => {
    await page.addInitScript(([l, th]) => { try { localStorage.setItem("kiorly.lang", l); localStorage.setItem("kx-theme", th); } catch { /* ignore */ } }, [lang, theme]);
    await page.goto("/login");
    await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    await audit(page, `login-${lang}`);
    await showPasswordForm(page);
    await audit(page, `login-password-${lang}`);
    await login(page, demo.owner, lang);
    await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    for (const path of ["/", "/pos", "/catalogue", "/inventory", "/rx", "/orders", "/receiving", "/purchasing", "/reports", "/settings"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await audit(page, `${path}-${lang}-${theme}`);
      if (path === "/inventory") for (const tab of [1, 2]) { await page.getByRole("tab").nth(tab).click(); await page.waitForLoadState("networkidle"); await audit(page, `${path}#${tab}-${lang}-${theme}`); }
    }
  });
}

test("keyboard: skip link, tab order reaches the POS scan field", async ({ page }) => {
  await login(page, demo.cashier);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.goto("/pos");
  await expect(page.getByLabel("Scan barcode or type a name")).toBeFocused();
});
