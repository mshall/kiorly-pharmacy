import type { Edition } from "../generated/prisma/client";
export type Capability = "purchasing" | "forecasting" | "transfers" | "central_price_book" | "insurer_claims" | "kiorex_orders";
export interface PlanDefinition {
    edition: Edition;
    maxUsers: number | null;
    maxBranches: number | null;
    capabilities: readonly Capability[];
    addOns: readonly Capability[];
}
export interface PlansPort {
    getPlan(edition: Edition): PlanDefinition;
    listPlans(): PlanDefinition[];
}
export interface EntitlementsPort {
    isEntitled(orgId: string, capability: Capability, opts?: {
        readOnlyRequest?: boolean;
    }): Promise<boolean>;
    checkLimit(orgId: string, kind: "users" | "branches", countAfter: number): Promise<{
        limit: number;
    } | null>;
}
export interface SubscriptionSummary {
    orgId: string;
    edition: Edition;
    status: string;
    marketCode: string;
}
export interface SubscriptionsPort {
    current(orgId: string): Promise<SubscriptionSummary>;
}
export interface CreditWalletPort {
    credit(input: {
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
export interface SettlementPort {
    recordFulfilledOrder(input: {
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
export interface MarketPack {
    market: string;
    currency: string;
    locale: string;
    vat: {
        label: string;
        labelAr: string;
        defaultRate: string;
    };
    shiftVarianceThreshold: string;
    coldChainRangeC: {
        min: number;
        max: number;
    };
    controlledQuantityLimit: number;
}
export interface MarketPackPort {
    get(market: string, overrides?: Partial<MarketPack> | null): MarketPack;
}
export declare const KERNEL: {
    readonly plans: symbol;
    readonly entitlements: symbol;
    readonly subscriptions: symbol;
    readonly wallet: symbol;
    readonly settlement: symbol;
    readonly marketPacks: symbol;
};
