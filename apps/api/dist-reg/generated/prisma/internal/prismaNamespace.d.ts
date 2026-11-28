import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> = [
    PrismaClientOptions
] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? ((Without<T, U> & U) | (Without<U, T> & T)) & object : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Tenant: "Tenant";
    readonly Branch: "Branch";
    readonly StaffUser: "StaffUser";
    readonly PassportSession: "PassportSession";
    readonly PassportRevocation: "PassportRevocation";
    readonly LogoutTokenSeen: "LogoutTokenSeen";
    readonly Drug: "Drug";
    readonly SubstitutionGroup: "SubstitutionGroup";
    readonly PriceBookEntry: "PriceBookEntry";
    readonly Supplier: "Supplier";
    readonly PurchaseOrder: "PurchaseOrder";
    readonly PurchaseOrderLine: "PurchaseOrderLine";
    readonly RecallNotice: "RecallNotice";
    readonly StockLot: "StockLot";
    readonly StockMovement: "StockMovement";
    readonly ColdChainReading: "ColdChainReading";
    readonly StockCount: "StockCount";
    readonly StockCountLine: "StockCountLine";
    readonly PatientRef: "PatientRef";
    readonly CustomerNote: "CustomerNote";
    readonly FamilyLink: "FamilyLink";
    readonly LoyaltyEntry: "LoyaltyEntry";
    readonly Prescription: "Prescription";
    readonly PrescriptionLine: "PrescriptionLine";
    readonly Dispensing: "Dispensing";
    readonly DispensingLine: "DispensingLine";
    readonly SafetyCheckResult: "SafetyCheckResult";
    readonly ControlledSubstanceLogEntry: "ControlledSubstanceLogEntry";
    readonly Shift: "Shift";
    readonly Sale: "Sale";
    readonly SaleLine: "SaleLine";
    readonly SalePayment: "SalePayment";
    readonly SaleReturn: "SaleReturn";
    readonly CustomerAccount: "CustomerAccount";
    readonly CustomerCreditEntry: "CustomerCreditEntry";
    readonly OutboxEvent: "OutboxEvent";
    readonly AuditLog: "AuditLog";
    readonly FlagSnapshotCache: "FlagSnapshotCache";
    readonly ReorderPolicy: "ReorderPolicy";
    readonly SupplierLedgerEntry: "SupplierLedgerEntry";
    readonly GoodsReceipt: "GoodsReceipt";
    readonly GoodsReceiptLine: "GoodsReceiptLine";
    readonly SupplierReturn: "SupplierReturn";
    readonly ExpiryAlert: "ExpiryAlert";
    readonly StockTransfer: "StockTransfer";
    readonly StockTransferLine: "StockTransferLine";
    readonly BranchMarketplaceSetting: "BranchMarketplaceSetting";
    readonly KiorexCommissionRateView: "KiorexCommissionRateView";
    readonly KiorexOrder: "KiorexOrder";
    readonly KiorexOrderLine: "KiorexOrderLine";
    readonly IntegrationClient: "IntegrationClient";
    readonly InboundEvent: "InboundEvent";
    readonly Notification: "Notification";
    readonly InsurerClaim: "InsurerClaim";
    readonly SyncConflict: "SyncConflict";
    readonly WalletEntry: "WalletEntry";
    readonly SettlementEntry: "SettlementEntry";
    readonly RolePermissionOverride: "RolePermissionOverride";
    readonly Prescriber: "Prescriber";
    readonly RxRefill: "RxRefill";
    readonly RefillReminder: "RefillReminder";
    readonly RxTransfer: "RxTransfer";
    readonly ClinicalRule: "ClinicalRule";
    readonly ControlledRegisterEntry: "ControlledRegisterEntry";
    readonly ControlledDiscrepancy: "ControlledDiscrepancy";
    readonly Promotion: "Promotion";
    readonly PromotionRedemption: "PromotionRedemption";
    readonly HeldCart: "HeldCart";
    readonly CashMovement: "CashMovement";
    readonly ShelfLocation: "ShelfLocation";
    readonly UomConversion: "UomConversion";
    readonly RequestForQuote: "RequestForQuote";
    readonly RfqLine: "RfqLine";
    readonly RfqQuote: "RfqQuote";
    readonly RfqQuoteLine: "RfqQuoteLine";
    readonly Expense: "Expense";
    readonly ClaimPayment: "ClaimPayment";
    readonly Alert: "Alert";
    readonly MobileDevice: "MobileDevice";
    readonly PushMessage: "PushMessage";
    readonly MobileUpgradeRequest: "MobileUpgradeRequest";
    readonly MobileAlertAck: "MobileAlertAck";
    readonly ControlledCountersign: "ControlledCountersign";
    readonly PayLink: "PayLink";
    readonly ProviderWebhookEvent: "ProviderWebhookEvent";
    readonly ConsentRecord: "ConsentRecord";
    readonly HandoffCode: "HandoffCode";
    readonly RateLimitBucket: "RateLimitBucket";
    readonly ProviderReferralLink: "ProviderReferralLink";
    readonly ProviderReferralLinkDaily: "ProviderReferralLinkDaily";
    readonly OrgSubscription: "OrgSubscription";
    readonly SubscriptionEvent: "SubscriptionEvent";
    readonly SubscriptionNotice: "SubscriptionNotice";
    readonly SubscriptionInvoice: "SubscriptionInvoice";
    readonly PlanPrice: "PlanPrice";
    readonly DemoMarker: "DemoMarker";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "tenant" | "branch" | "staffUser" | "passportSession" | "passportRevocation" | "logoutTokenSeen" | "drug" | "substitutionGroup" | "priceBookEntry" | "supplier" | "purchaseOrder" | "purchaseOrderLine" | "recallNotice" | "stockLot" | "stockMovement" | "coldChainReading" | "stockCount" | "stockCountLine" | "patientRef" | "customerNote" | "familyLink" | "loyaltyEntry" | "prescription" | "prescriptionLine" | "dispensing" | "dispensingLine" | "safetyCheckResult" | "controlledSubstanceLogEntry" | "shift" | "sale" | "saleLine" | "salePayment" | "saleReturn" | "customerAccount" | "customerCreditEntry" | "outboxEvent" | "auditLog" | "flagSnapshotCache" | "reorderPolicy" | "supplierLedgerEntry" | "goodsReceipt" | "goodsReceiptLine" | "supplierReturn" | "expiryAlert" | "stockTransfer" | "stockTransferLine" | "branchMarketplaceSetting" | "kiorexCommissionRateView" | "kiorexOrder" | "kiorexOrderLine" | "integrationClient" | "inboundEvent" | "notification" | "insurerClaim" | "syncConflict" | "walletEntry" | "settlementEntry" | "rolePermissionOverride" | "prescriber" | "rxRefill" | "refillReminder" | "rxTransfer" | "clinicalRule" | "controlledRegisterEntry" | "controlledDiscrepancy" | "promotion" | "promotionRedemption" | "heldCart" | "cashMovement" | "shelfLocation" | "uomConversion" | "requestForQuote" | "rfqLine" | "rfqQuote" | "rfqQuoteLine" | "expense" | "claimPayment" | "alert" | "mobileDevice" | "pushMessage" | "mobileUpgradeRequest" | "mobileAlertAck" | "controlledCountersign" | "payLink" | "providerWebhookEvent" | "consentRecord" | "handoffCode" | "rateLimitBucket" | "providerReferralLink" | "providerReferralLinkDaily" | "orgSubscription" | "subscriptionEvent" | "subscriptionNotice" | "subscriptionInvoice" | "planPrice" | "demoMarker";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Tenant: {
            payload: Prisma.$TenantPayload<ExtArgs>;
            fields: Prisma.TenantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.TenantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                findFirst: {
                    args: Prisma.TenantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                findMany: {
                    args: Prisma.TenantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                create: {
                    args: Prisma.TenantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                createMany: {
                    args: Prisma.TenantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                delete: {
                    args: Prisma.TenantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                update: {
                    args: Prisma.TenantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                deleteMany: {
                    args: Prisma.TenantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.TenantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>[];
                };
                upsert: {
                    args: Prisma.TenantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$TenantPayload>;
                };
                aggregate: {
                    args: Prisma.TenantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateTenant>;
                };
                groupBy: {
                    args: Prisma.TenantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.TenantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.TenantCountAggregateOutputType> | number;
                };
            };
        };
        Branch: {
            payload: Prisma.$BranchPayload<ExtArgs>;
            fields: Prisma.BranchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BranchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BranchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                findFirst: {
                    args: Prisma.BranchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BranchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                findMany: {
                    args: Prisma.BranchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                create: {
                    args: Prisma.BranchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                createMany: {
                    args: Prisma.BranchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BranchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                delete: {
                    args: Prisma.BranchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                update: {
                    args: Prisma.BranchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                deleteMany: {
                    args: Prisma.BranchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BranchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BranchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>[];
                };
                upsert: {
                    args: Prisma.BranchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchPayload>;
                };
                aggregate: {
                    args: Prisma.BranchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBranch>;
                };
                groupBy: {
                    args: Prisma.BranchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BranchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchCountAggregateOutputType> | number;
                };
            };
        };
        StaffUser: {
            payload: Prisma.$StaffUserPayload<ExtArgs>;
            fields: Prisma.StaffUserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StaffUserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StaffUserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>;
                };
                findFirst: {
                    args: Prisma.StaffUserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StaffUserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>;
                };
                findMany: {
                    args: Prisma.StaffUserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>[];
                };
                create: {
                    args: Prisma.StaffUserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>;
                };
                createMany: {
                    args: Prisma.StaffUserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StaffUserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>[];
                };
                delete: {
                    args: Prisma.StaffUserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>;
                };
                update: {
                    args: Prisma.StaffUserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>;
                };
                deleteMany: {
                    args: Prisma.StaffUserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StaffUserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StaffUserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>[];
                };
                upsert: {
                    args: Prisma.StaffUserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StaffUserPayload>;
                };
                aggregate: {
                    args: Prisma.StaffUserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStaffUser>;
                };
                groupBy: {
                    args: Prisma.StaffUserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StaffUserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StaffUserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StaffUserCountAggregateOutputType> | number;
                };
            };
        };
        PassportSession: {
            payload: Prisma.$PassportSessionPayload<ExtArgs>;
            fields: Prisma.PassportSessionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PassportSessionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PassportSessionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>;
                };
                findFirst: {
                    args: Prisma.PassportSessionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PassportSessionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>;
                };
                findMany: {
                    args: Prisma.PassportSessionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>[];
                };
                create: {
                    args: Prisma.PassportSessionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>;
                };
                createMany: {
                    args: Prisma.PassportSessionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PassportSessionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>[];
                };
                delete: {
                    args: Prisma.PassportSessionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>;
                };
                update: {
                    args: Prisma.PassportSessionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>;
                };
                deleteMany: {
                    args: Prisma.PassportSessionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PassportSessionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PassportSessionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>[];
                };
                upsert: {
                    args: Prisma.PassportSessionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportSessionPayload>;
                };
                aggregate: {
                    args: Prisma.PassportSessionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePassportSession>;
                };
                groupBy: {
                    args: Prisma.PassportSessionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PassportSessionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PassportSessionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PassportSessionCountAggregateOutputType> | number;
                };
            };
        };
        PassportRevocation: {
            payload: Prisma.$PassportRevocationPayload<ExtArgs>;
            fields: Prisma.PassportRevocationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PassportRevocationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PassportRevocationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>;
                };
                findFirst: {
                    args: Prisma.PassportRevocationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PassportRevocationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>;
                };
                findMany: {
                    args: Prisma.PassportRevocationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>[];
                };
                create: {
                    args: Prisma.PassportRevocationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>;
                };
                createMany: {
                    args: Prisma.PassportRevocationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PassportRevocationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>[];
                };
                delete: {
                    args: Prisma.PassportRevocationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>;
                };
                update: {
                    args: Prisma.PassportRevocationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>;
                };
                deleteMany: {
                    args: Prisma.PassportRevocationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PassportRevocationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PassportRevocationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>[];
                };
                upsert: {
                    args: Prisma.PassportRevocationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PassportRevocationPayload>;
                };
                aggregate: {
                    args: Prisma.PassportRevocationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePassportRevocation>;
                };
                groupBy: {
                    args: Prisma.PassportRevocationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PassportRevocationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PassportRevocationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PassportRevocationCountAggregateOutputType> | number;
                };
            };
        };
        LogoutTokenSeen: {
            payload: Prisma.$LogoutTokenSeenPayload<ExtArgs>;
            fields: Prisma.LogoutTokenSeenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LogoutTokenSeenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LogoutTokenSeenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>;
                };
                findFirst: {
                    args: Prisma.LogoutTokenSeenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LogoutTokenSeenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>;
                };
                findMany: {
                    args: Prisma.LogoutTokenSeenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>[];
                };
                create: {
                    args: Prisma.LogoutTokenSeenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>;
                };
                createMany: {
                    args: Prisma.LogoutTokenSeenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LogoutTokenSeenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>[];
                };
                delete: {
                    args: Prisma.LogoutTokenSeenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>;
                };
                update: {
                    args: Prisma.LogoutTokenSeenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>;
                };
                deleteMany: {
                    args: Prisma.LogoutTokenSeenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LogoutTokenSeenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LogoutTokenSeenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>[];
                };
                upsert: {
                    args: Prisma.LogoutTokenSeenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LogoutTokenSeenPayload>;
                };
                aggregate: {
                    args: Prisma.LogoutTokenSeenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLogoutTokenSeen>;
                };
                groupBy: {
                    args: Prisma.LogoutTokenSeenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LogoutTokenSeenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LogoutTokenSeenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LogoutTokenSeenCountAggregateOutputType> | number;
                };
            };
        };
        Drug: {
            payload: Prisma.$DrugPayload<ExtArgs>;
            fields: Prisma.DrugFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DrugFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DrugFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>;
                };
                findFirst: {
                    args: Prisma.DrugFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DrugFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>;
                };
                findMany: {
                    args: Prisma.DrugFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>[];
                };
                create: {
                    args: Prisma.DrugCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>;
                };
                createMany: {
                    args: Prisma.DrugCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DrugCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>[];
                };
                delete: {
                    args: Prisma.DrugDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>;
                };
                update: {
                    args: Prisma.DrugUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>;
                };
                deleteMany: {
                    args: Prisma.DrugDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DrugUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DrugUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>[];
                };
                upsert: {
                    args: Prisma.DrugUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DrugPayload>;
                };
                aggregate: {
                    args: Prisma.DrugAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDrug>;
                };
                groupBy: {
                    args: Prisma.DrugGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DrugGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DrugCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DrugCountAggregateOutputType> | number;
                };
            };
        };
        SubstitutionGroup: {
            payload: Prisma.$SubstitutionGroupPayload<ExtArgs>;
            fields: Prisma.SubstitutionGroupFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubstitutionGroupFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubstitutionGroupFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>;
                };
                findFirst: {
                    args: Prisma.SubstitutionGroupFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubstitutionGroupFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>;
                };
                findMany: {
                    args: Prisma.SubstitutionGroupFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>[];
                };
                create: {
                    args: Prisma.SubstitutionGroupCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>;
                };
                createMany: {
                    args: Prisma.SubstitutionGroupCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubstitutionGroupCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>[];
                };
                delete: {
                    args: Prisma.SubstitutionGroupDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>;
                };
                update: {
                    args: Prisma.SubstitutionGroupUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>;
                };
                deleteMany: {
                    args: Prisma.SubstitutionGroupDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubstitutionGroupUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubstitutionGroupUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>[];
                };
                upsert: {
                    args: Prisma.SubstitutionGroupUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubstitutionGroupPayload>;
                };
                aggregate: {
                    args: Prisma.SubstitutionGroupAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubstitutionGroup>;
                };
                groupBy: {
                    args: Prisma.SubstitutionGroupGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubstitutionGroupGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubstitutionGroupCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubstitutionGroupCountAggregateOutputType> | number;
                };
            };
        };
        PriceBookEntry: {
            payload: Prisma.$PriceBookEntryPayload<ExtArgs>;
            fields: Prisma.PriceBookEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PriceBookEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PriceBookEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>;
                };
                findFirst: {
                    args: Prisma.PriceBookEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PriceBookEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>;
                };
                findMany: {
                    args: Prisma.PriceBookEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>[];
                };
                create: {
                    args: Prisma.PriceBookEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>;
                };
                createMany: {
                    args: Prisma.PriceBookEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PriceBookEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>[];
                };
                delete: {
                    args: Prisma.PriceBookEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>;
                };
                update: {
                    args: Prisma.PriceBookEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.PriceBookEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PriceBookEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PriceBookEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>[];
                };
                upsert: {
                    args: Prisma.PriceBookEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PriceBookEntryPayload>;
                };
                aggregate: {
                    args: Prisma.PriceBookEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePriceBookEntry>;
                };
                groupBy: {
                    args: Prisma.PriceBookEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PriceBookEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PriceBookEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PriceBookEntryCountAggregateOutputType> | number;
                };
            };
        };
        Supplier: {
            payload: Prisma.$SupplierPayload<ExtArgs>;
            fields: Prisma.SupplierFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SupplierFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>;
                };
                findFirst: {
                    args: Prisma.SupplierFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>;
                };
                findMany: {
                    args: Prisma.SupplierFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>[];
                };
                create: {
                    args: Prisma.SupplierCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>;
                };
                createMany: {
                    args: Prisma.SupplierCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SupplierCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>[];
                };
                delete: {
                    args: Prisma.SupplierDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>;
                };
                update: {
                    args: Prisma.SupplierUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>;
                };
                deleteMany: {
                    args: Prisma.SupplierDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SupplierUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SupplierUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>[];
                };
                upsert: {
                    args: Prisma.SupplierUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierPayload>;
                };
                aggregate: {
                    args: Prisma.SupplierAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupplier>;
                };
                groupBy: {
                    args: Prisma.SupplierGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SupplierCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierCountAggregateOutputType> | number;
                };
            };
        };
        PurchaseOrder: {
            payload: Prisma.$PurchaseOrderPayload<ExtArgs>;
            fields: Prisma.PurchaseOrderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PurchaseOrderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PurchaseOrderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>;
                };
                findFirst: {
                    args: Prisma.PurchaseOrderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PurchaseOrderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>;
                };
                findMany: {
                    args: Prisma.PurchaseOrderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>[];
                };
                create: {
                    args: Prisma.PurchaseOrderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>;
                };
                createMany: {
                    args: Prisma.PurchaseOrderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PurchaseOrderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>[];
                };
                delete: {
                    args: Prisma.PurchaseOrderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>;
                };
                update: {
                    args: Prisma.PurchaseOrderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>;
                };
                deleteMany: {
                    args: Prisma.PurchaseOrderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PurchaseOrderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PurchaseOrderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>[];
                };
                upsert: {
                    args: Prisma.PurchaseOrderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderPayload>;
                };
                aggregate: {
                    args: Prisma.PurchaseOrderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePurchaseOrder>;
                };
                groupBy: {
                    args: Prisma.PurchaseOrderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PurchaseOrderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PurchaseOrderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PurchaseOrderCountAggregateOutputType> | number;
                };
            };
        };
        PurchaseOrderLine: {
            payload: Prisma.$PurchaseOrderLinePayload<ExtArgs>;
            fields: Prisma.PurchaseOrderLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PurchaseOrderLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PurchaseOrderLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>;
                };
                findFirst: {
                    args: Prisma.PurchaseOrderLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PurchaseOrderLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>;
                };
                findMany: {
                    args: Prisma.PurchaseOrderLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>[];
                };
                create: {
                    args: Prisma.PurchaseOrderLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>;
                };
                createMany: {
                    args: Prisma.PurchaseOrderLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PurchaseOrderLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>[];
                };
                delete: {
                    args: Prisma.PurchaseOrderLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>;
                };
                update: {
                    args: Prisma.PurchaseOrderLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>;
                };
                deleteMany: {
                    args: Prisma.PurchaseOrderLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PurchaseOrderLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PurchaseOrderLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>[];
                };
                upsert: {
                    args: Prisma.PurchaseOrderLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PurchaseOrderLinePayload>;
                };
                aggregate: {
                    args: Prisma.PurchaseOrderLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePurchaseOrderLine>;
                };
                groupBy: {
                    args: Prisma.PurchaseOrderLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PurchaseOrderLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PurchaseOrderLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PurchaseOrderLineCountAggregateOutputType> | number;
                };
            };
        };
        RecallNotice: {
            payload: Prisma.$RecallNoticePayload<ExtArgs>;
            fields: Prisma.RecallNoticeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RecallNoticeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RecallNoticeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>;
                };
                findFirst: {
                    args: Prisma.RecallNoticeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RecallNoticeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>;
                };
                findMany: {
                    args: Prisma.RecallNoticeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>[];
                };
                create: {
                    args: Prisma.RecallNoticeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>;
                };
                createMany: {
                    args: Prisma.RecallNoticeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RecallNoticeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>[];
                };
                delete: {
                    args: Prisma.RecallNoticeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>;
                };
                update: {
                    args: Prisma.RecallNoticeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>;
                };
                deleteMany: {
                    args: Prisma.RecallNoticeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RecallNoticeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RecallNoticeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>[];
                };
                upsert: {
                    args: Prisma.RecallNoticeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RecallNoticePayload>;
                };
                aggregate: {
                    args: Prisma.RecallNoticeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRecallNotice>;
                };
                groupBy: {
                    args: Prisma.RecallNoticeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RecallNoticeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RecallNoticeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RecallNoticeCountAggregateOutputType> | number;
                };
            };
        };
        StockLot: {
            payload: Prisma.$StockLotPayload<ExtArgs>;
            fields: Prisma.StockLotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockLotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockLotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>;
                };
                findFirst: {
                    args: Prisma.StockLotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockLotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>;
                };
                findMany: {
                    args: Prisma.StockLotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>[];
                };
                create: {
                    args: Prisma.StockLotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>;
                };
                createMany: {
                    args: Prisma.StockLotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockLotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>[];
                };
                delete: {
                    args: Prisma.StockLotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>;
                };
                update: {
                    args: Prisma.StockLotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>;
                };
                deleteMany: {
                    args: Prisma.StockLotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockLotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockLotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>[];
                };
                upsert: {
                    args: Prisma.StockLotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockLotPayload>;
                };
                aggregate: {
                    args: Prisma.StockLotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockLot>;
                };
                groupBy: {
                    args: Prisma.StockLotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockLotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockLotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockLotCountAggregateOutputType> | number;
                };
            };
        };
        StockMovement: {
            payload: Prisma.$StockMovementPayload<ExtArgs>;
            fields: Prisma.StockMovementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockMovementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockMovementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                findFirst: {
                    args: Prisma.StockMovementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockMovementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                findMany: {
                    args: Prisma.StockMovementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>[];
                };
                create: {
                    args: Prisma.StockMovementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                createMany: {
                    args: Prisma.StockMovementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockMovementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>[];
                };
                delete: {
                    args: Prisma.StockMovementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                update: {
                    args: Prisma.StockMovementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                deleteMany: {
                    args: Prisma.StockMovementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockMovementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockMovementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>[];
                };
                upsert: {
                    args: Prisma.StockMovementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockMovementPayload>;
                };
                aggregate: {
                    args: Prisma.StockMovementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockMovement>;
                };
                groupBy: {
                    args: Prisma.StockMovementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockMovementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockMovementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockMovementCountAggregateOutputType> | number;
                };
            };
        };
        ColdChainReading: {
            payload: Prisma.$ColdChainReadingPayload<ExtArgs>;
            fields: Prisma.ColdChainReadingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ColdChainReadingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ColdChainReadingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>;
                };
                findFirst: {
                    args: Prisma.ColdChainReadingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ColdChainReadingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>;
                };
                findMany: {
                    args: Prisma.ColdChainReadingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>[];
                };
                create: {
                    args: Prisma.ColdChainReadingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>;
                };
                createMany: {
                    args: Prisma.ColdChainReadingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ColdChainReadingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>[];
                };
                delete: {
                    args: Prisma.ColdChainReadingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>;
                };
                update: {
                    args: Prisma.ColdChainReadingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>;
                };
                deleteMany: {
                    args: Prisma.ColdChainReadingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ColdChainReadingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ColdChainReadingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>[];
                };
                upsert: {
                    args: Prisma.ColdChainReadingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ColdChainReadingPayload>;
                };
                aggregate: {
                    args: Prisma.ColdChainReadingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateColdChainReading>;
                };
                groupBy: {
                    args: Prisma.ColdChainReadingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ColdChainReadingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ColdChainReadingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ColdChainReadingCountAggregateOutputType> | number;
                };
            };
        };
        StockCount: {
            payload: Prisma.$StockCountPayload<ExtArgs>;
            fields: Prisma.StockCountFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockCountFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockCountFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>;
                };
                findFirst: {
                    args: Prisma.StockCountFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockCountFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>;
                };
                findMany: {
                    args: Prisma.StockCountFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>[];
                };
                create: {
                    args: Prisma.StockCountCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>;
                };
                createMany: {
                    args: Prisma.StockCountCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockCountCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>[];
                };
                delete: {
                    args: Prisma.StockCountDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>;
                };
                update: {
                    args: Prisma.StockCountUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>;
                };
                deleteMany: {
                    args: Prisma.StockCountDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockCountUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockCountUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>[];
                };
                upsert: {
                    args: Prisma.StockCountUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountPayload>;
                };
                aggregate: {
                    args: Prisma.StockCountAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockCount>;
                };
                groupBy: {
                    args: Prisma.StockCountGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockCountGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockCountCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockCountCountAggregateOutputType> | number;
                };
            };
        };
        StockCountLine: {
            payload: Prisma.$StockCountLinePayload<ExtArgs>;
            fields: Prisma.StockCountLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockCountLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockCountLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>;
                };
                findFirst: {
                    args: Prisma.StockCountLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockCountLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>;
                };
                findMany: {
                    args: Prisma.StockCountLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>[];
                };
                create: {
                    args: Prisma.StockCountLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>;
                };
                createMany: {
                    args: Prisma.StockCountLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockCountLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>[];
                };
                delete: {
                    args: Prisma.StockCountLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>;
                };
                update: {
                    args: Prisma.StockCountLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>;
                };
                deleteMany: {
                    args: Prisma.StockCountLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockCountLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockCountLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>[];
                };
                upsert: {
                    args: Prisma.StockCountLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockCountLinePayload>;
                };
                aggregate: {
                    args: Prisma.StockCountLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockCountLine>;
                };
                groupBy: {
                    args: Prisma.StockCountLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockCountLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockCountLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockCountLineCountAggregateOutputType> | number;
                };
            };
        };
        PatientRef: {
            payload: Prisma.$PatientRefPayload<ExtArgs>;
            fields: Prisma.PatientRefFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PatientRefFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PatientRefFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>;
                };
                findFirst: {
                    args: Prisma.PatientRefFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PatientRefFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>;
                };
                findMany: {
                    args: Prisma.PatientRefFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>[];
                };
                create: {
                    args: Prisma.PatientRefCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>;
                };
                createMany: {
                    args: Prisma.PatientRefCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PatientRefCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>[];
                };
                delete: {
                    args: Prisma.PatientRefDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>;
                };
                update: {
                    args: Prisma.PatientRefUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>;
                };
                deleteMany: {
                    args: Prisma.PatientRefDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PatientRefUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PatientRefUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>[];
                };
                upsert: {
                    args: Prisma.PatientRefUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PatientRefPayload>;
                };
                aggregate: {
                    args: Prisma.PatientRefAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePatientRef>;
                };
                groupBy: {
                    args: Prisma.PatientRefGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PatientRefGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PatientRefCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PatientRefCountAggregateOutputType> | number;
                };
            };
        };
        CustomerNote: {
            payload: Prisma.$CustomerNotePayload<ExtArgs>;
            fields: Prisma.CustomerNoteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerNoteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerNoteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>;
                };
                findFirst: {
                    args: Prisma.CustomerNoteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerNoteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>;
                };
                findMany: {
                    args: Prisma.CustomerNoteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>[];
                };
                create: {
                    args: Prisma.CustomerNoteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>;
                };
                createMany: {
                    args: Prisma.CustomerNoteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerNoteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>[];
                };
                delete: {
                    args: Prisma.CustomerNoteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>;
                };
                update: {
                    args: Prisma.CustomerNoteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerNoteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerNoteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerNoteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>[];
                };
                upsert: {
                    args: Prisma.CustomerNoteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerNotePayload>;
                };
                aggregate: {
                    args: Prisma.CustomerNoteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomerNote>;
                };
                groupBy: {
                    args: Prisma.CustomerNoteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerNoteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerNoteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerNoteCountAggregateOutputType> | number;
                };
            };
        };
        FamilyLink: {
            payload: Prisma.$FamilyLinkPayload<ExtArgs>;
            fields: Prisma.FamilyLinkFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FamilyLinkFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FamilyLinkFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>;
                };
                findFirst: {
                    args: Prisma.FamilyLinkFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FamilyLinkFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>;
                };
                findMany: {
                    args: Prisma.FamilyLinkFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>[];
                };
                create: {
                    args: Prisma.FamilyLinkCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>;
                };
                createMany: {
                    args: Prisma.FamilyLinkCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FamilyLinkCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>[];
                };
                delete: {
                    args: Prisma.FamilyLinkDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>;
                };
                update: {
                    args: Prisma.FamilyLinkUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>;
                };
                deleteMany: {
                    args: Prisma.FamilyLinkDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FamilyLinkUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FamilyLinkUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>[];
                };
                upsert: {
                    args: Prisma.FamilyLinkUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FamilyLinkPayload>;
                };
                aggregate: {
                    args: Prisma.FamilyLinkAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFamilyLink>;
                };
                groupBy: {
                    args: Prisma.FamilyLinkGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FamilyLinkGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FamilyLinkCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FamilyLinkCountAggregateOutputType> | number;
                };
            };
        };
        LoyaltyEntry: {
            payload: Prisma.$LoyaltyEntryPayload<ExtArgs>;
            fields: Prisma.LoyaltyEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LoyaltyEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LoyaltyEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>;
                };
                findFirst: {
                    args: Prisma.LoyaltyEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LoyaltyEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>;
                };
                findMany: {
                    args: Prisma.LoyaltyEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>[];
                };
                create: {
                    args: Prisma.LoyaltyEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>;
                };
                createMany: {
                    args: Prisma.LoyaltyEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LoyaltyEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>[];
                };
                delete: {
                    args: Prisma.LoyaltyEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>;
                };
                update: {
                    args: Prisma.LoyaltyEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.LoyaltyEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LoyaltyEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LoyaltyEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>[];
                };
                upsert: {
                    args: Prisma.LoyaltyEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LoyaltyEntryPayload>;
                };
                aggregate: {
                    args: Prisma.LoyaltyEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLoyaltyEntry>;
                };
                groupBy: {
                    args: Prisma.LoyaltyEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LoyaltyEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LoyaltyEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LoyaltyEntryCountAggregateOutputType> | number;
                };
            };
        };
        Prescription: {
            payload: Prisma.$PrescriptionPayload<ExtArgs>;
            fields: Prisma.PrescriptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PrescriptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PrescriptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>;
                };
                findFirst: {
                    args: Prisma.PrescriptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PrescriptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>;
                };
                findMany: {
                    args: Prisma.PrescriptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>[];
                };
                create: {
                    args: Prisma.PrescriptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>;
                };
                createMany: {
                    args: Prisma.PrescriptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PrescriptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>[];
                };
                delete: {
                    args: Prisma.PrescriptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>;
                };
                update: {
                    args: Prisma.PrescriptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>;
                };
                deleteMany: {
                    args: Prisma.PrescriptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PrescriptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PrescriptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>[];
                };
                upsert: {
                    args: Prisma.PrescriptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionPayload>;
                };
                aggregate: {
                    args: Prisma.PrescriptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePrescription>;
                };
                groupBy: {
                    args: Prisma.PrescriptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PrescriptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PrescriptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PrescriptionCountAggregateOutputType> | number;
                };
            };
        };
        PrescriptionLine: {
            payload: Prisma.$PrescriptionLinePayload<ExtArgs>;
            fields: Prisma.PrescriptionLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PrescriptionLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PrescriptionLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>;
                };
                findFirst: {
                    args: Prisma.PrescriptionLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PrescriptionLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>;
                };
                findMany: {
                    args: Prisma.PrescriptionLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>[];
                };
                create: {
                    args: Prisma.PrescriptionLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>;
                };
                createMany: {
                    args: Prisma.PrescriptionLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PrescriptionLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>[];
                };
                delete: {
                    args: Prisma.PrescriptionLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>;
                };
                update: {
                    args: Prisma.PrescriptionLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>;
                };
                deleteMany: {
                    args: Prisma.PrescriptionLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PrescriptionLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PrescriptionLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>[];
                };
                upsert: {
                    args: Prisma.PrescriptionLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriptionLinePayload>;
                };
                aggregate: {
                    args: Prisma.PrescriptionLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePrescriptionLine>;
                };
                groupBy: {
                    args: Prisma.PrescriptionLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PrescriptionLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PrescriptionLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PrescriptionLineCountAggregateOutputType> | number;
                };
            };
        };
        Dispensing: {
            payload: Prisma.$DispensingPayload<ExtArgs>;
            fields: Prisma.DispensingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DispensingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DispensingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>;
                };
                findFirst: {
                    args: Prisma.DispensingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DispensingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>;
                };
                findMany: {
                    args: Prisma.DispensingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>[];
                };
                create: {
                    args: Prisma.DispensingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>;
                };
                createMany: {
                    args: Prisma.DispensingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DispensingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>[];
                };
                delete: {
                    args: Prisma.DispensingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>;
                };
                update: {
                    args: Prisma.DispensingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>;
                };
                deleteMany: {
                    args: Prisma.DispensingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DispensingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DispensingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>[];
                };
                upsert: {
                    args: Prisma.DispensingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingPayload>;
                };
                aggregate: {
                    args: Prisma.DispensingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDispensing>;
                };
                groupBy: {
                    args: Prisma.DispensingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DispensingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DispensingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DispensingCountAggregateOutputType> | number;
                };
            };
        };
        DispensingLine: {
            payload: Prisma.$DispensingLinePayload<ExtArgs>;
            fields: Prisma.DispensingLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DispensingLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DispensingLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>;
                };
                findFirst: {
                    args: Prisma.DispensingLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DispensingLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>;
                };
                findMany: {
                    args: Prisma.DispensingLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>[];
                };
                create: {
                    args: Prisma.DispensingLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>;
                };
                createMany: {
                    args: Prisma.DispensingLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DispensingLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>[];
                };
                delete: {
                    args: Prisma.DispensingLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>;
                };
                update: {
                    args: Prisma.DispensingLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>;
                };
                deleteMany: {
                    args: Prisma.DispensingLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DispensingLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DispensingLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>[];
                };
                upsert: {
                    args: Prisma.DispensingLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DispensingLinePayload>;
                };
                aggregate: {
                    args: Prisma.DispensingLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDispensingLine>;
                };
                groupBy: {
                    args: Prisma.DispensingLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DispensingLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DispensingLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DispensingLineCountAggregateOutputType> | number;
                };
            };
        };
        SafetyCheckResult: {
            payload: Prisma.$SafetyCheckResultPayload<ExtArgs>;
            fields: Prisma.SafetyCheckResultFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SafetyCheckResultFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SafetyCheckResultFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>;
                };
                findFirst: {
                    args: Prisma.SafetyCheckResultFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SafetyCheckResultFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>;
                };
                findMany: {
                    args: Prisma.SafetyCheckResultFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>[];
                };
                create: {
                    args: Prisma.SafetyCheckResultCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>;
                };
                createMany: {
                    args: Prisma.SafetyCheckResultCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SafetyCheckResultCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>[];
                };
                delete: {
                    args: Prisma.SafetyCheckResultDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>;
                };
                update: {
                    args: Prisma.SafetyCheckResultUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>;
                };
                deleteMany: {
                    args: Prisma.SafetyCheckResultDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SafetyCheckResultUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SafetyCheckResultUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>[];
                };
                upsert: {
                    args: Prisma.SafetyCheckResultUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SafetyCheckResultPayload>;
                };
                aggregate: {
                    args: Prisma.SafetyCheckResultAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSafetyCheckResult>;
                };
                groupBy: {
                    args: Prisma.SafetyCheckResultGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SafetyCheckResultGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SafetyCheckResultCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SafetyCheckResultCountAggregateOutputType> | number;
                };
            };
        };
        ControlledSubstanceLogEntry: {
            payload: Prisma.$ControlledSubstanceLogEntryPayload<ExtArgs>;
            fields: Prisma.ControlledSubstanceLogEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ControlledSubstanceLogEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ControlledSubstanceLogEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>;
                };
                findFirst: {
                    args: Prisma.ControlledSubstanceLogEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ControlledSubstanceLogEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>;
                };
                findMany: {
                    args: Prisma.ControlledSubstanceLogEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>[];
                };
                create: {
                    args: Prisma.ControlledSubstanceLogEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>;
                };
                createMany: {
                    args: Prisma.ControlledSubstanceLogEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ControlledSubstanceLogEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>[];
                };
                delete: {
                    args: Prisma.ControlledSubstanceLogEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>;
                };
                update: {
                    args: Prisma.ControlledSubstanceLogEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.ControlledSubstanceLogEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ControlledSubstanceLogEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ControlledSubstanceLogEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>[];
                };
                upsert: {
                    args: Prisma.ControlledSubstanceLogEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledSubstanceLogEntryPayload>;
                };
                aggregate: {
                    args: Prisma.ControlledSubstanceLogEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateControlledSubstanceLogEntry>;
                };
                groupBy: {
                    args: Prisma.ControlledSubstanceLogEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledSubstanceLogEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ControlledSubstanceLogEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledSubstanceLogEntryCountAggregateOutputType> | number;
                };
            };
        };
        Shift: {
            payload: Prisma.$ShiftPayload<ExtArgs>;
            fields: Prisma.ShiftFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ShiftFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ShiftFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>;
                };
                findFirst: {
                    args: Prisma.ShiftFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ShiftFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>;
                };
                findMany: {
                    args: Prisma.ShiftFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>[];
                };
                create: {
                    args: Prisma.ShiftCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>;
                };
                createMany: {
                    args: Prisma.ShiftCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ShiftCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>[];
                };
                delete: {
                    args: Prisma.ShiftDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>;
                };
                update: {
                    args: Prisma.ShiftUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>;
                };
                deleteMany: {
                    args: Prisma.ShiftDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ShiftUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ShiftUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>[];
                };
                upsert: {
                    args: Prisma.ShiftUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShiftPayload>;
                };
                aggregate: {
                    args: Prisma.ShiftAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateShift>;
                };
                groupBy: {
                    args: Prisma.ShiftGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ShiftGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ShiftCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ShiftCountAggregateOutputType> | number;
                };
            };
        };
        Sale: {
            payload: Prisma.$SalePayload<ExtArgs>;
            fields: Prisma.SaleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SaleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SaleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                findFirst: {
                    args: Prisma.SaleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SaleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                findMany: {
                    args: Prisma.SaleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>[];
                };
                create: {
                    args: Prisma.SaleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                createMany: {
                    args: Prisma.SaleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SaleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>[];
                };
                delete: {
                    args: Prisma.SaleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                update: {
                    args: Prisma.SaleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                deleteMany: {
                    args: Prisma.SaleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SaleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SaleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>[];
                };
                upsert: {
                    args: Prisma.SaleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePayload>;
                };
                aggregate: {
                    args: Prisma.SaleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSale>;
                };
                groupBy: {
                    args: Prisma.SaleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SaleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleCountAggregateOutputType> | number;
                };
            };
        };
        SaleLine: {
            payload: Prisma.$SaleLinePayload<ExtArgs>;
            fields: Prisma.SaleLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SaleLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SaleLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>;
                };
                findFirst: {
                    args: Prisma.SaleLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SaleLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>;
                };
                findMany: {
                    args: Prisma.SaleLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>[];
                };
                create: {
                    args: Prisma.SaleLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>;
                };
                createMany: {
                    args: Prisma.SaleLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SaleLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>[];
                };
                delete: {
                    args: Prisma.SaleLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>;
                };
                update: {
                    args: Prisma.SaleLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>;
                };
                deleteMany: {
                    args: Prisma.SaleLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SaleLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SaleLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>[];
                };
                upsert: {
                    args: Prisma.SaleLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleLinePayload>;
                };
                aggregate: {
                    args: Prisma.SaleLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSaleLine>;
                };
                groupBy: {
                    args: Prisma.SaleLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SaleLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleLineCountAggregateOutputType> | number;
                };
            };
        };
        SalePayment: {
            payload: Prisma.$SalePaymentPayload<ExtArgs>;
            fields: Prisma.SalePaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SalePaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SalePaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>;
                };
                findFirst: {
                    args: Prisma.SalePaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SalePaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>;
                };
                findMany: {
                    args: Prisma.SalePaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>[];
                };
                create: {
                    args: Prisma.SalePaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>;
                };
                createMany: {
                    args: Prisma.SalePaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SalePaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>[];
                };
                delete: {
                    args: Prisma.SalePaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>;
                };
                update: {
                    args: Prisma.SalePaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.SalePaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SalePaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SalePaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>[];
                };
                upsert: {
                    args: Prisma.SalePaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SalePaymentPayload>;
                };
                aggregate: {
                    args: Prisma.SalePaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSalePayment>;
                };
                groupBy: {
                    args: Prisma.SalePaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SalePaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SalePaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SalePaymentCountAggregateOutputType> | number;
                };
            };
        };
        SaleReturn: {
            payload: Prisma.$SaleReturnPayload<ExtArgs>;
            fields: Prisma.SaleReturnFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SaleReturnFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SaleReturnFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>;
                };
                findFirst: {
                    args: Prisma.SaleReturnFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SaleReturnFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>;
                };
                findMany: {
                    args: Prisma.SaleReturnFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>[];
                };
                create: {
                    args: Prisma.SaleReturnCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>;
                };
                createMany: {
                    args: Prisma.SaleReturnCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SaleReturnCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>[];
                };
                delete: {
                    args: Prisma.SaleReturnDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>;
                };
                update: {
                    args: Prisma.SaleReturnUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>;
                };
                deleteMany: {
                    args: Prisma.SaleReturnDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SaleReturnUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SaleReturnUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>[];
                };
                upsert: {
                    args: Prisma.SaleReturnUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SaleReturnPayload>;
                };
                aggregate: {
                    args: Prisma.SaleReturnAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSaleReturn>;
                };
                groupBy: {
                    args: Prisma.SaleReturnGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleReturnGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SaleReturnCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SaleReturnCountAggregateOutputType> | number;
                };
            };
        };
        CustomerAccount: {
            payload: Prisma.$CustomerAccountPayload<ExtArgs>;
            fields: Prisma.CustomerAccountFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerAccountFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerAccountFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerAccountFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerAccountFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>;
                };
                findMany: {
                    args: Prisma.CustomerAccountFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>[];
                };
                create: {
                    args: Prisma.CustomerAccountCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>;
                };
                createMany: {
                    args: Prisma.CustomerAccountCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerAccountCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>[];
                };
                delete: {
                    args: Prisma.CustomerAccountDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>;
                };
                update: {
                    args: Prisma.CustomerAccountUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerAccountDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerAccountUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerAccountUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerAccountUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerAccountPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerAccountAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomerAccount>;
                };
                groupBy: {
                    args: Prisma.CustomerAccountGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerAccountGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerAccountCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerAccountCountAggregateOutputType> | number;
                };
            };
        };
        CustomerCreditEntry: {
            payload: Prisma.$CustomerCreditEntryPayload<ExtArgs>;
            fields: Prisma.CustomerCreditEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CustomerCreditEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CustomerCreditEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>;
                };
                findFirst: {
                    args: Prisma.CustomerCreditEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CustomerCreditEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>;
                };
                findMany: {
                    args: Prisma.CustomerCreditEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>[];
                };
                create: {
                    args: Prisma.CustomerCreditEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>;
                };
                createMany: {
                    args: Prisma.CustomerCreditEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CustomerCreditEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>[];
                };
                delete: {
                    args: Prisma.CustomerCreditEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>;
                };
                update: {
                    args: Prisma.CustomerCreditEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.CustomerCreditEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CustomerCreditEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CustomerCreditEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>[];
                };
                upsert: {
                    args: Prisma.CustomerCreditEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CustomerCreditEntryPayload>;
                };
                aggregate: {
                    args: Prisma.CustomerCreditEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCustomerCreditEntry>;
                };
                groupBy: {
                    args: Prisma.CustomerCreditEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCreditEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CustomerCreditEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CustomerCreditEntryCountAggregateOutputType> | number;
                };
            };
        };
        OutboxEvent: {
            payload: Prisma.$OutboxEventPayload<ExtArgs>;
            fields: Prisma.OutboxEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OutboxEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OutboxEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>;
                };
                findFirst: {
                    args: Prisma.OutboxEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OutboxEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>;
                };
                findMany: {
                    args: Prisma.OutboxEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>[];
                };
                create: {
                    args: Prisma.OutboxEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>;
                };
                createMany: {
                    args: Prisma.OutboxEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OutboxEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>[];
                };
                delete: {
                    args: Prisma.OutboxEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>;
                };
                update: {
                    args: Prisma.OutboxEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>;
                };
                deleteMany: {
                    args: Prisma.OutboxEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OutboxEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OutboxEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>[];
                };
                upsert: {
                    args: Prisma.OutboxEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OutboxEventPayload>;
                };
                aggregate: {
                    args: Prisma.OutboxEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOutboxEvent>;
                };
                groupBy: {
                    args: Prisma.OutboxEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OutboxEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OutboxEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OutboxEventCountAggregateOutputType> | number;
                };
            };
        };
        AuditLog: {
            payload: Prisma.$AuditLogPayload<ExtArgs>;
            fields: Prisma.AuditLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuditLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findFirst: {
                    args: Prisma.AuditLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                findMany: {
                    args: Prisma.AuditLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                create: {
                    args: Prisma.AuditLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                createMany: {
                    args: Prisma.AuditLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                delete: {
                    args: Prisma.AuditLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                update: {
                    args: Prisma.AuditLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                deleteMany: {
                    args: Prisma.AuditLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuditLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>[];
                };
                upsert: {
                    args: Prisma.AuditLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuditLogPayload>;
                };
                aggregate: {
                    args: Prisma.AuditLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuditLog>;
                };
                groupBy: {
                    args: Prisma.AuditLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuditLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuditLogCountAggregateOutputType> | number;
                };
            };
        };
        FlagSnapshotCache: {
            payload: Prisma.$FlagSnapshotCachePayload<ExtArgs>;
            fields: Prisma.FlagSnapshotCacheFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.FlagSnapshotCacheFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.FlagSnapshotCacheFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>;
                };
                findFirst: {
                    args: Prisma.FlagSnapshotCacheFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.FlagSnapshotCacheFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>;
                };
                findMany: {
                    args: Prisma.FlagSnapshotCacheFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>[];
                };
                create: {
                    args: Prisma.FlagSnapshotCacheCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>;
                };
                createMany: {
                    args: Prisma.FlagSnapshotCacheCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.FlagSnapshotCacheCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>[];
                };
                delete: {
                    args: Prisma.FlagSnapshotCacheDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>;
                };
                update: {
                    args: Prisma.FlagSnapshotCacheUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>;
                };
                deleteMany: {
                    args: Prisma.FlagSnapshotCacheDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.FlagSnapshotCacheUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.FlagSnapshotCacheUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>[];
                };
                upsert: {
                    args: Prisma.FlagSnapshotCacheUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$FlagSnapshotCachePayload>;
                };
                aggregate: {
                    args: Prisma.FlagSnapshotCacheAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateFlagSnapshotCache>;
                };
                groupBy: {
                    args: Prisma.FlagSnapshotCacheGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FlagSnapshotCacheGroupByOutputType>[];
                };
                count: {
                    args: Prisma.FlagSnapshotCacheCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.FlagSnapshotCacheCountAggregateOutputType> | number;
                };
            };
        };
        ReorderPolicy: {
            payload: Prisma.$ReorderPolicyPayload<ExtArgs>;
            fields: Prisma.ReorderPolicyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ReorderPolicyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ReorderPolicyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>;
                };
                findFirst: {
                    args: Prisma.ReorderPolicyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ReorderPolicyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>;
                };
                findMany: {
                    args: Prisma.ReorderPolicyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>[];
                };
                create: {
                    args: Prisma.ReorderPolicyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>;
                };
                createMany: {
                    args: Prisma.ReorderPolicyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ReorderPolicyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>[];
                };
                delete: {
                    args: Prisma.ReorderPolicyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>;
                };
                update: {
                    args: Prisma.ReorderPolicyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>;
                };
                deleteMany: {
                    args: Prisma.ReorderPolicyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ReorderPolicyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ReorderPolicyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>[];
                };
                upsert: {
                    args: Prisma.ReorderPolicyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ReorderPolicyPayload>;
                };
                aggregate: {
                    args: Prisma.ReorderPolicyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateReorderPolicy>;
                };
                groupBy: {
                    args: Prisma.ReorderPolicyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReorderPolicyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ReorderPolicyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ReorderPolicyCountAggregateOutputType> | number;
                };
            };
        };
        SupplierLedgerEntry: {
            payload: Prisma.$SupplierLedgerEntryPayload<ExtArgs>;
            fields: Prisma.SupplierLedgerEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SupplierLedgerEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SupplierLedgerEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>;
                };
                findFirst: {
                    args: Prisma.SupplierLedgerEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SupplierLedgerEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>;
                };
                findMany: {
                    args: Prisma.SupplierLedgerEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>[];
                };
                create: {
                    args: Prisma.SupplierLedgerEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>;
                };
                createMany: {
                    args: Prisma.SupplierLedgerEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SupplierLedgerEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>[];
                };
                delete: {
                    args: Prisma.SupplierLedgerEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>;
                };
                update: {
                    args: Prisma.SupplierLedgerEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.SupplierLedgerEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SupplierLedgerEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SupplierLedgerEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>[];
                };
                upsert: {
                    args: Prisma.SupplierLedgerEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierLedgerEntryPayload>;
                };
                aggregate: {
                    args: Prisma.SupplierLedgerEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupplierLedgerEntry>;
                };
                groupBy: {
                    args: Prisma.SupplierLedgerEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierLedgerEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SupplierLedgerEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierLedgerEntryCountAggregateOutputType> | number;
                };
            };
        };
        GoodsReceipt: {
            payload: Prisma.$GoodsReceiptPayload<ExtArgs>;
            fields: Prisma.GoodsReceiptFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GoodsReceiptFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GoodsReceiptFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>;
                };
                findFirst: {
                    args: Prisma.GoodsReceiptFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GoodsReceiptFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>;
                };
                findMany: {
                    args: Prisma.GoodsReceiptFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>[];
                };
                create: {
                    args: Prisma.GoodsReceiptCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>;
                };
                createMany: {
                    args: Prisma.GoodsReceiptCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GoodsReceiptCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>[];
                };
                delete: {
                    args: Prisma.GoodsReceiptDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>;
                };
                update: {
                    args: Prisma.GoodsReceiptUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>;
                };
                deleteMany: {
                    args: Prisma.GoodsReceiptDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GoodsReceiptUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GoodsReceiptUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>[];
                };
                upsert: {
                    args: Prisma.GoodsReceiptUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptPayload>;
                };
                aggregate: {
                    args: Prisma.GoodsReceiptAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGoodsReceipt>;
                };
                groupBy: {
                    args: Prisma.GoodsReceiptGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GoodsReceiptGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GoodsReceiptCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GoodsReceiptCountAggregateOutputType> | number;
                };
            };
        };
        GoodsReceiptLine: {
            payload: Prisma.$GoodsReceiptLinePayload<ExtArgs>;
            fields: Prisma.GoodsReceiptLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.GoodsReceiptLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.GoodsReceiptLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>;
                };
                findFirst: {
                    args: Prisma.GoodsReceiptLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.GoodsReceiptLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>;
                };
                findMany: {
                    args: Prisma.GoodsReceiptLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>[];
                };
                create: {
                    args: Prisma.GoodsReceiptLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>;
                };
                createMany: {
                    args: Prisma.GoodsReceiptLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.GoodsReceiptLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>[];
                };
                delete: {
                    args: Prisma.GoodsReceiptLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>;
                };
                update: {
                    args: Prisma.GoodsReceiptLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>;
                };
                deleteMany: {
                    args: Prisma.GoodsReceiptLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.GoodsReceiptLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.GoodsReceiptLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>[];
                };
                upsert: {
                    args: Prisma.GoodsReceiptLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$GoodsReceiptLinePayload>;
                };
                aggregate: {
                    args: Prisma.GoodsReceiptLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateGoodsReceiptLine>;
                };
                groupBy: {
                    args: Prisma.GoodsReceiptLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GoodsReceiptLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.GoodsReceiptLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.GoodsReceiptLineCountAggregateOutputType> | number;
                };
            };
        };
        SupplierReturn: {
            payload: Prisma.$SupplierReturnPayload<ExtArgs>;
            fields: Prisma.SupplierReturnFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SupplierReturnFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SupplierReturnFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>;
                };
                findFirst: {
                    args: Prisma.SupplierReturnFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SupplierReturnFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>;
                };
                findMany: {
                    args: Prisma.SupplierReturnFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>[];
                };
                create: {
                    args: Prisma.SupplierReturnCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>;
                };
                createMany: {
                    args: Prisma.SupplierReturnCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SupplierReturnCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>[];
                };
                delete: {
                    args: Prisma.SupplierReturnDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>;
                };
                update: {
                    args: Prisma.SupplierReturnUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>;
                };
                deleteMany: {
                    args: Prisma.SupplierReturnDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SupplierReturnUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SupplierReturnUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>[];
                };
                upsert: {
                    args: Prisma.SupplierReturnUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SupplierReturnPayload>;
                };
                aggregate: {
                    args: Prisma.SupplierReturnAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSupplierReturn>;
                };
                groupBy: {
                    args: Prisma.SupplierReturnGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierReturnGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SupplierReturnCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SupplierReturnCountAggregateOutputType> | number;
                };
            };
        };
        ExpiryAlert: {
            payload: Prisma.$ExpiryAlertPayload<ExtArgs>;
            fields: Prisma.ExpiryAlertFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ExpiryAlertFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ExpiryAlertFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>;
                };
                findFirst: {
                    args: Prisma.ExpiryAlertFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ExpiryAlertFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>;
                };
                findMany: {
                    args: Prisma.ExpiryAlertFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>[];
                };
                create: {
                    args: Prisma.ExpiryAlertCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>;
                };
                createMany: {
                    args: Prisma.ExpiryAlertCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ExpiryAlertCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>[];
                };
                delete: {
                    args: Prisma.ExpiryAlertDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>;
                };
                update: {
                    args: Prisma.ExpiryAlertUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>;
                };
                deleteMany: {
                    args: Prisma.ExpiryAlertDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ExpiryAlertUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ExpiryAlertUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>[];
                };
                upsert: {
                    args: Prisma.ExpiryAlertUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpiryAlertPayload>;
                };
                aggregate: {
                    args: Prisma.ExpiryAlertAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateExpiryAlert>;
                };
                groupBy: {
                    args: Prisma.ExpiryAlertGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpiryAlertGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ExpiryAlertCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpiryAlertCountAggregateOutputType> | number;
                };
            };
        };
        StockTransfer: {
            payload: Prisma.$StockTransferPayload<ExtArgs>;
            fields: Prisma.StockTransferFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockTransferFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockTransferFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>;
                };
                findFirst: {
                    args: Prisma.StockTransferFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockTransferFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>;
                };
                findMany: {
                    args: Prisma.StockTransferFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>[];
                };
                create: {
                    args: Prisma.StockTransferCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>;
                };
                createMany: {
                    args: Prisma.StockTransferCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockTransferCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>[];
                };
                delete: {
                    args: Prisma.StockTransferDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>;
                };
                update: {
                    args: Prisma.StockTransferUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>;
                };
                deleteMany: {
                    args: Prisma.StockTransferDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockTransferUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockTransferUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>[];
                };
                upsert: {
                    args: Prisma.StockTransferUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferPayload>;
                };
                aggregate: {
                    args: Prisma.StockTransferAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockTransfer>;
                };
                groupBy: {
                    args: Prisma.StockTransferGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockTransferGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockTransferCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockTransferCountAggregateOutputType> | number;
                };
            };
        };
        StockTransferLine: {
            payload: Prisma.$StockTransferLinePayload<ExtArgs>;
            fields: Prisma.StockTransferLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.StockTransferLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.StockTransferLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>;
                };
                findFirst: {
                    args: Prisma.StockTransferLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.StockTransferLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>;
                };
                findMany: {
                    args: Prisma.StockTransferLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>[];
                };
                create: {
                    args: Prisma.StockTransferLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>;
                };
                createMany: {
                    args: Prisma.StockTransferLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.StockTransferLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>[];
                };
                delete: {
                    args: Prisma.StockTransferLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>;
                };
                update: {
                    args: Prisma.StockTransferLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>;
                };
                deleteMany: {
                    args: Prisma.StockTransferLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.StockTransferLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.StockTransferLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>[];
                };
                upsert: {
                    args: Prisma.StockTransferLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$StockTransferLinePayload>;
                };
                aggregate: {
                    args: Prisma.StockTransferLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateStockTransferLine>;
                };
                groupBy: {
                    args: Prisma.StockTransferLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockTransferLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.StockTransferLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.StockTransferLineCountAggregateOutputType> | number;
                };
            };
        };
        BranchMarketplaceSetting: {
            payload: Prisma.$BranchMarketplaceSettingPayload<ExtArgs>;
            fields: Prisma.BranchMarketplaceSettingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BranchMarketplaceSettingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BranchMarketplaceSettingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>;
                };
                findFirst: {
                    args: Prisma.BranchMarketplaceSettingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BranchMarketplaceSettingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>;
                };
                findMany: {
                    args: Prisma.BranchMarketplaceSettingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>[];
                };
                create: {
                    args: Prisma.BranchMarketplaceSettingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>;
                };
                createMany: {
                    args: Prisma.BranchMarketplaceSettingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BranchMarketplaceSettingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>[];
                };
                delete: {
                    args: Prisma.BranchMarketplaceSettingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>;
                };
                update: {
                    args: Prisma.BranchMarketplaceSettingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>;
                };
                deleteMany: {
                    args: Prisma.BranchMarketplaceSettingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BranchMarketplaceSettingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BranchMarketplaceSettingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>[];
                };
                upsert: {
                    args: Prisma.BranchMarketplaceSettingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BranchMarketplaceSettingPayload>;
                };
                aggregate: {
                    args: Prisma.BranchMarketplaceSettingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBranchMarketplaceSetting>;
                };
                groupBy: {
                    args: Prisma.BranchMarketplaceSettingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchMarketplaceSettingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BranchMarketplaceSettingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BranchMarketplaceSettingCountAggregateOutputType> | number;
                };
            };
        };
        KiorexCommissionRateView: {
            payload: Prisma.$KiorexCommissionRateViewPayload<ExtArgs>;
            fields: Prisma.KiorexCommissionRateViewFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.KiorexCommissionRateViewFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.KiorexCommissionRateViewFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>;
                };
                findFirst: {
                    args: Prisma.KiorexCommissionRateViewFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.KiorexCommissionRateViewFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>;
                };
                findMany: {
                    args: Prisma.KiorexCommissionRateViewFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>[];
                };
                create: {
                    args: Prisma.KiorexCommissionRateViewCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>;
                };
                createMany: {
                    args: Prisma.KiorexCommissionRateViewCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.KiorexCommissionRateViewCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>[];
                };
                delete: {
                    args: Prisma.KiorexCommissionRateViewDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>;
                };
                update: {
                    args: Prisma.KiorexCommissionRateViewUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>;
                };
                deleteMany: {
                    args: Prisma.KiorexCommissionRateViewDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.KiorexCommissionRateViewUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.KiorexCommissionRateViewUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>[];
                };
                upsert: {
                    args: Prisma.KiorexCommissionRateViewUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexCommissionRateViewPayload>;
                };
                aggregate: {
                    args: Prisma.KiorexCommissionRateViewAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateKiorexCommissionRateView>;
                };
                groupBy: {
                    args: Prisma.KiorexCommissionRateViewGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KiorexCommissionRateViewGroupByOutputType>[];
                };
                count: {
                    args: Prisma.KiorexCommissionRateViewCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KiorexCommissionRateViewCountAggregateOutputType> | number;
                };
            };
        };
        KiorexOrder: {
            payload: Prisma.$KiorexOrderPayload<ExtArgs>;
            fields: Prisma.KiorexOrderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.KiorexOrderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.KiorexOrderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>;
                };
                findFirst: {
                    args: Prisma.KiorexOrderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.KiorexOrderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>;
                };
                findMany: {
                    args: Prisma.KiorexOrderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>[];
                };
                create: {
                    args: Prisma.KiorexOrderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>;
                };
                createMany: {
                    args: Prisma.KiorexOrderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.KiorexOrderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>[];
                };
                delete: {
                    args: Prisma.KiorexOrderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>;
                };
                update: {
                    args: Prisma.KiorexOrderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>;
                };
                deleteMany: {
                    args: Prisma.KiorexOrderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.KiorexOrderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.KiorexOrderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>[];
                };
                upsert: {
                    args: Prisma.KiorexOrderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderPayload>;
                };
                aggregate: {
                    args: Prisma.KiorexOrderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateKiorexOrder>;
                };
                groupBy: {
                    args: Prisma.KiorexOrderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KiorexOrderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.KiorexOrderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KiorexOrderCountAggregateOutputType> | number;
                };
            };
        };
        KiorexOrderLine: {
            payload: Prisma.$KiorexOrderLinePayload<ExtArgs>;
            fields: Prisma.KiorexOrderLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.KiorexOrderLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.KiorexOrderLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>;
                };
                findFirst: {
                    args: Prisma.KiorexOrderLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.KiorexOrderLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>;
                };
                findMany: {
                    args: Prisma.KiorexOrderLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>[];
                };
                create: {
                    args: Prisma.KiorexOrderLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>;
                };
                createMany: {
                    args: Prisma.KiorexOrderLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.KiorexOrderLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>[];
                };
                delete: {
                    args: Prisma.KiorexOrderLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>;
                };
                update: {
                    args: Prisma.KiorexOrderLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>;
                };
                deleteMany: {
                    args: Prisma.KiorexOrderLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.KiorexOrderLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.KiorexOrderLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>[];
                };
                upsert: {
                    args: Prisma.KiorexOrderLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$KiorexOrderLinePayload>;
                };
                aggregate: {
                    args: Prisma.KiorexOrderLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateKiorexOrderLine>;
                };
                groupBy: {
                    args: Prisma.KiorexOrderLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KiorexOrderLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.KiorexOrderLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.KiorexOrderLineCountAggregateOutputType> | number;
                };
            };
        };
        IntegrationClient: {
            payload: Prisma.$IntegrationClientPayload<ExtArgs>;
            fields: Prisma.IntegrationClientFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.IntegrationClientFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.IntegrationClientFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>;
                };
                findFirst: {
                    args: Prisma.IntegrationClientFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.IntegrationClientFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>;
                };
                findMany: {
                    args: Prisma.IntegrationClientFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>[];
                };
                create: {
                    args: Prisma.IntegrationClientCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>;
                };
                createMany: {
                    args: Prisma.IntegrationClientCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.IntegrationClientCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>[];
                };
                delete: {
                    args: Prisma.IntegrationClientDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>;
                };
                update: {
                    args: Prisma.IntegrationClientUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>;
                };
                deleteMany: {
                    args: Prisma.IntegrationClientDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.IntegrationClientUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.IntegrationClientUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>[];
                };
                upsert: {
                    args: Prisma.IntegrationClientUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$IntegrationClientPayload>;
                };
                aggregate: {
                    args: Prisma.IntegrationClientAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateIntegrationClient>;
                };
                groupBy: {
                    args: Prisma.IntegrationClientGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IntegrationClientGroupByOutputType>[];
                };
                count: {
                    args: Prisma.IntegrationClientCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.IntegrationClientCountAggregateOutputType> | number;
                };
            };
        };
        InboundEvent: {
            payload: Prisma.$InboundEventPayload<ExtArgs>;
            fields: Prisma.InboundEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InboundEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InboundEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>;
                };
                findFirst: {
                    args: Prisma.InboundEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InboundEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>;
                };
                findMany: {
                    args: Prisma.InboundEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>[];
                };
                create: {
                    args: Prisma.InboundEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>;
                };
                createMany: {
                    args: Prisma.InboundEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InboundEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>[];
                };
                delete: {
                    args: Prisma.InboundEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>;
                };
                update: {
                    args: Prisma.InboundEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>;
                };
                deleteMany: {
                    args: Prisma.InboundEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InboundEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InboundEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>[];
                };
                upsert: {
                    args: Prisma.InboundEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InboundEventPayload>;
                };
                aggregate: {
                    args: Prisma.InboundEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInboundEvent>;
                };
                groupBy: {
                    args: Prisma.InboundEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InboundEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InboundEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InboundEventCountAggregateOutputType> | number;
                };
            };
        };
        Notification: {
            payload: Prisma.$NotificationPayload<ExtArgs>;
            fields: Prisma.NotificationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.NotificationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findFirst: {
                    args: Prisma.NotificationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                findMany: {
                    args: Prisma.NotificationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                create: {
                    args: Prisma.NotificationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                createMany: {
                    args: Prisma.NotificationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                delete: {
                    args: Prisma.NotificationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                update: {
                    args: Prisma.NotificationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                deleteMany: {
                    args: Prisma.NotificationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.NotificationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>[];
                };
                upsert: {
                    args: Prisma.NotificationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$NotificationPayload>;
                };
                aggregate: {
                    args: Prisma.NotificationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateNotification>;
                };
                groupBy: {
                    args: Prisma.NotificationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.NotificationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.NotificationCountAggregateOutputType> | number;
                };
            };
        };
        InsurerClaim: {
            payload: Prisma.$InsurerClaimPayload<ExtArgs>;
            fields: Prisma.InsurerClaimFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InsurerClaimFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InsurerClaimFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>;
                };
                findFirst: {
                    args: Prisma.InsurerClaimFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InsurerClaimFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>;
                };
                findMany: {
                    args: Prisma.InsurerClaimFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>[];
                };
                create: {
                    args: Prisma.InsurerClaimCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>;
                };
                createMany: {
                    args: Prisma.InsurerClaimCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InsurerClaimCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>[];
                };
                delete: {
                    args: Prisma.InsurerClaimDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>;
                };
                update: {
                    args: Prisma.InsurerClaimUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>;
                };
                deleteMany: {
                    args: Prisma.InsurerClaimDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InsurerClaimUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InsurerClaimUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>[];
                };
                upsert: {
                    args: Prisma.InsurerClaimUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InsurerClaimPayload>;
                };
                aggregate: {
                    args: Prisma.InsurerClaimAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInsurerClaim>;
                };
                groupBy: {
                    args: Prisma.InsurerClaimGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InsurerClaimGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InsurerClaimCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InsurerClaimCountAggregateOutputType> | number;
                };
            };
        };
        SyncConflict: {
            payload: Prisma.$SyncConflictPayload<ExtArgs>;
            fields: Prisma.SyncConflictFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SyncConflictFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SyncConflictFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>;
                };
                findFirst: {
                    args: Prisma.SyncConflictFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SyncConflictFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>;
                };
                findMany: {
                    args: Prisma.SyncConflictFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>[];
                };
                create: {
                    args: Prisma.SyncConflictCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>;
                };
                createMany: {
                    args: Prisma.SyncConflictCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SyncConflictCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>[];
                };
                delete: {
                    args: Prisma.SyncConflictDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>;
                };
                update: {
                    args: Prisma.SyncConflictUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>;
                };
                deleteMany: {
                    args: Prisma.SyncConflictDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SyncConflictUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SyncConflictUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>[];
                };
                upsert: {
                    args: Prisma.SyncConflictUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SyncConflictPayload>;
                };
                aggregate: {
                    args: Prisma.SyncConflictAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSyncConflict>;
                };
                groupBy: {
                    args: Prisma.SyncConflictGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SyncConflictGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SyncConflictCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SyncConflictCountAggregateOutputType> | number;
                };
            };
        };
        WalletEntry: {
            payload: Prisma.$WalletEntryPayload<ExtArgs>;
            fields: Prisma.WalletEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WalletEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WalletEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>;
                };
                findFirst: {
                    args: Prisma.WalletEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WalletEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>;
                };
                findMany: {
                    args: Prisma.WalletEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>[];
                };
                create: {
                    args: Prisma.WalletEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>;
                };
                createMany: {
                    args: Prisma.WalletEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WalletEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>[];
                };
                delete: {
                    args: Prisma.WalletEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>;
                };
                update: {
                    args: Prisma.WalletEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.WalletEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WalletEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WalletEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>[];
                };
                upsert: {
                    args: Prisma.WalletEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WalletEntryPayload>;
                };
                aggregate: {
                    args: Prisma.WalletEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWalletEntry>;
                };
                groupBy: {
                    args: Prisma.WalletEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WalletEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WalletEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WalletEntryCountAggregateOutputType> | number;
                };
            };
        };
        SettlementEntry: {
            payload: Prisma.$SettlementEntryPayload<ExtArgs>;
            fields: Prisma.SettlementEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SettlementEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SettlementEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>;
                };
                findFirst: {
                    args: Prisma.SettlementEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SettlementEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>;
                };
                findMany: {
                    args: Prisma.SettlementEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>[];
                };
                create: {
                    args: Prisma.SettlementEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>;
                };
                createMany: {
                    args: Prisma.SettlementEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SettlementEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>[];
                };
                delete: {
                    args: Prisma.SettlementEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>;
                };
                update: {
                    args: Prisma.SettlementEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.SettlementEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SettlementEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SettlementEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>[];
                };
                upsert: {
                    args: Prisma.SettlementEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SettlementEntryPayload>;
                };
                aggregate: {
                    args: Prisma.SettlementEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSettlementEntry>;
                };
                groupBy: {
                    args: Prisma.SettlementEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SettlementEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SettlementEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SettlementEntryCountAggregateOutputType> | number;
                };
            };
        };
        RolePermissionOverride: {
            payload: Prisma.$RolePermissionOverridePayload<ExtArgs>;
            fields: Prisma.RolePermissionOverrideFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RolePermissionOverrideFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RolePermissionOverrideFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>;
                };
                findFirst: {
                    args: Prisma.RolePermissionOverrideFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RolePermissionOverrideFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>;
                };
                findMany: {
                    args: Prisma.RolePermissionOverrideFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>[];
                };
                create: {
                    args: Prisma.RolePermissionOverrideCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>;
                };
                createMany: {
                    args: Prisma.RolePermissionOverrideCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RolePermissionOverrideCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>[];
                };
                delete: {
                    args: Prisma.RolePermissionOverrideDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>;
                };
                update: {
                    args: Prisma.RolePermissionOverrideUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>;
                };
                deleteMany: {
                    args: Prisma.RolePermissionOverrideDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RolePermissionOverrideUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RolePermissionOverrideUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>[];
                };
                upsert: {
                    args: Prisma.RolePermissionOverrideUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RolePermissionOverridePayload>;
                };
                aggregate: {
                    args: Prisma.RolePermissionOverrideAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRolePermissionOverride>;
                };
                groupBy: {
                    args: Prisma.RolePermissionOverrideGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RolePermissionOverrideGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RolePermissionOverrideCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RolePermissionOverrideCountAggregateOutputType> | number;
                };
            };
        };
        Prescriber: {
            payload: Prisma.$PrescriberPayload<ExtArgs>;
            fields: Prisma.PrescriberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PrescriberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PrescriberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>;
                };
                findFirst: {
                    args: Prisma.PrescriberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PrescriberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>;
                };
                findMany: {
                    args: Prisma.PrescriberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>[];
                };
                create: {
                    args: Prisma.PrescriberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>;
                };
                createMany: {
                    args: Prisma.PrescriberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PrescriberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>[];
                };
                delete: {
                    args: Prisma.PrescriberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>;
                };
                update: {
                    args: Prisma.PrescriberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>;
                };
                deleteMany: {
                    args: Prisma.PrescriberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PrescriberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PrescriberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>[];
                };
                upsert: {
                    args: Prisma.PrescriberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PrescriberPayload>;
                };
                aggregate: {
                    args: Prisma.PrescriberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePrescriber>;
                };
                groupBy: {
                    args: Prisma.PrescriberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PrescriberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PrescriberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PrescriberCountAggregateOutputType> | number;
                };
            };
        };
        RxRefill: {
            payload: Prisma.$RxRefillPayload<ExtArgs>;
            fields: Prisma.RxRefillFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RxRefillFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RxRefillFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>;
                };
                findFirst: {
                    args: Prisma.RxRefillFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RxRefillFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>;
                };
                findMany: {
                    args: Prisma.RxRefillFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>[];
                };
                create: {
                    args: Prisma.RxRefillCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>;
                };
                createMany: {
                    args: Prisma.RxRefillCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RxRefillCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>[];
                };
                delete: {
                    args: Prisma.RxRefillDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>;
                };
                update: {
                    args: Prisma.RxRefillUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>;
                };
                deleteMany: {
                    args: Prisma.RxRefillDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RxRefillUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RxRefillUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>[];
                };
                upsert: {
                    args: Prisma.RxRefillUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxRefillPayload>;
                };
                aggregate: {
                    args: Prisma.RxRefillAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRxRefill>;
                };
                groupBy: {
                    args: Prisma.RxRefillGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RxRefillGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RxRefillCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RxRefillCountAggregateOutputType> | number;
                };
            };
        };
        RefillReminder: {
            payload: Prisma.$RefillReminderPayload<ExtArgs>;
            fields: Prisma.RefillReminderFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RefillReminderFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RefillReminderFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>;
                };
                findFirst: {
                    args: Prisma.RefillReminderFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RefillReminderFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>;
                };
                findMany: {
                    args: Prisma.RefillReminderFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>[];
                };
                create: {
                    args: Prisma.RefillReminderCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>;
                };
                createMany: {
                    args: Prisma.RefillReminderCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RefillReminderCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>[];
                };
                delete: {
                    args: Prisma.RefillReminderDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>;
                };
                update: {
                    args: Prisma.RefillReminderUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>;
                };
                deleteMany: {
                    args: Prisma.RefillReminderDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RefillReminderUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RefillReminderUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>[];
                };
                upsert: {
                    args: Prisma.RefillReminderUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RefillReminderPayload>;
                };
                aggregate: {
                    args: Prisma.RefillReminderAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRefillReminder>;
                };
                groupBy: {
                    args: Prisma.RefillReminderGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefillReminderGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RefillReminderCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RefillReminderCountAggregateOutputType> | number;
                };
            };
        };
        RxTransfer: {
            payload: Prisma.$RxTransferPayload<ExtArgs>;
            fields: Prisma.RxTransferFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RxTransferFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RxTransferFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>;
                };
                findFirst: {
                    args: Prisma.RxTransferFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RxTransferFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>;
                };
                findMany: {
                    args: Prisma.RxTransferFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>[];
                };
                create: {
                    args: Prisma.RxTransferCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>;
                };
                createMany: {
                    args: Prisma.RxTransferCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RxTransferCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>[];
                };
                delete: {
                    args: Prisma.RxTransferDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>;
                };
                update: {
                    args: Prisma.RxTransferUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>;
                };
                deleteMany: {
                    args: Prisma.RxTransferDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RxTransferUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RxTransferUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>[];
                };
                upsert: {
                    args: Prisma.RxTransferUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RxTransferPayload>;
                };
                aggregate: {
                    args: Prisma.RxTransferAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRxTransfer>;
                };
                groupBy: {
                    args: Prisma.RxTransferGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RxTransferGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RxTransferCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RxTransferCountAggregateOutputType> | number;
                };
            };
        };
        ClinicalRule: {
            payload: Prisma.$ClinicalRulePayload<ExtArgs>;
            fields: Prisma.ClinicalRuleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ClinicalRuleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ClinicalRuleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>;
                };
                findFirst: {
                    args: Prisma.ClinicalRuleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ClinicalRuleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>;
                };
                findMany: {
                    args: Prisma.ClinicalRuleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>[];
                };
                create: {
                    args: Prisma.ClinicalRuleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>;
                };
                createMany: {
                    args: Prisma.ClinicalRuleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ClinicalRuleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>[];
                };
                delete: {
                    args: Prisma.ClinicalRuleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>;
                };
                update: {
                    args: Prisma.ClinicalRuleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>;
                };
                deleteMany: {
                    args: Prisma.ClinicalRuleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ClinicalRuleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ClinicalRuleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>[];
                };
                upsert: {
                    args: Prisma.ClinicalRuleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClinicalRulePayload>;
                };
                aggregate: {
                    args: Prisma.ClinicalRuleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateClinicalRule>;
                };
                groupBy: {
                    args: Prisma.ClinicalRuleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClinicalRuleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ClinicalRuleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClinicalRuleCountAggregateOutputType> | number;
                };
            };
        };
        ControlledRegisterEntry: {
            payload: Prisma.$ControlledRegisterEntryPayload<ExtArgs>;
            fields: Prisma.ControlledRegisterEntryFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ControlledRegisterEntryFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ControlledRegisterEntryFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>;
                };
                findFirst: {
                    args: Prisma.ControlledRegisterEntryFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ControlledRegisterEntryFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>;
                };
                findMany: {
                    args: Prisma.ControlledRegisterEntryFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>[];
                };
                create: {
                    args: Prisma.ControlledRegisterEntryCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>;
                };
                createMany: {
                    args: Prisma.ControlledRegisterEntryCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ControlledRegisterEntryCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>[];
                };
                delete: {
                    args: Prisma.ControlledRegisterEntryDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>;
                };
                update: {
                    args: Prisma.ControlledRegisterEntryUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>;
                };
                deleteMany: {
                    args: Prisma.ControlledRegisterEntryDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ControlledRegisterEntryUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ControlledRegisterEntryUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>[];
                };
                upsert: {
                    args: Prisma.ControlledRegisterEntryUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledRegisterEntryPayload>;
                };
                aggregate: {
                    args: Prisma.ControlledRegisterEntryAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateControlledRegisterEntry>;
                };
                groupBy: {
                    args: Prisma.ControlledRegisterEntryGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledRegisterEntryGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ControlledRegisterEntryCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledRegisterEntryCountAggregateOutputType> | number;
                };
            };
        };
        ControlledDiscrepancy: {
            payload: Prisma.$ControlledDiscrepancyPayload<ExtArgs>;
            fields: Prisma.ControlledDiscrepancyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ControlledDiscrepancyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ControlledDiscrepancyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>;
                };
                findFirst: {
                    args: Prisma.ControlledDiscrepancyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ControlledDiscrepancyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>;
                };
                findMany: {
                    args: Prisma.ControlledDiscrepancyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>[];
                };
                create: {
                    args: Prisma.ControlledDiscrepancyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>;
                };
                createMany: {
                    args: Prisma.ControlledDiscrepancyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ControlledDiscrepancyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>[];
                };
                delete: {
                    args: Prisma.ControlledDiscrepancyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>;
                };
                update: {
                    args: Prisma.ControlledDiscrepancyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>;
                };
                deleteMany: {
                    args: Prisma.ControlledDiscrepancyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ControlledDiscrepancyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ControlledDiscrepancyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>[];
                };
                upsert: {
                    args: Prisma.ControlledDiscrepancyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledDiscrepancyPayload>;
                };
                aggregate: {
                    args: Prisma.ControlledDiscrepancyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateControlledDiscrepancy>;
                };
                groupBy: {
                    args: Prisma.ControlledDiscrepancyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledDiscrepancyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ControlledDiscrepancyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledDiscrepancyCountAggregateOutputType> | number;
                };
            };
        };
        Promotion: {
            payload: Prisma.$PromotionPayload<ExtArgs>;
            fields: Prisma.PromotionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PromotionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PromotionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>;
                };
                findFirst: {
                    args: Prisma.PromotionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PromotionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>;
                };
                findMany: {
                    args: Prisma.PromotionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>[];
                };
                create: {
                    args: Prisma.PromotionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>;
                };
                createMany: {
                    args: Prisma.PromotionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PromotionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>[];
                };
                delete: {
                    args: Prisma.PromotionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>;
                };
                update: {
                    args: Prisma.PromotionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>;
                };
                deleteMany: {
                    args: Prisma.PromotionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PromotionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PromotionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>[];
                };
                upsert: {
                    args: Prisma.PromotionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionPayload>;
                };
                aggregate: {
                    args: Prisma.PromotionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePromotion>;
                };
                groupBy: {
                    args: Prisma.PromotionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PromotionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PromotionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PromotionCountAggregateOutputType> | number;
                };
            };
        };
        PromotionRedemption: {
            payload: Prisma.$PromotionRedemptionPayload<ExtArgs>;
            fields: Prisma.PromotionRedemptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PromotionRedemptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PromotionRedemptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>;
                };
                findFirst: {
                    args: Prisma.PromotionRedemptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PromotionRedemptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>;
                };
                findMany: {
                    args: Prisma.PromotionRedemptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>[];
                };
                create: {
                    args: Prisma.PromotionRedemptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>;
                };
                createMany: {
                    args: Prisma.PromotionRedemptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PromotionRedemptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>[];
                };
                delete: {
                    args: Prisma.PromotionRedemptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>;
                };
                update: {
                    args: Prisma.PromotionRedemptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>;
                };
                deleteMany: {
                    args: Prisma.PromotionRedemptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PromotionRedemptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PromotionRedemptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>[];
                };
                upsert: {
                    args: Prisma.PromotionRedemptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PromotionRedemptionPayload>;
                };
                aggregate: {
                    args: Prisma.PromotionRedemptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePromotionRedemption>;
                };
                groupBy: {
                    args: Prisma.PromotionRedemptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PromotionRedemptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PromotionRedemptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PromotionRedemptionCountAggregateOutputType> | number;
                };
            };
        };
        HeldCart: {
            payload: Prisma.$HeldCartPayload<ExtArgs>;
            fields: Prisma.HeldCartFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HeldCartFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HeldCartFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>;
                };
                findFirst: {
                    args: Prisma.HeldCartFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HeldCartFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>;
                };
                findMany: {
                    args: Prisma.HeldCartFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>[];
                };
                create: {
                    args: Prisma.HeldCartCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>;
                };
                createMany: {
                    args: Prisma.HeldCartCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HeldCartCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>[];
                };
                delete: {
                    args: Prisma.HeldCartDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>;
                };
                update: {
                    args: Prisma.HeldCartUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>;
                };
                deleteMany: {
                    args: Prisma.HeldCartDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HeldCartUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HeldCartUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>[];
                };
                upsert: {
                    args: Prisma.HeldCartUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HeldCartPayload>;
                };
                aggregate: {
                    args: Prisma.HeldCartAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHeldCart>;
                };
                groupBy: {
                    args: Prisma.HeldCartGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HeldCartGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HeldCartCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HeldCartCountAggregateOutputType> | number;
                };
            };
        };
        CashMovement: {
            payload: Prisma.$CashMovementPayload<ExtArgs>;
            fields: Prisma.CashMovementFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CashMovementFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CashMovementFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>;
                };
                findFirst: {
                    args: Prisma.CashMovementFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CashMovementFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>;
                };
                findMany: {
                    args: Prisma.CashMovementFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>[];
                };
                create: {
                    args: Prisma.CashMovementCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>;
                };
                createMany: {
                    args: Prisma.CashMovementCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CashMovementCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>[];
                };
                delete: {
                    args: Prisma.CashMovementDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>;
                };
                update: {
                    args: Prisma.CashMovementUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>;
                };
                deleteMany: {
                    args: Prisma.CashMovementDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CashMovementUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CashMovementUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>[];
                };
                upsert: {
                    args: Prisma.CashMovementUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CashMovementPayload>;
                };
                aggregate: {
                    args: Prisma.CashMovementAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCashMovement>;
                };
                groupBy: {
                    args: Prisma.CashMovementGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CashMovementGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CashMovementCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CashMovementCountAggregateOutputType> | number;
                };
            };
        };
        ShelfLocation: {
            payload: Prisma.$ShelfLocationPayload<ExtArgs>;
            fields: Prisma.ShelfLocationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ShelfLocationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ShelfLocationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>;
                };
                findFirst: {
                    args: Prisma.ShelfLocationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ShelfLocationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>;
                };
                findMany: {
                    args: Prisma.ShelfLocationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>[];
                };
                create: {
                    args: Prisma.ShelfLocationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>;
                };
                createMany: {
                    args: Prisma.ShelfLocationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ShelfLocationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>[];
                };
                delete: {
                    args: Prisma.ShelfLocationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>;
                };
                update: {
                    args: Prisma.ShelfLocationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>;
                };
                deleteMany: {
                    args: Prisma.ShelfLocationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ShelfLocationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ShelfLocationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>[];
                };
                upsert: {
                    args: Prisma.ShelfLocationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ShelfLocationPayload>;
                };
                aggregate: {
                    args: Prisma.ShelfLocationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateShelfLocation>;
                };
                groupBy: {
                    args: Prisma.ShelfLocationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ShelfLocationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ShelfLocationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ShelfLocationCountAggregateOutputType> | number;
                };
            };
        };
        UomConversion: {
            payload: Prisma.$UomConversionPayload<ExtArgs>;
            fields: Prisma.UomConversionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UomConversionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UomConversionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>;
                };
                findFirst: {
                    args: Prisma.UomConversionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UomConversionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>;
                };
                findMany: {
                    args: Prisma.UomConversionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>[];
                };
                create: {
                    args: Prisma.UomConversionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>;
                };
                createMany: {
                    args: Prisma.UomConversionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UomConversionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>[];
                };
                delete: {
                    args: Prisma.UomConversionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>;
                };
                update: {
                    args: Prisma.UomConversionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>;
                };
                deleteMany: {
                    args: Prisma.UomConversionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UomConversionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UomConversionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>[];
                };
                upsert: {
                    args: Prisma.UomConversionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UomConversionPayload>;
                };
                aggregate: {
                    args: Prisma.UomConversionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUomConversion>;
                };
                groupBy: {
                    args: Prisma.UomConversionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UomConversionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UomConversionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UomConversionCountAggregateOutputType> | number;
                };
            };
        };
        RequestForQuote: {
            payload: Prisma.$RequestForQuotePayload<ExtArgs>;
            fields: Prisma.RequestForQuoteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RequestForQuoteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RequestForQuoteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>;
                };
                findFirst: {
                    args: Prisma.RequestForQuoteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RequestForQuoteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>;
                };
                findMany: {
                    args: Prisma.RequestForQuoteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>[];
                };
                create: {
                    args: Prisma.RequestForQuoteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>;
                };
                createMany: {
                    args: Prisma.RequestForQuoteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RequestForQuoteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>[];
                };
                delete: {
                    args: Prisma.RequestForQuoteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>;
                };
                update: {
                    args: Prisma.RequestForQuoteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>;
                };
                deleteMany: {
                    args: Prisma.RequestForQuoteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RequestForQuoteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RequestForQuoteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>[];
                };
                upsert: {
                    args: Prisma.RequestForQuoteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RequestForQuotePayload>;
                };
                aggregate: {
                    args: Prisma.RequestForQuoteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRequestForQuote>;
                };
                groupBy: {
                    args: Prisma.RequestForQuoteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RequestForQuoteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RequestForQuoteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RequestForQuoteCountAggregateOutputType> | number;
                };
            };
        };
        RfqLine: {
            payload: Prisma.$RfqLinePayload<ExtArgs>;
            fields: Prisma.RfqLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RfqLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RfqLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>;
                };
                findFirst: {
                    args: Prisma.RfqLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RfqLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>;
                };
                findMany: {
                    args: Prisma.RfqLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>[];
                };
                create: {
                    args: Prisma.RfqLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>;
                };
                createMany: {
                    args: Prisma.RfqLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RfqLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>[];
                };
                delete: {
                    args: Prisma.RfqLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>;
                };
                update: {
                    args: Prisma.RfqLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>;
                };
                deleteMany: {
                    args: Prisma.RfqLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RfqLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RfqLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>[];
                };
                upsert: {
                    args: Prisma.RfqLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqLinePayload>;
                };
                aggregate: {
                    args: Prisma.RfqLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRfqLine>;
                };
                groupBy: {
                    args: Prisma.RfqLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RfqLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RfqLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RfqLineCountAggregateOutputType> | number;
                };
            };
        };
        RfqQuote: {
            payload: Prisma.$RfqQuotePayload<ExtArgs>;
            fields: Prisma.RfqQuoteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RfqQuoteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RfqQuoteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>;
                };
                findFirst: {
                    args: Prisma.RfqQuoteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RfqQuoteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>;
                };
                findMany: {
                    args: Prisma.RfqQuoteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>[];
                };
                create: {
                    args: Prisma.RfqQuoteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>;
                };
                createMany: {
                    args: Prisma.RfqQuoteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RfqQuoteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>[];
                };
                delete: {
                    args: Prisma.RfqQuoteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>;
                };
                update: {
                    args: Prisma.RfqQuoteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>;
                };
                deleteMany: {
                    args: Prisma.RfqQuoteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RfqQuoteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RfqQuoteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>[];
                };
                upsert: {
                    args: Prisma.RfqQuoteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuotePayload>;
                };
                aggregate: {
                    args: Prisma.RfqQuoteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRfqQuote>;
                };
                groupBy: {
                    args: Prisma.RfqQuoteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RfqQuoteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RfqQuoteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RfqQuoteCountAggregateOutputType> | number;
                };
            };
        };
        RfqQuoteLine: {
            payload: Prisma.$RfqQuoteLinePayload<ExtArgs>;
            fields: Prisma.RfqQuoteLineFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RfqQuoteLineFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RfqQuoteLineFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>;
                };
                findFirst: {
                    args: Prisma.RfqQuoteLineFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RfqQuoteLineFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>;
                };
                findMany: {
                    args: Prisma.RfqQuoteLineFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>[];
                };
                create: {
                    args: Prisma.RfqQuoteLineCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>;
                };
                createMany: {
                    args: Prisma.RfqQuoteLineCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RfqQuoteLineCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>[];
                };
                delete: {
                    args: Prisma.RfqQuoteLineDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>;
                };
                update: {
                    args: Prisma.RfqQuoteLineUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>;
                };
                deleteMany: {
                    args: Prisma.RfqQuoteLineDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RfqQuoteLineUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RfqQuoteLineUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>[];
                };
                upsert: {
                    args: Prisma.RfqQuoteLineUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RfqQuoteLinePayload>;
                };
                aggregate: {
                    args: Prisma.RfqQuoteLineAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRfqQuoteLine>;
                };
                groupBy: {
                    args: Prisma.RfqQuoteLineGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RfqQuoteLineGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RfqQuoteLineCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RfqQuoteLineCountAggregateOutputType> | number;
                };
            };
        };
        Expense: {
            payload: Prisma.$ExpensePayload<ExtArgs>;
            fields: Prisma.ExpenseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ExpenseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ExpenseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                findFirst: {
                    args: Prisma.ExpenseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ExpenseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                findMany: {
                    args: Prisma.ExpenseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                create: {
                    args: Prisma.ExpenseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                createMany: {
                    args: Prisma.ExpenseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ExpenseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                delete: {
                    args: Prisma.ExpenseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                update: {
                    args: Prisma.ExpenseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                deleteMany: {
                    args: Prisma.ExpenseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ExpenseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ExpenseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>[];
                };
                upsert: {
                    args: Prisma.ExpenseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ExpensePayload>;
                };
                aggregate: {
                    args: Prisma.ExpenseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateExpense>;
                };
                groupBy: {
                    args: Prisma.ExpenseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ExpenseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ExpenseCountAggregateOutputType> | number;
                };
            };
        };
        ClaimPayment: {
            payload: Prisma.$ClaimPaymentPayload<ExtArgs>;
            fields: Prisma.ClaimPaymentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ClaimPaymentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ClaimPaymentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>;
                };
                findFirst: {
                    args: Prisma.ClaimPaymentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ClaimPaymentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>;
                };
                findMany: {
                    args: Prisma.ClaimPaymentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>[];
                };
                create: {
                    args: Prisma.ClaimPaymentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>;
                };
                createMany: {
                    args: Prisma.ClaimPaymentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ClaimPaymentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>[];
                };
                delete: {
                    args: Prisma.ClaimPaymentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>;
                };
                update: {
                    args: Prisma.ClaimPaymentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>;
                };
                deleteMany: {
                    args: Prisma.ClaimPaymentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ClaimPaymentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ClaimPaymentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>[];
                };
                upsert: {
                    args: Prisma.ClaimPaymentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClaimPaymentPayload>;
                };
                aggregate: {
                    args: Prisma.ClaimPaymentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateClaimPayment>;
                };
                groupBy: {
                    args: Prisma.ClaimPaymentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClaimPaymentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ClaimPaymentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClaimPaymentCountAggregateOutputType> | number;
                };
            };
        };
        Alert: {
            payload: Prisma.$AlertPayload<ExtArgs>;
            fields: Prisma.AlertFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AlertFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AlertFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>;
                };
                findFirst: {
                    args: Prisma.AlertFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AlertFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>;
                };
                findMany: {
                    args: Prisma.AlertFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>[];
                };
                create: {
                    args: Prisma.AlertCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>;
                };
                createMany: {
                    args: Prisma.AlertCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AlertCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>[];
                };
                delete: {
                    args: Prisma.AlertDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>;
                };
                update: {
                    args: Prisma.AlertUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>;
                };
                deleteMany: {
                    args: Prisma.AlertDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AlertUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AlertUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>[];
                };
                upsert: {
                    args: Prisma.AlertUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AlertPayload>;
                };
                aggregate: {
                    args: Prisma.AlertAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAlert>;
                };
                groupBy: {
                    args: Prisma.AlertGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AlertGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AlertCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AlertCountAggregateOutputType> | number;
                };
            };
        };
        MobileDevice: {
            payload: Prisma.$MobileDevicePayload<ExtArgs>;
            fields: Prisma.MobileDeviceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MobileDeviceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MobileDeviceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>;
                };
                findFirst: {
                    args: Prisma.MobileDeviceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MobileDeviceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>;
                };
                findMany: {
                    args: Prisma.MobileDeviceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>[];
                };
                create: {
                    args: Prisma.MobileDeviceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>;
                };
                createMany: {
                    args: Prisma.MobileDeviceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MobileDeviceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>[];
                };
                delete: {
                    args: Prisma.MobileDeviceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>;
                };
                update: {
                    args: Prisma.MobileDeviceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>;
                };
                deleteMany: {
                    args: Prisma.MobileDeviceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MobileDeviceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MobileDeviceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>[];
                };
                upsert: {
                    args: Prisma.MobileDeviceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileDevicePayload>;
                };
                aggregate: {
                    args: Prisma.MobileDeviceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMobileDevice>;
                };
                groupBy: {
                    args: Prisma.MobileDeviceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MobileDeviceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MobileDeviceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MobileDeviceCountAggregateOutputType> | number;
                };
            };
        };
        PushMessage: {
            payload: Prisma.$PushMessagePayload<ExtArgs>;
            fields: Prisma.PushMessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PushMessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PushMessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>;
                };
                findFirst: {
                    args: Prisma.PushMessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PushMessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>;
                };
                findMany: {
                    args: Prisma.PushMessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>[];
                };
                create: {
                    args: Prisma.PushMessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>;
                };
                createMany: {
                    args: Prisma.PushMessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PushMessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>[];
                };
                delete: {
                    args: Prisma.PushMessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>;
                };
                update: {
                    args: Prisma.PushMessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>;
                };
                deleteMany: {
                    args: Prisma.PushMessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PushMessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PushMessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>[];
                };
                upsert: {
                    args: Prisma.PushMessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PushMessagePayload>;
                };
                aggregate: {
                    args: Prisma.PushMessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePushMessage>;
                };
                groupBy: {
                    args: Prisma.PushMessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PushMessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PushMessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PushMessageCountAggregateOutputType> | number;
                };
            };
        };
        MobileUpgradeRequest: {
            payload: Prisma.$MobileUpgradeRequestPayload<ExtArgs>;
            fields: Prisma.MobileUpgradeRequestFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MobileUpgradeRequestFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MobileUpgradeRequestFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>;
                };
                findFirst: {
                    args: Prisma.MobileUpgradeRequestFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MobileUpgradeRequestFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>;
                };
                findMany: {
                    args: Prisma.MobileUpgradeRequestFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>[];
                };
                create: {
                    args: Prisma.MobileUpgradeRequestCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>;
                };
                createMany: {
                    args: Prisma.MobileUpgradeRequestCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MobileUpgradeRequestCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>[];
                };
                delete: {
                    args: Prisma.MobileUpgradeRequestDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>;
                };
                update: {
                    args: Prisma.MobileUpgradeRequestUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>;
                };
                deleteMany: {
                    args: Prisma.MobileUpgradeRequestDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MobileUpgradeRequestUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MobileUpgradeRequestUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>[];
                };
                upsert: {
                    args: Prisma.MobileUpgradeRequestUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileUpgradeRequestPayload>;
                };
                aggregate: {
                    args: Prisma.MobileUpgradeRequestAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMobileUpgradeRequest>;
                };
                groupBy: {
                    args: Prisma.MobileUpgradeRequestGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MobileUpgradeRequestGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MobileUpgradeRequestCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MobileUpgradeRequestCountAggregateOutputType> | number;
                };
            };
        };
        MobileAlertAck: {
            payload: Prisma.$MobileAlertAckPayload<ExtArgs>;
            fields: Prisma.MobileAlertAckFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.MobileAlertAckFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.MobileAlertAckFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>;
                };
                findFirst: {
                    args: Prisma.MobileAlertAckFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.MobileAlertAckFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>;
                };
                findMany: {
                    args: Prisma.MobileAlertAckFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>[];
                };
                create: {
                    args: Prisma.MobileAlertAckCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>;
                };
                createMany: {
                    args: Prisma.MobileAlertAckCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.MobileAlertAckCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>[];
                };
                delete: {
                    args: Prisma.MobileAlertAckDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>;
                };
                update: {
                    args: Prisma.MobileAlertAckUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>;
                };
                deleteMany: {
                    args: Prisma.MobileAlertAckDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.MobileAlertAckUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.MobileAlertAckUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>[];
                };
                upsert: {
                    args: Prisma.MobileAlertAckUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$MobileAlertAckPayload>;
                };
                aggregate: {
                    args: Prisma.MobileAlertAckAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateMobileAlertAck>;
                };
                groupBy: {
                    args: Prisma.MobileAlertAckGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MobileAlertAckGroupByOutputType>[];
                };
                count: {
                    args: Prisma.MobileAlertAckCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.MobileAlertAckCountAggregateOutputType> | number;
                };
            };
        };
        ControlledCountersign: {
            payload: Prisma.$ControlledCountersignPayload<ExtArgs>;
            fields: Prisma.ControlledCountersignFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ControlledCountersignFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ControlledCountersignFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>;
                };
                findFirst: {
                    args: Prisma.ControlledCountersignFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ControlledCountersignFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>;
                };
                findMany: {
                    args: Prisma.ControlledCountersignFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>[];
                };
                create: {
                    args: Prisma.ControlledCountersignCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>;
                };
                createMany: {
                    args: Prisma.ControlledCountersignCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ControlledCountersignCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>[];
                };
                delete: {
                    args: Prisma.ControlledCountersignDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>;
                };
                update: {
                    args: Prisma.ControlledCountersignUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>;
                };
                deleteMany: {
                    args: Prisma.ControlledCountersignDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ControlledCountersignUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ControlledCountersignUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>[];
                };
                upsert: {
                    args: Prisma.ControlledCountersignUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ControlledCountersignPayload>;
                };
                aggregate: {
                    args: Prisma.ControlledCountersignAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateControlledCountersign>;
                };
                groupBy: {
                    args: Prisma.ControlledCountersignGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledCountersignGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ControlledCountersignCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ControlledCountersignCountAggregateOutputType> | number;
                };
            };
        };
        PayLink: {
            payload: Prisma.$PayLinkPayload<ExtArgs>;
            fields: Prisma.PayLinkFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PayLinkFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PayLinkFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>;
                };
                findFirst: {
                    args: Prisma.PayLinkFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PayLinkFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>;
                };
                findMany: {
                    args: Prisma.PayLinkFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>[];
                };
                create: {
                    args: Prisma.PayLinkCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>;
                };
                createMany: {
                    args: Prisma.PayLinkCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PayLinkCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>[];
                };
                delete: {
                    args: Prisma.PayLinkDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>;
                };
                update: {
                    args: Prisma.PayLinkUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>;
                };
                deleteMany: {
                    args: Prisma.PayLinkDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PayLinkUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PayLinkUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>[];
                };
                upsert: {
                    args: Prisma.PayLinkUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PayLinkPayload>;
                };
                aggregate: {
                    args: Prisma.PayLinkAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePayLink>;
                };
                groupBy: {
                    args: Prisma.PayLinkGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PayLinkGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PayLinkCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PayLinkCountAggregateOutputType> | number;
                };
            };
        };
        ProviderWebhookEvent: {
            payload: Prisma.$ProviderWebhookEventPayload<ExtArgs>;
            fields: Prisma.ProviderWebhookEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProviderWebhookEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProviderWebhookEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>;
                };
                findFirst: {
                    args: Prisma.ProviderWebhookEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProviderWebhookEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>;
                };
                findMany: {
                    args: Prisma.ProviderWebhookEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>[];
                };
                create: {
                    args: Prisma.ProviderWebhookEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>;
                };
                createMany: {
                    args: Prisma.ProviderWebhookEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProviderWebhookEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>[];
                };
                delete: {
                    args: Prisma.ProviderWebhookEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>;
                };
                update: {
                    args: Prisma.ProviderWebhookEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>;
                };
                deleteMany: {
                    args: Prisma.ProviderWebhookEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProviderWebhookEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProviderWebhookEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>[];
                };
                upsert: {
                    args: Prisma.ProviderWebhookEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderWebhookEventPayload>;
                };
                aggregate: {
                    args: Prisma.ProviderWebhookEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProviderWebhookEvent>;
                };
                groupBy: {
                    args: Prisma.ProviderWebhookEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProviderWebhookEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProviderWebhookEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProviderWebhookEventCountAggregateOutputType> | number;
                };
            };
        };
        ConsentRecord: {
            payload: Prisma.$ConsentRecordPayload<ExtArgs>;
            fields: Prisma.ConsentRecordFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ConsentRecordFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ConsentRecordFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>;
                };
                findFirst: {
                    args: Prisma.ConsentRecordFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ConsentRecordFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>;
                };
                findMany: {
                    args: Prisma.ConsentRecordFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[];
                };
                create: {
                    args: Prisma.ConsentRecordCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>;
                };
                createMany: {
                    args: Prisma.ConsentRecordCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ConsentRecordCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[];
                };
                delete: {
                    args: Prisma.ConsentRecordDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>;
                };
                update: {
                    args: Prisma.ConsentRecordUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>;
                };
                deleteMany: {
                    args: Prisma.ConsentRecordDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ConsentRecordUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ConsentRecordUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>[];
                };
                upsert: {
                    args: Prisma.ConsentRecordUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ConsentRecordPayload>;
                };
                aggregate: {
                    args: Prisma.ConsentRecordAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateConsentRecord>;
                };
                groupBy: {
                    args: Prisma.ConsentRecordGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConsentRecordGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ConsentRecordCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ConsentRecordCountAggregateOutputType> | number;
                };
            };
        };
        HandoffCode: {
            payload: Prisma.$HandoffCodePayload<ExtArgs>;
            fields: Prisma.HandoffCodeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HandoffCodeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HandoffCodeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>;
                };
                findFirst: {
                    args: Prisma.HandoffCodeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HandoffCodeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>;
                };
                findMany: {
                    args: Prisma.HandoffCodeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>[];
                };
                create: {
                    args: Prisma.HandoffCodeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>;
                };
                createMany: {
                    args: Prisma.HandoffCodeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HandoffCodeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>[];
                };
                delete: {
                    args: Prisma.HandoffCodeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>;
                };
                update: {
                    args: Prisma.HandoffCodeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>;
                };
                deleteMany: {
                    args: Prisma.HandoffCodeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HandoffCodeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HandoffCodeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>[];
                };
                upsert: {
                    args: Prisma.HandoffCodeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HandoffCodePayload>;
                };
                aggregate: {
                    args: Prisma.HandoffCodeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHandoffCode>;
                };
                groupBy: {
                    args: Prisma.HandoffCodeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HandoffCodeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HandoffCodeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HandoffCodeCountAggregateOutputType> | number;
                };
            };
        };
        RateLimitBucket: {
            payload: Prisma.$RateLimitBucketPayload<ExtArgs>;
            fields: Prisma.RateLimitBucketFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RateLimitBucketFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RateLimitBucketFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>;
                };
                findFirst: {
                    args: Prisma.RateLimitBucketFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RateLimitBucketFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>;
                };
                findMany: {
                    args: Prisma.RateLimitBucketFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>[];
                };
                create: {
                    args: Prisma.RateLimitBucketCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>;
                };
                createMany: {
                    args: Prisma.RateLimitBucketCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RateLimitBucketCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>[];
                };
                delete: {
                    args: Prisma.RateLimitBucketDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>;
                };
                update: {
                    args: Prisma.RateLimitBucketUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>;
                };
                deleteMany: {
                    args: Prisma.RateLimitBucketDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RateLimitBucketUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RateLimitBucketUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>[];
                };
                upsert: {
                    args: Prisma.RateLimitBucketUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RateLimitBucketPayload>;
                };
                aggregate: {
                    args: Prisma.RateLimitBucketAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRateLimitBucket>;
                };
                groupBy: {
                    args: Prisma.RateLimitBucketGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RateLimitBucketGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RateLimitBucketCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RateLimitBucketCountAggregateOutputType> | number;
                };
            };
        };
        ProviderReferralLink: {
            payload: Prisma.$ProviderReferralLinkPayload<ExtArgs>;
            fields: Prisma.ProviderReferralLinkFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProviderReferralLinkFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProviderReferralLinkFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>;
                };
                findFirst: {
                    args: Prisma.ProviderReferralLinkFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProviderReferralLinkFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>;
                };
                findMany: {
                    args: Prisma.ProviderReferralLinkFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>[];
                };
                create: {
                    args: Prisma.ProviderReferralLinkCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>;
                };
                createMany: {
                    args: Prisma.ProviderReferralLinkCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProviderReferralLinkCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>[];
                };
                delete: {
                    args: Prisma.ProviderReferralLinkDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>;
                };
                update: {
                    args: Prisma.ProviderReferralLinkUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>;
                };
                deleteMany: {
                    args: Prisma.ProviderReferralLinkDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProviderReferralLinkUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProviderReferralLinkUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>[];
                };
                upsert: {
                    args: Prisma.ProviderReferralLinkUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkPayload>;
                };
                aggregate: {
                    args: Prisma.ProviderReferralLinkAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProviderReferralLink>;
                };
                groupBy: {
                    args: Prisma.ProviderReferralLinkGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProviderReferralLinkGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProviderReferralLinkCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProviderReferralLinkCountAggregateOutputType> | number;
                };
            };
        };
        ProviderReferralLinkDaily: {
            payload: Prisma.$ProviderReferralLinkDailyPayload<ExtArgs>;
            fields: Prisma.ProviderReferralLinkDailyFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProviderReferralLinkDailyFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProviderReferralLinkDailyFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>;
                };
                findFirst: {
                    args: Prisma.ProviderReferralLinkDailyFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProviderReferralLinkDailyFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>;
                };
                findMany: {
                    args: Prisma.ProviderReferralLinkDailyFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>[];
                };
                create: {
                    args: Prisma.ProviderReferralLinkDailyCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>;
                };
                createMany: {
                    args: Prisma.ProviderReferralLinkDailyCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProviderReferralLinkDailyCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>[];
                };
                delete: {
                    args: Prisma.ProviderReferralLinkDailyDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>;
                };
                update: {
                    args: Prisma.ProviderReferralLinkDailyUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>;
                };
                deleteMany: {
                    args: Prisma.ProviderReferralLinkDailyDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProviderReferralLinkDailyUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProviderReferralLinkDailyUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>[];
                };
                upsert: {
                    args: Prisma.ProviderReferralLinkDailyUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProviderReferralLinkDailyPayload>;
                };
                aggregate: {
                    args: Prisma.ProviderReferralLinkDailyAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProviderReferralLinkDaily>;
                };
                groupBy: {
                    args: Prisma.ProviderReferralLinkDailyGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProviderReferralLinkDailyGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProviderReferralLinkDailyCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProviderReferralLinkDailyCountAggregateOutputType> | number;
                };
            };
        };
        OrgSubscription: {
            payload: Prisma.$OrgSubscriptionPayload<ExtArgs>;
            fields: Prisma.OrgSubscriptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.OrgSubscriptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.OrgSubscriptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>;
                };
                findFirst: {
                    args: Prisma.OrgSubscriptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.OrgSubscriptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>;
                };
                findMany: {
                    args: Prisma.OrgSubscriptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>[];
                };
                create: {
                    args: Prisma.OrgSubscriptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>;
                };
                createMany: {
                    args: Prisma.OrgSubscriptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.OrgSubscriptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>[];
                };
                delete: {
                    args: Prisma.OrgSubscriptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>;
                };
                update: {
                    args: Prisma.OrgSubscriptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>;
                };
                deleteMany: {
                    args: Prisma.OrgSubscriptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.OrgSubscriptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.OrgSubscriptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>[];
                };
                upsert: {
                    args: Prisma.OrgSubscriptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$OrgSubscriptionPayload>;
                };
                aggregate: {
                    args: Prisma.OrgSubscriptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateOrgSubscription>;
                };
                groupBy: {
                    args: Prisma.OrgSubscriptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrgSubscriptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.OrgSubscriptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.OrgSubscriptionCountAggregateOutputType> | number;
                };
            };
        };
        SubscriptionEvent: {
            payload: Prisma.$SubscriptionEventPayload<ExtArgs>;
            fields: Prisma.SubscriptionEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubscriptionEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubscriptionEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>;
                };
                findFirst: {
                    args: Prisma.SubscriptionEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubscriptionEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>;
                };
                findMany: {
                    args: Prisma.SubscriptionEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>[];
                };
                create: {
                    args: Prisma.SubscriptionEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>;
                };
                createMany: {
                    args: Prisma.SubscriptionEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubscriptionEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>[];
                };
                delete: {
                    args: Prisma.SubscriptionEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>;
                };
                update: {
                    args: Prisma.SubscriptionEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>;
                };
                deleteMany: {
                    args: Prisma.SubscriptionEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubscriptionEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubscriptionEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>[];
                };
                upsert: {
                    args: Prisma.SubscriptionEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionEventPayload>;
                };
                aggregate: {
                    args: Prisma.SubscriptionEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubscriptionEvent>;
                };
                groupBy: {
                    args: Prisma.SubscriptionEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubscriptionEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionEventCountAggregateOutputType> | number;
                };
            };
        };
        SubscriptionNotice: {
            payload: Prisma.$SubscriptionNoticePayload<ExtArgs>;
            fields: Prisma.SubscriptionNoticeFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubscriptionNoticeFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubscriptionNoticeFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>;
                };
                findFirst: {
                    args: Prisma.SubscriptionNoticeFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubscriptionNoticeFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>;
                };
                findMany: {
                    args: Prisma.SubscriptionNoticeFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>[];
                };
                create: {
                    args: Prisma.SubscriptionNoticeCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>;
                };
                createMany: {
                    args: Prisma.SubscriptionNoticeCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubscriptionNoticeCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>[];
                };
                delete: {
                    args: Prisma.SubscriptionNoticeDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>;
                };
                update: {
                    args: Prisma.SubscriptionNoticeUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>;
                };
                deleteMany: {
                    args: Prisma.SubscriptionNoticeDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubscriptionNoticeUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubscriptionNoticeUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>[];
                };
                upsert: {
                    args: Prisma.SubscriptionNoticeUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionNoticePayload>;
                };
                aggregate: {
                    args: Prisma.SubscriptionNoticeAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubscriptionNotice>;
                };
                groupBy: {
                    args: Prisma.SubscriptionNoticeGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionNoticeGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubscriptionNoticeCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionNoticeCountAggregateOutputType> | number;
                };
            };
        };
        SubscriptionInvoice: {
            payload: Prisma.$SubscriptionInvoicePayload<ExtArgs>;
            fields: Prisma.SubscriptionInvoiceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.SubscriptionInvoiceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.SubscriptionInvoiceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>;
                };
                findFirst: {
                    args: Prisma.SubscriptionInvoiceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.SubscriptionInvoiceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>;
                };
                findMany: {
                    args: Prisma.SubscriptionInvoiceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>[];
                };
                create: {
                    args: Prisma.SubscriptionInvoiceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>;
                };
                createMany: {
                    args: Prisma.SubscriptionInvoiceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.SubscriptionInvoiceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>[];
                };
                delete: {
                    args: Prisma.SubscriptionInvoiceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>;
                };
                update: {
                    args: Prisma.SubscriptionInvoiceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>;
                };
                deleteMany: {
                    args: Prisma.SubscriptionInvoiceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.SubscriptionInvoiceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.SubscriptionInvoiceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>[];
                };
                upsert: {
                    args: Prisma.SubscriptionInvoiceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$SubscriptionInvoicePayload>;
                };
                aggregate: {
                    args: Prisma.SubscriptionInvoiceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateSubscriptionInvoice>;
                };
                groupBy: {
                    args: Prisma.SubscriptionInvoiceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionInvoiceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.SubscriptionInvoiceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.SubscriptionInvoiceCountAggregateOutputType> | number;
                };
            };
        };
        PlanPrice: {
            payload: Prisma.$PlanPricePayload<ExtArgs>;
            fields: Prisma.PlanPriceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PlanPriceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PlanPriceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>;
                };
                findFirst: {
                    args: Prisma.PlanPriceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PlanPriceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>;
                };
                findMany: {
                    args: Prisma.PlanPriceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>[];
                };
                create: {
                    args: Prisma.PlanPriceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>;
                };
                createMany: {
                    args: Prisma.PlanPriceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PlanPriceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>[];
                };
                delete: {
                    args: Prisma.PlanPriceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>;
                };
                update: {
                    args: Prisma.PlanPriceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>;
                };
                deleteMany: {
                    args: Prisma.PlanPriceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PlanPriceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PlanPriceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>[];
                };
                upsert: {
                    args: Prisma.PlanPriceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PlanPricePayload>;
                };
                aggregate: {
                    args: Prisma.PlanPriceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePlanPrice>;
                };
                groupBy: {
                    args: Prisma.PlanPriceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlanPriceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PlanPriceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PlanPriceCountAggregateOutputType> | number;
                };
            };
        };
        DemoMarker: {
            payload: Prisma.$DemoMarkerPayload<ExtArgs>;
            fields: Prisma.DemoMarkerFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.DemoMarkerFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.DemoMarkerFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>;
                };
                findFirst: {
                    args: Prisma.DemoMarkerFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.DemoMarkerFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>;
                };
                findMany: {
                    args: Prisma.DemoMarkerFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>[];
                };
                create: {
                    args: Prisma.DemoMarkerCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>;
                };
                createMany: {
                    args: Prisma.DemoMarkerCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.DemoMarkerCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>[];
                };
                delete: {
                    args: Prisma.DemoMarkerDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>;
                };
                update: {
                    args: Prisma.DemoMarkerUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>;
                };
                deleteMany: {
                    args: Prisma.DemoMarkerDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.DemoMarkerUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.DemoMarkerUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>[];
                };
                upsert: {
                    args: Prisma.DemoMarkerUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$DemoMarkerPayload>;
                };
                aggregate: {
                    args: Prisma.DemoMarkerAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateDemoMarker>;
                };
                groupBy: {
                    args: Prisma.DemoMarkerGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DemoMarkerGroupByOutputType>[];
                };
                count: {
                    args: Prisma.DemoMarkerCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.DemoMarkerCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const TenantScalarFieldEnum: {
    readonly id: "id";
    readonly externalOrgId: "externalOrgId";
    readonly name: "name";
    readonly edition: "edition";
    readonly marketCode: "marketCode";
    readonly subscriptionStatus: "subscriptionStatus";
    readonly defaultSignInMethod: "defaultSignInMethod";
    readonly settings: "settings";
    readonly onboardedAt: "onboardedAt";
    readonly createdAt: "createdAt";
};
export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum];
export declare const BranchScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly name: "name";
    readonly licenceNo: "licenceNo";
    readonly address: "address";
    readonly code: "code";
    readonly phone: "phone";
    readonly active: "active";
    readonly receiptCounter: "receiptCounter";
    readonly createdAt: "createdAt";
};
export type BranchScalarFieldEnum = (typeof BranchScalarFieldEnum)[keyof typeof BranchScalarFieldEnum];
export declare const StaffUserScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly subject: "subject";
    readonly phone: "phone";
    readonly displayName: "displayName";
    readonly role: "role";
    readonly pharmacistLicenceNo: "pharmacistLicenceNo";
    readonly active: "active";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly branchId: "branchId";
    readonly mfaEnrolled: "mfaEnrolled";
    readonly dismissedCards: "dismissedCards";
    readonly lastLoginAt: "lastLoginAt";
    readonly createdAt: "createdAt";
};
export type StaffUserScalarFieldEnum = (typeof StaffUserScalarFieldEnum)[keyof typeof StaffUserScalarFieldEnum];
export declare const PassportSessionScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly staffId: "staffId";
    readonly sub: "sub";
    readonly sid: "sid";
    readonly createdAt: "createdAt";
    readonly lastSeenAt: "lastSeenAt";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly revokedReason: "revokedReason";
};
export type PassportSessionScalarFieldEnum = (typeof PassportSessionScalarFieldEnum)[keyof typeof PassportSessionScalarFieldEnum];
export declare const PassportRevocationScalarFieldEnum: {
    readonly id: "id";
    readonly kind: "kind";
    readonly value: "value";
    readonly revokedAt: "revokedAt";
    readonly expiresAt: "expiresAt";
};
export type PassportRevocationScalarFieldEnum = (typeof PassportRevocationScalarFieldEnum)[keyof typeof PassportRevocationScalarFieldEnum];
export declare const LogoutTokenSeenScalarFieldEnum: {
    readonly jti: "jti";
    readonly seenAt: "seenAt";
    readonly expiresAt: "expiresAt";
};
export type LogoutTokenSeenScalarFieldEnum = (typeof LogoutTokenSeenScalarFieldEnum)[keyof typeof LogoutTokenSeenScalarFieldEnum];
export declare const DrugScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly brandName: "brandName";
    readonly brandNameAr: "brandNameAr";
    readonly activeIngredient: "activeIngredient";
    readonly strength: "strength";
    readonly dosageForm: "dosageForm";
    readonly packSize: "packSize";
    readonly gtin: "gtin";
    readonly manufacturer: "manufacturer";
    readonly rxOnly: "rxOnly";
    readonly controlledSchedule: "controlledSchedule";
    readonly coldChain: "coldChain";
    readonly otc: "otc";
    readonly marketCodes: "marketCodes";
    readonly substitutionGroupId: "substitutionGroupId";
    readonly vatRate: "vatRate";
    readonly category: "category";
    readonly baseUnit: "baseUnit";
    readonly sourceKey: "sourceKey";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type DrugScalarFieldEnum = (typeof DrugScalarFieldEnum)[keyof typeof DrugScalarFieldEnum];
