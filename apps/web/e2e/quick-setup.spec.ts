import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { API, showPasswordForm } from "./helpers";

/**
 * Quick setup (Pharmacy). Every test starts from a FRESH self-serve pharmacy (POST /onboarding/signup), never from seeded demo data.
 * Per step: the click opens the right screen (deep link + bar "Step n of N" + first field focused), the real data change flips the step to done by itself
 * (data-status + data-just-done = the animation state), the next step is highlighted, progress moves, and it persists after a reload.
 */
const PASSWORD = "demopass8";
let seq = 0;
const uniq = () => `${Date.now()}${++seq}`;
type Org = { email: string; tenantId: string; branchId: string; token: string };

async function freshPharmacy(request: APIRequestContext, o: { chain?: boolean } = {}): Promise<Org> {
  const email = `qs.ph.${uniq()}@example.com`;
  const r = await request.post(`${API}/api/v1/onboarding/signup`, { data: { pharmacyName: `QS Pharmacy ${uniq().slice(-5)}`, ownerName: "QS Owner", email, password: PASSWORD } });
  expect(r.ok(), await r.text()).toBeTruthy();
  const { tenantId, branchId } = (await r.json()) as { tenantId: string; branchId: string };
  if (o.chain) execFileSync("/Users/postgres/bin/psql", ["-h", "127.0.0.1", "-p", "5433", "-U", "postgres", "-d", "kiorly_pharmacy", "-c", `update "Tenant" set edition='CHAIN' where id='${tenantId}'`], { env: { ...process.env, PGPASSWORD: "postgres" }, stdio: "ignore" });
  return { email, tenantId, branchId, token: await token(request, email) };
}
async function token(request: APIRequestContext, email: string) {
  const r = await request.post(`${API}/api/v1/auth/login`, { data: { email, password: PASSWORD } });
  expect(r.ok(), await r.text()).toBeTruthy();
  return ((await r.json()) as { accessToken: string }).accessToken;
}
const auth = (t: string) => ({ Authorization: `Bearer ${t}` });
async function uiLogin(page: Page, email: string, lang: "en" | "ar" = "en") {
  await page.addInitScript((l) => { try { localStorage.setItem("kiorly.lang", l); } catch { /* ignore */ } }, lang);
  await page.goto("/login");
  await showPasswordForm(page);
  await page.getByLabel(lang === "en" ? "Email" : "البريد الإلكتروني").fill(email);
  await page.getByLabel(lang === "en" ? "Password" : "كلمة المرور").fill(PASSWORD);
  await page.getByRole("button", { name: lang === "en" ? "Sign in" : "تسجيل الدخول", exact: true }).click();
  // a brand-new pharmacy first lands on the one-time first-run page; "Finish setup" leaves it (its branch fields are optional) and opens the dashboard
  const finish = page.getByRole("button", { name: lang === "en" ? "Finish setup" : "إنهاء الإعداد" });
  await expect(page.getByRole("navigation").or(finish).first()).toBeVisible();
  if (await finish.isVisible()) await finish.click();
  await expect(page.getByRole("navigation")).toBeVisible();
}
const checklist = (p: Page) => p.getByTestId("setup-checklist");
const row = (p: Page, k: string) => p.locator(`[data-testid="setup-step"][data-step="${k}"]`);
const bar = (p: Page) => p.getByTestId("setup-bar");
const pct = async (p: Page) => Number(await p.getByTestId("setup-progressbar").getAttribute("aria-valuenow"));
async function openStep(p: Page, key: string, url: RegExp) {
  await row(p, key).getByTestId("setup-cta").click();
  await expect(p).toHaveURL(url);
  await expect(bar(p)).toHaveAttribute("data-step", key);
  await expect(p.getByTestId("setup-bar-back")).toBeVisible();
  await expect(p.getByTestId("setup-bar-skip")).toBeVisible();
}
async function flips(p: Page, key: string, next: string | null) {
  await expect(bar(p)).toHaveAttribute("data-success", "true", { timeout: 25_000 });
  await expect(p).toHaveURL(/\/$/, { timeout: 15_000 });
  await expect(row(p, key)).toHaveAttribute("data-status", "done");
  await expect(row(p, key)).toHaveAttribute("data-just-done", "true");
  if (next) await expect(row(p, next)).toHaveAttribute("data-next", "true");
}
async function axe(p: Page, include: string) {
  await p.waitForTimeout(1500);
  const r = await new AxeBuilder({ page: p }).include(include).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
}
async function otcDrug(request: APIRequestContext, t: string) {
  const page = (await (await request.get(`${API}/api/v1/catalogue/drugs?pageSize=50`, { headers: auth(t) })).json()) as { items?: { id: string; rxOnly?: boolean; controlled?: boolean; controlledSchedule?: string }[] } | { id: string }[];
  const items = (Array.isArray(page) ? page : page.items ?? []) as { id: string; rxOnly?: boolean; controlledSchedule?: string }[];
  return (items.find((d) => !d.rxOnly && (!d.controlledSchedule || d.controlledSchedule === "NONE")) ?? items[0]!).id;
}


