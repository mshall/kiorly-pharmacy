"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpPaymentProvider = exports.MockPaymentProvider = void 0;
exports.paymentProvider = paymentProvider;
const node_crypto_1 = require("node:crypto");
const http_1 = require("./http");
const provider_env_1 = require("./provider-env");
const payment_mapping_1 = require("./mapping/payment.mapping");
const vendor_kit_1 = require("./vendor-kit");
const h = (s) => (0, node_crypto_1.createHash)("sha256").update(s).digest("hex").slice(0, 16);
class MockPaymentProvider {
    publicBaseUrl;
    mode = "mock";
    name = "mock";
    constructor(publicBaseUrl = "http://localhost:5191") {
        this.publicBaseUrl = publicBaseUrl;
    }
    async charge(r) {
        const providerRef = `mockpsp_${h(`${r.idempotencyKey}:${r.method}`)}`;
        if (r.amount.endsWith(".13") || r.cardToken === "tok_decline")
            return { status: "DECLINED", providerRef, declineReason: r.cardToken === "tok_decline" ? "card_declined" : "MOCK_DECLINED" };
        if (r.method === "WALLET" && !r.walletRef)
            return { status: "DECLINED", providerRef, declineReason: "WALLET_REF_REQUIRED" };
        return { status: "CAPTURED", providerRef };
    }
    async createPayLink(r) {
        const providerRef = `mocklink_${h(r.idempotencyKey)}`;
        return { providerRef, payUrl: `${this.publicBaseUrl}/mock-pay/${providerRef}`, status: "PENDING" };
    }
    async refund(r) {
        return { providerRef: `mockrefund_${h(`${r.providerRef}:${r.idempotencyKey}`)}`, status: "SUCCEEDED" };
    }
    parseWebhook(json) { return payment_mapping_1.paymentMapping.parseWebhook(json); }
}
exports.MockPaymentProvider = MockPaymentProvider;
class HttpPaymentProvider {
    cfg;
    fetchImpl;
    mode = "real";
    name = "payment";
    constructor(cfg, fetchImpl) {
        this.cfg = cfg;
        this.fetchImpl = fetchImpl;
    }
    call(path, body, key) { return (0, http_1.providerRequest)(this.cfg, { path, body, idempotencyKey: key }, payment_mapping_1.paymentMapping.authHeaders(this.cfg), this.fetchImpl); }
    get vendor() { return (0, vendor_kit_1.vendorOf)("PAYMENT"); }
    async charge(r) {
        if (this.vendor)
            throw new http_1.ProviderError("UNSUPPORTED", `${this.vendor} is a hosted-checkout PSP: use pay links (no direct card charge)`);
        return payment_mapping_1.paymentMapping.chargeResult((await this.call(payment_mapping_1.paymentMapping.paths.charge, payment_mapping_1.paymentMapping.chargeBody(r), r.idempotencyKey)).json);
    }
    async createPayLink(r) {
        const v = this.vendor;
        if (v === "fawry")
            return (0, vendor_kit_1.fawryPayLink)(r, this.cfg);
        if (v === "paymob") {
            const c = (0, vendor_kit_1.vendorPayLinkCall)(v, r);
            const res = await (0, http_1.providerRequest)(this.cfg, { path: c.path, body: c.body, idempotencyKey: c.idempotencyKey }, (0, vendor_kit_1.vendorAuthHeaders)(v, this.cfg), this.fetchImpl);
            return (0, vendor_kit_1.vendorPayLinkResult)(v, r, res.json, this.cfg);
        }
        return payment_mapping_1.paymentMapping.payLinkResult((await this.call(payment_mapping_1.paymentMapping.paths.payLink, payment_mapping_1.paymentMapping.payLinkBody(r), r.idempotencyKey)).json);
    }
    async refund(r) {
        const v = this.vendor;
        const minor = Math.round(Number(r.amount) * 100);
        if (v === "paymob") {
            const auth = (0, vendor_kit_1.vendorAuthHeaders)(v, this.cfg);
            const inq = await (0, http_1.providerRequest)(this.cfg, { path: "/api/ecommerce/orders/transaction_inquiry", body: { order_id: r.providerRef } }, auth, this.fetchImpl);
            const ref = await (0, http_1.providerRequest)(this.cfg, { path: "/api/acceptance/void_refund/refund", body: (0, vendor_kit_1.paymobRefundBody)((0, vendor_kit_1.paymobTransactionIdFromInquiry)(inq.json), minor), idempotencyKey: r.idempotencyKey }, auth, this.fetchImpl);
            if (ref.json?.id === undefined)
                throw new http_1.ProviderError("BAD_RESPONSE", "provider refund response has no id");
            return { providerRef: String(ref.json.id), status: "SUCCEEDED" };
        }
        if (v === "fawry") {
            const code = process.env.PAYMENT_MERCHANT_CODE ?? "";
            const key = this.cfg.apiKey ?? "";
            const st = await (0, http_1.providerRequest)(this.cfg, { method: "GET", path: "", absoluteUrl: (0, vendor_kit_1.fawryStatusUrl)(this.cfg.apiUrl ?? "", code, key, r.providerRef) }, {}, this.fetchImpl);
            if (!st.json?.fawryRefNumber)
                throw new http_1.ProviderError("BAD_RESPONSE", "provider status has no fawryRefNumber");
            const rr = await (0, http_1.providerRequest)(this.cfg, { path: "/ECommerceWeb/Fawry/payments/refund", body: (0, vendor_kit_1.fawryRefundBody)({ merchantCode: code, secureKey: key, fawryRefNumber: String(st.json.fawryRefNumber), amountMinor: minor, reason: r.reason ?? "refund" }), idempotencyKey: r.idempotencyKey }, {}, this.fetchImpl);
            if (Number(rr.json?.statusCode) !== 200)
                throw new http_1.ProviderError("REJECTED", "provider rejected the refund");
            return { providerRef: String(st.json.fawryRefNumber), status: "SUCCEEDED" };
        }
        return payment_mapping_1.paymentMapping.refundResult((await this.call(payment_mapping_1.paymentMapping.paths.refund, payment_mapping_1.paymentMapping.refundBody(r), r.idempotencyKey)).json);
    }
    parseWebhook(json) { return payment_mapping_1.paymentMapping.parseWebhook(json); }
}
exports.HttpPaymentProvider = HttpPaymentProvider;
function paymentProvider(env = process.env, fetchImpl) {
    const cfg = (0, provider_env_1.providerConfig)("PAYMENT", env);
    return cfg.mode === "real" ? new HttpPaymentProvider(cfg, fetchImpl) : new MockPaymentProvider(env.PUBLIC_BASE_URL?.replace(/\/+$/, ""));
}
//# sourceMappingURL=payment-provider.js.map