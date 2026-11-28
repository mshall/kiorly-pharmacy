"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalMarketPacks = exports.LocalSettlement = exports.DEFAULT_ORDER_FEE_RATE = exports.LocalCreditWallet = exports.LocalEntitlements = exports.LocalSubscriptions = exports.LocalPlans = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const money_1 = require("../../common/money");
const PLANS = {
    LITE: { edition: "LITE", maxUsers: 2, maxBranches: 1, capabilities: ["kiorex_orders"], addOns: [] },
    PRO: { edition: "PRO", maxUsers: 5, maxBranches: null, capabilities: ["kiorex_orders", "purchasing", "forecasting"], addOns: ["insurer_claims"] },
    CHAIN: { edition: "CHAIN", maxUsers: null, maxBranches: null, capabilities: ["kiorex_orders", "purchasing", "forecasting", "transfers", "central_price_book", "insurer_claims"], addOns: [] },
    ENTERPRISE: { edition: "ENTERPRISE", maxUsers: null, maxBranches: null, capabilities: ["kiorex_orders", "purchasing", "forecasting", "transfers", "central_price_book", "insurer_claims"], addOns: [] },
};
let LocalPlans = class LocalPlans {
    getPlan(edition) { return PLANS[edition]; }
    listPlans() { return Object.values(PLANS); }
};
exports.LocalPlans = LocalPlans;
exports.LocalPlans = LocalPlans = __decorate([
    (0, common_1.Injectable)()
], LocalPlans);
let LocalSubscriptions = class LocalSubscriptions {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async current(orgId) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        return { orgId, edition: t.edition, status: t.subscriptionStatus, marketCode: t.marketCode };
    }
};
exports.LocalSubscriptions = LocalSubscriptions;
exports.LocalSubscriptions = LocalSubscriptions = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalSubscriptions);
let LocalEntitlements = class LocalEntitlements {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async isEntitled(orgId, capability, opts = {}) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        if (t.subscriptionStatus === "SUSPENDED")
            return false;
        const plan = PLANS[t.edition];
        if (plan.capabilities.includes(capability))
            return true;
        if (opts.readOnlyRequest) {
            const s = await this.prisma.orgSubscription.findUnique({ where: { orgId } });
            if (s?.previousEdition && s.liteReadOnlyGraceUntil && s.liteReadOnlyGraceUntil > new Date() && PLANS[s.previousEdition].capabilities.includes(capability))
                return true;
        }
        const addons = (t.settings?.addOns ?? []);
        return plan.addOns.includes(capability) && addons.includes(capability);
    }
    async checkLimit(orgId, kind, countAfter) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        const plan = PLANS[t.edition];
        const limit = kind === "users" ? plan.maxUsers : plan.maxBranches;
        return limit != null && countAfter > limit ? { limit } : null;
    }
};
exports.LocalEntitlements = LocalEntitlements;
exports.LocalEntitlements = LocalEntitlements = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalEntitlements);
let LocalCreditWallet = class LocalCreditWallet {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async credit(i) {
        try {
            await this.prisma.walletEntry.create({ data: { orgId: i.orgId, amount: i.amount, kind: i.kind, idempotencyKey: i.idempotencyKey, refType: i.refType, refId: i.refId } });
            return { created: true };
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002")
                return { created: false };
            throw e;
        }
    }
    async balance(orgId) {
        const r = await this.prisma.walletEntry.aggregate({ where: { orgId }, _sum: { amount: true } });
        return (0, money_1.money)(r._sum.amount);
    }
};
exports.LocalCreditWallet = LocalCreditWallet;
exports.LocalCreditWallet = LocalCreditWallet = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalCreditWallet);
exports.DEFAULT_ORDER_FEE_RATE = "0.04";
let LocalSettlement = class LocalSettlement {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordFulfilledOrder(i) {
        const rate = process.env.KIOREX_ORDER_FEE_RATE ?? exports.DEFAULT_ORDER_FEE_RATE;
        const fee = (0, money_1.money)((0, money_1.D)(i.orderValue).mul(rate));
        try {
            await this.prisma.settlementEntry.create({ data: { orgId: i.orgId, orderRef: i.orderRef, orderValue: i.orderValue, feeRate: rate, feeAmount: fee } });
            return { created: true, feeAmount: fee, feeRate: rate };
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                const ex = await this.prisma.settlementEntry.findUniqueOrThrow({ where: { orgId_orderRef: { orgId: i.orgId, orderRef: i.orderRef } } });
                return { created: false, feeAmount: (0, money_1.money)(ex.feeAmount), feeRate: ex.feeRate.toString() };
            }
            throw e;
        }
    }
    async totals(orgId) {
        const r = await this.prisma.settlementEntry.aggregate({ where: { orgId }, _sum: { feeAmount: true, orderValue: true }, _count: true });
        return { orders: r._count, fees: (0, money_1.money)(r._sum.feeAmount), value: (0, money_1.money)(r._sum.orderValue) };
    }
};
exports.LocalSettlement = LocalSettlement;
exports.LocalSettlement = LocalSettlement = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalSettlement);
const PACKS = {
    EG: {
        market: "EG", currency: "EGP", locale: "ar-EG",
        vat: { label: "VAT", labelAr: "ضريبة القيمة المضافة", defaultRate: "0.14" },
        shiftVarianceThreshold: "50.00",
        coldChainRangeC: { min: 2, max: 8 },
        controlledQuantityLimit: 3,
    },
};
let LocalMarketPacks = class LocalMarketPacks {
    get(market, overrides) {
        const base = PACKS[market.toUpperCase()] ?? PACKS.EG;
        return { ...base, ...(overrides ?? {}), vat: { ...base.vat, ...(overrides?.vat ?? {}) }, coldChainRangeC: { ...base.coldChainRangeC, ...(overrides?.coldChainRangeC ?? {}) } };
    }
};
exports.LocalMarketPacks = LocalMarketPacks;
exports.LocalMarketPacks = LocalMarketPacks = __decorate([
    (0, common_1.Injectable)()
], LocalMarketPacks);
//# sourceMappingURL=local-kernel.js.map