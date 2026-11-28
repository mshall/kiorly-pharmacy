"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPauseReason = exports.LISTING_KEY = exports.newLeadNonce = exports.LeadInputError = exports.LEAD_TIMES = void 0;
exports.frontDoorState = frontDoorState;
exports.cleanTalkToUs = cleanTalkToUs;
exports.leadSigningSecret = leadSigningSecret;
exports.leadHeaders = leadHeaders;
exports.listingPause = listingPause;
const node_crypto_1 = require("node:crypto");
function frontDoorState(input) {
    if (input.legacy)
        return "LIVE";
    switch (input.status) {
        case "APPROVED": return "LIVE";
        case "REQUESTED": return "WAITING";
        case "PAUSED":
        case "CHANGES_REQUESTED":
        case "REJECTED": return "ATTENTION";
        case "CONSENTED": return "IN_PROGRESS";
        default: return input.started ? "IN_PROGRESS" : "NOT_CONNECTED";
    }
}
exports.LEAD_TIMES = ["MORNING", "AFTERNOON", "EVENING", "ANYTIME"];
class LeadInputError extends Error {
    code;
    field;
    constructor(code, field) {
        super(code);
        this.code = code;
        this.field = field;
    }
}
exports.LeadInputError = LeadInputError;
const CTRL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
const clip = (v, max, field) => {
    if (v === undefined || v === null || v === "")
        return undefined;
    if (typeof v !== "string")
        throw new LeadInputError("INVALID_FIELD", field);
    const s = v.trim();
    if (!s)
        return undefined;
    if (s.length > max || CTRL.test(s))
        throw new LeadInputError("INVALID_FIELD", field);
    return s;
};
function cleanTalkToUs(i) {
    if (i.consent !== true)
        throw new LeadInputError("CONSENT_REQUIRED", "consent");
    const contactName = clip(i.contactName, 120, "contactName");
    if (!contactName)
        throw new LeadInputError("INVALID_FIELD", "contactName");
    const phone = clip(i.phone, 24, "phone");
    if (phone && !/^\+?[0-9][0-9 ()-]{6,22}$/.test(phone))
        throw new LeadInputError("INVALID_FIELD", "phone");
    const email = clip(i.email, 160, "email");
    if (email && !/^[^\s@]{1,64}@[^\s@]{1,120}\.[^\s@]{2,}$/.test(email))
        throw new LeadInputError("INVALID_FIELD", "email");
    if (!phone && !email)
        throw new LeadInputError("CONTACT_REQUIRED", "phone");
    const pt = clip(i.preferredTime, 12, "preferredTime");
    if (pt && !exports.LEAD_TIMES.includes(pt))
        throw new LeadInputError("INVALID_FIELD", "preferredTime");
    return { contactName, contactRole: clip(i.contactRole, 80, "contactRole"), phone, email, preferredTime: pt, note: clip(i.note, 500, "note") };
}
function leadSigningSecret(env = process.env) {
    const s = env.KIOREX_LEAD_SIGNING_SECRET?.trim() || (env.NODE_ENV === "production" ? "" : "kiorex-dev-lead-signing-secret");
    return s || null;
}
function leadHeaders(secret, ts, body) {
    const key = (0, node_crypto_1.createHash)("sha256").update(secret, "utf8").digest("hex");
    return { "content-type": "application/json", "X-Kiorly-Timestamp": String(ts), "X-Kiorly-Signature": `sha256=${(0, node_crypto_1.createHmac)("sha256", key).update(`${ts}.${body}`).digest("hex")}` };
}
const newLeadNonce = () => (0, node_crypto_1.randomBytes)(18).toString("base64url");
exports.newLeadNonce = newLeadNonce;
exports.LISTING_KEY = "kiorexListing";
function listingPause(settings) {
    const v = settings?.[exports.LISTING_KEY];
    return v?.paused && v.pausedAt ? { pausedAt: v.pausedAt, by: v.by ?? "", ...(v.reason ? { reason: v.reason } : {}) } : null;
}
const cleanPauseReason = (r) => { if (typeof r !== "string")
    return undefined; const s = r.trim().slice(0, 200); return s && !CTRL.test(s) ? s : undefined; };
exports.cleanPauseReason = cleanPauseReason;
//# sourceMappingURL=kiorex-front-door.core.js.map