// Usage: node scripts/ui-shots.mjs <before|after> — key screens (EN light/dark, AR light) into _docs/ui-review/pharmacy.
import { chromium } from "@playwright/test";
import path from "node:path";
const phase = process.argv[2] ?? "after";
const base = process.env.BASE ?? "http://localhost:5190";
const out = path.resolve(process.cwd(), "../../../_docs/ui-review/pharmacy");
const routes = ["/", "/pos", "/rx", "/inventory", "/catalogue", "/reports", "/orders"];
const browser = await chromium.launch();
for (const mode of [{ n: "en-light", lang: "en", dark: false }, { n: "en-dark", lang: "en", dark: true }, { n: "ar-light", lang: "ar", dark: false }]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: mode.dark ? "dark" : "light" });
  await ctx.addInitScript(([l, d]) => { try { localStorage.setItem("kiorly.lang", l); localStorage.setItem("kx-theme", d ? "dark" : "light"); } catch {} }, [mode.lang, mode.dark]);
  const page = await ctx.newPage();
  await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  if (mode.n === "en-light") await page.screenshot({ path: `${out}/${phase}-login-${mode.n}.png` });
  await page.locator('input[type=email]').fill("pharmacist@demo.kiorly.local");
  await page.locator('input[type=password]').fill("Demo@12345");
  await page.locator("button[type=submit]").click();
  await page.waitForURL((u) => !u.pathname.includes("login"), { timeout: 30000 }).catch(() => {});
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/${phase}-${(r.replace(/\//g, "_").slice(1) || "home")}-${mode.n}.png` });
  }
  await ctx.close();
}
await browser.close();