export declare const SubstitutionGroupScalarFieldEnum: {
    readonly id: "id";
    readonly activeIngredient: "activeIngredient";
    readonly strength: "strength";
    readonly dosageForm: "dosageForm";
};
export type SubstitutionGroupScalarFieldEnum = (typeof SubstitutionGroupScalarFieldEnum)[keyof typeof SubstitutionGroupScalarFieldEnum];
export declare const PriceBookEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly drugId: "drugId";
    readonly branchId: "branchId";
    readonly price: "price";
    readonly effectiveFrom: "effectiveFrom";
    readonly effectiveTo: "effectiveTo";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type PriceBookEntryScalarFieldEnum = (typeof PriceBookEntryScalarFieldEnum)[keyof typeof PriceBookEntryScalarFieldEnum];
export declare const SupplierScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly name: "name";
    readonly phone: "phone";
    readonly email: "email";
    readonly paymentTerms: "paymentTerms";
    readonly creditLimit: "creditLimit";
    readonly balance: "balance";
    readonly leadTimeDays: "leadTimeDays";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum];
export declare const PurchaseOrderScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly supplierId: "supplierId";
    readonly status: "status";
    readonly origin: "origin";
    readonly createdBy: "createdBy";
    readonly poNumber: "poNumber";
    readonly expectedAt: "expectedAt";
    readonly notes: "notes";
    readonly sentVia: "sentVia";
    readonly totalCost: "totalCost";
    readonly sentAt: "sentAt";
    readonly createdAt: "createdAt";
};
export type PurchaseOrderScalarFieldEnum = (typeof PurchaseOrderScalarFieldEnum)[keyof typeof PurchaseOrderScalarFieldEnum];
export declare const PurchaseOrderLineScalarFieldEnum: {
    readonly id: "id";
    readonly purchaseOrderId: "purchaseOrderId";
    readonly drugId: "drugId";
    readonly qtyOrdered: "qtyOrdered";
    readonly qtyReceived: "qtyReceived";
    readonly unitCost: "unitCost";
};
export type PurchaseOrderLineScalarFieldEnum = (typeof PurchaseOrderLineScalarFieldEnum)[keyof typeof PurchaseOrderLineScalarFieldEnum];
export declare const RecallNoticeScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly drugId: "drugId";
    readonly lotNumbers: "lotNumbers";
    readonly affectedLots: "affectedLots";
    readonly reason: "reason";
    readonly source: "source";
    readonly status: "status";
    readonly enteredBy: "enteredBy";
    readonly enteredAt: "enteredAt";
    readonly liftedBy: "liftedBy";
    readonly liftedAt: "liftedAt";
};
export type RecallNoticeScalarFieldEnum = (typeof RecallNoticeScalarFieldEnum)[keyof typeof RecallNoticeScalarFieldEnum];
export declare const StockLotScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly drugId: "drugId";
    readonly lotNumber: "lotNumber";
    readonly expiryDate: "expiryDate";
    readonly status: "status";
    readonly qtyOnHand: "qtyOnHand";
    readonly qtyReserved: "qtyReserved";
    readonly unitCost: "unitCost";
    readonly supplierId: "supplierId";
    readonly purchaseOrderId: "purchaseOrderId";
    readonly supplierInvoiceNo: "supplierInvoiceNo";
    readonly receivedAt: "receivedAt";
    readonly blockedReason: "blockedReason";
    readonly blockedAt: "blockedAt";
    readonly recallNoticeId: "recallNoticeId";
    readonly statusBeforeBlock: "statusBeforeBlock";
    readonly locationId: "locationId";
    readonly createdAt: "createdAt";
};
export type StockLotScalarFieldEnum = (typeof StockLotScalarFieldEnum)[keyof typeof StockLotScalarFieldEnum];
export declare const StockMovementScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly lotId: "lotId";
    readonly type: "type";
    readonly qtyDelta: "qtyDelta";
    readonly reason: "reason";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly reasonCode: "reasonCode";
    readonly managerApprovalBy: "managerApprovalBy";
    readonly performedBy: "performedBy";
    readonly occurredAt: "occurredAt";
};
export type StockMovementScalarFieldEnum = (typeof StockMovementScalarFieldEnum)[keyof typeof StockMovementScalarFieldEnum];
export declare const ColdChainReadingScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly lotId: "lotId";
    readonly temperatureC: "temperatureC";
    readonly excursion: "excursion";
    readonly recordedBy: "recordedBy";
    readonly recordedAt: "recordedAt";
};
export type ColdChainReadingScalarFieldEnum = (typeof ColdChainReadingScalarFieldEnum)[keyof typeof ColdChainReadingScalarFieldEnum];
export declare const StockCountScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly type: "type";
    readonly status: "status";
    readonly startedBy: "startedBy";
    readonly approvedBy: "approvedBy";
    readonly startedAt: "startedAt";
    readonly closedAt: "closedAt";
};
export type StockCountScalarFieldEnum = (typeof StockCountScalarFieldEnum)[keyof typeof StockCountScalarFieldEnum];
export declare const StockCountLineScalarFieldEnum: {
    readonly id: "id";
    readonly stockCountId: "stockCountId";
    readonly lotId: "lotId";
    readonly qtyExpected: "qtyExpected";
    readonly qtyCounted: "qtyCounted";
};
export type StockCountLineScalarFieldEnum = (typeof StockCountLineScalarFieldEnum)[keyof typeof StockCountLineScalarFieldEnum];
export declare const PatientRefScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly externalId: "externalId";
    readonly customerNo: "customerNo";
    readonly displayName: "displayName";
    readonly phone: "phone";
    readonly email: "email";
    readonly gender: "gender";
    readonly dateOfBirth: "dateOfBirth";
    readonly address: "address";
    readonly nationalIdHash: "nationalIdHash";
    readonly nationalIdLast4: "nationalIdLast4";
    readonly allergies: "allergies";
    readonly chronicConditions: "chronicConditions";
    readonly medicalNotes: "medicalNotes";
    readonly pregnant: "pregnant";
    readonly lactating: "lactating";
    readonly renalImpairment: "renalImpairment";
    readonly hepaticImpairment: "hepaticImpairment";
    readonly weightKg: "weightKg";
    readonly birthYear: "birthYear";
    readonly consentDataProcessing: "consentDataProcessing";
    readonly consentMarketing: "consentMarketing";
    readonly consentRecordedAt: "consentRecordedAt";
    readonly consentRecordedBy: "consentRecordedBy";
    readonly loyaltyPoints: "loyaltyPoints";
    readonly loyaltyTier: "loyaltyTier";
    readonly lifetimeSpend: "lifetimeSpend";
    readonly active: "active";
    readonly mergedIntoId: "mergedIntoId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PatientRefScalarFieldEnum = (typeof PatientRefScalarFieldEnum)[keyof typeof PatientRefScalarFieldEnum];