test("Pharmacy journey: every step opens its screen, detects completion, animates and moves on", async ({ page, request }) => {
  const org = await freshPharmacy(request);
  await uiLogin(page, org.email);
  await expect(checklist(page)).toBeVisible();
  expect(await pct(page)).toBe(0);
  await expect(row(page, "branch_licence")).toHaveAttribute("data-next", "true");
  await axe(page, "[data-testid=setup-checklist]");

  // 1 branch licence + address (single branch: no nesting, direct deep link)
  await openStep(page, "branch_licence", /\/settings\?tab=branches.*entity=/);
  await expect(page.getByTestId("setup-bar-count")).toContainText(/Step 1 of \d+/);
  await expect(page.locator('[data-setup-target="branch_licence"]')).toBeFocused({ timeout: 15_000 });
  await page.locator('[data-setup-target="branch_licence"]').fill("EDA-QS-1001");
  await page.getByLabel("Address").fill("12 Nile Street, Cairo");
  await page.getByTestId("branch-licence-form").getByRole("button", { name: "Save" }).click();
  await flips(page, "branch_licence", "pharmacist_licence");
  const p1 = await pct(page);
  expect(p1).toBeGreaterThan(0);
  await page.reload();
  await expect(row(page, "branch_licence")).toHaveAttribute("data-status", "done");
  expect(await pct(page)).toBe(p1);

  // 2 a licensed pharmacist (staff form)
  await openStep(page, "pharmacist_licence", /\/settings\?tab=staff/);
  await page.getByRole("button", { name: "Add staff" }).click();
  await page.getByLabel("Name", { exact: true }).fill("QS Pharmacist");
  await page.getByLabel("Email", { exact: true }).fill(`qs.rph.${uniq()}@example.com`);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Role", { exact: true }).selectOption("PHARMACIST");
  await page.getByLabel(/syndicate licence/i).fill("SYN-QS-7788");
  await page.getByRole("button", { name: "Save", exact: true }).last().click();
  await flips(page, "pharmacist_licence", "drug_prices");

  // 3-4 prices and first stock: the page opens by itself; the data change (API) flips the step with no reload
  await openStep(page, "drug_prices", /\/catalogue/);
  const drug = await otcDrug(request, org.token);
  expect((await request.post(`${API}/api/v1/catalogue/prices/bulk`, { headers: auth(org.token), data: { effectiveFrom: "2026-01-01", items: [{ drugId: drug, price: "25.00" }] } })).ok()).toBeTruthy();
  await flips(page, "drug_prices", "first_stock");
  await openStep(page, "first_stock", /\/receiving/);
  expect((await request.post(`${API}/api/v1/inventory/receipts`, { headers: auth(org.token), data: { lines: [{ drugId: drug, lotNumber: "QS-LOT-1", expiryDate: "2028-12-31", quantity: 20, unitCost: "10.00" }] } })).ok()).toBeTruthy();
  await flips(page, "first_stock", "receipt_settings");

  // 5 first sale at the counter
  await openStep(page, "first_sale", /\/pos/);
  const shift = await request.post(`${API}/api/v1/pos/shifts/open`, { headers: auth(org.token), data: { openingFloat: "100" } });
  expect(shift.ok(), await shift.text()).toBeTruthy();
  const sale = await request.post(`${API}/api/v1/pos/sales`, { headers: auth(org.token), data: { idempotencyKey: `qs-sale-${uniq()}`, lines: [{ drugId: drug, quantity: 1 }], payments: [{ method: "CASH", amount: "25.00" }] } });
  expect(sale.ok(), await sale.text()).toBeTruthy();
  await flips(page, "first_sale", "receipt_settings");
  await expect(row(page, "invite_staff")).toHaveAttribute("data-status", "done"); // the pharmacist added in step 2 is also "a team member"

  // optional steps: skip one, open Connect to Kiorex (owner only), then everything required is done
  await row(page, "receipt_settings").getByTestId("setup-skip").click();
  await expect(row(page, "receipt_settings")).toHaveAttribute("data-status", "skipped");
  await openStep(page, "connect_kiorex", /\/kiorex-connect/);
  await page.getByTestId("setup-bar-back").click();
  await expect(checklist(page)).toBeVisible();
  expect(await pct(page)).toBeGreaterThanOrEqual(85); // 7 of 8 units: only the optional Kiorex connection is left
});

