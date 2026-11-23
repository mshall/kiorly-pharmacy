import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHash, createHmac, generateKeyPairSync } from "node:crypto";
import { HttpMessageProvider } from "./messaging-provider";
import { HttpPaymentProvider } from "./payment-provider";
import { providerConfig, validateProviderConfig, webhookSecretFor } from "./provider-env";
import { VENDOR_WEBHOOKS } from "./vendor-kit";
import { sendPush } from "./push-provider";
import { signMetaBody } from "./vendors/meta-whatsapp";
import { signTwilio } from "./vendors/twilio-sms";
import { paymobHmac } from "./vendors/paymob";
import { fawryCallbackSignature } from "./vendors/fawry";
import type { FetchLike } from "./http";

/** Native vendors through this repo's provider ports against recorded (faked) HTTP: only env selects them. */
interface Call { url: string; method: string; headers: Record<string, string>; body: string }
function fake(...replies: Array<{ status?: number; json?: unknown }>) {
  const calls: Call[] = [];
  const f: FetchLike = async (url, init) => {
    calls.push({ url, method: init.method, headers: init.headers, body: String(init.body ?? "") });
    const r = replies.shift() ?? { json: {} };
    const buf = Buffer.from(JSON.stringify(r.json ?? {}));
    return { status: r.status ?? 200, headers: { get: (n: string) => (n.toLowerCase() === "content-type" ? "application/json" : null) }, arrayBuffer: async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer };
  };
  return { f, calls };
}
const META = { WHATSAPP_MODE: "real", WHATSAPP_PROVIDER: "meta", WHATSAPP_API_KEY: "EAAG_tok", WHATSAPP_SENDER_ID: "1055550001", WHATSAPP_WEBHOOK_SECRET: "app_secret_0123456789ab", WHATSAPP_VERIFY_TOKEN: "vt" };
const SES = { EMAIL_MODE: "real", EMAIL_PROVIDER: "ses", EMAIL_API_URL: "https://email.eu-central-1.amazonaws.com", EMAIL_API_KEY: "AKIAEXAMPLE:secretexample", EMAIL_FROM: "Kiorly <no-reply@kiorly.com>", EMAIL_WEBHOOK_SECRET: "sns_pw_0123456789abc" };
const TWILIO = { SMS_MODE: "real", SMS_PROVIDER: "twilio", SMS_API_KEY: "ACabc:authtoken0123456789", SMS_SENDER_ID: "KIORLY", SMS_WEBHOOK_PUBLIC_URL: "https://api.kiorly.com/api/v1/webhooks/providers/sms" };
const PAYMOB = { PAYMENT_MODE: "real", PAYMENT_PROVIDER: "paymob", PAYMENT_API_KEY: "egy_sk_test", PAYMENT_WEBHOOK_SECRET: "paymob_hmac_secret", PAYMENT_PUBLIC_KEY: "egy_pk_test", PAYMENT_INTEGRATION_IDS: "4321", PUBLIC_BASE_URL: "https://api.kiorly.com" };
const FAWRY = { PAYMENT_MODE: "real", PAYMENT_PROVIDER: "fawry", PAYMENT_API_KEY: "fawry_secure_key", PAYMENT_MERCHANT_CODE: "MC1", PUBLIC_BASE_URL: "https://api.kiorly.com" };
const withEnv = async (e: Record<string, string>, fn: () => Promise<void> | void) => { const prev = { ...process.env }; Object.assign(process.env, e); try { await fn(); } finally { for (const k of Object.keys(e)) { if (prev[k] === undefined) delete process.env[k]; else process.env[k] = prev[k]; } } };
const req = { to: "+201000000001", templateId: "BOOKING", locale: "en" as const, text: "Hello", idempotencyKey: "idem-1", reference: "ref-1" };

