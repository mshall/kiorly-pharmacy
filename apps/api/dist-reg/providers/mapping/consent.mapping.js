"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentMapping = void 0;
const http_1 = require("../http");
const generic_1 = require("./generic");
const id = (json, what) => {
    const v = json?.id;
    if (typeof v !== "string" || !v)
        throw new http_1.ProviderError("BAD_RESPONSE", `consent registry ${what} response has no id`);
    return v;
};
const status = (v) => {
    const s = String(v ?? "").toLowerCase();
    return /revok|withdraw/.test(s) ? "REVOKED" : /expir/.test(s) ? "EXPIRED" : "ACTIVE";
};
const iso = (v) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : undefined);
exports.consentMapping = {
    paths: { grant: "/consents", query: "/consents", revoke: (providerRef) => `/consents/${encodeURIComponent(providerRef)}/revoke`, introspect: "/consents/introspect" },
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    grantBody: (r) => ({ subjectRef: r.subjectRef, purpose: r.purpose, expiresAt: r.expiresAt, reference: r.reference, evidence: r.evidence }),
    grantResult: (json) => ({ providerRef: id(json, "grant"), status: "ACTIVE", expiresAt: iso(json?.expiresAt) }),
    queryPath: (subjectRef, purpose) => `/consents?subjectRef=${encodeURIComponent(subjectRef)}&purpose=${encodeURIComponent(purpose)}`,
    queryResult: (json, subjectRef, purpose) => {
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        return { subjectRef, purpose, consents: list.map((c) => ({ providerRef: id(c, "query"), status: status(c.status), grantedAt: iso(c.grantedAt), expiresAt: iso(c.expiresAt), revokedAt: iso(c.revokedAt) })) };
    },
    revokeBody: (r) => ({ reason: r.reason }),
    revokeResult: (json, providerRef) => ({ providerRef: typeof json?.id === "string" ? json.id : providerRef, status: "REVOKED" }),
    introspectBody: (token, ctx) => ({ token, patientRef: ctx.patientRef, clinicId: ctx.clinicId }),
    introspectResult: (json) => {
        if (typeof json?.active !== "boolean")
            throw new http_1.ProviderError("BAD_RESPONSE", "consent registry introspection response has no `active`");
        if (json.active)
            return { valid: true, expiresAt: iso(json.expiresAt) };
        const r = String(json.reason ?? "").toUpperCase();
        return { valid: false, reason: r === "EXPIRED" ? "EXPIRED" : r === "MALFORMED" ? "MALFORMED" : r === "MISSING" ? "MISSING" : "REVOKED" };
    },
    parseWebhook: (json) => (0, generic_1.genericEvents)(json, "consent"),
};
//# sourceMappingURL=consent.mapping.js.map