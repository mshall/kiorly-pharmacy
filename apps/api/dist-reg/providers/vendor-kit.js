"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymobTransactionIdFromInquiry = exports.paymobRefundBody = exports.fawryStatusUrl = exports.fawryRefundBody = exports.VENDOR_WEBHOOKS = exports.vendorAuthHeaders = exports.vendorApiUrl = exports.VENDOR_DEFAULT_URL = exports.VENDORS = void 0;
exports.vendorOf = vendorOf;
exports.derivedWebhookSecret = derivedWebhookSecret;
exports.vendorProblems = vendorProblems;
exports.vendorSend = vendorSend;
exports.vendorParseSend = vendorParseSend;
exports.vendorPayLinkCall = vendorPayLinkCall;
exports.vendorPayLinkResult = vendorPayLinkResult;
exports.fawryPayLink = fawryPayLink;
const http_1 = require("./http");
const fawry_1 = require("./vendors/fawry");
Object.defineProperty(exports, "fawryRefundBody", { enumerable: true, get: function () { return fawry_1.fawryRefundBody; } });
Object.defineProperty(exports, "fawryStatusUrl", { enumerable: true, get: function () { return fawry_1.fawryStatusUrl; } });
const meta_whatsapp_1 = require("./vendors/meta-whatsapp");
const ses_1 = require("./vendors/ses");
const paymob_1 = require("./vendors/paymob");
Object.defineProperty(exports, "paymobRefundBody", { enumerable: true, get: function () { return paymob_1.paymobRefundBody; } });
Object.defineProperty(exports, "paymobTransactionIdFromInquiry", { enumerable: true, get: function () { return paymob_1.paymobTransactionIdFromInquiry; } });
const twilio_sms_1 = require("./vendors/twilio-sms");
exports.VENDORS = { WHATSAPP: ["meta"], EMAIL: ["ses"], SMS: ["twilio"], PAYMENT: ["paymob", "fawry"] };
exports.VENDOR_DEFAULT_URL = { meta: "https://graph.facebook.com/v21.0", twilio: "https://api.twilio.com", paymob: "https://accept.paymob.com", fawry: "https://www.atfawry.com" };
const clean = (v) => (v && v.trim() ? v.trim() : undefined);
function vendorOf(kind, env = process.env) {
    const v = clean(env[`${kind}_PROVIDER`])?.toLowerCase();
    return v && exports.VENDORS[kind]?.includes(v) ? v : undefined;
}
function derivedWebhookSecret(kind, env = process.env) {
    const v = vendorOf(kind, env);
    const key = clean(env[`${kind}_API_KEY`]);
    if (v === "twilio" && key?.includes(":"))
        return key.slice(key.indexOf(":") + 1);
    if (v === "fawry")
        return key;
    return undefined;
}
function vendorProblems(kind, env = process.env) {
    const raw = clean(env[`${kind}_PROVIDER`])?.toLowerCase();
    if (raw && raw !== "gateway" && !exports.VENDORS[kind]?.includes(raw))
        return [`${kind}_PROVIDER must be gateway${exports.VENDORS[kind] ? ` or ${exports.VENDORS[kind].join(" | ")}` : ""}`];
    const v = vendorOf(kind, env);
    const out = [];
    const need = (n) => { if (!clean(env[n]))
        out.push(`${kind}_MODE=real with ${kind}_PROVIDER=${v} but ${n} is not set`); };
    const key = clean(env[`${kind}_API_KEY`]);
    if (v === "meta")
        need("WHATSAPP_VERIFY_TOKEN");
    if (v === "ses") {
        if (key && !/^[^:]+:[^:]+(:.+)?$/.test(key))
            out.push('EMAIL_API_KEY must be "<ACCESS_KEY_ID>:<SECRET_ACCESS_KEY>" for EMAIL_PROVIDER=ses');
        if (!/\.[a-z]{2}(-[a-z]+)+-\d\.amazonaws\.com/.test(clean(env.EMAIL_API_URL) ?? ""))
            out.push("EMAIL_API_URL must be https://email.<region>.amazonaws.com for EMAIL_PROVIDER=ses");
    }
    if (v === "twilio") {
        if (key && !key.includes(":"))
            out.push('SMS_API_KEY must be "<AccountSid>:<AuthToken>" for SMS_PROVIDER=twilio');
        need("SMS_WEBHOOK_PUBLIC_URL");
    }
    if (v === "paymob") {
        need("PAYMENT_PUBLIC_KEY");
        need("PAYMENT_INTEGRATION_IDS");
    }
    if (v === "fawry")
        need("PAYMENT_MERCHANT_CODE");
    return out;
}
const vendorApiUrl = (kind, env = process.env) => { const v = vendorOf(kind, env); return clean(env[`${kind}_API_URL`])?.replace(/\/+$/, "") ?? (v ? exports.VENDOR_DEFAULT_URL[v] : undefined); };
exports.vendorApiUrl = vendorApiUrl;
const tmplName = (id, env) => { try {
    const m = JSON.parse(env.WHATSAPP_TEMPLATE_MAP ?? "{}");
    return typeof m?.[id] === "string" ? m[id] : id;
}
catch {
    return id;
} };
function vendorSend(vendor, r, cfg, env = process.env) {
    if (vendor === "meta") {
        const numbered = Object.entries(r.params ?? {}).filter(([k]) => /^\d+$/.test(k)).sort((a, b) => Number(a[0]) - Number(b[0])).map(([, v]) => String(v));
        const code = r.params?.code !== undefined ? String(r.params.code) : undefined;
        return { path: `/${encodeURIComponent(cfg.senderId ?? "")}/messages`, body: (0, meta_whatsapp_1.metaTemplateBody)({ to: r.to, templateName: tmplName(r.templateId, env), language: r.locale === "en" ? "en" : "ar", bodyParams: numbered.length ? numbered : code ? [code] : [r.text], urlButtonParam: code }) };
    }
    if (vendor === "ses") {
        const url = (0, exports.vendorApiUrl)("EMAIL", env) ?? "";
        return { path: "/v2/email/outbound-emails", body: (0, ses_1.sesSendBody)({ from: r.from ?? cfg.senderId ?? "", to: r.to, subject: r.subject ?? "Kiorly", text: r.text, html: r.html, reference: r.reference, configurationSet: clean(env.EMAIL_SES_CONFIGURATION_SET) }), sign: (0, ses_1.sesSigner)(url, cfg.apiKey ?? "") };
    }
    if (vendor === "twilio")
        return { path: (0, twilio_sms_1.twilioPath)(cfg.apiKey ?? ""), form: (0, twilio_sms_1.twilioForm)({ to: r.to, from: r.from ?? cfg.senderId ?? "", body: r.text, statusCallback: clean(env.SMS_WEBHOOK_PUBLIC_URL) }) };
    throw new http_1.ProviderError("UNSUPPORTED", `no native message vendor ${vendor}`);
}
const vendorAuthHeaders = (vendor, cfg) => {
    const k = cfg.apiKey ?? "";
    return vendor === "meta" ? { authorization: `Bearer ${k}` } : vendor === "twilio" ? (0, twilio_sms_1.twilioAuth)(k) : vendor === "paymob" ? (0, paymob_1.paymobAuth)(k) : {};
};
exports.vendorAuthHeaders = vendorAuthHeaders;
function vendorParseSend(vendor, json) {
    try {
        const id = vendor === "meta" ? (0, meta_whatsapp_1.parseMetaSend)(json).providerRef : vendor === "ses" ? (0, ses_1.parseSesSend)(json).providerRef : (0, twilio_sms_1.parseTwilioSend)(json).providerRef;
        return { providerMessageId: id, status: "SENT" };
    }
    catch {
        throw new http_1.ProviderError("BAD_RESPONSE", "provider send response has no message id");
    }
}
const msgEv = (providerRef, status, error, at) => ({ eventId: `${providerRef}:${status}`, type: status === "SENT" ? "message.sent" : status === "DELIVERED" ? "message.delivered" : status === "READ" ? "message.read" : "message.failed", providerRef, ...(at ? { occurredAt: at } : {}), ...(error ? { error } : {}) });
const major = (minor) => (minor / 100).toFixed(2);
exports.VENDOR_WEBHOOKS = {
    meta: { verify: (i) => (0, meta_whatsapp_1.verifyMetaSignature)(i.secret, i.rawBody, i.headers), parse: (raw) => (0, meta_whatsapp_1.parseMetaWebhook)(raw).statuses.map((s) => msgEv(s.providerRef, s.status, s.error, s.occurredAt)), challenge: meta_whatsapp_1.metaVerifyChallenge },
    ses: { verify: (i) => (0, ses_1.verifySnsBasicAuth)(i.secret, i.headers), parse: (raw) => (0, ses_1.parseSesEvents)(raw).map((s) => msgEv(s.providerRef, s.status, s.error, s.occurredAt)), confirmUrl: ses_1.snsConfirmUrl },
    twilio: { verify: (i) => (0, twilio_sms_1.verifyTwilioSignature)(i.secret, i.publicUrl ?? "", i.rawBody, i.headers), parse: (raw) => (0, twilio_sms_1.parseTwilioStatus)(raw).map((s) => msgEv(s.providerRef, s.status, s.error)) },
    paymob: {
        verify: (i) => { try {
            return (0, paymob_1.verifyPaymobHmac)(i.secret, JSON.parse(i.rawBody)?.obj, String(i.query.hmac ?? ""));
        }
        catch {
            return false;
        } },
        parse: (raw) => { const e = (0, paymob_1.parsePaymobCallback)(raw); return e ? [{ eventId: e.eventId, type: e.type === "payment.captured" ? "payment.succeeded" : e.type === "payment.failed" ? "payment.failed" : "refund.succeeded", providerRef: e.pspRef, occurredAt: e.occurredAt, amount: major(e.amountMinor), reference: e.paymentId }] : []; },
    },
    fawry: {
        verify: (i) => !!(0, fawry_1.verifyFawryCallback)(i.secret, i.rawBody),
        parse: (raw) => { let b; try {
            b = JSON.parse(raw);
        }
        catch {
            return [];
        } const e = (0, fawry_1.parseFawryCallback)(b); return e ? [{ eventId: e.eventId, type: e.type === "payment.captured" ? "payment.succeeded" : e.type === "payment.failed" ? "payment.failed" : "refund.succeeded", providerRef: e.pspRef, occurredAt: e.occurredAt, amount: major(e.amountMinor), reference: e.paymentId }] : []; },
    },
};
const minor = (amount) => Math.round(Number(amount) * 100);
function vendorPayLinkCall(vendor, r, env = process.env) {
    const base = clean(env.PUBLIC_BASE_URL) ?? "http://localhost:3100";
    const notificationUrl = `${base.replace(/\/+$/, "")}/api/v1/webhooks/providers/payment`;
    const returnUrl = clean(env.PAYMENT_RETURN_URL) ?? base;
    if (vendor === "paymob")
        return { path: "/v1/intention/", idempotencyKey: r.idempotencyKey, body: (0, paymob_1.paymobIntentionBody)({ paymentId: r.reference, amountMinor: minor(r.amount), currency: r.currency, integrationIds: (clean(env.PAYMENT_INTEGRATION_IDS) ?? "").split(",").map((s) => Number(s.trim())).filter(Number.isInteger), notificationUrl, redirectionUrl: returnUrl }) };
    throw new http_1.ProviderError("UNSUPPORTED", `pay link call for ${vendor}`);
}
function vendorPayLinkResult(vendor, r, json, cfg, env = process.env) {
    if (vendor === "paymob") {
        const o = (0, paymob_1.parsePaymobIntention)(json, cfg.apiUrl ?? exports.VENDOR_DEFAULT_URL.paymob, clean(env.PAYMENT_PUBLIC_KEY) ?? "");
        return { providerRef: o.pspRef, payUrl: o.checkoutUrl, status: "PENDING" };
    }
    throw new http_1.ProviderError("UNSUPPORTED", `pay link result for ${vendor}`);
}
function fawryPayLink(r, cfg, env = process.env) {
    const base = (clean(env.PUBLIC_BASE_URL) ?? "http://localhost:3100").replace(/\/+$/, "");
    const o = (0, fawry_1.fawryCheckoutUrl)({ apiUrl: cfg.apiUrl ?? exports.VENDOR_DEFAULT_URL.fawry, merchantCode: clean(env.PAYMENT_MERCHANT_CODE) ?? "", secureKey: cfg.apiKey ?? "", paymentId: r.reference, amountMinor: minor(r.amount), returnUrl: clean(env.PAYMENT_RETURN_URL) ?? base, webhookUrl: `${base}/api/v1/webhooks/providers/payment` });
    return { providerRef: o.pspRef, payUrl: o.checkoutUrl, status: "PENDING" };
}
//# sourceMappingURL=vendor-kit.js.map