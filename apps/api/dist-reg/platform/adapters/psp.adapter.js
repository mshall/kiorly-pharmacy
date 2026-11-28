"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pspProvider = exports.SwitchingPspAdapter = exports.RealPspAdapter = exports.MockPspAdapter = exports.PspAdapter = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const adapter_mode_1 = require("./adapter-mode");
const http_1 = require("../../providers/http");
const payment_provider_1 = require("../../providers/payment-provider");
class PspAdapter {
    createPayLink(r) { return (0, payment_provider_1.paymentProvider)(process.env, PspAdapter.fetchImpl).createPayLink(r); }
    refundPayment(r) { return (0, payment_provider_1.paymentProvider)(process.env, PspAdapter.fetchImpl).refund(r); }
    static fetchImpl;
}
exports.PspAdapter = PspAdapter;
let MockPspAdapter = class MockPspAdapter extends PspAdapter {
    async charge(i) {
        const reference = `mockpsp_${(0, node_crypto_1.createHash)("sha256").update(`${i.orgId}:${i.idempotencyKey}:${i.method}`).digest("hex").slice(0, 16)}`;
        if (i.amount.endsWith(".13"))
            return { status: "DECLINED", reference, declineReason: "MOCK_DECLINED" };
        if (i.method === "WALLET" && !i.walletRef)
            return { status: "DECLINED", reference, declineReason: "WALLET_REF_REQUIRED" };
        return { status: "CAPTURED", reference };
    }
    async refund(i) {
        return { reference: `mockrefund_${(0, node_crypto_1.createHash)("sha256").update(`${i.orgId}:${i.reference}:${i.idempotencyKey}`).digest("hex").slice(0, 16)}` };
    }
};
exports.MockPspAdapter = MockPspAdapter;
exports.MockPspAdapter = MockPspAdapter = __decorate([
    (0, common_1.Injectable)()
], MockPspAdapter);
let RealPspAdapter = class RealPspAdapter extends PspAdapter {
    currency() { return process.env.PAYMENT_CURRENCY?.trim() || "EGP"; }
    async charge(i) {
        try {
            const r = await (0, payment_provider_1.paymentProvider)(process.env, PspAdapter.fetchImpl).charge({ amount: i.amount, currency: this.currency(), method: i.method, reference: i.idempotencyKey, idempotencyKey: i.idempotencyKey, walletRef: i.walletRef });
            if (r.status === "CAPTURED")
                return { status: "CAPTURED", reference: r.providerRef };
            return { status: "DECLINED", reference: r.providerRef, declineReason: r.status === "PENDING" ? "PAYMENT_PENDING" : r.declineReason ?? "DECLINED" };
        }
        catch (e) {
            if (e instanceof http_1.ProviderError)
                return { status: "DECLINED", reference: `psp_error_${(0, node_crypto_1.createHash)("sha256").update(i.idempotencyKey).digest("hex").slice(0, 12)}`, declineReason: `PSP_${e.code}` };
            throw e;
        }
    }
    async refund(i) {
        const r = await (0, payment_provider_1.paymentProvider)(process.env, PspAdapter.fetchImpl).refund({ providerRef: i.reference, amount: i.amount, currency: this.currency(), idempotencyKey: i.idempotencyKey });
        return { reference: r.providerRef };
    }
};
exports.RealPspAdapter = RealPspAdapter;
exports.RealPspAdapter = RealPspAdapter = __decorate([
    (0, common_1.Injectable)()
], RealPspAdapter);
let SwitchingPspAdapter = class SwitchingPspAdapter extends PspAdapter {
    mock = new MockPspAdapter();
    real = new RealPspAdapter();
    pick() { return (0, adapter_mode_1.adapterMode)("PSP") === "real" ? this.real : this.mock; }
    charge(i) { return this.pick().charge(i); }
    refund(i) { return this.pick().refund(i); }
};
exports.SwitchingPspAdapter = SwitchingPspAdapter;
exports.SwitchingPspAdapter = SwitchingPspAdapter = __decorate([
    (0, common_1.Injectable)()
], SwitchingPspAdapter);
exports.pspProvider = { provide: PspAdapter, useFactory: () => new SwitchingPspAdapter() };
//# sourceMappingURL=psp.adapter.js.map