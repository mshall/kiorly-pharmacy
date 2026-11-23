// Usage: node scripts/ui-shots.mjs <tag> [viewFilter] — EN/AR x light/dark x desktop(1440)/phone(390) into _docs/ui-review/pharmacy/<tag>-<view>-<lang>-<theme>-<vp>.png
import { chromium } from "@playwright/test";
import path from "node:path";
const tag = process.argv[2] ?? "after";
const only = process.argv[3];
const base = process.env.BASE ?? "http://localhost:5190";
const out = path.resolve(process.cwd(), "../../../_docs/ui-review/pharmacy");
const first = (page, sel) => page.locator(sel).first();
const settle = (page, ms = 900) => page.waitForTimeout(ms);
/** name, route, optional interaction (runs after navigation). `modal` views are captured at viewport size, the rest full page. */
const views = [
  { n: "login", route: "/login", anon: true },
  { n: "dashboard", route: "/" },
  { n: "pos", route: "/pos" },
  { n: "pos-pay", route: "/pos", modal: true, run: async (p) => { await p.locator("#pos-scan").fill("a"); await settle(p, 900); await first(p, 'ul[aria-label] button').click(); await first(p, 'ul[aria-label] button').click(); await p.locator("#pos-scan").press("F9"); await settle(p, 800); } },
  { n: "rx", route: "/rx" },
  { n: "rx-detail", route: "/rx", run: async (p) => { await first(p, "main tbody tr button").click(); await settle(p, 1200); } },
  { n: "catalogue", route: "/catalogue" },
  { n: "catalogue-price", route: "/catalogue", modal: true, run: async (p) => { await first(p, "main tbody tr button").click(); await settle(p, 1200); } },
  { n: "inventory-stock", route: "/inventory" },
  { n: "inventory-lots", route: "/inventory", run: async (p) => { await p.getByRole("tab").nth(1).click(); await settle(p, 1000); } },
  { n: "inventory-expiry", route: "/inventory", run: async (p) => { await p.getByRole("tab").nth(2).click(); await settle(p, 1000); } },
  { n: "receiving", route: "/receiving", run: async (p) => { const s = p.getByLabel(/search product|ابحث/i).first(); await s.fill("amox").catch(() => {}); await settle(p, 1000); await p.locator("ul li button").first().click().catch(() => {}); await settle(p, 400); } },
  { n: "purchasing-suppliers", route: "/purchasing" },
  { n: "purchasing-pos", route: "/purchasing", run: async (p) => { await p.getByRole("tab").nth(1).click(); await settle(p, 1000); } },
  { n: "purchasing-reorder", route: "/purchasing", run: async (p) => { await p.getByRole("tab").nth(2).click(); await settle(p, 1200); } },
  { n: "orders", route: "/orders" },
  { n: "orders-all", route: "/orders", run: async (p) => { await p.getByRole("radio").last().check({ force: true }); await settle(p, 800); } },
  { n: "orders-accept", route: "/orders", modal: true, run: async (p) => { await p.getByRole("radio").last().check({ force: true }); await settle(p, 500); await p.getByRole("button", { name: /^(Accept|قبول)$/ }).first().click(); await settle(p, 700); } },
  { n: "reports-sales", route: "/reports" },
  { n: "reports-top", route: "/reports", run: async (p) => { await p.locator("main select").first().selectOption("top-sellers"); await settle(p, 1200); } },
  { n: "reports-expiry", route: "/reports", run: async (p) => { await p.locator("main select").first().selectOption("expiry"); await settle(p, 1200); } },
  { n: "reports-suppliers", route: "/reports", run: async (p) => { await p.locator("main select").first().selectOption("supplier-balances"); await settle(p, 1200); } },
  { n: "settings", route: "/settings" },
  { n: "settings-staff", route: "/settings", run: async (p) => { await p.getByRole("tab").nth(1).click(); await settle(p, 900); } },
  { n: "settings-roles", route: "/settings", run: async (p) => { await p.getByRole("tab").nth(2).click(); await settle(p, 900); } },
  { n: "settings-market", route: "/settings", run: async (p) => { await p.getByRole("tab").nth(4).click(); await settle(p, 900); } },
];
const browser = await chromium.launch();
const modes = [["en", false], ["en", true], ["ar", false], ["ar", true]];
const vps = [["desktop", 1440, 900], ["phone", 390, 844]];
for (const [lang, dark] of modes) for (const [vp, w, h] of vps) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: dark ? "dark" : "light", deviceScaleFactor: vp === "phone" ? 2 : 1 });
  await ctx.addInitScript(([l, d]) => { try { localStorage.setItem("kiorly.lang", l); localStorage.setItem("kx-theme", d ? "dark" : "light"); } catch {} }, [lang, dark]);
  const page = await ctx.newPage(); page.setDefaultTimeout(8000);
  const suffix = `${lang}-${dark ? "dark" : "light"}-${vp}`;
  await page.goto(`${base}/login`, { waitUntil: "domcontentloaded" });
  await settle(page, 700);
  for (const v of views.filter((x) => x.anon && (!only || x.n.includes(only)))) await page.screenshot({ path: `${out}/${tag}-${v.n}-${suffix}.png` });
  { const t = page.getByTestId("signin-method-password"); await t.waitFor({ state: "visible", timeout: 8000 }).then(() => t.click()).catch(() => {}); }
  await page.locator("input[type=email]").fill("owner@demo.kiorly.local");
  await page.locator("input[type=password]").fill("Demo@12345");
  await page.locator("button[type=submit]").click();
  await page.waitForURL((u) => !u.pathname.includes("login"), { timeout: 30000 }).catch(() => {});
  for (const v of views.filter((x) => !x.anon && (!only || x.n.includes(only)))) {
    try {
      await page.goto(base + v.route, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});
      await settle(page, 700);
      if (v.run) await v.run(page);
      await page.screenshot({ path: `${out}/${tag}-${v.n}-${suffix}.png`, fullPage: !v.modal });
    } catch (e) { console.log("skip", v.n, suffix, String(e).split("\n")[0]); }
  }
  await ctx.close();
}
await browser.close();
