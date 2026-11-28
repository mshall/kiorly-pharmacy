"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentMapping = void 0;
const http_1 = require("../http");
const generic_1 = require("./generic");
const id = (json, what) => {
    const v = json?.id;
    if (typeof v !== "string" || !v)
        throw new http_1.ProviderError("BAD_RESPONSE", `provider ${what} response has no id`);
    return v;
};
exports.paymentMapping = {
    paths: { charge: "/charges", payLink: "/pay-links", refund: "/refunds" },
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    chargeBody: (r) => ({ amount: r.amount, currency: r.currency, method: r.method, reference: r.reference, cardToken: r.cardToken, walletRef: r.walletRef, customer: r.customer }),
    chargeResult: (json) => {
        const s = String(json?.status ?? "").toLowerCase();
        return { providerRef: id(json, "charge"), status: /captur|succe|paid/.test(s) ? "CAPTURED" : /declin|fail/.test(s) ? "DECLINED" : "PENDING", declineReason: typeof json?.declineReason === "string" ? json.declineReason : undefined, payUrl: typeof json?.payUrl === "string" ? json.payUrl : undefined };
    },
    payLinkBody: (r) => ({ amount: r.amount, currency: r.currency, reference: r.reference, description: r.description, expiresAt: r.expiresAt, customer: r.customer }),
    payLinkResult: (json) => {
        if (typeof json?.payUrl !== "string" || !/^https?:\/\//.test(json.payUrl))
            throw new http_1.ProviderError("BAD_RESPONSE", "provider pay-link response has no payUrl");
        return { providerRef: id(json, "pay-link"), payUrl: json.payUrl, status: "PENDING" };
    },
    refundBody: (r) => ({ chargeId: r.providerRef, amount: r.amount, currency: r.currency, reason: r.reason }),
    refundResult: (json) => ({ providerRef: id(json, "refund"), status: /succe|done|complete/i.test(String(json?.status ?? "")) ? "SUCCEEDED" : "PENDING" }),
    parseWebhook: (json) => (0, generic_1.genericEvents)(json, "payment"),
};
//# sourceMappingURL=payment.mapping.js.map