test("Pharmacy multi-branch: per-branch rows with their own state and deep link; a new branch reopens the step", async ({ page, request }) => {
  const org = await freshPharmacy(request, { chain: true });
  const b2 = await request.post(`${API}/api/v1/branches`, { headers: auth(org.token), data: { name: "QS Branch Zamalek" } });
  expect(b2.ok(), await b2.text()).toBeTruthy();
  const second = ((await b2.json()) as { id: string }).id;
  await uiLogin(page, org.email);
  const step = row(page, "branch_licence");
  await expect(step.getByTestId("setup-aggregate")).toHaveText(/0 of 2/);
  const tg = step.getByTestId("setup-toggle");
  if ((await tg.getAttribute("aria-expanded")) !== "true") await tg.click(); // the highlighted step starts expanded
  await expect(step.getByTestId("setup-entity")).toHaveCount(2);
  // open the second branch: the deep link carries its id and the form preselects it
  await step.locator(`[data-entity="${second}"]`).getByTestId("setup-entity-cta").click();
  await expect(page).toHaveURL(new RegExp(`entity=${second}`));
  await expect(bar(page)).toContainText("QS Branch Zamalek");
  await page.locator('[data-setup-target="branch_licence"]').fill("EDA-QS-2002");
  await page.getByLabel("Address").fill("3 Zamalek Street");
  await page.getByTestId("branch-licence-form").getByRole("button", { name: "Save" }).click();
  await expect(bar(page)).toHaveAttribute("data-success", "true", { timeout: 25_000 });
  await expect(page).toHaveURL(/\/$/);
  await expect(step.getByTestId("setup-aggregate")).toHaveText(/1 of 2/);
  await expect(step).toHaveAttribute("data-status", "pending");
  await expect(step.locator(`[data-entity="${second}"]`)).toHaveAttribute("data-status", "done");
  // finish the first branch -> the step is done; a third branch added later reopens it
  const first = (await (await request.get(`${API}/api/v1/branches`, { headers: auth(org.token) })).json()) as { id: string }[];
  const firstId = first.find((b) => b.id !== second)!.id;
  expect((await request.patch(`${API}/api/v1/branches/${firstId}`, { headers: auth(org.token), data: { licenceNo: "EDA-QS-1", address: "1 Maadi" } })).ok()).toBeTruthy();
  await expect(row(page, "branch_licence")).toHaveAttribute("data-status", "done", { timeout: 45_000 });
  expect((await request.post(`${API}/api/v1/branches`, { headers: auth(org.token), data: { name: "QS Branch Heliopolis" } })).ok()).toBeTruthy();
  await page.reload();
  await expect(row(page, "branch_licence")).toHaveAttribute("data-status", "pending");
  await expect(row(page, "branch_licence").getByTestId("setup-aggregate")).toHaveText(/2 of 3/);
  // collapse / expand the whole checklist
  await page.getByTestId("setup-collapse").click();
  await expect(page.getByTestId("setup-steps")).toBeHidden();
  await page.getByTestId("setup-collapse").click();
  await expect(page.getByTestId("setup-steps")).toBeVisible();
});