export declare const CustomerNoteScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly patientId: "patientId";
    readonly kind: "kind";
    readonly body: "body";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type CustomerNoteScalarFieldEnum = (typeof CustomerNoteScalarFieldEnum)[keyof typeof CustomerNoteScalarFieldEnum];
export declare const FamilyLinkScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly patientId: "patientId";
    readonly relatedPatientId: "relatedPatientId";
    readonly relation: "relation";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type FamilyLinkScalarFieldEnum = (typeof FamilyLinkScalarFieldEnum)[keyof typeof FamilyLinkScalarFieldEnum];
export declare const LoyaltyEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly patientId: "patientId";
    readonly kind: "kind";
    readonly points: "points";
    readonly balanceAfter: "balanceAfter";
    readonly saleId: "saleId";
    readonly note: "note";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type LoyaltyEntryScalarFieldEnum = (typeof LoyaltyEntryScalarFieldEnum)[keyof typeof LoyaltyEntryScalarFieldEnum];
export declare const PrescriptionScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly source: "source";
    readonly status: "status";
    readonly patientId: "patientId";
    readonly sourceEventId: "sourceEventId";
    readonly sourceRxRef: "sourceRxRef";
    readonly consentTokenHash: "consentTokenHash";
    readonly consentVerifiedAt: "consentVerifiedAt";
    readonly consentExpiresAt: "consentExpiresAt";
    readonly prescriberName: "prescriberName";
    readonly prescriberLicenceNo: "prescriberLicenceNo";
    readonly prescriberVerifiedBadge: "prescriberVerifiedBadge";
    readonly issuedAt: "issuedAt";
    readonly validUntil: "validUntil";
    readonly scanStorageKey: "scanStorageKey";
    readonly prescriberRef: "prescriberRef";
    readonly prescriberId: "prescriberId";
    readonly refillsAllowed: "refillsAllowed";
    readonly refillsUsed: "refillsUsed";
    readonly refillIntervalDays: "refillIntervalDays";
    readonly nextRefillDueAt: "nextRefillDueAt";
    readonly priority: "priority";
    readonly verificationNotes: "verificationNotes";
    readonly transferredOutAt: "transferredOutAt";
    readonly clinicRef: "clinicRef";
    readonly validatedBy: "validatedBy";
    readonly validatedAt: "validatedAt";
    readonly kiorexOrderId: "kiorexOrderId";
    readonly rejectionReason: "rejectionReason";
    readonly receivedBy: "receivedBy";
    readonly receivedAt: "receivedAt";
};
export type PrescriptionScalarFieldEnum = (typeof PrescriptionScalarFieldEnum)[keyof typeof PrescriptionScalarFieldEnum];
export declare const PrescriptionLineScalarFieldEnum: {
    readonly id: "id";
    readonly prescriptionId: "prescriptionId";
    readonly drugId: "drugId";
    readonly activeIngredient: "activeIngredient";
    readonly strength: "strength";
    readonly dosageForm: "dosageForm";
    readonly quantity: "quantity";
    readonly qtyDispensed: "qtyDispensed";
    readonly drugName: "drugName";
    readonly controlled: "controlled";
    readonly directions: "directions";
};
export type PrescriptionLineScalarFieldEnum = (typeof PrescriptionLineScalarFieldEnum)[keyof typeof PrescriptionLineScalarFieldEnum];
export declare const DispensingScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly prescriptionId: "prescriptionId";
    readonly patientId: "patientId";
    readonly status: "status";
    readonly pharmacistId: "pharmacistId";
    readonly signedOffAt: "signedOffAt";
    readonly counsellingNotes: "counsellingNotes";
    readonly kiorexOrderRef: "kiorexOrderRef";
    readonly controlledIdCaptured: "controlledIdCaptured";
    readonly partialReason: "partialReason";
    readonly counsellingTopics: "counsellingTopics";
    readonly safetyChecksRunAt: "safetyChecksRunAt";
    readonly saleId: "saleId";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly dispensedAt: "dispensedAt";
};
export type DispensingScalarFieldEnum = (typeof DispensingScalarFieldEnum)[keyof typeof DispensingScalarFieldEnum];
export declare const DispensingLineScalarFieldEnum: {
    readonly id: "id";
    readonly dispensingId: "dispensingId";
    readonly drugId: "drugId";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
    readonly prescriptionLineId: "prescriptionLineId";
    readonly substitutedFromDrugId: "substitutedFromDrugId";
    readonly substitutionConsent: "substitutionConsent";
    readonly substitutionDecidedBy: "substitutionDecidedBy";
    readonly unitPrice: "unitPrice";
    readonly vatRate: "vatRate";
};
export type DispensingLineScalarFieldEnum = (typeof DispensingLineScalarFieldEnum)[keyof typeof DispensingLineScalarFieldEnum];
export declare const SafetyCheckResultScalarFieldEnum: {
    readonly id: "id";
    readonly dispensingId: "dispensingId";
    readonly kind: "kind";
    readonly outcome: "outcome";
    readonly detail: "detail";
    readonly overridable: "overridable";
    readonly overriddenBy: "overriddenBy";
    readonly overrideReason: "overrideReason";
    readonly checkedAt: "checkedAt";
};
export type SafetyCheckResultScalarFieldEnum = (typeof SafetyCheckResultScalarFieldEnum)[keyof typeof SafetyCheckResultScalarFieldEnum];
export declare const ControlledSubstanceLogEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly dispensingId: "dispensingId";
    readonly drugId: "drugId";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
    readonly patientNationalIdLast4: "patientNationalIdLast4";
    readonly patientNationalIdHash: "patientNationalIdHash";
    readonly patientName: "patientName";
    readonly prescriptionId: "prescriptionId";
    readonly prescriberLicenceNo: "prescriberLicenceNo";
    readonly pharmacistId: "pharmacistId";
    readonly loggedAt: "loggedAt";
};
export type ControlledSubstanceLogEntryScalarFieldEnum = (typeof ControlledSubstanceLogEntryScalarFieldEnum)[keyof typeof ControlledSubstanceLogEntryScalarFieldEnum];
export declare const ShiftScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly openedBy: "openedBy";
    readonly closedBy: "closedBy";
    readonly status: "status";
    readonly openingFloat: "openingFloat";
    readonly countedCash: "countedCash";
    readonly expectedCash: "expectedCash";
    readonly variance: "variance";
    readonly varianceAlerted: "varianceAlerted";
    readonly zReport: "zReport";
    readonly openedAt: "openedAt";
    readonly closedAt: "closedAt";
};
export type ShiftScalarFieldEnum = (typeof ShiftScalarFieldEnum)[keyof typeof ShiftScalarFieldEnum];
export declare const SaleScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly shiftId: "shiftId";
    readonly channel: "channel";
    readonly status: "status";
    readonly idempotencyKey: "idempotencyKey";
    readonly receiptNo: "receiptNo";
    readonly customerAccountId: "customerAccountId";
    readonly patientId: "patientId";
    readonly exchangeOfSaleId: "exchangeOfSaleId";
    readonly dispensingId: "dispensingId";
    readonly subtotal: "subtotal";
    readonly discountTotal: "discountTotal";
    readonly vatTotal: "vatTotal";
    readonly total: "total";
    readonly offline: "offline";
    readonly clientCreatedAt: "clientCreatedAt";
    readonly voidedBy: "voidedBy";
    readonly voidReason: "voidReason";
    readonly voidedAt: "voidedAt";
    readonly soldBy: "soldBy";
    readonly soldAt: "soldAt";
};
export type SaleScalarFieldEnum = (typeof SaleScalarFieldEnum)[keyof typeof SaleScalarFieldEnum];
export declare const SaleLineScalarFieldEnum: {
    readonly id: "id";
    readonly saleId: "saleId";
    readonly drugId: "drugId";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
    readonly unitPrice: "unitPrice";
    readonly discount: "discount";
    readonly vatRate: "vatRate";
    readonly vatAmount: "vatAmount";
};
export type SaleLineScalarFieldEnum = (typeof SaleLineScalarFieldEnum)[keyof typeof SaleLineScalarFieldEnum];
export declare const SalePaymentScalarFieldEnum: {
    readonly id: "id";
    readonly saleId: "saleId";
    readonly method: "method";
    readonly amount: "amount";
    readonly reference: "reference";
    readonly status: "status";
    readonly paidAt: "paidAt";
};
export type SalePaymentScalarFieldEnum = (typeof SalePaymentScalarFieldEnum)[keyof typeof SalePaymentScalarFieldEnum];
export declare const SaleReturnScalarFieldEnum: {
    readonly id: "id";
    readonly saleId: "saleId";
    readonly saleLineId: "saleLineId";
    readonly refundMethod: "refundMethod";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
    readonly refund: "refund";
    readonly reason: "reason";
    readonly approvedBy: "approvedBy";
    readonly createdAt: "createdAt";
};
export type SaleReturnScalarFieldEnum = (typeof SaleReturnScalarFieldEnum)[keyof typeof SaleReturnScalarFieldEnum];
export declare const CustomerAccountScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly patientId: "patientId";
    readonly creditLimit: "creditLimit";
    readonly balance: "balance";
    readonly createdAt: "createdAt";
};
export type CustomerAccountScalarFieldEnum = (typeof CustomerAccountScalarFieldEnum)[keyof typeof CustomerAccountScalarFieldEnum];
export declare const CustomerCreditEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly accountId: "accountId";
    readonly kind: "kind";
    readonly amount: "amount";
    readonly saleId: "saleId";
    readonly note: "note";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type CustomerCreditEntryScalarFieldEnum = (typeof CustomerCreditEntryScalarFieldEnum)[keyof typeof CustomerCreditEntryScalarFieldEnum];
