import { ProviderError } from "./http";
import type { ProviderConfig, ProviderKind } from "./provider-env";
import type { CanonicalEvent, ChargeRequest, MessageRequest, MessageResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "./provider-types";
import { fawryCheckoutUrl, fawryRefundBody, fawryStatusUrl, parseFawryCallback, verifyFawryCallback } from "./vendors/fawry";
import { metaTemplateBody, metaVerifyChallenge, parseMetaSend, parseMetaWebhook, verifyMetaSignature } from "./vendors/meta-whatsapp";
import { parseSesEvents, parseSesSend, sesSendBody, sesSigner, snsConfirmUrl, verifySnsBasicAuth } from "./vendors/ses";
import { paymobAuth, paymobIntentionBody, paymobRefundBody, parsePaymobCallback, parsePaymobIntention, paymobTransactionIdFromInquiry, verifyPaymobHmac } from "./vendors/paymob";
import { parseTwilioStatus, parseTwilioSend, twilioAuth, twilioForm, twilioPath, verifyTwilioSignature } from "./vendors/twilio-sms";

/**
 * Native vendors, selected ONLY by env: <KIND>_PROVIDER = meta (WHATSAPP) | ses (EMAIL) | twilio (SMS) | paymob | fawry (PAYMENT); unset = the generic gateway
 * contract in mapping/*.ts. Wire formats live in ./vendors/* (pure, unit tested against faked HTTP); this file only adapts them to this repo's provider ports.
 *   WHATSAPP meta : WHATSAPP_API_KEY system-user token, WHATSAPP_SENDER_ID phone-number-id, WHATSAPP_WEBHOOK_SECRET app secret, WHATSAPP_VERIFY_TOKEN
 *   EMAIL ses     : EMAIL_API_URL https://email.<region>.amazonaws.com, EMAIL_API_KEY "<access key id>:<secret>", EMAIL_FROM, EMAIL_WEBHOOK_SECRET (SNS basic-auth password)
 *   SMS twilio    : SMS_API_KEY "<AccountSid>:<AuthToken>", SMS_SENDER_ID, SMS_WEBHOOK_PUBLIC_URL (secret = the auth token)
 *   PAYMENT paymob: PAYMENT_API_KEY secret key, PAYMENT_WEBHOOK_SECRET HMAC secret, PAYMENT_PUBLIC_KEY, PAYMENT_INTEGRATION_IDS (comma)
 *   PAYMENT fawry : PAYMENT_API_KEY secure key, PAYMENT_MERCHANT_CODE
 */
type Env = Record<string, string | undefined>;
export const VENDORS: Partial<Record<ProviderKind, string[]>> = { WHATSAPP: ["meta"], EMAIL: ["ses"], SMS: ["twilio"], PAYMENT: ["paymob", "fawry"] };
export const VENDOR_DEFAULT_URL: Record<string, string> = { meta: "https://graph.facebook.com/v21.0", twilio: "https://api.twilio.com", paymob: "https://accept.paymob.com", fawry: "https://www.atfawry.com" };
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

/** The configured native vendor of a kind (undefined = generic gateway). */
export function vendorOf(kind: ProviderKind, env: Env = process.env): string | undefined {
  const v = clean(env[`${kind}_PROVIDER`])?.toLowerCase();
  return v && VENDORS[kind]?.includes(v) ? v : undefined;
}
/** Secret derived from the credential when the vendor signs callbacks with it (Twilio: auth token; Fawry: secure key). */
export function derivedWebhookSecret(kind: ProviderKind, env: Env = process.env): string | undefined {
  const v = vendorOf(kind, env);
  const key = clean(env[`${kind}_API_KEY`]);
  if (v === "twilio" && key?.includes(":")) return key.slice(key.indexOf(":") + 1);
  if (v === "fawry") return key;
  return undefined;
}
/** Names only (never values). */
export function vendorProblems(kind: ProviderKind, env: Env = process.env): string[] {
  const raw = clean(env[`${kind}_PROVIDER`])?.toLowerCase();
  if (raw && raw !== "gateway" && !VENDORS[kind]?.includes(raw)) return [`${kind}_PROVIDER must be gateway${VENDORS[kind] ? ` or ${VENDORS[kind]!.join(" | ")}` : ""}`];
  const v = vendorOf(kind, env); const out: string[] = []; const need = (n: string) => { if (!clean(env[n])) out.push(`${kind}_MODE=real with ${kind}_PROVIDER=${v} but ${n} is not set`); };
  const key = clean(env[`${kind}_API_KEY`]);
  if (v === "meta") need("WHATSAPP_VERIFY_TOKEN");
  if (v === "ses") { if (key && !/^[^:]+:[^:]+(:.+)?$/.test(key)) out.push('EMAIL_API_KEY must be "<ACCESS_KEY_ID>:<SECRET_ACCESS_KEY>" for EMAIL_PROVIDER=ses'); if (!/\.[a-z]{2}(-[a-z]+)+-\d\.amazonaws\.com/.test(clean(env.EMAIL_API_URL) ?? "")) out.push("EMAIL_API_URL must be https://email.<region>.amazonaws.com for EMAIL_PROVIDER=ses"); }
  if (v === "twilio") { if (key && !key.includes(":")) out.push('SMS_API_KEY must be "<AccountSid>:<AuthToken>" for SMS_PROVIDER=twilio'); need("SMS_WEBHOOK_PUBLIC_URL"); }
  if (v === "paymob") { need("PAYMENT_PUBLIC_KEY"); need("PAYMENT_INTEGRATION_IDS"); }
  if (v === "fawry") need("PAYMENT_MERCHANT_CODE");
  return out;
}
export const vendorApiUrl = (kind: ProviderKind, env: Env = process.env): string | undefined => { const v = vendorOf(kind, env); return clean(env[`${kind}_API_URL`])?.replace(/\/+$/, "") ?? (v ? VENDOR_DEFAULT_URL[v] : undefined); };

// ── messaging ──
export interface VendorSend { path: string; body?: unknown; form?: Record<string, string>; sign?: (r: { method: string; url: string; body: string }) => Record<string, string> }
const tmplName = (id: string, env: Env) => { try { const m = JSON.parse(env.WHATSAPP_TEMPLATE_MAP ?? "{}"); return typeof m?.[id] === "string" ? m[id] : id; } catch { return id; } };
export function vendorSend(vendor: string, r: MessageRequest, cfg: ProviderConfig, env: Env = process.env): VendorSend {
  if (vendor === "meta") {
    const numbered = Object.entries(r.params ?? {}).filter(([k]) => /^\d+$/.test(k)).sort((a, b) => Number(a[0]) - Number(b[0])).map(([, v]) => String(v));
    const code = r.params?.code !== undefined ? String(r.params.code) : undefined;
    return { path: `/${encodeURIComponent(cfg.senderId ?? "")}/messages`, body: metaTemplateBody({ to: r.to, templateName: tmplName(r.templateId, env), language: r.locale === "en" ? "en" : "ar", bodyParams: numbered.length ? numbered : code ? [code] : [r.text], urlButtonParam: code }) };
  }
  if (vendor === "ses") {
    const url = vendorApiUrl("EMAIL", env) ?? "";
    return { path: "/v2/email/outbound-emails", body: sesSendBody({ from: r.from ?? cfg.senderId ?? "", to: r.to, subject: r.subject ?? "Kiorly", text: r.text, html: r.html, reference: r.reference, configurationSet: clean(env.EMAIL_SES_CONFIGURATION_SET) }), sign: sesSigner(url, cfg.apiKey ?? "") };
  }
  if (vendor === "twilio") return { path: twilioPath(cfg.apiKey ?? ""), form: twilioForm({ to: r.to, from: r.from ?? cfg.senderId ?? "", body: r.text, statusCallback: clean(env.SMS_WEBHOOK_PUBLIC_URL) }) };
  throw new ProviderError("UNSUPPORTED", `no native message vendor ${vendor}`);
}
export const vendorAuthHeaders = (vendor: string, cfg: ProviderConfig): Record<string, string> => {
  const k = cfg.apiKey ?? "";
  return vendor === "meta" ? { authorization: `Bearer ${k}` } : vendor === "twilio" ? twilioAuth(k) : vendor === "paymob" ? paymobAuth(k) : {};
};
export function vendorParseSend(vendor: string, json: unknown): MessageResult {
  try {
    const id = vendor === "meta" ? parseMetaSend(json).providerRef : vendor === "ses" ? parseSesSend(json).providerRef : parseTwilioSend(json).providerRef;
    return { providerMessageId: id, status: "SENT" };
  } catch { throw new ProviderError("BAD_RESPONSE", "provider send response has no message id"); }
}

// ── webhooks ──
export interface WebhookInput { secret: string; rawBody: string; headers: Record<string, unknown>; query: Record<string, unknown>; publicUrl?: string }
export interface VendorWebhook { verify(i: WebhookInput): boolean; parse(raw: string): CanonicalEvent[]; confirmUrl?(raw: string): string | null; challenge?(q: Record<string, unknown>, token: string): string | null }
const msgEv = (providerRef: string, status: "SENT" | "DELIVERED" | "READ" | "FAILED", error?: string, at?: string): CanonicalEvent => ({ eventId: `${providerRef}:${status}`, type: status === "SENT" ? "message.sent" : status === "DELIVERED" ? "message.delivered" : status === "READ" ? "message.read" : "message.failed", providerRef, ...(at ? { occurredAt: at } : {}), ...(error ? { error } : {}) });
const major = (minor: number) => (minor / 100).toFixed(2);
export const VENDOR_WEBHOOKS: Record<string, VendorWebhook> = {
  meta: { verify: (i) => verifyMetaSignature(i.secret, i.rawBody, i.headers), parse: (raw) => parseMetaWebhook(raw).statuses.map((s) => msgEv(s.providerRef, s.status, s.error, s.occurredAt)), challenge: metaVerifyChallenge },
  ses: { verify: (i) => verifySnsBasicAuth(i.secret, i.headers), parse: (raw) => parseSesEvents(raw).map((s) => msgEv(s.providerRef, s.status, s.error, s.occurredAt)), confirmUrl: snsConfirmUrl },
  twilio: { verify: (i) => verifyTwilioSignature(i.secret, i.publicUrl ?? "", i.rawBody, i.headers), parse: (raw) => parseTwilioStatus(raw).map((s) => msgEv(s.providerRef, s.status, s.error)) },
  paymob: {
    verify: (i) => { try { return verifyPaymobHmac(i.secret, JSON.parse(i.rawBody)?.obj, String(i.query.hmac ?? "")); } catch { return false; } },
    parse: (raw) => { const e = parsePaymobCallback(raw); return e ? [{ eventId: e.eventId, type: e.type === "payment.captured" ? "payment.succeeded" : e.type === "payment.failed" ? "payment.failed" : "refund.succeeded", providerRef: e.pspRef, occurredAt: e.occurredAt, amount: major(e.amountMinor), reference: e.paymentId }] : []; },
  },
  fawry: {
    verify: (i) => !!verifyFawryCallback(i.secret, i.rawBody),
    parse: (raw) => { let b: any; try { b = JSON.parse(raw); } catch { return []; } const e = parseFawryCallback(b); return e ? [{ eventId: e.eventId, type: e.type === "payment.captured" ? "payment.succeeded" : e.type === "payment.failed" ? "payment.failed" : "refund.succeeded", providerRef: e.pspRef, occurredAt: e.occurredAt, amount: major(e.amountMinor), reference: e.paymentId }] : []; },
  },
};

// ── payments (pay links + refunds) ──
export interface PspCall { path: string; body?: unknown; method?: "GET" | "POST"; absoluteUrl?: string; idempotencyKey: string }
const minor = (amount: string) => Math.round(Number(amount) * 100);
export function vendorPayLinkCall(vendor: string, r: PayLinkRequest, env: Env = process.env): PspCall {
  const base = clean(env.PUBLIC_BASE_URL) ?? "http://localhost:3100";
  const notificationUrl = `${base.replace(/\/+$/, "")}/api/v1/webhooks/providers/payment`;
  const returnUrl = clean(env.PAYMENT_RETURN_URL) ?? base;
  if (vendor === "paymob") return { path: "/v1/intention/", idempotencyKey: r.idempotencyKey, body: paymobIntentionBody({ paymentId: r.reference, amountMinor: minor(r.amount), currency: r.currency, integrationIds: (clean(env.PAYMENT_INTEGRATION_IDS) ?? "").split(",").map((s) => Number(s.trim())).filter(Number.isInteger), notificationUrl, redirectionUrl: returnUrl }) };
  throw new ProviderError("UNSUPPORTED", `pay link call for ${vendor}`);
}
export function vendorPayLinkResult(vendor: string, r: PayLinkRequest, json: unknown, cfg: ProviderConfig, env: Env = process.env): PayLinkResult {
  if (vendor === "paymob") { const o = parsePaymobIntention(json, cfg.apiUrl ?? VENDOR_DEFAULT_URL.paymob, clean(env.PAYMENT_PUBLIC_KEY) ?? ""); return { providerRef: o.pspRef, payUrl: o.checkoutUrl, status: "PENDING" }; }
  throw new ProviderError("UNSUPPORTED", `pay link result for ${vendor}`);
}
/** Fawry needs no network call to create a payment page: the signed redirect URL is the pay link. */
export function fawryPayLink(r: PayLinkRequest, cfg: ProviderConfig, env: Env = process.env): PayLinkResult {
  const base = (clean(env.PUBLIC_BASE_URL) ?? "http://localhost:3100").replace(/\/+$/, "");
  const o = fawryCheckoutUrl({ apiUrl: cfg.apiUrl ?? VENDOR_DEFAULT_URL.fawry, merchantCode: clean(env.PAYMENT_MERCHANT_CODE) ?? "", secureKey: cfg.apiKey ?? "", paymentId: r.reference, amountMinor: minor(r.amount), returnUrl: clean(env.PAYMENT_RETURN_URL) ?? base, webhookUrl: `${base}/api/v1/webhooks/providers/payment` });
  return { providerRef: o.pspRef, payUrl: o.checkoutUrl, status: "PENDING" };
}
export { fawryRefundBody, fawryStatusUrl, paymobRefundBody, paymobTransactionIdFromInquiry };
export type { ChargeRequest, RefundRequest, RefundResult };
