import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { API, apiLogin, demo, login } from "./helpers";

/** Staff management (Settings > Staff and roles): add, edit phone/role/active, validation, AR + RTL, accessibility. */
const uniq = () => Math.random().toString(36).slice(2, 8);
const phoneFor = () => `+2012${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`;

test("owner adds a staff member with a phone, edits it, deactivates; bad and duplicate numbers are refused in the form", async ({ page, request }) => {
  await login(page, demo.owner);
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Staff and roles" }).click();
  const id = uniq(); const phone = phoneFor(); const email = `ui.${id}@demo.kiorly.local`;

  await page.getByRole("button", { name: "Add staff" }).click();
  const dlg = page.getByRole("dialog", { name: "Add staff" });
  await dlg.getByLabel("Name").fill(`UI Cashier ${id}`);
  await dlg.getByLabel("Email").fill(email);
  await dlg.getByLabel("Password", { exact: true }).fill("Passw0rd!x");
  await dlg.getByLabel("Mobile number").fill("0100");
  await expect(dlg.getByText("Use the international format")).toBeVisible();
  await expect(dlg.getByRole("button", { name: "Save" })).toBeDisabled();
  await dlg.getByLabel("Mobile number").fill(phone.replace("+20", "+20 "));
  await dlg.getByRole("button", { name: "Save" }).click();
  const row = page.getByTestId(`staff-row-${email}`);
  await expect(row).toBeVisible();
  await expect(row.getByText(phone)).toBeVisible();
  await expect(row.getByText("Waiting for first sign-in")).toBeVisible();

  // a duplicate number is refused by the API and shown as a readable message
  await page.getByRole("button", { name: "Add staff" }).click();
  const dup = page.getByRole("dialog", { name: "Add staff" });
  await dup.getByLabel("Name").fill("Dup");
  await dup.getByLabel("Email").fill(`dup.${email}`);
  await dup.getByLabel("Password", { exact: true }).fill("Passw0rd!x");
  await dup.getByLabel("Mobile number").fill(phone);
  await dup.getByRole("button", { name: "Save" }).click();
  await expect(dup.getByText("Another staff member already uses this phone number.")).toBeVisible();
  await dup.getByRole("button", { name: "Cancel" }).click();

  // edit: change role, phone; clear nothing else
  const phone2 = phoneFor();
  await row.getByRole("button", { name: /Edit staff member/ }).click();
  const ed = page.getByRole("dialog", { name: "Edit staff member" });
  await ed.getByLabel("Role").selectOption("ASSISTANT");
  await ed.getByLabel("Mobile number").fill(phone2);
  await ed.getByRole("button", { name: "Save" }).click();
  await expect(row.getByText(phone2)).toBeVisible();
  await expect(row.getByText("Pharmacy assistant")).toBeVisible();

  // deactivate from the row, then check the API agrees
  await row.getByRole("button", { name: "Deactivate" }).click();
  await expect(row.getByText("Inactive")).toBeVisible();
  const owner = await apiLogin(request, demo.owner);
  const list = await (await request.get(`${API}/api/v1/staff`, { headers: { Authorization: `Bearer ${owner}` } })).json();
  expect(list.find((s: { email: string }) => s.email === email)).toMatchObject({ phone: phone2, role: "ASSISTANT", active: false, passportLinked: false });
});

test("non-owners do not see the Staff tab; the API refuses them too", async ({ page, request }) => {
  await login(page, demo.cashier);
  await page.goto("/settings");
  await expect(page.getByRole("tab", { name: "Staff and roles" })).toHaveCount(0);
  const cashier = await apiLogin(request, demo.cashier);
  expect((await request.get(`${API}/api/v1/staff`, { headers: { Authorization: `Bearer ${cashier}` } })).status()).toBe(403);
});

for (const [lang, theme] of [["en", "light"], ["ar", "light"], ["ar", "dark"]] as const) {
  test(`staff screen in ${lang} ${theme}: direction, phone stays LTR, no serious accessibility violations`, async ({ page }) => {
    await page.addInitScript(([l, th]) => { try { localStorage.setItem("kiorly.lang", l); localStorage.setItem("kx-theme", th); } catch { /* ignore */ } }, [lang, theme]);
    await login(page, demo.owner, lang);
    await page.goto("/settings");
    await page.getByRole("tab", { name: lang === "ar" ? "الموظفون والأدوار" : "Staff and roles" }).click();
    await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    await page.waitForLoadState("networkidle");
    const phoneCell = page.locator("bdi[dir=ltr]").first();
    await expect(phoneCell).toBeVisible();
    for (const open of [false, true]) {
      if (open) { await page.getByRole("button", { name: lang === "ar" ? "إضافة موظف" : "Add staff" }).click(); await expect(page.getByRole("dialog")).toBeVisible(); await expect(page.getByLabel(lang === "ar" ? "رقم الموبايل" : "Mobile number", { exact: true })).toHaveAttribute("dir", "ltr"); await page.waitForTimeout(500); /* let the dialog finish its open animation before measuring contrast */ }
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      const bad = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(bad.map((v) => `${v.id} (${v.nodes.length})`), JSON.stringify(bad.map((v) => ({ id: v.id, n: v.nodes.slice(0, 2).map((x) => x.html) })))).toEqual([]);
    }
  });
}