export declare const OutboxEventScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly type: "type";
    readonly aggregateType: "aggregateType";
    readonly aggregateId: "aggregateId";
    readonly payload: "payload";
    readonly target: "target";
    readonly dedupeKey: "dedupeKey";
    readonly status: "status";
    readonly attempts: "attempts";
    readonly lastError: "lastError";
    readonly nextAttemptAt: "nextAttemptAt";
    readonly occurredAt: "occurredAt";
    readonly sentAt: "sentAt";
};
export type OutboxEventScalarFieldEnum = (typeof OutboxEventScalarFieldEnum)[keyof typeof OutboxEventScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly actorId: "actorId";
    readonly action: "action";
    readonly entityType: "entityType";
    readonly entityId: "entityId";
    readonly meta: "meta";
    readonly at: "at";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const FlagSnapshotCacheScalarFieldEnum: {
    readonly product: "product";
    readonly version: "version";
    readonly etag: "etag";
    readonly body: "body";
    readonly fetchedAt: "fetchedAt";
};
export type FlagSnapshotCacheScalarFieldEnum = (typeof FlagSnapshotCacheScalarFieldEnum)[keyof typeof FlagSnapshotCacheScalarFieldEnum];
export declare const ReorderPolicyScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly drugId: "drugId";
    readonly minQty: "minQty";
    readonly maxQty: "maxQty";
    readonly leadTimeDays: "leadTimeDays";
    readonly supplierId: "supplierId";
    readonly updatedAt: "updatedAt";
};
export type ReorderPolicyScalarFieldEnum = (typeof ReorderPolicyScalarFieldEnum)[keyof typeof ReorderPolicyScalarFieldEnum];
export declare const SupplierLedgerEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly supplierId: "supplierId";
    readonly type: "type";
    readonly amount: "amount";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly note: "note";
    readonly idempotencyKey: "idempotencyKey";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type SupplierLedgerEntryScalarFieldEnum = (typeof SupplierLedgerEntryScalarFieldEnum)[keyof typeof SupplierLedgerEntryScalarFieldEnum];
