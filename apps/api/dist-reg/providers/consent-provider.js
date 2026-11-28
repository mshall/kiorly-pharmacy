"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpConsentRegistry = exports.MockConsentRegistry = void 0;
exports.consentRegistry = consentRegistry;
const node_crypto_1 = require("node:crypto");
const http_1 = require("./http");
const provider_env_1 = require("./provider-env");
const consent_mapping_1 = require("./mapping/consent.mapping");
const h = (s) => (0, node_crypto_1.createHash)("sha256").update(s).digest("hex").slice(0, 16);
class MockConsentRegistry {
    mode = "mock";
    name = "mock";
    async grant(r) { return { providerRef: `mockconsent_${h(r.idempotencyKey)}`, status: "ACTIVE", expiresAt: r.expiresAt }; }
    async query(subjectRef, purpose) { return { subjectRef, purpose, consents: [] }; }
    async revoke(r) { return { providerRef: r.providerRef, status: "REVOKED" }; }
    async introspect(token, _ctx) {
        if (!token)
            return { valid: false, reason: "MISSING" };
        if (!/^ct_[A-Za-z0-9_-]{4,}$/.test(token))
            return { valid: false, reason: "MALFORMED" };
        if (token.startsWith("ct_revoked"))
            return { valid: false, reason: "REVOKED" };
        if (token.startsWith("ct_expired"))
            return { valid: false, reason: "EXPIRED" };
        return { valid: true, expiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString() };
    }
    parseWebhook(json) { return consent_mapping_1.consentMapping.parseWebhook(json); }
}
exports.MockConsentRegistry = MockConsentRegistry;
class HttpConsentRegistry {
    cfg;
    fetchImpl;
    mode = "real";
    name = "consent";
    constructor(cfg, fetchImpl) {
        this.cfg = cfg;
        this.fetchImpl = fetchImpl;
    }
    call(req) { return (0, http_1.providerRequest)(this.cfg, req, consent_mapping_1.consentMapping.authHeaders(this.cfg), this.fetchImpl); }
    async grant(r) { return consent_mapping_1.consentMapping.grantResult((await this.call({ path: consent_mapping_1.consentMapping.paths.grant, body: consent_mapping_1.consentMapping.grantBody(r), idempotencyKey: r.idempotencyKey })).json); }
    async query(subjectRef, purpose) { return consent_mapping_1.consentMapping.queryResult((await this.call({ method: "GET", path: consent_mapping_1.consentMapping.queryPath(subjectRef, purpose) })).json, subjectRef, purpose); }
    async revoke(r) { return consent_mapping_1.consentMapping.revokeResult((await this.call({ path: consent_mapping_1.consentMapping.paths.revoke(r.providerRef), body: consent_mapping_1.consentMapping.revokeBody(r), idempotencyKey: r.idempotencyKey })).json, r.providerRef); }
    async introspect(token, ctx) {
        if (!token)
            return { valid: false, reason: "MISSING" };
        return consent_mapping_1.consentMapping.introspectResult((await this.call({ path: consent_mapping_1.consentMapping.paths.introspect, body: consent_mapping_1.consentMapping.introspectBody(token, ctx) })).json);
    }
    parseWebhook(json) { return consent_mapping_1.consentMapping.parseWebhook(json); }
}
exports.HttpConsentRegistry = HttpConsentRegistry;
function consentRegistry(env = process.env, fetchImpl) {
    const cfg = (0, provider_env_1.providerConfig)("CONSENT", env);
    return cfg.mode === "real" ? new HttpConsentRegistry(cfg, fetchImpl) : new MockConsentRegistry();
}
//# sourceMappingURL=consent-provider.js.map