import { expect, test, type Page } from "@playwright/test";

/**
 * Crash sweep (Pharmacy): every web route as each role, English and Arabic, light and dark. Fails on console errors, React warnings (update
 * depth, hooks, keys), uncaught exceptions, an error boundary on screen and API 5xx (retried once). Narrow with SWEEP_ROLES / SWEEP_LOCALES / SWEEP_THEMES.
 */
const API = process.env.SWEEP_API ?? `${process.env.PHARMACY_API_ORIGIN ?? "http://127.0.0.1:3100"}/api/v1`;
const FATAL = /Maximum update depth|Too many re-renders|Rendered (more|fewer) hooks|Invalid hook call|Cannot update a component|Hooks can only be called|getSnapshot should be cached|Objects are not valid as a React child|The above error occurred/i;
const IGNORED = [/Failed to load resource/i, /favicon/i, /ResizeObserver loop/i, /\[vite\]/i, /Download the React DevTools/i];

const ROLES = { owner: "owner", manager: "manager", pharmacist: "pharmacist", cashier: "cashier", assistant: "assistant" } as Record<string, string>;
const ROUTES: string[] = ["/", "/pos", "/rx", "/rx/:rxId", "/customers", "/controlled", "/promotions", "/finance", "/audit", "/notifications", "/safety", "/orders", "/catalogue", "/inventory", "/receiving", "/purchasing", "/reports", "/settings", "/settings?tab=branches", "/settings?tab=staff", "/settings?tab=receipt", "/kiorex-connect", "/kiorex-connect/steps"];

const pick = (name: string, all: string[]) => (process.env[name] ? process.env[name]!.split(",") : all);
const roles = pick("SWEEP_ROLES", Object.keys(ROLES));
const locales = pick("SWEEP_LOCALES", ["en", "ar"]) as Array<"en" | "ar">;
const themes = pick("SWEEP_THEMES", ["light", "dark"]) as Array<"light" | "dark">;

const PASSWORD = "Demo@12345";
async function loginToken(request: import("@playwright/test").APIRequestContext, role: string): Promise<string> {
  const r = await request.post(`${API}/auth/login`, { data: { email: `${ROLES[role]}@demo.kiorly.local`, password: PASSWORD } });
  expect(r.ok(), await r.text()).toBeTruthy();
  return ((await r.json()) as { accessToken: string }).accessToken;
}
async function dynamicIds(request: import("@playwright/test").APIRequestContext, token: string): Promise<Record<string, string>> {
  const r = await request.get(`${API}/prescriptions`, { headers: { Authorization: `Bearer ${token}` } });
  const body = r.ok() ? ((await r.json()) as { items?: { id: string }[] }) : {};
  return { rxId: body.items?.[0]?.id ?? "" };
}

function watch(page: Page) {
  const findings: string[] = [];
  page.on("console", (m) => {
    const text = m.text();
    if (m.type() !== "error" && m.type() !== "warning") return;
    if (m.type() === "warning" && !FATAL.test(text) && !/Warning:|React will try|validateDOMNesting|unique "key"/i.test(text)) return;
    if (IGNORED.some((re) => re.test(text)) && !FATAL.test(text)) return;
    findings.push(`[console.${m.type()}] ${text.replace(/\s+/g, " ").slice(0, 300)}`);
  });
  page.on("pageerror", (e) => findings.push(`[pageerror] ${e.message.slice(0, 300)}`));
  page.on("response", (r) => { if (r.status() >= 500 && r.url().includes("/api/")) findings.push(`[http${r.status()}] ${r.request().method()} ${r.url()}`); });
  return findings;
}

for (const roleName of roles) {
  for (const locale of locales) {
    for (const theme of themes) {
      test(`sweep ${roleName} ${locale} ${theme}`, async ({ page, request }) => {
        test.setTimeout(600_000);
        const token = await loginToken(request, roleName);
        const ids = await dynamicIds(request, token);
        await page.addInitScript(([t, l, th]) => {
          try { localStorage.setItem("kiorly.token", t!); localStorage.setItem("kiorly.lang", l!); localStorage.setItem("kx-theme", th!); } catch { /* ignore */ }
        }, [token, locale, theme]);
        const findings = watch(page);
        const failures: string[] = [];
        for (const template of ROUTES) {
          const path = template.replace(/:(\w+)/g, (_m, k: string) => ids[k] ?? "missing");
          if (path.includes("/missing")) continue;
          const visit = async () => {
            findings.length = 0;
            await page.goto(path, { waitUntil: "domcontentloaded" });
            await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => undefined);
            await page.waitForTimeout(500);
          };
          await visit();
          if (path === "/") await expect(page.getByRole("navigation").first(), "signed in: the app shell is on screen").toBeVisible();
          if (findings.some((f) => f.startsWith("[http5"))) await visit();
          const crashed = await page.getByText(/Unexpected Application Error|Something went wrong|حدث خطأ غير متوقع/i).first().isVisible().catch(() => false);
          const dir = await page.evaluate(() => document.documentElement.dir);
          if (dir !== (locale === "ar" ? "rtl" : "ltr")) failures.push(`${path}: dir=${dir}`);
          const dark = await page.evaluate(() => document.documentElement.classList.contains("dark") || document.documentElement.dataset.theme === "dark");
          if (theme === "dark" && !dark) failures.push(`${path}: dark theme not applied`);
          if (crashed) failures.push(`${path}: error boundary visible`);
          for (const f of findings) failures.push(`${path}: ${f}`);
        }
        expect(failures, failures.join("\n")).toEqual([]);
      });
    }
  }
}
