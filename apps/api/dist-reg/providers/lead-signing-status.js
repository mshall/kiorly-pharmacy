"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIN_PROD_LEAD_SECRET_LENGTH = void 0;
exports.leadSigningStatus = leadSigningStatus;
exports.warnIfLeadSigningMissing = warnIfLeadSigningMissing;
exports.MIN_PROD_LEAD_SECRET_LENGTH = 32;
function leadSigningStatus(env = process.env) {
    if (env.NODE_ENV !== "production")
        return { status: "configured" };
    return { status: (env.KIOREX_LEAD_SIGNING_SECRET ?? "").trim().length >= exports.MIN_PROD_LEAD_SECRET_LENGTH ? "configured" : "not configured" };
}
function warnIfLeadSigningMissing(log = (m) => console.warn(m), env = process.env) {
    if (leadSigningStatus(env).status === "not configured")
        log("lead signing: not configured (KIOREX_LEAD_SIGNING_SECRET missing or shorter than 32 characters); Kiorex 'Talk to us' stays unavailable until it is set.");
}
//# sourceMappingURL=lead-signing-status.js.map