describe("startup validation for native vendors", () => {
  it("accepts complete configs with default vendor URLs and rejects incomplete ones by name", () => {
    for (const e of [META, SES, TWILIO, PAYMOB, FAWRY]) assert.deepEqual(validateProviderConfig(e), []);
    assert.ok(validateProviderConfig({ ...META, WHATSAPP_VERIFY_TOKEN: "" }).some((p) => p.includes("WHATSAPP_VERIFY_TOKEN")));
    assert.ok(validateProviderConfig({ ...SES, EMAIL_API_URL: "https://mail.example.com" }).some((p) => p.includes("amazonaws.com")));
    assert.ok(validateProviderConfig({ ...TWILIO, SMS_WEBHOOK_PUBLIC_URL: "" }).some((p) => p.includes("SMS_WEBHOOK_PUBLIC_URL")));
    assert.ok(validateProviderConfig({ ...PAYMOB, PAYMENT_PUBLIC_KEY: "" }).some((p) => p.includes("PAYMENT_PUBLIC_KEY")));
    assert.ok(validateProviderConfig({ ...FAWRY, PAYMENT_MERCHANT_CODE: "" }).some((p) => p.includes("PAYMENT_MERCHANT_CODE")));
    assert.ok(validateProviderConfig({ SMS_MODE: "real", SMS_PROVIDER: "nexmo" }).some((p) => p.includes("SMS_PROVIDER must be")));
    const leak = validateProviderConfig({ ...PAYMOB, PAYMENT_PUBLIC_KEY: "" }).join("|");
    assert.ok(!leak.includes("egy_sk_test"));
  });
  it("derives the webhook secret from the credential for Twilio / Fawry", () => {
    assert.equal(webhookSecretFor("SMS", TWILIO), "authtoken0123456789");
    assert.equal(webhookSecretFor("PAYMENT", FAWRY), "fawry_secure_key");
  });
  it("PUSH real needs FCM / Expo credentials (no PUSH_API_URL required) and names only variables", () => {
    assert.ok(validateProviderConfig({ PUSH_MODE: "real" }).some((p) => p.includes("PUSH_FCM_SERVICE_ACCOUNT_JSON")));
    assert.deepEqual(validateProviderConfig({ PUSH_MODE: "real", PUSH_EXPO_ENABLED: "true" }), []);
  });
});

describe("messaging vendors", () => {
  it("Meta: approved template to /{phone-number-id}/messages", async () => {
    const t = fake({ json: { messages: [{ id: "wamid.1" }] } });
    const p = new HttpMessageProvider("WHATSAPP", providerConfig("WHATSAPP", META), t.f);
    await withEnv(META, async () => assert.deepEqual(await p.send({ ...req, channel: "WHATSAPP" }), { providerMessageId: "wamid.1", status: "SENT" }));
    assert.equal(t.calls[0].url, "https://graph.facebook.com/v21.0/1055550001/messages");
    assert.equal(t.calls[0].headers.authorization, "Bearer EAAG_tok");
    assert.equal(JSON.parse(t.calls[0].body).template.components[0].parameters[0].text, "Hello");
  });
  it("SES: SigV4-signed SendEmail", async () => {
    const t = fake({ json: { MessageId: "ses-1" } });
    const p = new HttpMessageProvider("EMAIL", providerConfig("EMAIL", SES), t.f);
    await withEnv(SES, async () => assert.equal((await p.send({ ...req, channel: "EMAIL", to: "a@b.co", subject: "Hi" })).providerMessageId, "ses-1"));
    assert.equal(t.calls[0].url, "https://email.eu-central-1.amazonaws.com/v2/email/outbound-emails");
    assert.match(t.calls[0].headers.authorization, /^AWS4-HMAC-SHA256 Credential=AKIAEXAMPLE\/\d{8}\/eu-central-1\/ses\/aws4_request/);
    assert.equal(JSON.parse(t.calls[0].body).Content.Simple.Subject.Data, "Hi");
  });
  it("Twilio: form body, basic auth, status callback", async () => {
    const t = fake({ status: 201, json: { sid: "SM1" } });
    const p = new HttpMessageProvider("SMS", providerConfig("SMS", TWILIO), t.f);
    await withEnv(TWILIO, async () => assert.equal((await p.send({ ...req, channel: "SMS" })).providerMessageId, "SM1"));
    assert.equal(t.calls[0].url, "https://api.twilio.com/2010-04-01/Accounts/ACabc/Messages.json");
    assert.equal(t.calls[0].headers["content-type"], "application/x-www-form-urlencoded");
    assert.deepEqual(Object.fromEntries(new URLSearchParams(t.calls[0].body)), { To: "+201000000001", Body: "Hello", From: "KIORLY", StatusCallback: TWILIO.SMS_WEBHOOK_PUBLIC_URL });
  });
});

