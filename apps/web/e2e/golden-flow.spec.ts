import { expect, test } from "@playwright/test";
import { API, apiLogin, demo, login, sendERx, sendKiorexOrder } from "./helpers";

/** Golden flow (KX-06 §04): Rx -> safety checks -> pharmacist sign-off -> dispense -> stock decrement -> event. */
test.describe("golden flow", () => {
  test("e-Rx from Kiorly -> validate -> dispense -> stock decrements", async ({ page, request }) => {
    const token = await apiLogin(request, demo.pharmacist);
    const stock = async () => {
      const r = await request.get(`${API}/api/v1/inventory/stock`, { params: { q: "Amoxirex" }, headers: { Authorization: `Bearer ${token}` } });
      return (await r.json()).items.reduce((a: number, i: { onHand: number }) => a + i.onHand, 0) as number;
    };
    const before = await stock();
    const { prescriptionId } = await sendERx(request, "amoxicillin", "500 mg", 1);

    await login(page, demo.pharmacist);
    await page.goto(`/rx/${prescriptionId}`);
    await expect(page.getByRole("heading", { name: "Prescription" })).toBeVisible();
    await page.getByRole("button", { name: "Validate prescription" }).click();
    await expect(page.getByText("Prescription validated")).toBeVisible();

    // ingredient-only e-Rx line: pick a product to dispense
    await page.getByRole("combobox", { name: "Product to dispense" }).selectOption({ index: 1 });
    await page.getByRole("button", { name: "Run safety checks and reserve stock" }).click();
    for (const c of ["Drug interactions", "Allergies", "Duplicate therapy", "Dose / quantity", "Prescriber and validity", "Controlled-medicine limit"]) await expect(page.getByText(c, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Sign off as pharmacist" }).click();
    await expect(page.getByText("Signed off", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Dispense", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Dispensed", exact: true })).toBeVisible();
    expect(await stock()).toBe(before - 1);
  });

  test("Kiorex order -> accept -> sign-off -> ready -> dispense -> OrderReady + DispenseCompleted events", async ({ page, request }) => {
    const owner = await apiLogin(request, demo.owner);
    const me = await (await request.get(`${API}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${owner}` } })).json();
    const branchId = me.branches.find((b: { code: string }) => b.code === "MAIN").id as string;
    const lots = await (await request.get(`${API}/api/v1/pos/offline-bundle`, { params: { branchId }, headers: { Authorization: `Bearer ${owner}` } })).json();
    const item = lots.items[0] as { id: string; brandName: string; price: string };
    const orderId = await sendKiorexOrder(request, branchId, item.id, 1, item.price);

    await login(page, demo.pharmacist);
    await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Kiorex orders" }).click();
    const card = page.getByRole("article", { name: `#${orderId}` });
    await expect(card).toBeVisible();
    await expect(card.getByRole("timer")).toBeVisible();
    await card.getByRole("button", { name: "Accept" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Accept", exact: true }).click(); // full acceptance (the dialog allows partial quantities)
    await page.locator("label", { hasText: /^In progress/ }).click();
    await expect(card).toBeVisible();
    await card.getByRole("link", { name: "Open dispensing" }).click();
    await page.getByRole("button", { name: "Sign off as pharmacist" }).click();
    await expect(page.getByText("Signed off", { exact: true }).first()).toBeVisible();
    await page.goBack();
    await card.getByRole("button", { name: "Mark ready" }).click();
    await page.goto("/orders?view=progress");
    await card.getByRole("link", { name: "Open dispensing" }).click();
    await page.getByRole("button", { name: "Dispense", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Dispensed", exact: true })).toBeVisible();

    const pharm = await apiLogin(request, demo.pharmacist);
    await expect.poll(async () => {
      const ev = await (await request.get(`${API}/api/v1/dashboard/outbox`, { headers: { Authorization: `Bearer ${owner}` } })).json();
      return ev.filter((e: { aggregateId: string }) => e.aggregateId === orderId).map((e: { type: string }) => e.type).sort();
    }, { timeout: 20_000 }).toEqual(["DispenseCompleted", "OrderReady"]);
    expect(pharm).toBeTruthy();
  });
});
