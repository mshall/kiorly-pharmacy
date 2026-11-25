/**
 * Seam for @kiorly/commerce-kernel (PH-F09). The kernel package is not published yet (ADR-027), so the product depends ONLY on
 * these interfaces; `local/*` implements them against this product's own tables. When the kernel ships, add `kernel/*`
 * implementations and flip the providers in kernel-adapter.module.ts — no module outside src/kernel-adapter changes.
 * Prices/fees below are DEFAULTS marked NEEDS_HUMAN (KX-12 pricing is a test point, not a decision).
 */
import type { Edition } from "../generated/prisma/client";

export type Capability = "purchasing" | "forecasting" | "transfers" | "central_price_book" | "insurer_claims" | "kiorex_orders";

export interface PlanDefinition {
  edition: Edition;
  /** null = unlimited */
  maxUsers: number | null;
  maxBranches: number | null;
  capabilities: readonly Capability[];
  /** Add-ons that can unlock a capability on this plan (e.g. insurer_claims on Pro). */
  addOns: readonly Capability[];
}

export interface PlansPort {
  getPlan(edition: Edition): PlanDefinition;
  listPlans(): PlanDefinition[];
}

export interface EntitlementsPort {
  isEntitled(orgId: string, capability: Capability, opts?: { readOnlyRequest?: boolean }): Promise<boolean>;
  /** Throws nothing; returns the first violated limit or null. */
  checkLimit(orgId: string, kind: "users" | "branches", countAfter: number): Promise<{ limit: number } | null>;
}

export interface SubscriptionSummary { orgId: string; edition: Edition; status: string; marketCode: string }
export interface SubscriptionsPort {
  current(orgId: string): Promise<SubscriptionSummary>;
}

export interface CreditWalletPort {
  /** Idempotent on (orgId, idempotencyKey). Positive amount = credit. */
  credit(input: { orgId: string; amount: string; kind: string; idempotencyKey: string; refType?: string; refId?: string }): Promise<{ created: boolean }>;
  balance(orgId: string): Promise<string>;
}

export interface SettlementPort {
  /** One settlement entry per fulfilled Kiorex order (idempotent on orderRef). Fee = orderValue * rate (NEEDS_HUMAN default 4%). */
  recordFulfilledOrder(input: { orgId: string; orderRef: string; orderValue: string }): Promise<{ created: boolean; feeAmount: string; feeRate: string }>;
  totals(orgId: string): Promise<{ orders: number; fees: string; value: string }>;
}

export interface MarketPack {
  market: string;
  currency: string;
  locale: string;
  /** Label + default rate for VAT lines on receipts/exports. Presentation only (CLAUDE.md: no tax-authority reporting). */
  vat: { label: string; labelAr: string; defaultRate: string };
  /** Shift variance (cash) above which the owner is alerted (KPPOS04). */
  shiftVarianceThreshold: string;
  coldChainRangeC: { min: number; max: number };
  controlledQuantityLimit: number;
}
export interface MarketPackPort {
  get(market: string, overrides?: Partial<MarketPack> | null): MarketPack;
}

export const KERNEL = {
  plans: Symbol("KERNEL_PLANS"),
  entitlements: Symbol("KERNEL_ENTITLEMENTS"),
  subscriptions: Symbol("KERNEL_SUBSCRIPTIONS"),
  wallet: Symbol("KERNEL_WALLET"),
  settlement: Symbol("KERNEL_SETTLEMENT"),
  marketPacks: Symbol("KERNEL_MARKET_PACKS"),
} as const;
