"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMessageProvider = exports.MockMessageProvider = void 0;
exports.messageProvider = messageProvider;
const node_crypto_1 = require("node:crypto");
const http_1 = require("./http");
const provider_env_1 = require("./provider-env");
const sms_mapping_1 = require("./mapping/sms.mapping");
const email_mapping_1 = require("./mapping/email.mapping");
const whatsapp_mapping_1 = require("./mapping/whatsapp.mapping");
const vendor_kit_1 = require("./vendor-kit");
const MAPPINGS = { SMS: sms_mapping_1.smsMapping, EMAIL: email_mapping_1.emailMapping, WHATSAPP: whatsapp_mapping_1.whatsappMapping };
class MockMessageProvider {
    kind;
    mode = "mock";
    name = "mock";
    constructor(kind) {
        this.kind = kind;
    }
    async send(req) {
        if (/-fail$|^fail@/i.test(req.to))
            throw new http_1.ProviderError("REJECTED", "mock provider rejected recipient", 422);
        return { providerMessageId: `mock_${this.kind.toLowerCase()}_${(0, node_crypto_1.createHash)("sha256").update(req.idempotencyKey).digest("hex").slice(0, 16)}`, status: "SENT" };
    }
    parseWebhook(json) { return MAPPINGS[this.kind].parseWebhook(json); }
}
exports.MockMessageProvider = MockMessageProvider;
class HttpMessageProvider {
    kind;
    cfg;
    fetchImpl;
    mode = "real";
    name;
    constructor(kind, cfg, fetchImpl) {
        this.kind = kind;
        this.cfg = cfg;
        this.fetchImpl = fetchImpl;
        this.name = kind.toLowerCase();
    }
    async send(req) {
        const vendor = (0, vendor_kit_1.vendorOf)(this.kind);
        if (vendor) {
            const w = (0, vendor_kit_1.vendorSend)(vendor, { ...req, from: req.from ?? this.cfg.senderId }, this.cfg);
            const r = await (0, http_1.providerRequest)(this.cfg, { path: w.path, body: w.body, form: w.form, sign: w.sign, idempotencyKey: req.idempotencyKey }, (0, vendor_kit_1.vendorAuthHeaders)(vendor, this.cfg), this.fetchImpl);
            return (0, vendor_kit_1.vendorParseSend)(vendor, r.json);
        }
        const m = MAPPINGS[this.kind];
        const res = await (0, http_1.providerRequest)(this.cfg, { path: m.sendPath, body: m.toRequest({ ...req, from: req.from ?? this.cfg.senderId }, this.cfg), idempotencyKey: req.idempotencyKey }, m.authHeaders(this.cfg), this.fetchImpl);
        return m.fromResponse(res.json);
    }
    parseWebhook(json) { return MAPPINGS[this.kind].parseWebhook(json); }
}
exports.HttpMessageProvider = HttpMessageProvider;
function messageProvider(kind, env = process.env, fetchImpl) {
    const cfg = (0, provider_env_1.providerConfig)(kind, env);
    return cfg.mode === "real" ? new HttpMessageProvider(kind, cfg, fetchImpl) : new MockMessageProvider(kind);
}
//# sourceMappingURL=messaging-provider.js.map