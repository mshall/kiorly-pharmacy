"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bearer = void 0;
exports.genericMessageResponse = genericMessageResponse;
exports.genericEvents = genericEvents;
const http_1 = require("../http");
const bearer = (cfg) => (cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {});
exports.bearer = bearer;
const MESSAGE_TYPES = new Set(["message.sent", "message.delivered", "message.read", "message.failed"]);
const CONSENT_TYPES = new Set(["consent.granted", "consent.revoked", "consent.expired"]);
const PAYMENT_TYPES = new Set(["payment.succeeded", "payment.failed", "payment.expired", "refund.succeeded", "refund.failed"]);
function genericMessageResponse(json) {
    const id = json?.id ?? json?.messageId ?? json?.message_id;
    if (typeof id !== "string" || !id)
        throw new http_1.ProviderError("BAD_RESPONSE", "provider send response has no message id");
    return { providerMessageId: id, status: /queued|pending|accepted/i.test(String(json?.status ?? "")) ? "QUEUED" : "SENT" };
}
function genericEvents(json, allowed) {
    const list = Array.isArray(json) ? json : Array.isArray(json?.events) ? json.events : json ? [json] : [];
    const set = allowed === "message" ? MESSAGE_TYPES : allowed === "consent" ? CONSENT_TYPES : PAYMENT_TYPES;
    const out = [];
    for (const e of list) {
        if (typeof e?.id !== "string" || !set.has(e?.type) || typeof e?.data?.id !== "string")
            throw new http_1.ProviderError("BAD_RESPONSE", "malformed webhook event");
        out.push({ eventId: e.id, type: e.type, providerRef: e.data.id, occurredAt: typeof e.createdAt === "string" ? e.createdAt : undefined, error: typeof e.data.error === "string" ? e.data.error.slice(0, 200) : undefined, amount: e.data.amount != null ? String(e.data.amount) : undefined, currency: e.data.currency, reference: e.data.reference });
    }
    return out;
}
//# sourceMappingURL=generic.js.map