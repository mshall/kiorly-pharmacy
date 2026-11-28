import type { Edition } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { Capability, CreditWalletPort, EntitlementsPort, MarketPack, MarketPackPort, PlanDefinition, PlansPort, SettlementPort, SubscriptionsPort } from "../ports";
export declare class LocalPlans implements PlansPort {
    getPlan(edition: Edition): PlanDefinition;
    listPlans(): PlanDefinition[];
}
export declare class LocalSubscriptions implements SubscriptionsPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    current(orgId: string): Promise<{
        orgId: string;
        edition: Edition;
        status: string;
        marketCode: string;
    }>;
}
export declare class LocalEntitlements implements EntitlementsPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    isEntitled(orgId: string, capability: Capability, opts?: {
        readOnlyRequest?: boolean;
    }): Promise<boolean>;
    checkLimit(orgId: string, kind: "users" | "branches", countAfter: number): Promise<{
        limit: number;
    } | null>;
}
export declare class LocalCreditWallet implements CreditWalletPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    credit(i: {
        orgId: string;
        amount: string;
        kind: string;
        idempotencyKey: string;
        refType?: string;
        refId?: string;
    }): Promise<{
        created: boolean;
    }>;
    balance(orgId: string): Promise<string>;
}
export declare const DEFAULT_ORDER_FEE_RATE = "0.04";
export declare class LocalSettlement implements SettlementPort {
    private readonly prisma;
    constructor(prisma: PrismaService);
    recordFulfilledOrder(i: {
        orgId: string;
        orderRef: string;
        orderValue: string;
    }): Promise<{
        created: boolean;
        feeAmount: string;
        feeRate: string;
    }>;
    totals(orgId: string): Promise<{
        orders: number;
        fees: string;
        value: string;
    }>;
}
export declare class LocalMarketPacks implements MarketPackPort {
    get(market: string, overrides?: Partial<MarketPack> | null): MarketPack;
}
