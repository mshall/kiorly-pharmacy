import { expect, test } from "@playwright/test";
import { API, apiLogin, demo, login } from "./helpers";

test("POS: sells offline from the local catalogue, queues, and reconciles on reconnect (PH-SS03)", async ({ page, context, request }) => {
  await login(page, demo.cashier);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Point of sale" }).click();
  const open = page.getByRole("button", { name: "Open shift" });
  if (await open.isVisible().catch(() => false)) { await open.click(); await page.getByLabel("Opening cash float").fill("200"); await page.getByRole("button", { name: "Confirm" }).click(); }
  await expect(page.getByText("Shift open")).toBeVisible();
  const firstItem = page.getByRole("list", { name: "Products" }).getByRole("button").first();
  await expect(firstItem).toBeVisible();   // local catalogue loaded into IndexedDB

  await context.setOffline(true);
  await expect(page.getByTestId("online-status")).toHaveText("Offline");
  await firstItem.click();
  await page.getByRole("button", { name: "Pay", exact: true }).click();
  await page.getByRole("button", { name: "Add payment" }).click();      // defaults to the amount due, cash
  await page.getByRole("button", { name: "Complete sale" }).click();
  await expect(page.getByText("Saved offline").first()).toBeVisible();
  await page.getByRole("button", { name: "New sale" }).click();
  await expect(page.getByText("1 sale(s) queued offline")).toBeVisible();

  await context.setOffline(false);
  await expect(page.getByText("sale(s) queued offline")).toBeHidden({ timeout: 30_000 });   // auto-sync on reconnect
  const token = await apiLogin(request, demo.cashier);
  const sales = await (await request.get(`${API}/api/v1/pos/sales`, { headers: { Authorization: `Bearer ${token}` } })).json();
  expect(sales.items.some((s: { offline: boolean }) => s.offline)).toBeTruthy();
});