export declare const GoodsReceiptScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly supplierId: "supplierId";
    readonly purchaseOrderId: "purchaseOrderId";
    readonly invoiceNo: "invoiceNo";
    readonly invoiceTotal: "invoiceTotal";
    readonly idempotencyKey: "idempotencyKey";
    readonly receivedBy: "receivedBy";
    readonly receivedAt: "receivedAt";
};
export type GoodsReceiptScalarFieldEnum = (typeof GoodsReceiptScalarFieldEnum)[keyof typeof GoodsReceiptScalarFieldEnum];
export declare const GoodsReceiptLineScalarFieldEnum: {
    readonly id: "id";
    readonly receiptId: "receiptId";
    readonly drugId: "drugId";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
    readonly unitCost: "unitCost";
    readonly poUnitCost: "poUnitCost";
    readonly prevUnitCost: "prevUnitCost";
};
export type GoodsReceiptLineScalarFieldEnum = (typeof GoodsReceiptLineScalarFieldEnum)[keyof typeof GoodsReceiptLineScalarFieldEnum];
export declare const SupplierReturnScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly supplierId: "supplierId";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
    readonly creditAmount: "creditAmount";
    readonly reason: "reason";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type SupplierReturnScalarFieldEnum = (typeof SupplierReturnScalarFieldEnum)[keyof typeof SupplierReturnScalarFieldEnum];