describe("vendor webhooks verify with the vendor's own scheme and normalise to canonical events", () => {
  it("Meta / Twilio / SES / Paymob / Fawry", () => {
    const raw = JSON.stringify({ object: "whatsapp_business_account", entry: [{ changes: [{ value: { statuses: [{ id: "wamid.1", status: "read", timestamp: "1700000000" }] } }] }] });
    const base = { rawBody: raw, query: {} };
    assert.ok(VENDOR_WEBHOOKS.meta.verify({ ...base, secret: "s", headers: { "x-hub-signature-256": signMetaBody("s", raw) } }));
    assert.ok(!VENDOR_WEBHOOKS.meta.verify({ ...base, secret: "s", headers: { "x-hub-signature-256": "sha256=00" } }));
    assert.deepEqual(VENDOR_WEBHOOKS.meta.parse(raw).map((e) => [e.type, e.providerRef]), [["message.read", "wamid.1"]]);
    const form = "MessageSid=SM1&MessageStatus=delivered";
    assert.ok(VENDOR_WEBHOOKS.twilio.verify({ secret: "tok", rawBody: form, query: {}, publicUrl: "https://x/cb", headers: { "x-twilio-signature": signTwilio("tok", "https://x/cb", form) } }));
    assert.equal(VENDOR_WEBHOOKS.twilio.parse(form)[0].type, "message.delivered");
    const sns = JSON.stringify({ Type: "Notification", Message: JSON.stringify({ eventType: "Bounce", mail: { messageId: "m1" }, bounce: { bounceType: "Permanent" } }) });
    assert.ok(VENDOR_WEBHOOKS.ses.verify({ ...base, secret: "pw", headers: { authorization: `Basic ${Buffer.from("u:pw").toString("base64")}` } }));
    assert.deepEqual(VENDOR_WEBHOOKS.ses.parse(sns).map((e) => [e.type, e.error]), [["message.failed", "SES_BOUNCE_PERMANENT"]]);
    const obj = { amount_cents: 15000, created_at: "2026-11-23T10:00:00", currency: "EGP", id: 9, order: { id: 55, merchant_order_id: "plink_1" }, success: true, pending: false, source_data: {} };
    const pm = JSON.stringify({ type: "TRANSACTION", obj });
    assert.ok(VENDOR_WEBHOOKS.paymob.verify({ secret: "hs", rawBody: pm, headers: {}, query: { hmac: paymobHmac("hs", obj) } }));
    assert.ok(!VENDOR_WEBHOOKS.paymob.verify({ secret: "hs", rawBody: pm, headers: {}, query: { hmac: "bad" } }));
    assert.deepEqual(VENDOR_WEBHOOKS.paymob.parse(pm).map((e) => [e.type, e.providerRef, e.amount, e.reference]), [["payment.succeeded", "55", "150.00", "plink_1"]]);
    const cb = { fawryRefNumber: "1", merchantRefNumber: "plink_2", paymentAmount: 150, orderAmount: 150, orderStatus: "PAID", paymentMethod: "CARD", paymentRefrenceNumber: "x" };
    const fw = JSON.stringify({ ...cb, messageSignature: fawryCallbackSignature("sk", cb) });
    assert.ok(VENDOR_WEBHOOKS.fawry.verify({ secret: "sk", rawBody: fw, headers: {}, query: {} }));
    assert.ok(!VENDOR_WEBHOOKS.fawry.verify({ secret: "other", rawBody: fw, headers: {}, query: {} }));
    assert.deepEqual(VENDOR_WEBHOOKS.fawry.parse(fw).map((e) => [e.type, e.providerRef]), [["payment.succeeded", "plink_2"]]);
    void createHash; void createHmac;
  });
});

describe("payment vendors (pay links + refunds)", () => {
  const link = { amount: "150.00", currency: "EGP", reference: "plink_1", description: "Invoice 1", idempotencyKey: "idem-pl" };
  it("Paymob: intention -> unified checkout URL; refund via transaction inquiry", async () => {
    const t = fake({ json: { client_secret: "cs1", intention_order_id: 55 } }, { json: { id: 9 } }, { json: { id: 77 } });
    const p = new HttpPaymentProvider(providerConfig("PAYMENT", PAYMOB), t.f);
    await withEnv(PAYMOB, async () => {
      assert.deepEqual(await p.createPayLink(link), { providerRef: "55", payUrl: "https://accept.paymob.com/unifiedcheckout/?publicKey=egy_pk_test&clientSecret=cs1", status: "PENDING" });
      assert.deepEqual(await p.refund({ providerRef: "55", amount: "50.00", currency: "EGP", idempotencyKey: "rf-1" }), { providerRef: "77", status: "SUCCEEDED" });
      await assert.rejects(() => p.charge({ amount: "1.00", currency: "EGP", method: "CARD", reference: "r", idempotencyKey: "k" }), /hosted-checkout/);
    });
    assert.equal(t.calls[0].url, "https://accept.paymob.com/v1/intention/");
    assert.equal(t.calls[0].headers.authorization, "Token egy_sk_test");
    const b = JSON.parse(t.calls[0].body); assert.equal(b.amount, 15000); assert.equal(b.special_reference, "plink_1"); assert.deepEqual(b.payment_methods, [4321]);
    assert.deepEqual(JSON.parse(t.calls[2].body), { transaction_id: 9, amount_cents: 5000 });
  });
  it("Fawry: signed redirect URL without a network call; refund via status lookup", async () => {
    const t = fake({ json: { fawryRefNumber: "970505" } }, { json: { statusCode: 200 } });
    const p = new HttpPaymentProvider(providerConfig("PAYMENT", FAWRY), t.f);
    await withEnv(FAWRY, async () => {
      const l = await p.createPayLink(link);
      assert.equal(l.providerRef, "plink_1"); assert.match(l.payUrl, /^https:\/\/www\.atfawry\.com\/ECommercePlugin\/FawryPay\.jsp\?chargeRequest=/);
      assert.equal(t.calls.length, 0);
      assert.deepEqual(await p.refund({ providerRef: "plink_1", amount: "50.00", currency: "EGP", idempotencyKey: "rf-2" }), { providerRef: "970505", status: "SUCCEEDED" });
    });
    assert.equal(JSON.parse(t.calls[1].body).refundAmount, 50);
  });
});

