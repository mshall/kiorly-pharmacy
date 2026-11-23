import { expect, type APIRequestContext, type Page } from "@playwright/test";
import { createHash, randomUUID } from "node:crypto";
import { PARTNER_DEV_DEFAULTS, signKiorlyRequest, signWebhook, WEBHOOK_HEADERS } from "@kiorex/contracts";

/** The seeded dev registration of Kiorex as a machine client of the demo tenant (`prisma/seed.ts`). The client key addresses the tenant; there is no org header. */
const KX = PARTNER_DEV_DEFAULTS.pharmacy;

export const API = process.env.PHARMACY_API_ORIGIN ?? "http://127.0.0.1:3100";
export const DEMO_PASSWORD = "Demo@12345";
export const demo = { owner: "owner@demo.kiorly.local", pharmacist: "pharmacist@demo.kiorly.local", cashier: "cashier@demo.kiorly.local", manager: "manager@demo.kiorly.local" };

export async function apiLogin(request: APIRequestContext, email: string): Promise<string> {
  const r = await request.post(`${API}/api/v1/auth/login`, { data: { email, password: DEMO_PASSWORD } });
  expect(r.ok(), await r.text()).toBeTruthy();
  return (await r.json()).accessToken as string;
}

export async function login(page: Page, email: string, lang: "en" | "ar" = "en") {
  await page.addInitScript((l) => { try { localStorage.setItem("kiorly.lang", l); } catch { /* ignore */ } }, lang);
  await page.goto("/login");
  await page.getByLabel(lang === "en" ? "Email" : "البريد الإلكتروني").fill(email);
  await page.getByLabel(lang === "en" ? "Password" : "كلمة المرور").fill(DEMO_PASSWORD);
  await page.getByRole("button", { name: lang === "en" ? "Sign in" : "تسجيل الدخول", exact: true }).click(); // exact: the page also offers "Sign in with Kiorex Passport"
  await expect(page.getByRole("navigation")).toBeVisible();
}

/** Signed Kiorex -> pharmacy PrescriptionIssued webhook (webhook HMAC scheme from @kiorex/contracts). */
export async function sendERx(request: APIRequestContext, ingredient: string, strength: string, quantity = 1) {
  const eventId = `ev_e2e_${randomUUID()}`;
  const body = JSON.stringify({ eventId, type: "PrescriptionIssued", aggregateType: "Prescription", aggregateId: `rx_${eventId}`, target: "KIOREX", occurredAt: new Date().toISOString(),
    data: { prescriptionId: `rx_${eventId}`, encounterId: "enc_e2e", clinicId: "clinic_e2e", patientRef: `sub_${createHash("sha1").update(eventId).digest("hex").slice(0, 10)}`, prescriberId: "clin_e2e_001", consentToken: "ct_e2e_consent_1", issuedAt: new Date().toISOString(), items: [{ activeIngredient: ingredient, strength, quantity, dose: "1 capsule 3 times daily" }] } });
  const s = signWebhook({ secret: KX.webhookSecret, body, eventType: "PrescriptionIssued", eventId });
  const r = await request.post(`${API}/api/v1/webhooks/kiorex`, { headers: { ...s.headers, [WEBHOOK_HEADERS.clientKey]: KX.clientKey, "content-type": "application/json" }, data: body });
  expect(r.ok(), await r.text()).toBeTruthy();
  return (await r.json()) as { prescriptionId: string };
}

/** Signed Kiorex -> pharmacy order (marketplace machine API, request HMAC scheme). */
export async function sendKiorexOrder(request: APIRequestContext, branchId: string, sku: string, quantity: number, unitPrice: string) {
  const orderId = `kx-e2e-${randomUUID()}`;
  const body = JSON.stringify({ orderId, branchId, customer: { name: "E2E Customer", phone: "+201000000123", address: "Cairo" }, prepaid: true, lines: [{ sku, quantity, unitPrice }] });
  const s = signKiorlyRequest({ clientKey: KX.clientKey, clientSecret: KX.clientSecret, method: "POST", path: "/marketplace/v1/orders", body });
  const r = await request.post(`${API}/marketplace/v1/orders`, { headers: { ...s.headers, "content-type": "application/json" }, data: body });
  expect(r.ok(), await r.text()).toBeTruthy();
  return orderId;
}