export declare const ExpiryAlertScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly lotId: "lotId";
    readonly thresholdDays: "thresholdDays";
    readonly notifiedAt: "notifiedAt";
};
export type ExpiryAlertScalarFieldEnum = (typeof ExpiryAlertScalarFieldEnum)[keyof typeof ExpiryAlertScalarFieldEnum];
export declare const StockTransferScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly fromBranchId: "fromBranchId";
    readonly toBranchId: "toBranchId";
    readonly status: "status";
    readonly requestedBy: "requestedBy";
    readonly dispatchedBy: "dispatchedBy";
    readonly receivedBy: "receivedBy";
    readonly createdAt: "createdAt";
    readonly dispatchedAt: "dispatchedAt";
    readonly receivedAt: "receivedAt";
};
export type StockTransferScalarFieldEnum = (typeof StockTransferScalarFieldEnum)[keyof typeof StockTransferScalarFieldEnum];
export declare const StockTransferLineScalarFieldEnum: {
    readonly id: "id";
    readonly transferId: "transferId";
    readonly drugId: "drugId";
    readonly lotId: "lotId";
    readonly quantity: "quantity";
};
export type StockTransferLineScalarFieldEnum = (typeof StockTransferLineScalarFieldEnum)[keyof typeof StockTransferLineScalarFieldEnum];
export declare const BranchMarketplaceSettingScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly optedIn: "optedIn";
    readonly deliveryRadiusKm: "deliveryRadiusKm";
    readonly openingHours: "openingHours";
    readonly prepMinutes: "prepMinutes";
    readonly slaMinutes: "slaMinutes";
    readonly latitude: "latitude";
    readonly longitude: "longitude";
    readonly updatedAt: "updatedAt";
};
export type BranchMarketplaceSettingScalarFieldEnum = (typeof BranchMarketplaceSettingScalarFieldEnum)[keyof typeof BranchMarketplaceSettingScalarFieldEnum];
export declare const KiorexCommissionRateViewScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly product: "product";
    readonly version: "version";
    readonly view: "view";
    readonly receivedAt: "receivedAt";
    readonly updatedAt: "updatedAt";
};
export type KiorexCommissionRateViewScalarFieldEnum = (typeof KiorexCommissionRateViewScalarFieldEnum)[keyof typeof KiorexCommissionRateViewScalarFieldEnum];
export declare const KiorexOrderScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly externalOrderId: "externalOrderId";
    readonly status: "status";
    readonly hasRx: "hasRx";
    readonly prescriptionId: "prescriptionId";
    readonly customerName: "customerName";
    readonly customerPhone: "customerPhone";
    readonly deliveryAddress: "deliveryAddress";
    readonly prepaid: "prepaid";
    readonly orderValue: "orderValue";
    readonly slaDueAt: "slaDueAt";
    readonly respondedAt: "respondedAt";
    readonly respondedBy: "respondedBy";
    readonly rejectionReason: "rejectionReason";
    readonly rejectionCode: "rejectionCode";
    readonly readyAt: "readyAt";
    readonly outForDeliveryAt: "outForDeliveryAt";
    readonly dispensingId: "dispensingId";
    readonly patientRef: "patientRef";
    readonly deliveryMethod: "deliveryMethod";
    readonly paymentRef: "paymentRef";
    readonly acquisitionOrigin: "acquisitionOrigin";
    readonly acquisitionDecisionRef: "acquisitionDecisionRef";
    readonly acquisitionReason: "acquisitionReason";
    readonly acquisitionLinkId: "acquisitionLinkId";
    readonly acquisitionOrderCountedAt: "acquisitionOrderCountedAt";
    readonly acquisitionCompletedCountedAt: "acquisitionCompletedCountedAt";
    readonly createdAt: "createdAt";
};
export type KiorexOrderScalarFieldEnum = (typeof KiorexOrderScalarFieldEnum)[keyof typeof KiorexOrderScalarFieldEnum];
export declare const KiorexOrderLineScalarFieldEnum: {
    readonly id: "id";
    readonly orderId: "orderId";
    readonly drugId: "drugId";
    readonly qtyRequested: "qtyRequested";
    readonly qtyAccepted: "qtyAccepted";
    readonly unitPrice: "unitPrice";
};
export type KiorexOrderLineScalarFieldEnum = (typeof KiorexOrderLineScalarFieldEnum)[keyof typeof KiorexOrderLineScalarFieldEnum];
export declare const IntegrationClientScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly key: "key";
    readonly secretEnc: "secretEnc";
    readonly source: "source";
    readonly kiorexBaseUrl: "kiorexBaseUrl";
    readonly webhookSecretEnc: "webhookSecretEnc";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type IntegrationClientScalarFieldEnum = (typeof IntegrationClientScalarFieldEnum)[keyof typeof IntegrationClientScalarFieldEnum];