describe("push (FCM v1 / Expo)", () => {
  it("routes Expo tokens to exp.host and reports dead tokens", async () => {
    const t = fake({ json: { data: [{ status: "ok", id: "t1" }] } }, { json: { data: [{ status: "error", details: { error: "DeviceNotRegistered" } }] } });
    const env = { PUSH_MODE: "real", PUSH_EXPO_ENABLED: "true" };
    assert.deepEqual(await sendPush([{ to: "ExponentPushToken[a]", title: "T", body: "B", channelId: "safety" }], env, t.f), { accepted: 1, invalid: [] });
    assert.equal(t.calls[0].url, "https://exp.host/--/api/v2/push/send");
    assert.equal(JSON.parse(t.calls[0].body)[0].channelId, "safety");
    const r = await sendPush([{ to: "ExponentPushToken[b]", title: "T", body: "B" }, { to: "ExponentPushToken[c]", title: "T", body: "B" }], env, fake({ json: { data: [{ status: "ok", id: "x" }] } }, { json: { data: [{ status: "error", details: { error: "DeviceNotRegistered" } }] } }).f);
    assert.deepEqual(r, { accepted: 1, invalid: ["ExponentPushToken[c]"] });
  });
  it("mints an FCM OAuth token from a service account and sends v1 messages", async () => {
    const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048, privateKeyEncoding: { type: "pkcs8", format: "pem" }, publicKeyEncoding: { type: "spki", format: "pem" } });
    const sa = JSON.stringify({ project_id: "kiorly-prod", client_email: "fcm@kiorly-prod.iam.gserviceaccount.com", private_key: privateKey });
    const t = fake({ json: { access_token: "ya29", expires_in: 3600 } }, { json: { name: "projects/kiorly-prod/messages/1" } });
    assert.deepEqual(await sendPush([{ to: "fcm-native-token", title: "T", body: "B", channelId: "safety", data: { a: 1 } }], { PUSH_MODE: "real", PUSH_FCM_SERVICE_ACCOUNT_JSON: sa }, t.f), { accepted: 1, invalid: [] });
    assert.equal(t.calls[1].url, "https://fcm.googleapis.com/v1/projects/kiorly-prod/messages:send");
    assert.equal(JSON.parse(t.calls[1].body).message.android.notification.channel_id, "safety");
    assert.equal(JSON.parse(t.calls[1].body).message.data.a, "1");
  });
  it("mock mode never calls out", async () => { const t = fake(); assert.deepEqual(await sendPush([{ to: "x", title: "T", body: "B" }], {}, t.f), { accepted: 1, invalid: [] }); assert.equal(t.calls.length, 0); });
});

describe("provider status for /health", () => {
  it("reports mock by default and real + vendor + readiness without secrets", async () => {
    const { providerStatus } = await import("./provider-env");
    assert.ok(providerStatus({}).every((s) => s.mode === "mock" && s.vendor === "mock" && s.ready));
    const s = providerStatus({ ...META, ...PAYMOB, PUSH_MODE: "real" });
    assert.deepEqual(s.find((x) => x.provider === "whatsapp"), { provider: "whatsapp", mode: "real", vendor: "meta", ready: true });
    assert.deepEqual(s.find((x) => x.provider === "payment"), { provider: "payment", mode: "real", vendor: "paymob", ready: true });
    assert.equal(s.find((x) => x.provider === "push")!.ready, false);
    assert.ok(!JSON.stringify(s).includes("EAAG_tok"));
  });
});