test("Pharmacy role-restricted: a cashier sees who can do owner steps, never a dead click; Connect to Kiorex is hidden", async ({ page, request }) => {
  const org = await freshPharmacy(request);
  const cashier = `qs.cashier.${uniq()}@example.com`;
  const mk = await request.post(`${API}/api/v1/staff`, { headers: auth(org.token), data: { displayName: "QS Cashier", email: cashier, password: PASSWORD, role: "CASHIER" } });
  expect(mk.ok(), await mk.text()).toBeTruthy();
  await uiLogin(page, cashier);
  await expect(checklist(page)).toBeVisible();
  await expect(row(page, "branch_licence").getByTestId("setup-cta-disabled")).toBeDisabled();
  await expect(row(page, "branch_licence").getByTestId("setup-ask-owner")).toContainText("Ask the owner");
  await expect(row(page, "branch_licence").getByTestId("setup-ask-owner")).toContainText("Owner");
  await expect(row(page, "connect_kiorex")).toHaveCount(0);
  await expect(row(page, "first_sale").getByTestId("setup-cta")).toBeEnabled();
  // the server refuses too (no dead click, no bypass)
  const t = await token(request, cashier);
  expect((await request.patch(`${API}/api/v1/setup/steps/receipt_settings`, { headers: auth(t), data: { action: "skip" } })).status()).toBe(403);
  expect((await request.patch(`${API}/api/v1/setup/steps/first_sale`, { headers: auth(org.token), data: { action: "complete" } })).status()).toBe(400);
});

test("Pharmacy completion state, dismissal remembered per organisation, Arabic RTL dark, responsive 360-2560", async ({ page, request }) => {
  const org = await freshPharmacy(request);
  // everything done through real data
  const drug = await otcDrug(request, org.token);
  const H = auth(org.token);
  await request.patch(`${API}/api/v1/branches/${org.branchId}`, { headers: H, data: { licenceNo: "EDA-QS-9", address: "9 Cairo Rd" } });
  await request.post(`${API}/api/v1/staff`, { headers: H, data: { displayName: "QS RPh", email: `qs.rph.${uniq()}@example.com`, password: PASSWORD, role: "PHARMACIST", pharmacistLicenceNo: "SYN-1" } });
  await request.post(`${API}/api/v1/catalogue/prices/bulk`, { headers: H, data: { effectiveFrom: "2026-01-01", items: [{ drugId: drug, price: "25.00" }] } });
  await request.post(`${API}/api/v1/inventory/receipts`, { headers: H, data: { lines: [{ drugId: drug, lotNumber: "QS-LOT-2", expiryDate: "2028-12-31", quantity: 20, unitCost: "10.00" }] } });
  await request.post(`${API}/api/v1/pos/shifts/open`, { headers: H, data: { openingFloat: "100" } });
  await request.post(`${API}/api/v1/pos/sales`, { headers: H, data: { idempotencyKey: `qs-sale-${uniq()}`, lines: [{ drugId: drug, quantity: 1 }], payments: [{ method: "CASH", amount: "25.00" }] } });
  await request.patch(`${API}/api/v1/settings`, { headers: H, data: { receipt: { header: "QS Pharmacy", footer: "Thank you" } } });
  for (const k of ["invite_staff", "connect_kiorex"]) await request.patch(`${API}/api/v1/setup/steps/${k}`, { headers: H, data: { action: "skip" } });
  const plan0 = (await (await request.get(`${API}/api/v1/setup`, { headers: H })).json()) as { allDone: boolean; steps: { key: string; status: string }[] };
  expect(plan0.steps.filter((s) => s.status === "pending").map((s) => s.key), "steps still pending after the data setup").toEqual([]);
  await page.addInitScript(() => { try { localStorage.setItem("kx-theme", "dark"); } catch { /* ignore */ } });
  await uiLogin(page, org.email, "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByTestId("setup-complete")).toBeVisible();
  await expect(checklist(page)).toHaveAttribute("data-all-done", "true");
  for (const w of [360, 768, 1440, 2560]) {
    await page.setViewportSize({ width: w, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), `no horizontal scroll at ${w}`).toBe(true);
  }
  await axe(page, "[data-testid=setup-checklist]");
  await page.getByTestId("setup-dismiss").click();
  await expect(checklist(page)).toHaveCount(0);
  await page.reload();
  await expect(checklist(page)).toHaveCount(0); // remembered on the server, per organisation
  const t = await token(request, org.email);
  const plan = (await (await request.get(`${API}/api/v1/setup`, { headers: auth(t) })).json()) as { dismissedAt: string | null; allDone: boolean };
  expect(plan.allDone && plan.dismissedAt).toBeTruthy();
});