export declare const InboundEventScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly type: "type";
    readonly orgId: "orgId";
    readonly receivedAt: "receivedAt";
};
export type InboundEventScalarFieldEnum = (typeof InboundEventScalarFieldEnum)[keyof typeof InboundEventScalarFieldEnum];
export declare const NotificationScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly channel: "channel";
    readonly recipient: "recipient";
    readonly template: "template";
    readonly locale: "locale";
    readonly body: "body";
    readonly status: "status";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly provider: "provider";
    readonly createdAt: "createdAt";
    readonly sentAt: "sentAt";
    readonly providerMessageId: "providerMessageId";
    readonly error: "error";
    readonly deliveredAt: "deliveredAt";
};
export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum];
export declare const InsurerClaimScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly saleId: "saleId";
    readonly insurerName: "insurerName";
    readonly memberRef: "memberRef";
    readonly policyNo: "policyNo";
    readonly amountClaimed: "amountClaimed";
    readonly patientCopay: "patientCopay";
    readonly approvedAmount: "approvedAmount";
    readonly paidAmount: "paidAmount";
    readonly rejectionReason: "rejectionReason";
    readonly submissionRef: "submissionRef";
    readonly dueAt: "dueAt";
    readonly status: "status";
    readonly submittedAt: "submittedAt";
    readonly resolvedAt: "resolvedAt";
    readonly responseNote: "responseNote";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type InsurerClaimScalarFieldEnum = (typeof InsurerClaimScalarFieldEnum)[keyof typeof InsurerClaimScalarFieldEnum];
export declare const SyncConflictScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly idempotencyKey: "idempotencyKey";
    readonly reason: "reason";
    readonly payload: "payload";
    readonly resolved: "resolved";
    readonly resolvedBy: "resolvedBy";
    readonly createdAt: "createdAt";
};
export type SyncConflictScalarFieldEnum = (typeof SyncConflictScalarFieldEnum)[keyof typeof SyncConflictScalarFieldEnum];
export declare const WalletEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly amount: "amount";
    readonly kind: "kind";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly idempotencyKey: "idempotencyKey";
    readonly createdAt: "createdAt";
};
export type WalletEntryScalarFieldEnum = (typeof WalletEntryScalarFieldEnum)[keyof typeof WalletEntryScalarFieldEnum];
export declare const SettlementEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly orderRef: "orderRef";
    readonly orderValue: "orderValue";
    readonly feeRate: "feeRate";
    readonly feeAmount: "feeAmount";
    readonly currency: "currency";
    readonly createdAt: "createdAt";
};
export type SettlementEntryScalarFieldEnum = (typeof SettlementEntryScalarFieldEnum)[keyof typeof SettlementEntryScalarFieldEnum];
export declare const RolePermissionOverrideScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly role: "role";
    readonly permission: "permission";
    readonly granted: "granted";
    readonly updatedBy: "updatedBy";
    readonly updatedAt: "updatedAt";
};
export type RolePermissionOverrideScalarFieldEnum = (typeof RolePermissionOverrideScalarFieldEnum)[keyof typeof RolePermissionOverrideScalarFieldEnum];
export declare const PrescriberScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly name: "name";
    readonly nameAr: "nameAr";
    readonly licenceNo: "licenceNo";
    readonly specialty: "specialty";
    readonly phone: "phone";
    readonly clinicName: "clinicName";
    readonly clinicAddress: "clinicAddress";
    readonly verified: "verified";
    readonly verifiedBy: "verifiedBy";
    readonly verifiedAt: "verifiedAt";
    readonly active: "active";
    readonly notes: "notes";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PrescriberScalarFieldEnum = (typeof PrescriberScalarFieldEnum)[keyof typeof PrescriberScalarFieldEnum];
export declare const RxRefillScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly prescriptionId: "prescriptionId";
    readonly refillNo: "refillNo";
    readonly early: "early";
    readonly earlyReason: "earlyReason";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type RxRefillScalarFieldEnum = (typeof RxRefillScalarFieldEnum)[keyof typeof RxRefillScalarFieldEnum];
export declare const RefillReminderScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly prescriptionId: "prescriptionId";
    readonly refillNo: "refillNo";
    readonly notificationId: "notificationId";
    readonly sentAt: "sentAt";
};
export type RefillReminderScalarFieldEnum = (typeof RefillReminderScalarFieldEnum)[keyof typeof RefillReminderScalarFieldEnum];
export declare const RxTransferScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly direction: "direction";
    readonly prescriptionId: "prescriptionId";
    readonly counterpartyName: "counterpartyName";
    readonly counterpartyPhone: "counterpartyPhone";
    readonly counterpartyPharmacist: "counterpartyPharmacist";
    readonly counterpartyLicenceNo: "counterpartyLicenceNo";
    readonly reason: "reason";
    readonly snapshot: "snapshot";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type RxTransferScalarFieldEnum = (typeof RxTransferScalarFieldEnum)[keyof typeof RxTransferScalarFieldEnum];
export declare const ClinicalRuleScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly key: "key";
    readonly kind: "kind";
    readonly ingredient: "ingredient";
    readonly ingredientB: "ingredientB";
    readonly severity: "severity";
    readonly note: "note";
    readonly maxDailyMg: "maxDailyMg";
    readonly maxSingleMg: "maxSingleMg";
    readonly pediatricMaxMgPerKg: "pediatricMaxMgPerKg";
    readonly category: "category";
    readonly source: "source";
    readonly active: "active";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type ClinicalRuleScalarFieldEnum = (typeof ClinicalRuleScalarFieldEnum)[keyof typeof ClinicalRuleScalarFieldEnum];
export declare const ControlledRegisterEntryScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly drugId: "drugId";
    readonly lotId: "lotId";
    readonly movementId: "movementId";
    readonly kind: "kind";
    readonly qtyDelta: "qtyDelta";
    readonly balanceAfter: "balanceAfter";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly patientName: "patientName";
    readonly patientIdLast4: "patientIdLast4";
    readonly prescriptionId: "prescriptionId";
    readonly prescriberLicenceNo: "prescriberLicenceNo";
    readonly performedBy: "performedBy";
    readonly witnessId: "witnessId";
    readonly witnessName: "witnessName";
    readonly reason: "reason";
    readonly occurredAt: "occurredAt";
};
export type ControlledRegisterEntryScalarFieldEnum = (typeof ControlledRegisterEntryScalarFieldEnum)[keyof typeof ControlledRegisterEntryScalarFieldEnum];
export declare const ControlledDiscrepancyScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly drugId: "drugId";
    readonly expectedQty: "expectedQty";
    readonly countedQty: "countedQty";
    readonly difference: "difference";
    readonly status: "status";
    readonly notes: "notes";
    readonly reportedBy: "reportedBy";
    readonly witnessId: "witnessId";
    readonly resolvedBy: "resolvedBy";
    readonly resolution: "resolution";
    readonly resolvedAt: "resolvedAt";
    readonly createdAt: "createdAt";
};
export type ControlledDiscrepancyScalarFieldEnum = (typeof ControlledDiscrepancyScalarFieldEnum)[keyof typeof ControlledDiscrepancyScalarFieldEnum];
export declare const PromotionScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly name: "name";
    readonly nameAr: "nameAr";
    readonly kind: "kind";
    readonly couponCode: "couponCode";
    readonly drugIds: "drugIds";
    readonly params: "params";
    readonly startsAt: "startsAt";
    readonly endsAt: "endsAt";
    readonly minSubtotal: "minSubtotal";
    readonly maxUses: "maxUses";
    readonly usedCount: "usedCount";
    readonly priority: "priority";
    readonly stackable: "stackable";
    readonly active: "active";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type PromotionScalarFieldEnum = (typeof PromotionScalarFieldEnum)[keyof typeof PromotionScalarFieldEnum];
export declare const PromotionRedemptionScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly promotionId: "promotionId";
    readonly saleId: "saleId";
    readonly patientId: "patientId";
    readonly discountAmount: "discountAmount";
    readonly couponCode: "couponCode";
    readonly createdAt: "createdAt";
};
export type PromotionRedemptionScalarFieldEnum = (typeof PromotionRedemptionScalarFieldEnum)[keyof typeof PromotionRedemptionScalarFieldEnum];
export declare const HeldCartScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly userId: "userId";
    readonly label: "label";
    readonly patientId: "patientId";
    readonly payload: "payload";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly resolvedAt: "resolvedAt";
};
export type HeldCartScalarFieldEnum = (typeof HeldCartScalarFieldEnum)[keyof typeof HeldCartScalarFieldEnum];
export declare const CashMovementScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly shiftId: "shiftId";
    readonly kind: "kind";
    readonly category: "category";
    readonly amount: "amount";
    readonly reason: "reason";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
};
export type CashMovementScalarFieldEnum = (typeof CashMovementScalarFieldEnum)[keyof typeof CashMovementScalarFieldEnum];
export declare const ShelfLocationScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly code: "code";
    readonly label: "label";
    readonly kind: "kind";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type ShelfLocationScalarFieldEnum = (typeof ShelfLocationScalarFieldEnum)[keyof typeof ShelfLocationScalarFieldEnum];
export declare const UomConversionScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly drugId: "drugId";
    readonly name: "name";
    readonly factor: "factor";
    readonly barcode: "barcode";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type UomConversionScalarFieldEnum = (typeof UomConversionScalarFieldEnum)[keyof typeof UomConversionScalarFieldEnum];
