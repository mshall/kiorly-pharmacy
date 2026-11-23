import { createHash, randomBytes } from "node:crypto";
import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

/**
 * A Pharmacy web session started with Kiorex Passport (driven through the real browser UI) ends when the person signs out other sessions through the
 * Passport account API (`DELETE /api/sessions`, what the account page's "Sign out all other sessions" calls; OIDC back-channel logout -> POST /api/v1/auth/oidc/backchannel-logout). Real browser, real Passport dev IdP (:4400), real API (:3100).
 * The Passport redirect URI is registered for http://localhost:5192 (the dev web), so this spec drives that origin; it skips when the
 * stack is not up. Demo owner persona +201000002007 (OTP 000000, linked to owner@demo.kiorly.local).
 */
const WEB = process.env.PHARMACY_PASSPORT_WEB ?? "http://localhost:5192";
const PASSPORT = process.env.PASSPORT_URL ?? "http://localhost:4400";
const PHONE = "+201000002007";

async function up(url: string): Promise<boolean> { try { return (await fetch(url, { signal: AbortSignal.timeout(3000) })).ok; } catch { return false; } }

/** The Passport hosted pages: phone, one-time code, optional passkey offer. */
async function passportPages(page: Page) {
  await page.locator("#phone").fill(PHONE);
  await page.locator("form button[type=submit]").first().click();
  await page.locator("#code").fill("000000");
  await page.locator("form button[type=submit]").first().click();
  const skip = page.locator("#finish button");
  if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) await skip.click();
}

/** The Passport account page signs in as the public client kiorex-passport-web (code + PKCE) and calls /api with that access token: do the same over HTTP. */
async function passportAccountToken(api: APIRequestContext): Promise<string> {
  const verifier = randomBytes(32).toString("base64url");
  const redirectUri = `${PASSPORT}/account/callback`;
  const q = new URLSearchParams({ client_id: "kiorex-passport-web", redirect_uri: redirectUri, response_type: "code", scope: "openid profile phone kx offline_access", state: "s", code_challenge: createHash("sha256").update(verifier).digest("base64url"), code_challenge_method: "S256", prompt: "login" });
  const follow = async (start: string) => {
    let url = start; let res = await api.get(url, { maxRedirects: 0 });
    while (res.status() >= 300 && res.status() < 400) { url = new URL(res.headers().location!, url).toString(); if (url.startsWith(redirectUri)) return url; res = await api.get(url, { maxRedirects: 0 }); }
    return url;
  };
  const interaction = await follow(`${PASSPORT}/auth?${q}`);
  const uid = new URL(interaction).pathname.split("/")[2]!;
  await api.get(`${PASSPORT}/interaction/${uid}`);
  await api.post(`${PASSPORT}/interaction/${uid}/phone`, { form: { phone: PHONE, lang: "en" } });
  let r = await api.post(`${PASSPORT}/interaction/${uid}/verify`, { form: { code: "000000", lang: "en" }, maxRedirects: 0 });
  if (r.status() === 200) r = await api.post(`${PASSPORT}/interaction/${uid}/finish`, { form: { lang: "en" }, maxRedirects: 0 }); // skip the passkey offer
  let url = new URL(r.headers().location!, PASSPORT).toString();
  if (!url.startsWith(redirectUri)) url = await follow(url);
  const code = new URL(url).searchParams.get("code")!;
  const t = await api.post(`${PASSPORT}/token`, { form: { grant_type: "authorization_code", code, redirect_uri: redirectUri, code_verifier: verifier, client_id: "kiorex-passport-web" } });
  expect(t.ok(), await t.text()).toBeTruthy();
  return ((await t.json()) as { access_token: string }).access_token;
}

test("signing out other sessions on the Passport account page ends the Pharmacy web session", async ({ browser, playwright }) => {
  test.skip(!(await up(`${PASSPORT}/.well-known/openid-configuration`)) || !(await up(`${WEB}/login`)), "Passport dev IdP or the Pharmacy web (:5192) is not running");
  test.skip(!(await up("http://127.0.0.1:3100/api/v1/health/ready")), "Pharmacy API is not running");

  const playwrightRequest = await playwright.request.newContext();
  await fetch(`${PASSPORT}/dev/reset-rate-limits`, { method: "POST" }); // dev IdP only: OTP send limits are 5 per phone and hour
  // 1) the Pharmacy web: sign in with Kiorex Passport
  const pharmacy = await (await browser.newContext({ locale: "en" })).newPage();
  await pharmacy.addInitScript(() => { try { localStorage.setItem("kiorly.lang", "en"); } catch { /* ignore */ } });
  await pharmacy.goto(`${WEB}/login`);
  await pharmacy.getByRole("button", { name: "Sign in with Kiorex Passport" }).click();
  await passportPages(pharmacy);
  await expect(pharmacy.getByRole("navigation")).toBeVisible({ timeout: 20_000 });
  await expect(pharmacy).toHaveURL(new RegExp(`^${WEB}/?$`));

  // 2) the Passport account API (what the account page calls): its own Passport session, then "sign out all other sessions"
  const account = await passportAccountToken(playwrightRequest);
  const others = await playwrightRequest.delete(`${PASSPORT}/api/sessions`, { headers: { authorization: `Bearer ${account}` } });
  expect(others.status()).toBe(200);
  expect(((await others.json()) as { revoked: unknown[] }).revoked.length).toBeGreaterThanOrEqual(1);

  // 3) the Pharmacy web session is gone: the next navigation inside the app returns to the sign-in page, with the explanation
  await pharmacy.getByRole("link", { name: "Inventory" }).first().click();
  await expect(pharmacy).toHaveURL(/\/login$/, { timeout: 20_000 });
  await expect(pharmacy.getByText("Your session ended. Sign in again.")).toBeVisible();
  expect(await pharmacy.evaluate(() => localStorage.getItem("kiorly.token"))).toBeNull();
});
