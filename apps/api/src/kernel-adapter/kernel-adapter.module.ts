import { Global, Module } from "@nestjs/common";
import { KERNEL } from "./ports";
import { LocalCreditWallet, LocalEntitlements, LocalMarketPacks, LocalPlans, LocalSettlement, LocalSubscriptions } from "./local/local-kernel";
import { RequiresEntitlementGuard } from "./requires-entitlement.guard";

/** Swap `useClass` for the real @kiorly/commerce-kernel implementations when it is published (ADR-027). */
@Global()
@Module({
  providers: [
    { provide: KERNEL.plans, useClass: LocalPlans },
    { provide: KERNEL.entitlements, useClass: LocalEntitlements },
    { provide: KERNEL.subscriptions, useClass: LocalSubscriptions },
    { provide: KERNEL.wallet, useClass: LocalCreditWallet },
    { provide: KERNEL.settlement, useClass: LocalSettlement },
    { provide: KERNEL.marketPacks, useClass: LocalMarketPacks },
    RequiresEntitlementGuard,
  ],
  exports: [KERNEL.plans, KERNEL.entitlements, KERNEL.subscriptions, KERNEL.wallet, KERNEL.settlement, KERNEL.marketPacks, RequiresEntitlementGuard],
})
export class KernelAdapterModule {}
