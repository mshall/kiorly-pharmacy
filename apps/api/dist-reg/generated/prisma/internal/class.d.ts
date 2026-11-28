import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.PrismaClientConstructorArgs<Options>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = Prisma.PrismaClientOptions['omit'], in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    $connect(): runtime.Types.Utils.JsPromise<void>;
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    get tenant(): Prisma.TenantDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get branch(): Prisma.BranchDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get staffUser(): Prisma.StaffUserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get passportSession(): Prisma.PassportSessionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get passportRevocation(): Prisma.PassportRevocationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get logoutTokenSeen(): Prisma.LogoutTokenSeenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get drug(): Prisma.DrugDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get substitutionGroup(): Prisma.SubstitutionGroupDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get priceBookEntry(): Prisma.PriceBookEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get supplier(): Prisma.SupplierDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get purchaseOrder(): Prisma.PurchaseOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get purchaseOrderLine(): Prisma.PurchaseOrderLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get recallNotice(): Prisma.RecallNoticeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockLot(): Prisma.StockLotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockMovement(): Prisma.StockMovementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get coldChainReading(): Prisma.ColdChainReadingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockCount(): Prisma.StockCountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockCountLine(): Prisma.StockCountLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get patientRef(): Prisma.PatientRefDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customerNote(): Prisma.CustomerNoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get familyLink(): Prisma.FamilyLinkDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get loyaltyEntry(): Prisma.LoyaltyEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get prescription(): Prisma.PrescriptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get prescriptionLine(): Prisma.PrescriptionLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get dispensing(): Prisma.DispensingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get dispensingLine(): Prisma.DispensingLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get safetyCheckResult(): Prisma.SafetyCheckResultDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get controlledSubstanceLogEntry(): Prisma.ControlledSubstanceLogEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get shift(): Prisma.ShiftDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get sale(): Prisma.SaleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get saleLine(): Prisma.SaleLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get salePayment(): Prisma.SalePaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get saleReturn(): Prisma.SaleReturnDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customerAccount(): Prisma.CustomerAccountDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get customerCreditEntry(): Prisma.CustomerCreditEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get outboxEvent(): Prisma.OutboxEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get auditLog(): Prisma.AuditLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get flagSnapshotCache(): Prisma.FlagSnapshotCacheDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get reorderPolicy(): Prisma.ReorderPolicyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get supplierLedgerEntry(): Prisma.SupplierLedgerEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get goodsReceipt(): Prisma.GoodsReceiptDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get goodsReceiptLine(): Prisma.GoodsReceiptLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get supplierReturn(): Prisma.SupplierReturnDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get expiryAlert(): Prisma.ExpiryAlertDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockTransfer(): Prisma.StockTransferDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get stockTransferLine(): Prisma.StockTransferLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get branchMarketplaceSetting(): Prisma.BranchMarketplaceSettingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get kiorexCommissionRateView(): Prisma.KiorexCommissionRateViewDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get kiorexOrder(): Prisma.KiorexOrderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get kiorexOrderLine(): Prisma.KiorexOrderLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get integrationClient(): Prisma.IntegrationClientDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get inboundEvent(): Prisma.InboundEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get notification(): Prisma.NotificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get insurerClaim(): Prisma.InsurerClaimDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get syncConflict(): Prisma.SyncConflictDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get walletEntry(): Prisma.WalletEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get settlementEntry(): Prisma.SettlementEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rolePermissionOverride(): Prisma.RolePermissionOverrideDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get prescriber(): Prisma.PrescriberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rxRefill(): Prisma.RxRefillDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get refillReminder(): Prisma.RefillReminderDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rxTransfer(): Prisma.RxTransferDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get clinicalRule(): Prisma.ClinicalRuleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get controlledRegisterEntry(): Prisma.ControlledRegisterEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get controlledDiscrepancy(): Prisma.ControlledDiscrepancyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get promotion(): Prisma.PromotionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get promotionRedemption(): Prisma.PromotionRedemptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get heldCart(): Prisma.HeldCartDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get cashMovement(): Prisma.CashMovementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get shelfLocation(): Prisma.ShelfLocationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get uomConversion(): Prisma.UomConversionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get requestForQuote(): Prisma.RequestForQuoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rfqLine(): Prisma.RfqLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rfqQuote(): Prisma.RfqQuoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rfqQuoteLine(): Prisma.RfqQuoteLineDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get expense(): Prisma.ExpenseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get claimPayment(): Prisma.ClaimPaymentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get alert(): Prisma.AlertDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get mobileDevice(): Prisma.MobileDeviceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get pushMessage(): Prisma.PushMessageDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get mobileUpgradeRequest(): Prisma.MobileUpgradeRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get mobileAlertAck(): Prisma.MobileAlertAckDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get controlledCountersign(): Prisma.ControlledCountersignDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get payLink(): Prisma.PayLinkDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get providerWebhookEvent(): Prisma.ProviderWebhookEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get consentRecord(): Prisma.ConsentRecordDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get handoffCode(): Prisma.HandoffCodeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rateLimitBucket(): Prisma.RateLimitBucketDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get providerReferralLink(): Prisma.ProviderReferralLinkDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get providerReferralLinkDaily(): Prisma.ProviderReferralLinkDailyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get orgSubscription(): Prisma.OrgSubscriptionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get subscriptionEvent(): Prisma.SubscriptionEventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get subscriptionNotice(): Prisma.SubscriptionNoticeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get subscriptionInvoice(): Prisma.SubscriptionInvoiceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get planPrice(): Prisma.PlanPriceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get demoMarker(): Prisma.DemoMarkerDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
