import { Inject, Injectable } from "@nestjs/common";
import type { Edition } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  Capability, CreditWalletPort, EntitlementsPort, MarketPack, MarketPackPort, PlanDefinition, PlansPort, SettlementPort, SubscriptionsPort,
} from "../ports";
import { D, money } from "../../common/money";

/** KX-06 §02 capability matrix. Lite/Pro/Chain/Enterprise. Safety controls are in EVERY edition and are not listed (not capabilities). */
const PLANS: Record<Edition, PlanDefinition> = {
  LITE: { edition: "LITE", maxUsers: 2, maxBranches: 1, capabilities: ["kiorex_orders"], addOns: [] },
  PRO: { edition: "PRO", maxUsers: 5, maxBranches: null, capabilities: ["kiorex_orders", "purchasing", "forecasting"], addOns: ["insurer_claims"] },
  CHAIN: { edition: "CHAIN", maxUsers: null, maxBranches: null, capabilities: ["kiorex_orders", "purchasing", "forecasting", "transfers", "central_price_book", "insurer_claims"], addOns: [] },
  ENTERPRISE: { edition: "ENTERPRISE", maxUsers: null, maxBranches: null, capabilities: ["kiorex_orders", "purchasing", "forecasting", "transfers", "central_price_book", "insurer_claims"], addOns: [] },
};

@Injectable()
export class LocalPlans implements PlansPort {
  getPlan(edition: Edition) { return PLANS[edition]; }
  listPlans() { return Object.values(PLANS); }
}

@Injectable()
export class LocalSubscriptions implements SubscriptionsPort {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async current(orgId: string) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    return { orgId, edition: t.edition, status: t.subscriptionStatus, marketCode: t.marketCode };
  }
}

@Injectable()
export class LocalEntitlements implements EntitlementsPort {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async isEntitled(orgId: string, capability: Capability): Promise<boolean> {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    if (t.subscriptionStatus === "SUSPENDED") return false;
    const plan = PLANS[t.edition];
    if (plan.capabilities.includes(capability)) return true;
    const addons = ((t.settings as { addOns?: string[] } | null)?.addOns ?? []) as string[];
    return plan.addOns.includes(capability) && addons.includes(capability);
  }

  async checkLimit(orgId: string, kind: "users" | "branches", countAfter: number) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    const plan = PLANS[t.edition];
    const limit = kind === "users" ? plan.maxUsers : plan.maxBranches;
    return limit != null && countAfter > limit ? { limit } : null;
  }
}

@Injectable()
export class LocalCreditWallet implements CreditWalletPort {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async credit(i: { orgId: string; amount: string; kind: string; idempotencyKey: string; refType?: string; refId?: string }) {
    try {
      await this.prisma.walletEntry.create({ data: { orgId: i.orgId, amount: i.amount, kind: i.kind, idempotencyKey: i.idempotencyKey, refType: i.refType, refId: i.refId } });
      return { created: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { created: false };
      throw e;
    }
  }
  async balance(orgId: string) {
    const r = await this.prisma.walletEntry.aggregate({ where: { orgId }, _sum: { amount: true } });
    return money(r._sum.amount);
  }
}

/** NEEDS_HUMAN default: 4% of fulfilled order value (KX-06 §05 test point), higher-of rule is applied by the kernel at invoice time. */
export const DEFAULT_ORDER_FEE_RATE = "0.04";

@Injectable()
export class LocalSettlement implements SettlementPort {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async recordFulfilledOrder(i: { orgId: string; orderRef: string; orderValue: string }) {
    const rate = process.env.KIOREX_ORDER_FEE_RATE ?? DEFAULT_ORDER_FEE_RATE;
    const fee = money(D(i.orderValue).mul(rate));
    try {
      await this.prisma.settlementEntry.create({ data: { orgId: i.orgId, orderRef: i.orderRef, orderValue: i.orderValue, feeRate: rate, feeAmount: fee } });
      return { created: true, feeAmount: fee, feeRate: rate };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const ex = await this.prisma.settlementEntry.findUniqueOrThrow({ where: { orgId_orderRef: { orgId: i.orgId, orderRef: i.orderRef } } });
        return { created: false, feeAmount: money(ex.feeAmount), feeRate: ex.feeRate.toString() };
      }
      throw e;
    }
  }
  async totals(orgId: string) {
    const r = await this.prisma.settlementEntry.aggregate({ where: { orgId }, _sum: { feeAmount: true, orderValue: true }, _count: true });
    return { orders: r._count, fees: money(r._sum.feeAmount), value: money(r._sum.orderValue) };
  }
}

/** Egypt market pack. NEEDS_HUMAN: VAT default (medicines are often exempt/reduced), variance threshold, controlled quantity limit. */
const PACKS: Record<string, MarketPack> = {
  EG: {
    market: "EG", currency: "EGP", locale: "ar-EG",
    vat: { label: "VAT", labelAr: "ضريبة القيمة المضافة", defaultRate: "0.14" },
    shiftVarianceThreshold: "50.00",
    coldChainRangeC: { min: 2, max: 8 },
    controlledQuantityLimit: 3,
  },
};

@Injectable()
export class LocalMarketPacks implements MarketPackPort {
  get(market: string, overrides?: Partial<MarketPack> | null): MarketPack {
    const base = PACKS[market.toUpperCase()] ?? PACKS.EG!;
    return { ...base, ...(overrides ?? {}), vat: { ...base.vat, ...(overrides?.vat ?? {}) }, coldChainRangeC: { ...base.coldChainRangeC, ...(overrides?.coldChainRangeC ?? {}) } };
  }
}