export declare const RequestForQuoteScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly number: "number";
    readonly status: "status";
    readonly notes: "notes";
    readonly dueAt: "dueAt";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly awardedAt: "awardedAt";
};
export type RequestForQuoteScalarFieldEnum = (typeof RequestForQuoteScalarFieldEnum)[keyof typeof RequestForQuoteScalarFieldEnum];
export declare const RfqLineScalarFieldEnum: {
    readonly id: "id";
    readonly rfqId: "rfqId";
    readonly drugId: "drugId";
    readonly qty: "qty";
};
export type RfqLineScalarFieldEnum = (typeof RfqLineScalarFieldEnum)[keyof typeof RfqLineScalarFieldEnum];
export declare const RfqQuoteScalarFieldEnum: {
    readonly id: "id";
    readonly rfqId: "rfqId";
    readonly supplierId: "supplierId";
    readonly status: "status";
    readonly leadTimeDays: "leadTimeDays";
    readonly validUntil: "validUntil";
    readonly notes: "notes";
    readonly receivedAt: "receivedAt";
    readonly createdAt: "createdAt";
};
export type RfqQuoteScalarFieldEnum = (typeof RfqQuoteScalarFieldEnum)[keyof typeof RfqQuoteScalarFieldEnum];
export declare const RfqQuoteLineScalarFieldEnum: {
    readonly id: "id";
    readonly quoteId: "quoteId";
    readonly rfqLineId: "rfqLineId";
    readonly unitPrice: "unitPrice";
};
export type RfqQuoteLineScalarFieldEnum = (typeof RfqQuoteLineScalarFieldEnum)[keyof typeof RfqQuoteLineScalarFieldEnum];
export declare const ExpenseScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly category: "category";
    readonly amount: "amount";
    readonly vatAmount: "vatAmount";
    readonly method: "method";
    readonly description: "description";
    readonly supplierId: "supplierId";
    readonly expenseDate: "expenseDate";
    readonly receiptRef: "receiptRef";
    readonly fromDrawer: "fromDrawer";
    readonly cashMovementId: "cashMovementId";
    readonly createdBy: "createdBy";
    readonly voidedAt: "voidedAt";
    readonly voidedBy: "voidedBy";
    readonly createdAt: "createdAt";
};
export type ExpenseScalarFieldEnum = (typeof ExpenseScalarFieldEnum)[keyof typeof ExpenseScalarFieldEnum];
export declare const ClaimPaymentScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly claimId: "claimId";
    readonly amount: "amount";
    readonly reference: "reference";
    readonly paidAt: "paidAt";
    readonly createdBy: "createdBy";
};
export type ClaimPaymentScalarFieldEnum = (typeof ClaimPaymentScalarFieldEnum)[keyof typeof ClaimPaymentScalarFieldEnum];
export declare const AlertScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchId: "branchId";
    readonly kind: "kind";
    readonly severity: "severity";
    readonly title: "title";
    readonly body: "body";
    readonly link: "link";
    readonly refType: "refType";
    readonly refId: "refId";
    readonly dedupeKey: "dedupeKey";
    readonly readBy: "readBy";
    readonly createdAt: "createdAt";
    readonly resolvedAt: "resolvedAt";
};
export type AlertScalarFieldEnum = (typeof AlertScalarFieldEnum)[keyof typeof AlertScalarFieldEnum];
export declare const MobileDeviceScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly userId: "userId";
    readonly deviceId: "deviceId";
    readonly platform: "platform";
    readonly name: "name";
    readonly appVersion: "appVersion";
    readonly tokenHash: "tokenHash";
    readonly pushToken: "pushToken";
    readonly pushProvider: "pushProvider";
    readonly status: "status";
    readonly lastSeenAt: "lastSeenAt";
    readonly revokedAt: "revokedAt";
    readonly revokedBy: "revokedBy";
    readonly createdAt: "createdAt";
};
export type MobileDeviceScalarFieldEnum = (typeof MobileDeviceScalarFieldEnum)[keyof typeof MobileDeviceScalarFieldEnum];
export declare const PushMessageScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly userId: "userId";
    readonly kind: "kind";
    readonly title: "title";
    readonly titleAr: "titleAr";
    readonly body: "body";
    readonly bodyAr: "bodyAr";
    readonly data: "data";
    readonly provider: "provider";
    readonly deliveredAt: "deliveredAt";
    readonly readAt: "readAt";
    readonly createdAt: "createdAt";
};
export type PushMessageScalarFieldEnum = (typeof PushMessageScalarFieldEnum)[keyof typeof PushMessageScalarFieldEnum];
export declare const MobileUpgradeRequestScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly userId: "userId";
    readonly role: "role";
    readonly featureKey: "featureKey";
    readonly plan: "plan";
    readonly note: "note";
    readonly status: "status";
    readonly notifiedCount: "notifiedCount";
    readonly createdAt: "createdAt";
};
export type MobileUpgradeRequestScalarFieldEnum = (typeof MobileUpgradeRequestScalarFieldEnum)[keyof typeof MobileUpgradeRequestScalarFieldEnum];
export declare const MobileAlertAckScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly alertKey: "alertKey";
    readonly ackedBy: "ackedBy";
    readonly note: "note";
    readonly ackedAt: "ackedAt";
};
export type MobileAlertAckScalarFieldEnum = (typeof MobileAlertAckScalarFieldEnum)[keyof typeof MobileAlertAckScalarFieldEnum];
export declare const ControlledCountersignScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly discrepancyId: "discrepancyId";
    readonly witnessId: "witnessId";
    readonly note: "note";
    readonly signedAt: "signedAt";
};
export type ControlledCountersignScalarFieldEnum = (typeof ControlledCountersignScalarFieldEnum)[keyof typeof ControlledCountersignScalarFieldEnum];
export declare const PayLinkScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly accountId: "accountId";
    readonly amount: "amount";
    readonly currency: "currency";
    readonly status: "status";
    readonly providerRef: "providerRef";
    readonly payUrl: "payUrl";
    readonly idempotencyKey: "idempotencyKey";
    readonly entryId: "entryId";
    readonly failureReason: "failureReason";
    readonly refundedAmount: "refundedAmount";
    readonly refundRef: "refundRef";
    readonly refundAmount: "refundAmount";
    readonly expiresAt: "expiresAt";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PayLinkScalarFieldEnum = (typeof PayLinkScalarFieldEnum)[keyof typeof PayLinkScalarFieldEnum];
export declare const ProviderWebhookEventScalarFieldEnum: {
    readonly id: "id";
    readonly kind: "kind";
    readonly eventId: "eventId";
    readonly type: "type";
    readonly receivedAt: "receivedAt";
};
export type ProviderWebhookEventScalarFieldEnum = (typeof ProviderWebhookEventScalarFieldEnum)[keyof typeof ProviderWebhookEventScalarFieldEnum];
export declare const ConsentRecordScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly patientId: "patientId";
    readonly subjectRef: "subjectRef";
    readonly purpose: "purpose";
    readonly status: "status";
    readonly source: "source";
    readonly providerRef: "providerRef";
    readonly tokenHash: "tokenHash";
    readonly grantedAt: "grantedAt";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly revokeReason: "revokeReason";
    readonly syncError: "syncError";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ConsentRecordScalarFieldEnum = (typeof ConsentRecordScalarFieldEnum)[keyof typeof ConsentRecordScalarFieldEnum];
export declare const HandoffCodeScalarFieldEnum: {
    readonly id: "id";
    readonly codeHash: "codeHash";
    readonly product: "product";
    readonly edition: "edition";
    readonly origin: "origin";
    readonly subjectId: "subjectId";
    readonly createdAt: "createdAt";
    readonly expiresAt: "expiresAt";
    readonly usedAt: "usedAt";
};
export type HandoffCodeScalarFieldEnum = (typeof HandoffCodeScalarFieldEnum)[keyof typeof HandoffCodeScalarFieldEnum];
export declare const RateLimitBucketScalarFieldEnum: {
    readonly key: "key";
    readonly windowStart: "windowStart";
    readonly count: "count";
    readonly expiresAt: "expiresAt";
};
export type RateLimitBucketScalarFieldEnum = (typeof RateLimitBucketScalarFieldEnum)[keyof typeof RateLimitBucketScalarFieldEnum];
export declare const ProviderReferralLinkScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly branchRef: "branchRef";
    readonly ownerScope: "ownerScope";
    readonly channelKind: "channelKind";
    readonly code: "code";
    readonly label: "label";
    readonly status: "status";
    readonly tags: "tags";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly revokedAt: "revokedAt";
    readonly revokedBy: "revokedBy";
};
export type ProviderReferralLinkScalarFieldEnum = (typeof ProviderReferralLinkScalarFieldEnum)[keyof typeof ProviderReferralLinkScalarFieldEnum];
export declare const ProviderReferralLinkDailyScalarFieldEnum: {
    readonly linkId: "linkId";
    readonly orgId: "orgId";
    readonly date: "date";
    readonly visits: "visits";
    readonly orders: "orders";
    readonly completed: "completed";
    readonly updatedAt: "updatedAt";
};
export type ProviderReferralLinkDailyScalarFieldEnum = (typeof ProviderReferralLinkDailyScalarFieldEnum)[keyof typeof ProviderReferralLinkDailyScalarFieldEnum];
export declare const OrgSubscriptionScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly interval: "interval";
    readonly status: "status";
    readonly autoRenew: "autoRenew";
    readonly autoRenewForced: "autoRenewForced";
    readonly autoRenewChangedAt: "autoRenewChangedAt";
    readonly autoRenewChangedBy: "autoRenewChangedBy";
    readonly currentPeriodStart: "currentPeriodStart";
    readonly currentPeriodEnd: "currentPeriodEnd";
    readonly paymentTokenRef: "paymentTokenRef";
    readonly paymentBrand: "paymentBrand";
    readonly paymentLast4: "paymentLast4";
    readonly paymentExpMonth: "paymentExpMonth";
    readonly paymentExpYear: "paymentExpYear";
    readonly failedAttempts: "failedAttempts";
    readonly firstFailedAt: "firstFailedAt";
    readonly nextRetryAt: "nextRetryAt";
    readonly downgradedToLiteAt: "downgradedToLiteAt";
    readonly downgradeReason: "downgradeReason";
    readonly previousEdition: "previousEdition";
    readonly liteReadOnlyGraceUntil: "liteReadOnlyGraceUntil";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type OrgSubscriptionScalarFieldEnum = (typeof OrgSubscriptionScalarFieldEnum)[keyof typeof OrgSubscriptionScalarFieldEnum];
export declare const SubscriptionEventScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly type: "type";
    readonly fromJson: "fromJson";
    readonly toJson: "toJson";
    readonly actorId: "actorId";
    readonly at: "at";
};
export type SubscriptionEventScalarFieldEnum = (typeof SubscriptionEventScalarFieldEnum)[keyof typeof SubscriptionEventScalarFieldEnum];
export declare const SubscriptionNoticeScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly kind: "kind";
    readonly payload: "payload";
    readonly notBefore: "notBefore";
    readonly sentAt: "sentAt";
    readonly dedupeKey: "dedupeKey";
    readonly createdAt: "createdAt";
};
export type SubscriptionNoticeScalarFieldEnum = (typeof SubscriptionNoticeScalarFieldEnum)[keyof typeof SubscriptionNoticeScalarFieldEnum];
export declare const SubscriptionInvoiceScalarFieldEnum: {
    readonly id: "id";
    readonly orgId: "orgId";
    readonly number: "number";
    readonly periodKey: "periodKey";
    readonly periodStart: "periodStart";
    readonly periodEnd: "periodEnd";
    readonly edition: "edition";
    readonly currency: "currency";
    readonly subtotal: "subtotal";
    readonly tax: "tax";
    readonly total: "total";
    readonly status: "status";
    readonly providerRef: "providerRef";
    readonly attempts: "attempts";
    readonly issuedAt: "issuedAt";
    readonly paidAt: "paidAt";
};
export type SubscriptionInvoiceScalarFieldEnum = (typeof SubscriptionInvoiceScalarFieldEnum)[keyof typeof SubscriptionInvoiceScalarFieldEnum];
export declare const PlanPriceScalarFieldEnum: {
    readonly id: "id";
    readonly edition: "edition";
    readonly marketCode: "marketCode";
    readonly interval: "interval";
    readonly currency: "currency";
    readonly amount: "amount";
    readonly validFrom: "validFrom";
    readonly validTo: "validTo";
    readonly priceVersion: "priceVersion";
    readonly proposalId: "proposalId";
    readonly proposedBy: "proposedBy";
    readonly publishedBy: "publishedBy";
    readonly createdAt: "createdAt";
};
export type PlanPriceScalarFieldEnum = (typeof PlanPriceScalarFieldEnum)[keyof typeof PlanPriceScalarFieldEnum];
export declare const DemoMarkerScalarFieldEnum: {
    readonly tableName: "tableName";
    readonly rowId: "rowId";
    readonly dataClass: "dataClass";
    readonly batch: "batch";
    readonly createdAt: "createdAt";
};
export type DemoMarkerScalarFieldEnum = (typeof DemoMarkerScalarFieldEnum)[keyof typeof DemoMarkerScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type EnumEditionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Edition'>;
export type ListEnumEditionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Edition[]'>;
export type EnumSignInMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SignInMethod'>;
export type ListEnumSignInMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SignInMethod[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type EnumStaffRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StaffRole'>;
export type ListEnumStaffRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StaffRole[]'>;
export type EnumControlledScheduleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ControlledSchedule'>;
export type ListEnumControlledScheduleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ControlledSchedule[]'>;
export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>;
export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>;
export type EnumPurchaseOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PurchaseOrderStatus'>;
export type ListEnumPurchaseOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PurchaseOrderStatus[]'>;
export type EnumRecallStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecallStatus'>;
export type ListEnumRecallStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RecallStatus[]'>;
export type EnumLotStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LotStatus'>;
export type ListEnumLotStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LotStatus[]'>;
export type EnumStockMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMovementType'>;
export type ListEnumStockMovementTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockMovementType[]'>;
export type EnumStockCountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockCountType'>;
export type ListEnumStockCountTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockCountType[]'>;
export type EnumStockCountStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockCountStatus'>;
export type ListEnumStockCountStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'StockCountStatus[]'>;
export type EnumRxSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RxSource'>;
export type ListEnumRxSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RxSource[]'>;
export type EnumRxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RxStatus'>;
export type ListEnumRxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RxStatus[]'>;
export type EnumDispensingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DispensingStatus'>;
export type ListEnumDispensingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DispensingStatus[]'>;
export type EnumSafetyCheckKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyCheckKind'>;
export type ListEnumSafetyCheckKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyCheckKind[]'>;
export type EnumSafetyCheckOutcomeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyCheckOutcome'>;
export type ListEnumSafetyCheckOutcomeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SafetyCheckOutcome[]'>;
export type EnumShiftStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShiftStatus'>;
export type ListEnumShiftStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ShiftStatus[]'>;
export type EnumSaleChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SaleChannel'>;
export type ListEnumSaleChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SaleChannel[]'>;
export type EnumSaleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SaleStatus'>;
export type ListEnumSaleStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SaleStatus[]'>;
export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod'>;
export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>;
export type EnumOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OutboxStatus'>;
export type ListEnumOutboxStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OutboxStatus[]'>;
export type EnumSupplierLedgerTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SupplierLedgerType'>;
export type ListEnumSupplierLedgerTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SupplierLedgerType[]'>;
export type EnumTransferStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransferStatus'>;
export type ListEnumTransferStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TransferStatus[]'>;
export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>;
export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>;
export type EnumKiorexOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KiorexOrderStatus'>;
export type ListEnumKiorexOrderStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'KiorexOrderStatus[]'>;
export type EnumNotificationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationChannel'>;
export type ListEnumNotificationChannelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationChannel[]'>;
export type EnumNotificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationStatus'>;
export type ListEnumNotificationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'NotificationStatus[]'>;
export type EnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus'>;
export type ListEnumClaimStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClaimStatus[]'>;
export type EnumPayLinkStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayLinkStatus'>;
export type ListEnumPayLinkStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PayLinkStatus[]'>;
export type EnumConsentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentStatus'>;
export type ListEnumConsentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ConsentStatus[]'>;
export type EnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReferralLinkOwnerScope'>;
export type ListEnumReferralLinkOwnerScopeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReferralLinkOwnerScope[]'>;
export type EnumReferralLinkChannelKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReferralLinkChannelKind'>;
export type ListEnumReferralLinkChannelKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReferralLinkChannelKind[]'>;
export type EnumReferralLinkStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReferralLinkStatus'>;
export type ListEnumReferralLinkStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReferralLinkStatus[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export interface PrismaClientBaseOptions {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
    queryPlanCacheMaxSize?: number;
}
export interface PrismaClientOptionsWithAccelerateUrl extends PrismaClientBaseOptions {
    accelerateUrl: string;
    adapter?: never;
}
export interface PrismaClientOptionsWithAdapter extends PrismaClientBaseOptions {
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
}
export type PrismaClientOptions = PrismaClientOptionsWithAccelerateUrl | PrismaClientOptionsWithAdapter;
export type GlobalOmitConfig = {
    tenant?: Prisma.TenantOmit;
    branch?: Prisma.BranchOmit;
    staffUser?: Prisma.StaffUserOmit;
    passportSession?: Prisma.PassportSessionOmit;
    passportRevocation?: Prisma.PassportRevocationOmit;
    logoutTokenSeen?: Prisma.LogoutTokenSeenOmit;
    drug?: Prisma.DrugOmit;
    substitutionGroup?: Prisma.SubstitutionGroupOmit;
    priceBookEntry?: Prisma.PriceBookEntryOmit;
    supplier?: Prisma.SupplierOmit;
    purchaseOrder?: Prisma.PurchaseOrderOmit;
    purchaseOrderLine?: Prisma.PurchaseOrderLineOmit;
    recallNotice?: Prisma.RecallNoticeOmit;
    stockLot?: Prisma.StockLotOmit;
    stockMovement?: Prisma.StockMovementOmit;
    coldChainReading?: Prisma.ColdChainReadingOmit;
    stockCount?: Prisma.StockCountOmit;
    stockCountLine?: Prisma.StockCountLineOmit;
    patientRef?: Prisma.PatientRefOmit;
    customerNote?: Prisma.CustomerNoteOmit;
    familyLink?: Prisma.FamilyLinkOmit;
    loyaltyEntry?: Prisma.LoyaltyEntryOmit;
    prescription?: Prisma.PrescriptionOmit;
    prescriptionLine?: Prisma.PrescriptionLineOmit;
    dispensing?: Prisma.DispensingOmit;
    dispensingLine?: Prisma.DispensingLineOmit;
    safetyCheckResult?: Prisma.SafetyCheckResultOmit;
    controlledSubstanceLogEntry?: Prisma.ControlledSubstanceLogEntryOmit;
    shift?: Prisma.ShiftOmit;
    sale?: Prisma.SaleOmit;
    saleLine?: Prisma.SaleLineOmit;
    salePayment?: Prisma.SalePaymentOmit;
    saleReturn?: Prisma.SaleReturnOmit;
    customerAccount?: Prisma.CustomerAccountOmit;
    customerCreditEntry?: Prisma.CustomerCreditEntryOmit;
    outboxEvent?: Prisma.OutboxEventOmit;
    auditLog?: Prisma.AuditLogOmit;
    flagSnapshotCache?: Prisma.FlagSnapshotCacheOmit;
    reorderPolicy?: Prisma.ReorderPolicyOmit;
    supplierLedgerEntry?: Prisma.SupplierLedgerEntryOmit;
    goodsReceipt?: Prisma.GoodsReceiptOmit;
    goodsReceiptLine?: Prisma.GoodsReceiptLineOmit;
    supplierReturn?: Prisma.SupplierReturnOmit;
    expiryAlert?: Prisma.ExpiryAlertOmit;
    stockTransfer?: Prisma.StockTransferOmit;
    stockTransferLine?: Prisma.StockTransferLineOmit;
    branchMarketplaceSetting?: Prisma.BranchMarketplaceSettingOmit;
    kiorexCommissionRateView?: Prisma.KiorexCommissionRateViewOmit;
    kiorexOrder?: Prisma.KiorexOrderOmit;
    kiorexOrderLine?: Prisma.KiorexOrderLineOmit;
    integrationClient?: Prisma.IntegrationClientOmit;
    inboundEvent?: Prisma.InboundEventOmit;
    notification?: Prisma.NotificationOmit;
    insurerClaim?: Prisma.InsurerClaimOmit;
    syncConflict?: Prisma.SyncConflictOmit;
    walletEntry?: Prisma.WalletEntryOmit;
    settlementEntry?: Prisma.SettlementEntryOmit;
    rolePermissionOverride?: Prisma.RolePermissionOverrideOmit;
    prescriber?: Prisma.PrescriberOmit;
    rxRefill?: Prisma.RxRefillOmit;
    refillReminder?: Prisma.RefillReminderOmit;
    rxTransfer?: Prisma.RxTransferOmit;
    clinicalRule?: Prisma.ClinicalRuleOmit;
    controlledRegisterEntry?: Prisma.ControlledRegisterEntryOmit;
    controlledDiscrepancy?: Prisma.ControlledDiscrepancyOmit;
    promotion?: Prisma.PromotionOmit;
    promotionRedemption?: Prisma.PromotionRedemptionOmit;
    heldCart?: Prisma.HeldCartOmit;
    cashMovement?: Prisma.CashMovementOmit;
    shelfLocation?: Prisma.ShelfLocationOmit;
    uomConversion?: Prisma.UomConversionOmit;
    requestForQuote?: Prisma.RequestForQuoteOmit;
    rfqLine?: Prisma.RfqLineOmit;
    rfqQuote?: Prisma.RfqQuoteOmit;
    rfqQuoteLine?: Prisma.RfqQuoteLineOmit;
    expense?: Prisma.ExpenseOmit;
    claimPayment?: Prisma.ClaimPaymentOmit;
    alert?: Prisma.AlertOmit;
    mobileDevice?: Prisma.MobileDeviceOmit;
    pushMessage?: Prisma.PushMessageOmit;
    mobileUpgradeRequest?: Prisma.MobileUpgradeRequestOmit;
    mobileAlertAck?: Prisma.MobileAlertAckOmit;
    controlledCountersign?: Prisma.ControlledCountersignOmit;
    payLink?: Prisma.PayLinkOmit;
    providerWebhookEvent?: Prisma.ProviderWebhookEventOmit;
    consentRecord?: Prisma.ConsentRecordOmit;
    handoffCode?: Prisma.HandoffCodeOmit;
    rateLimitBucket?: Prisma.RateLimitBucketOmit;
    providerReferralLink?: Prisma.ProviderReferralLinkOmit;
    providerReferralLinkDaily?: Prisma.ProviderReferralLinkDailyOmit;
    orgSubscription?: Prisma.OrgSubscriptionOmit;
    subscriptionEvent?: Prisma.SubscriptionEventOmit;
    subscriptionNotice?: Prisma.SubscriptionNoticeOmit;
    subscriptionInvoice?: Prisma.SubscriptionInvoiceOmit;
    planPrice?: Prisma.PlanPriceOmit;
    demoMarker?: Prisma.DemoMarkerOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
