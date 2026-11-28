"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingChargeFromEnv = exports.UnwiredRealBillingCharge = exports.MockBillingCharge = exports.BILLING_CHARGE = void 0;
exports.BILLING_CHARGE = Symbol("SUBSCRIPTION_BILLING_CHARGE");
class MockBillingCharge {
    seen = new Map();
    async charge(req) {
        const prev = this.seen.get(req.idempotencyKey);
        if (prev)
            return prev;
        const r = { providerRef: `mock_${req.idempotencyKey}`, status: req.tokenRef.includes("fail") ? "failed" : "succeeded" };
        this.seen.set(req.idempotencyKey, r);
        return r;
    }
}
exports.MockBillingCharge = MockBillingCharge;
class UnwiredRealBillingCharge {
    async charge() { throw new Error("BILLING_MODE=real is not wired yet (NEEDS_HUMAN LG-SUB-5)"); }
}
exports.UnwiredRealBillingCharge = UnwiredRealBillingCharge;
const billingChargeFromEnv = (env = process.env) => (env.BILLING_MODE === "real" ? new UnwiredRealBillingCharge() : new MockBillingCharge());
exports.billingChargeFromEnv = billingChargeFromEnv;
//# sourceMappingURL=billing.port.js.map