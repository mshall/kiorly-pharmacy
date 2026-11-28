"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleLineScalarFieldEnum = exports.SaleScalarFieldEnum = exports.ShiftScalarFieldEnum = exports.ControlledSubstanceLogEntryScalarFieldEnum = exports.SafetyCheckResultScalarFieldEnum = exports.DispensingLineScalarFieldEnum = exports.DispensingScalarFieldEnum = exports.PrescriptionLineScalarFieldEnum = exports.PrescriptionScalarFieldEnum = exports.LoyaltyEntryScalarFieldEnum = exports.FamilyLinkScalarFieldEnum = exports.CustomerNoteScalarFieldEnum = exports.PatientRefScalarFieldEnum = exports.StockCountLineScalarFieldEnum = exports.StockCountScalarFieldEnum = exports.ColdChainReadingScalarFieldEnum = exports.StockMovementScalarFieldEnum = exports.StockLotScalarFieldEnum = exports.RecallNoticeScalarFieldEnum = exports.PurchaseOrderLineScalarFieldEnum = exports.PurchaseOrderScalarFieldEnum = exports.SupplierScalarFieldEnum = exports.PriceBookEntryScalarFieldEnum = exports.SubstitutionGroupScalarFieldEnum = exports.DrugScalarFieldEnum = exports.LogoutTokenSeenScalarFieldEnum = exports.PassportRevocationScalarFieldEnum = exports.PassportSessionScalarFieldEnum = exports.StaffUserScalarFieldEnum = exports.BranchScalarFieldEnum = exports.TenantScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
exports.MobileUpgradeRequestScalarFieldEnum = exports.PushMessageScalarFieldEnum = exports.MobileDeviceScalarFieldEnum = exports.AlertScalarFieldEnum = exports.ClaimPaymentScalarFieldEnum = exports.ExpenseScalarFieldEnum = exports.RfqQuoteLineScalarFieldEnum = exports.RfqQuoteScalarFieldEnum = exports.RfqLineScalarFieldEnum = exports.RequestForQuoteScalarFieldEnum = exports.UomConversionScalarFieldEnum = exports.ShelfLocationScalarFieldEnum = exports.CashMovementScalarFieldEnum = exports.HeldCartScalarFieldEnum = exports.PromotionRedemptionScalarFieldEnum = exports.PromotionScalarFieldEnum = exports.ControlledDiscrepancyScalarFieldEnum = exports.ControlledRegisterEntryScalarFieldEnum = exports.ClinicalRuleScalarFieldEnum = exports.RxTransferScalarFieldEnum = exports.RefillReminderScalarFieldEnum = exports.RxRefillScalarFieldEnum = exports.PrescriberScalarFieldEnum = exports.RolePermissionOverrideScalarFieldEnum = exports.SettlementEntryScalarFieldEnum = exports.WalletEntryScalarFieldEnum = exports.SyncConflictScalarFieldEnum = exports.InsurerClaimScalarFieldEnum = exports.NotificationScalarFieldEnum = exports.InboundEventScalarFieldEnum = exports.IntegrationClientScalarFieldEnum = exports.KiorexOrderLineScalarFieldEnum = exports.KiorexOrderScalarFieldEnum = exports.KiorexCommissionRateViewScalarFieldEnum = exports.BranchMarketplaceSettingScalarFieldEnum = exports.StockTransferLineScalarFieldEnum = exports.StockTransferScalarFieldEnum = exports.ExpiryAlertScalarFieldEnum = exports.SupplierReturnScalarFieldEnum = exports.GoodsReceiptLineScalarFieldEnum = exports.GoodsReceiptScalarFieldEnum = exports.SupplierLedgerEntryScalarFieldEnum = exports.ReorderPolicyScalarFieldEnum = exports.FlagSnapshotCacheScalarFieldEnum = exports.AuditLogScalarFieldEnum = exports.OutboxEventScalarFieldEnum = exports.CustomerCreditEntryScalarFieldEnum = exports.CustomerAccountScalarFieldEnum = exports.SaleReturnScalarFieldEnum = exports.SalePaymentScalarFieldEnum = void 0;
exports.defineExtension = exports.NullsOrder = exports.JsonNullValueFilter = exports.QueryMode = exports.JsonNullValueInput = exports.NullableJsonNullValueInput = exports.SortOrder = exports.DemoMarkerScalarFieldEnum = exports.PlanPriceScalarFieldEnum = exports.SubscriptionInvoiceScalarFieldEnum = exports.SubscriptionNoticeScalarFieldEnum = exports.SubscriptionEventScalarFieldEnum = exports.OrgSubscriptionScalarFieldEnum = exports.ProviderReferralLinkDailyScalarFieldEnum = exports.ProviderReferralLinkScalarFieldEnum = exports.RateLimitBucketScalarFieldEnum = exports.HandoffCodeScalarFieldEnum = exports.ConsentRecordScalarFieldEnum = exports.ProviderWebhookEventScalarFieldEnum = exports.PayLinkScalarFieldEnum = exports.ControlledCountersignScalarFieldEnum = exports.MobileAlertAckScalarFieldEnum = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.10.1",
    engine: "d1b3f377ca835d73fd50954a5e22128b9ebdd6b8"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Tenant: 'Tenant',
    Branch: 'Branch',
    StaffUser: 'StaffUser',
    PassportSession: 'PassportSession',
    PassportRevocation: 'PassportRevocation',
    LogoutTokenSeen: 'LogoutTokenSeen',
    Drug: 'Drug',
    SubstitutionGroup: 'SubstitutionGroup',
    PriceBookEntry: 'PriceBookEntry',
    Supplier: 'Supplier',
    PurchaseOrder: 'PurchaseOrder',
    PurchaseOrderLine: 'PurchaseOrderLine',
    RecallNotice: 'RecallNotice',
    StockLot: 'StockLot',
    StockMovement: 'StockMovement',
    ColdChainReading: 'ColdChainReading',
    StockCount: 'StockCount',
    StockCountLine: 'StockCountLine',
    PatientRef: 'PatientRef',
    CustomerNote: 'CustomerNote',
    FamilyLink: 'FamilyLink',
    LoyaltyEntry: 'LoyaltyEntry',
    Prescription: 'Prescription',
    PrescriptionLine: 'PrescriptionLine',
    Dispensing: 'Dispensing',
    DispensingLine: 'DispensingLine',
    SafetyCheckResult: 'SafetyCheckResult',
    ControlledSubstanceLogEntry: 'ControlledSubstanceLogEntry',
    Shift: 'Shift',
    Sale: 'Sale',
    SaleLine: 'SaleLine',
    SalePayment: 'SalePayment',
    SaleReturn: 'SaleReturn',
    CustomerAccount: 'CustomerAccount',
    CustomerCreditEntry: 'CustomerCreditEntry',
    OutboxEvent: 'OutboxEvent',
    AuditLog: 'AuditLog',
    FlagSnapshotCache: 'FlagSnapshotCache',
    ReorderPolicy: 'ReorderPolicy',
    SupplierLedgerEntry: 'SupplierLedgerEntry',
    GoodsReceipt: 'GoodsReceipt',
    GoodsReceiptLine: 'GoodsReceiptLine',
    SupplierReturn: 'SupplierReturn',
    ExpiryAlert: 'ExpiryAlert',
    StockTransfer: 'StockTransfer',
    StockTransferLine: 'StockTransferLine',
    BranchMarketplaceSetting: 'BranchMarketplaceSetting',
    KiorexCommissionRateView: 'KiorexCommissionRateView',
    KiorexOrder: 'KiorexOrder',
    KiorexOrderLine: 'KiorexOrderLine',
    IntegrationClient: 'IntegrationClient',
    InboundEvent: 'InboundEvent',
    Notification: 'Notification',
    InsurerClaim: 'InsurerClaim',
    SyncConflict: 'SyncConflict',
    WalletEntry: 'WalletEntry',
    SettlementEntry: 'SettlementEntry',
    RolePermissionOverride: 'RolePermissionOverride',
    Prescriber: 'Prescriber',
    RxRefill: 'RxRefill',
    RefillReminder: 'RefillReminder',
    RxTransfer: 'RxTransfer',
    ClinicalRule: 'ClinicalRule',
    ControlledRegisterEntry: 'ControlledRegisterEntry',
    ControlledDiscrepancy: 'ControlledDiscrepancy',
    Promotion: 'Promotion',
    PromotionRedemption: 'PromotionRedemption',
    HeldCart: 'HeldCart',
    CashMovement: 'CashMovement',
    ShelfLocation: 'ShelfLocation',
    UomConversion: 'UomConversion',
    RequestForQuote: 'RequestForQuote',
    RfqLine: 'RfqLine',
    RfqQuote: 'RfqQuote',
    RfqQuoteLine: 'RfqQuoteLine',
    Expense: 'Expense',
    ClaimPayment: 'ClaimPayment',
    Alert: 'Alert',
    MobileDevice: 'MobileDevice',
    PushMessage: 'PushMessage',
    MobileUpgradeRequest: 'MobileUpgradeRequest',
    MobileAlertAck: 'MobileAlertAck',
    ControlledCountersign: 'ControlledCountersign',
    PayLink: 'PayLink',
    ProviderWebhookEvent: 'ProviderWebhookEvent',
    ConsentRecord: 'ConsentRecord',
    HandoffCode: 'HandoffCode',
    RateLimitBucket: 'RateLimitBucket',
    ProviderReferralLink: 'ProviderReferralLink',
    ProviderReferralLinkDaily: 'ProviderReferralLinkDaily',
    OrgSubscription: 'OrgSubscription',
    SubscriptionEvent: 'SubscriptionEvent',
    SubscriptionNotice: 'SubscriptionNotice',
    SubscriptionInvoice: 'SubscriptionInvoice',
    PlanPrice: 'PlanPrice',
    DemoMarker: 'DemoMarker'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.TenantScalarFieldEnum = {
    id: 'id',
    externalOrgId: 'externalOrgId',
    name: 'name',
    edition: 'edition',
    marketCode: 'marketCode',
    subscriptionStatus: 'subscriptionStatus',
    defaultSignInMethod: 'defaultSignInMethod',
    settings: 'settings',
    onboardedAt: 'onboardedAt',
    createdAt: 'createdAt'
};
exports.BranchScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    name: 'name',
    licenceNo: 'licenceNo',
    address: 'address',
    code: 'code',
    phone: 'phone',
    active: 'active',
    receiptCounter: 'receiptCounter',
    createdAt: 'createdAt'
};
exports.StaffUserScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    subject: 'subject',
    phone: 'phone',
    displayName: 'displayName',
    role: 'role',
    pharmacistLicenceNo: 'pharmacistLicenceNo',
    active: 'active',
    email: 'email',
    passwordHash: 'passwordHash',
    branchId: 'branchId',
    mfaEnrolled: 'mfaEnrolled',
    dismissedCards: 'dismissedCards',
    lastLoginAt: 'lastLoginAt',
    createdAt: 'createdAt'
};
exports.PassportSessionScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    staffId: 'staffId',
    sub: 'sub',
    sid: 'sid',
    createdAt: 'createdAt',
    lastSeenAt: 'lastSeenAt',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    revokedReason: 'revokedReason'
};
exports.PassportRevocationScalarFieldEnum = {
    id: 'id',
    kind: 'kind',
    value: 'value',
    revokedAt: 'revokedAt',
    expiresAt: 'expiresAt'
};
exports.LogoutTokenSeenScalarFieldEnum = {
    jti: 'jti',
    seenAt: 'seenAt',
    expiresAt: 'expiresAt'
};
exports.DrugScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    brandName: 'brandName',
    brandNameAr: 'brandNameAr',
    activeIngredient: 'activeIngredient',
    strength: 'strength',
    dosageForm: 'dosageForm',
    packSize: 'packSize',
    gtin: 'gtin',
    manufacturer: 'manufacturer',
    rxOnly: 'rxOnly',
    controlledSchedule: 'controlledSchedule',
    coldChain: 'coldChain',
    otc: 'otc',
    marketCodes: 'marketCodes',
    substitutionGroupId: 'substitutionGroupId',
    vatRate: 'vatRate',
    category: 'category',
    baseUnit: 'baseUnit',
    sourceKey: 'sourceKey',
    active: 'active',
    createdAt: 'createdAt'
};
exports.SubstitutionGroupScalarFieldEnum = {
    id: 'id',
    activeIngredient: 'activeIngredient',
    strength: 'strength',
    dosageForm: 'dosageForm'
};
exports.PriceBookEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    drugId: 'drugId',
    branchId: 'branchId',
    price: 'price',
    effectiveFrom: 'effectiveFrom',
    effectiveTo: 'effectiveTo',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.SupplierScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    name: 'name',
    phone: 'phone',
    email: 'email',
    paymentTerms: 'paymentTerms',
    creditLimit: 'creditLimit',
    balance: 'balance',
    leadTimeDays: 'leadTimeDays',
    active: 'active',
    createdAt: 'createdAt'
};
exports.PurchaseOrderScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    supplierId: 'supplierId',
    status: 'status',
    origin: 'origin',
    createdBy: 'createdBy',
    poNumber: 'poNumber',
    expectedAt: 'expectedAt',
    notes: 'notes',
    sentVia: 'sentVia',
    totalCost: 'totalCost',
    sentAt: 'sentAt',
    createdAt: 'createdAt'
};
exports.PurchaseOrderLineScalarFieldEnum = {
    id: 'id',
    purchaseOrderId: 'purchaseOrderId',
    drugId: 'drugId',
    qtyOrdered: 'qtyOrdered',
    qtyReceived: 'qtyReceived',
    unitCost: 'unitCost'
};
exports.RecallNoticeScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    drugId: 'drugId',
    lotNumbers: 'lotNumbers',
    affectedLots: 'affectedLots',
    reason: 'reason',
    source: 'source',
    status: 'status',
    enteredBy: 'enteredBy',
    enteredAt: 'enteredAt',
    liftedBy: 'liftedBy',
    liftedAt: 'liftedAt'
};
exports.StockLotScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    drugId: 'drugId',
    lotNumber: 'lotNumber',
    expiryDate: 'expiryDate',
    status: 'status',
    qtyOnHand: 'qtyOnHand',
    qtyReserved: 'qtyReserved',
    unitCost: 'unitCost',
    supplierId: 'supplierId',
    purchaseOrderId: 'purchaseOrderId',
    supplierInvoiceNo: 'supplierInvoiceNo',
    receivedAt: 'receivedAt',
    blockedReason: 'blockedReason',
    blockedAt: 'blockedAt',
    recallNoticeId: 'recallNoticeId',
    statusBeforeBlock: 'statusBeforeBlock',
    locationId: 'locationId',
    createdAt: 'createdAt'
};
exports.StockMovementScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    lotId: 'lotId',
    type: 'type',
    qtyDelta: 'qtyDelta',
    reason: 'reason',
    refType: 'refType',
    refId: 'refId',
    reasonCode: 'reasonCode',
    managerApprovalBy: 'managerApprovalBy',
    performedBy: 'performedBy',
    occurredAt: 'occurredAt'
};
exports.ColdChainReadingScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    lotId: 'lotId',
    temperatureC: 'temperatureC',
    excursion: 'excursion',
    recordedBy: 'recordedBy',
    recordedAt: 'recordedAt'
};
exports.StockCountScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    type: 'type',
    status: 'status',
    startedBy: 'startedBy',
    approvedBy: 'approvedBy',
    startedAt: 'startedAt',
    closedAt: 'closedAt'
};
exports.StockCountLineScalarFieldEnum = {
    id: 'id',
    stockCountId: 'stockCountId',
    lotId: 'lotId',
    qtyExpected: 'qtyExpected',
    qtyCounted: 'qtyCounted'
};
exports.PatientRefScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    externalId: 'externalId',
    customerNo: 'customerNo',
    displayName: 'displayName',
    phone: 'phone',
    email: 'email',
    gender: 'gender',
    dateOfBirth: 'dateOfBirth',
    address: 'address',
    nationalIdHash: 'nationalIdHash',
    nationalIdLast4: 'nationalIdLast4',
    allergies: 'allergies',
    chronicConditions: 'chronicConditions',
    medicalNotes: 'medicalNotes',
    pregnant: 'pregnant',
    lactating: 'lactating',
    renalImpairment: 'renalImpairment',
    hepaticImpairment: 'hepaticImpairment',
    weightKg: 'weightKg',
    birthYear: 'birthYear',
    consentDataProcessing: 'consentDataProcessing',
    consentMarketing: 'consentMarketing',
    consentRecordedAt: 'consentRecordedAt',
    consentRecordedBy: 'consentRecordedBy',
    loyaltyPoints: 'loyaltyPoints',
    loyaltyTier: 'loyaltyTier',
    lifetimeSpend: 'lifetimeSpend',
    active: 'active',
    mergedIntoId: 'mergedIntoId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CustomerNoteScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    patientId: 'patientId',
    kind: 'kind',
    body: 'body',
    refType: 'refType',
    refId: 'refId',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.FamilyLinkScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    patientId: 'patientId',
    relatedPatientId: 'relatedPatientId',
    relation: 'relation',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.LoyaltyEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    patientId: 'patientId',
    kind: 'kind',
    points: 'points',
    balanceAfter: 'balanceAfter',
    saleId: 'saleId',
    note: 'note',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.PrescriptionScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    source: 'source',
    status: 'status',
    patientId: 'patientId',
    sourceEventId: 'sourceEventId',
    sourceRxRef: 'sourceRxRef',
    consentTokenHash: 'consentTokenHash',
    consentVerifiedAt: 'consentVerifiedAt',
    consentExpiresAt: 'consentExpiresAt',
    prescriberName: 'prescriberName',
    prescriberLicenceNo: 'prescriberLicenceNo',
    prescriberVerifiedBadge: 'prescriberVerifiedBadge',
    issuedAt: 'issuedAt',
    validUntil: 'validUntil',
    scanStorageKey: 'scanStorageKey',
    prescriberRef: 'prescriberRef',
    prescriberId: 'prescriberId',
    refillsAllowed: 'refillsAllowed',
    refillsUsed: 'refillsUsed',
    refillIntervalDays: 'refillIntervalDays',
    nextRefillDueAt: 'nextRefillDueAt',
    priority: 'priority',
    verificationNotes: 'verificationNotes',
    transferredOutAt: 'transferredOutAt',
    clinicRef: 'clinicRef',
    validatedBy: 'validatedBy',
    validatedAt: 'validatedAt',
    kiorexOrderId: 'kiorexOrderId',
    rejectionReason: 'rejectionReason',
    receivedBy: 'receivedBy',
    receivedAt: 'receivedAt'
};
exports.PrescriptionLineScalarFieldEnum = {
    id: 'id',
    prescriptionId: 'prescriptionId',
    drugId: 'drugId',
    activeIngredient: 'activeIngredient',
    strength: 'strength',
    dosageForm: 'dosageForm',
    quantity: 'quantity',
    qtyDispensed: 'qtyDispensed',
    drugName: 'drugName',
    controlled: 'controlled',
    directions: 'directions'
};
exports.DispensingScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    prescriptionId: 'prescriptionId',
    patientId: 'patientId',
    status: 'status',
    pharmacistId: 'pharmacistId',
    signedOffAt: 'signedOffAt',
    counsellingNotes: 'counsellingNotes',
    kiorexOrderRef: 'kiorexOrderRef',
    controlledIdCaptured: 'controlledIdCaptured',
    partialReason: 'partialReason',
    counsellingTopics: 'counsellingTopics',
    safetyChecksRunAt: 'safetyChecksRunAt',
    saleId: 'saleId',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    dispensedAt: 'dispensedAt'
};
exports.DispensingLineScalarFieldEnum = {
    id: 'id',
    dispensingId: 'dispensingId',
    drugId: 'drugId',
    lotId: 'lotId',
    quantity: 'quantity',
    prescriptionLineId: 'prescriptionLineId',
    substitutedFromDrugId: 'substitutedFromDrugId',
    substitutionConsent: 'substitutionConsent',
    substitutionDecidedBy: 'substitutionDecidedBy',
    unitPrice: 'unitPrice',
    vatRate: 'vatRate'
};
exports.SafetyCheckResultScalarFieldEnum = {
    id: 'id',
    dispensingId: 'dispensingId',
    kind: 'kind',
    outcome: 'outcome',
    detail: 'detail',
    overridable: 'overridable',
    overriddenBy: 'overriddenBy',
    overrideReason: 'overrideReason',
    checkedAt: 'checkedAt'
};
exports.ControlledSubstanceLogEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    dispensingId: 'dispensingId',
    drugId: 'drugId',
    lotId: 'lotId',
    quantity: 'quantity',
    patientNationalIdLast4: 'patientNationalIdLast4',
    patientNationalIdHash: 'patientNationalIdHash',
    patientName: 'patientName',
    prescriptionId: 'prescriptionId',
    prescriberLicenceNo: 'prescriberLicenceNo',
    pharmacistId: 'pharmacistId',
    loggedAt: 'loggedAt'
};
exports.ShiftScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    openedBy: 'openedBy',
    closedBy: 'closedBy',
    status: 'status',
    openingFloat: 'openingFloat',
    countedCash: 'countedCash',
    expectedCash: 'expectedCash',
    variance: 'variance',
    varianceAlerted: 'varianceAlerted',
    zReport: 'zReport',
    openedAt: 'openedAt',
    closedAt: 'closedAt'
};
exports.SaleScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    shiftId: 'shiftId',
    channel: 'channel',
    status: 'status',
    idempotencyKey: 'idempotencyKey',
    receiptNo: 'receiptNo',
    customerAccountId: 'customerAccountId',
    patientId: 'patientId',
    exchangeOfSaleId: 'exchangeOfSaleId',
    dispensingId: 'dispensingId',
    subtotal: 'subtotal',
    discountTotal: 'discountTotal',
    vatTotal: 'vatTotal',
    total: 'total',
    offline: 'offline',
    clientCreatedAt: 'clientCreatedAt',
    voidedBy: 'voidedBy',
    voidReason: 'voidReason',
    voidedAt: 'voidedAt',
    soldBy: 'soldBy',
    soldAt: 'soldAt'
};
exports.SaleLineScalarFieldEnum = {
    id: 'id',
    saleId: 'saleId',
    drugId: 'drugId',
    lotId: 'lotId',
    quantity: 'quantity',
    unitPrice: 'unitPrice',
    discount: 'discount',
    vatRate: 'vatRate',
    vatAmount: 'vatAmount'
};
exports.SalePaymentScalarFieldEnum = {
    id: 'id',
    saleId: 'saleId',
    method: 'method',
    amount: 'amount',
    reference: 'reference',
    status: 'status',
    paidAt: 'paidAt'
};
exports.SaleReturnScalarFieldEnum = {
    id: 'id',
    saleId: 'saleId',
    saleLineId: 'saleLineId',
    refundMethod: 'refundMethod',
    lotId: 'lotId',
    quantity: 'quantity',
    refund: 'refund',
    reason: 'reason',
    approvedBy: 'approvedBy',
    createdAt: 'createdAt'
};
exports.CustomerAccountScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    patientId: 'patientId',
    creditLimit: 'creditLimit',
    balance: 'balance',
    createdAt: 'createdAt'
};
exports.CustomerCreditEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    accountId: 'accountId',
    kind: 'kind',
    amount: 'amount',
    saleId: 'saleId',
    note: 'note',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.OutboxEventScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    type: 'type',
    aggregateType: 'aggregateType',
    aggregateId: 'aggregateId',
    payload: 'payload',
    target: 'target',
    dedupeKey: 'dedupeKey',
    status: 'status',
    attempts: 'attempts',
    lastError: 'lastError',
    nextAttemptAt: 'nextAttemptAt',
    occurredAt: 'occurredAt',
    sentAt: 'sentAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    actorId: 'actorId',
    action: 'action',
    entityType: 'entityType',
    entityId: 'entityId',
    meta: 'meta',
    at: 'at'
};
exports.FlagSnapshotCacheScalarFieldEnum = {
    product: 'product',
    version: 'version',
    etag: 'etag',
    body: 'body',
    fetchedAt: 'fetchedAt'
};
exports.ReorderPolicyScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    drugId: 'drugId',
    minQty: 'minQty',
    maxQty: 'maxQty',
    leadTimeDays: 'leadTimeDays',
    supplierId: 'supplierId',
    updatedAt: 'updatedAt'
};
exports.SupplierLedgerEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    supplierId: 'supplierId',
    type: 'type',
    amount: 'amount',
    refType: 'refType',
    refId: 'refId',
    note: 'note',
    idempotencyKey: 'idempotencyKey',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.GoodsReceiptScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    supplierId: 'supplierId',
    purchaseOrderId: 'purchaseOrderId',
    invoiceNo: 'invoiceNo',
    invoiceTotal: 'invoiceTotal',
    idempotencyKey: 'idempotencyKey',
    receivedBy: 'receivedBy',
    receivedAt: 'receivedAt'
};
exports.GoodsReceiptLineScalarFieldEnum = {
    id: 'id',
    receiptId: 'receiptId',
    drugId: 'drugId',
    lotId: 'lotId',
    quantity: 'quantity',
    unitCost: 'unitCost',
    poUnitCost: 'poUnitCost',
    prevUnitCost: 'prevUnitCost'
};
exports.SupplierReturnScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    supplierId: 'supplierId',
    lotId: 'lotId',
    quantity: 'quantity',
    creditAmount: 'creditAmount',
    reason: 'reason',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.ExpiryAlertScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    lotId: 'lotId',
    thresholdDays: 'thresholdDays',
    notifiedAt: 'notifiedAt'
};
exports.StockTransferScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    fromBranchId: 'fromBranchId',
    toBranchId: 'toBranchId',
    status: 'status',
    requestedBy: 'requestedBy',
    dispatchedBy: 'dispatchedBy',
    receivedBy: 'receivedBy',
    createdAt: 'createdAt',
    dispatchedAt: 'dispatchedAt',
    receivedAt: 'receivedAt'
};
exports.StockTransferLineScalarFieldEnum = {
    id: 'id',
    transferId: 'transferId',
    drugId: 'drugId',
    lotId: 'lotId',
    quantity: 'quantity'
};
exports.BranchMarketplaceSettingScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    optedIn: 'optedIn',
    deliveryRadiusKm: 'deliveryRadiusKm',
    openingHours: 'openingHours',
    prepMinutes: 'prepMinutes',
    slaMinutes: 'slaMinutes',
    latitude: 'latitude',
    longitude: 'longitude',
    updatedAt: 'updatedAt'
};
exports.KiorexCommissionRateViewScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    product: 'product',
    version: 'version',
    view: 'view',
    receivedAt: 'receivedAt',
    updatedAt: 'updatedAt'
};
exports.KiorexOrderScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    externalOrderId: 'externalOrderId',
    status: 'status',
    hasRx: 'hasRx',
    prescriptionId: 'prescriptionId',
    customerName: 'customerName',
    customerPhone: 'customerPhone',
    deliveryAddress: 'deliveryAddress',
    prepaid: 'prepaid',
    orderValue: 'orderValue',
    slaDueAt: 'slaDueAt',
    respondedAt: 'respondedAt',
    respondedBy: 'respondedBy',
    rejectionReason: 'rejectionReason',
    rejectionCode: 'rejectionCode',
    readyAt: 'readyAt',
    outForDeliveryAt: 'outForDeliveryAt',
    dispensingId: 'dispensingId',
    patientRef: 'patientRef',
    deliveryMethod: 'deliveryMethod',
    paymentRef: 'paymentRef',
    acquisitionOrigin: 'acquisitionOrigin',
    acquisitionDecisionRef: 'acquisitionDecisionRef',
    acquisitionReason: 'acquisitionReason',
    acquisitionLinkId: 'acquisitionLinkId',
    acquisitionOrderCountedAt: 'acquisitionOrderCountedAt',
    acquisitionCompletedCountedAt: 'acquisitionCompletedCountedAt',
    createdAt: 'createdAt'
};
exports.KiorexOrderLineScalarFieldEnum = {
    id: 'id',
    orderId: 'orderId',
    drugId: 'drugId',
    qtyRequested: 'qtyRequested',
    qtyAccepted: 'qtyAccepted',
    unitPrice: 'unitPrice'
};
exports.IntegrationClientScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    key: 'key',
    secretEnc: 'secretEnc',
    source: 'source',
    kiorexBaseUrl: 'kiorexBaseUrl',
    webhookSecretEnc: 'webhookSecretEnc',
    active: 'active',
    createdAt: 'createdAt'
};
exports.InboundEventScalarFieldEnum = {
    id: 'id',
    eventId: 'eventId',
    type: 'type',
    orgId: 'orgId',
    receivedAt: 'receivedAt'
};
exports.NotificationScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    channel: 'channel',
    recipient: 'recipient',
    template: 'template',
    locale: 'locale',
    body: 'body',
    status: 'status',
    refType: 'refType',
    refId: 'refId',
    provider: 'provider',
    createdAt: 'createdAt',
    sentAt: 'sentAt',
    providerMessageId: 'providerMessageId',
    error: 'error',
    deliveredAt: 'deliveredAt'
};
exports.InsurerClaimScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    saleId: 'saleId',
    insurerName: 'insurerName',
    memberRef: 'memberRef',
    policyNo: 'policyNo',
    amountClaimed: 'amountClaimed',
    patientCopay: 'patientCopay',
    approvedAmount: 'approvedAmount',
    paidAmount: 'paidAmount',
    rejectionReason: 'rejectionReason',
    submissionRef: 'submissionRef',
    dueAt: 'dueAt',
    status: 'status',
    submittedAt: 'submittedAt',
    resolvedAt: 'resolvedAt',
    responseNote: 'responseNote',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.SyncConflictScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    idempotencyKey: 'idempotencyKey',
    reason: 'reason',
    payload: 'payload',
    resolved: 'resolved',
    resolvedBy: 'resolvedBy',
    createdAt: 'createdAt'
};
exports.WalletEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    amount: 'amount',
    kind: 'kind',
    refType: 'refType',
    refId: 'refId',
    idempotencyKey: 'idempotencyKey',
    createdAt: 'createdAt'
};
exports.SettlementEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    orderRef: 'orderRef',
    orderValue: 'orderValue',
    feeRate: 'feeRate',
    feeAmount: 'feeAmount',
    currency: 'currency',
    createdAt: 'createdAt'
};
exports.RolePermissionOverrideScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    role: 'role',
    permission: 'permission',
    granted: 'granted',
    updatedBy: 'updatedBy',
    updatedAt: 'updatedAt'
};
exports.PrescriberScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    name: 'name',
    nameAr: 'nameAr',
    licenceNo: 'licenceNo',
    specialty: 'specialty',
    phone: 'phone',
    clinicName: 'clinicName',
    clinicAddress: 'clinicAddress',
    verified: 'verified',
    verifiedBy: 'verifiedBy',
    verifiedAt: 'verifiedAt',
    active: 'active',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RxRefillScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    prescriptionId: 'prescriptionId',
    refillNo: 'refillNo',
    early: 'early',
    earlyReason: 'earlyReason',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.RefillReminderScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    prescriptionId: 'prescriptionId',
    refillNo: 'refillNo',
    notificationId: 'notificationId',
    sentAt: 'sentAt'
};
exports.RxTransferScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    direction: 'direction',
    prescriptionId: 'prescriptionId',
    counterpartyName: 'counterpartyName',
    counterpartyPhone: 'counterpartyPhone',
    counterpartyPharmacist: 'counterpartyPharmacist',
    counterpartyLicenceNo: 'counterpartyLicenceNo',
    reason: 'reason',
    snapshot: 'snapshot',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.ClinicalRuleScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    key: 'key',
    kind: 'kind',
    ingredient: 'ingredient',
    ingredientB: 'ingredientB',
    severity: 'severity',
    note: 'note',
    maxDailyMg: 'maxDailyMg',
    maxSingleMg: 'maxSingleMg',
    pediatricMaxMgPerKg: 'pediatricMaxMgPerKg',
    category: 'category',
    source: 'source',
    active: 'active',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.ControlledRegisterEntryScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    drugId: 'drugId',
    lotId: 'lotId',
    movementId: 'movementId',
    kind: 'kind',
    qtyDelta: 'qtyDelta',
    balanceAfter: 'balanceAfter',
    refType: 'refType',
    refId: 'refId',
    patientName: 'patientName',
    patientIdLast4: 'patientIdLast4',
    prescriptionId: 'prescriptionId',
    prescriberLicenceNo: 'prescriberLicenceNo',
    performedBy: 'performedBy',
    witnessId: 'witnessId',
    witnessName: 'witnessName',
    reason: 'reason',
    occurredAt: 'occurredAt'
};
exports.ControlledDiscrepancyScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    drugId: 'drugId',
    expectedQty: 'expectedQty',
    countedQty: 'countedQty',
    difference: 'difference',
    status: 'status',
    notes: 'notes',
    reportedBy: 'reportedBy',
    witnessId: 'witnessId',
    resolvedBy: 'resolvedBy',
    resolution: 'resolution',
    resolvedAt: 'resolvedAt',
    createdAt: 'createdAt'
};
exports.PromotionScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    name: 'name',
    nameAr: 'nameAr',
    kind: 'kind',
    couponCode: 'couponCode',
    drugIds: 'drugIds',
    params: 'params',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    minSubtotal: 'minSubtotal',
    maxUses: 'maxUses',
    usedCount: 'usedCount',
    priority: 'priority',
    stackable: 'stackable',
    active: 'active',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.PromotionRedemptionScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    promotionId: 'promotionId',
    saleId: 'saleId',
    patientId: 'patientId',
    discountAmount: 'discountAmount',
    couponCode: 'couponCode',
    createdAt: 'createdAt'
};
exports.HeldCartScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    userId: 'userId',
    label: 'label',
    patientId: 'patientId',
    payload: 'payload',
    status: 'status',
    createdAt: 'createdAt',
    resolvedAt: 'resolvedAt'
};
exports.CashMovementScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    shiftId: 'shiftId',
    kind: 'kind',
    category: 'category',
    amount: 'amount',
    reason: 'reason',
    refType: 'refType',
    refId: 'refId',
    createdBy: 'createdBy',
    createdAt: 'createdAt'
};
exports.ShelfLocationScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    code: 'code',
    label: 'label',
    kind: 'kind',
    active: 'active',
    createdAt: 'createdAt'
};
exports.UomConversionScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    drugId: 'drugId',
    name: 'name',
    factor: 'factor',
    barcode: 'barcode',
    active: 'active',
    createdAt: 'createdAt'
};
exports.RequestForQuoteScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    number: 'number',
    status: 'status',
    notes: 'notes',
    dueAt: 'dueAt',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    awardedAt: 'awardedAt'
};
exports.RfqLineScalarFieldEnum = {
    id: 'id',
    rfqId: 'rfqId',
    drugId: 'drugId',
    qty: 'qty'
};
exports.RfqQuoteScalarFieldEnum = {
    id: 'id',
    rfqId: 'rfqId',
    supplierId: 'supplierId',
    status: 'status',
    leadTimeDays: 'leadTimeDays',
    validUntil: 'validUntil',
    notes: 'notes',
    receivedAt: 'receivedAt',
    createdAt: 'createdAt'
};
exports.RfqQuoteLineScalarFieldEnum = {
    id: 'id',
    quoteId: 'quoteId',
    rfqLineId: 'rfqLineId',
    unitPrice: 'unitPrice'
};
exports.ExpenseScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    category: 'category',
    amount: 'amount',
    vatAmount: 'vatAmount',
    method: 'method',
    description: 'description',
    supplierId: 'supplierId',
    expenseDate: 'expenseDate',
    receiptRef: 'receiptRef',
    fromDrawer: 'fromDrawer',
    cashMovementId: 'cashMovementId',
    createdBy: 'createdBy',
    voidedAt: 'voidedAt',
    voidedBy: 'voidedBy',
    createdAt: 'createdAt'
};
exports.ClaimPaymentScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    claimId: 'claimId',
    amount: 'amount',
    reference: 'reference',
    paidAt: 'paidAt',
    createdBy: 'createdBy'
};
exports.AlertScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchId: 'branchId',
    kind: 'kind',
    severity: 'severity',
    title: 'title',
    body: 'body',
    link: 'link',
    refType: 'refType',
    refId: 'refId',
    dedupeKey: 'dedupeKey',
    readBy: 'readBy',
    createdAt: 'createdAt',
    resolvedAt: 'resolvedAt'
};
exports.MobileDeviceScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    userId: 'userId',
    deviceId: 'deviceId',
    platform: 'platform',
    name: 'name',
    appVersion: 'appVersion',
    tokenHash: 'tokenHash',
    pushToken: 'pushToken',
    pushProvider: 'pushProvider',
    status: 'status',
    lastSeenAt: 'lastSeenAt',
    revokedAt: 'revokedAt',
    revokedBy: 'revokedBy',
    createdAt: 'createdAt'
};
exports.PushMessageScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    userId: 'userId',
    kind: 'kind',
    title: 'title',
    titleAr: 'titleAr',
    body: 'body',
    bodyAr: 'bodyAr',
    data: 'data',
    provider: 'provider',
    deliveredAt: 'deliveredAt',
    readAt: 'readAt',
    createdAt: 'createdAt'
};
exports.MobileUpgradeRequestScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    userId: 'userId',
    role: 'role',
    featureKey: 'featureKey',
    plan: 'plan',
    note: 'note',
    status: 'status',
    notifiedCount: 'notifiedCount',
    createdAt: 'createdAt'
};
exports.MobileAlertAckScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    alertKey: 'alertKey',
    ackedBy: 'ackedBy',
    note: 'note',
    ackedAt: 'ackedAt'
};
exports.ControlledCountersignScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    discrepancyId: 'discrepancyId',
    witnessId: 'witnessId',
    note: 'note',
    signedAt: 'signedAt'
};
exports.PayLinkScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    accountId: 'accountId',
    amount: 'amount',
    currency: 'currency',
    status: 'status',
    providerRef: 'providerRef',
    payUrl: 'payUrl',
    idempotencyKey: 'idempotencyKey',
    entryId: 'entryId',
    failureReason: 'failureReason',
    refundedAmount: 'refundedAmount',
    refundRef: 'refundRef',
    refundAmount: 'refundAmount',
    expiresAt: 'expiresAt',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ProviderWebhookEventScalarFieldEnum = {
    id: 'id',
    kind: 'kind',
    eventId: 'eventId',
    type: 'type',
    receivedAt: 'receivedAt'
};
exports.ConsentRecordScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    patientId: 'patientId',
    subjectRef: 'subjectRef',
    purpose: 'purpose',
    status: 'status',
    source: 'source',
    providerRef: 'providerRef',
    tokenHash: 'tokenHash',
    grantedAt: 'grantedAt',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    revokeReason: 'revokeReason',
    syncError: 'syncError',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.HandoffCodeScalarFieldEnum = {
    id: 'id',
    codeHash: 'codeHash',
    product: 'product',
    edition: 'edition',
    origin: 'origin',
    subjectId: 'subjectId',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    usedAt: 'usedAt'
};
exports.RateLimitBucketScalarFieldEnum = {
    key: 'key',
    windowStart: 'windowStart',
    count: 'count',
    expiresAt: 'expiresAt'
};
exports.ProviderReferralLinkScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    branchRef: 'branchRef',
    ownerScope: 'ownerScope',
    channelKind: 'channelKind',
    code: 'code',
    label: 'label',
    status: 'status',
    tags: 'tags',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    revokedAt: 'revokedAt',
    revokedBy: 'revokedBy'
};
exports.ProviderReferralLinkDailyScalarFieldEnum = {
    linkId: 'linkId',
    orgId: 'orgId',
    date: 'date',
    visits: 'visits',
    orders: 'orders',
    completed: 'completed',
    updatedAt: 'updatedAt'
};
exports.OrgSubscriptionScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    interval: 'interval',
    status: 'status',
    autoRenew: 'autoRenew',
    autoRenewForced: 'autoRenewForced',
    autoRenewChangedAt: 'autoRenewChangedAt',
    autoRenewChangedBy: 'autoRenewChangedBy',
    currentPeriodStart: 'currentPeriodStart',
    currentPeriodEnd: 'currentPeriodEnd',
    paymentTokenRef: 'paymentTokenRef',
    paymentBrand: 'paymentBrand',
    paymentLast4: 'paymentLast4',
    paymentExpMonth: 'paymentExpMonth',
    paymentExpYear: 'paymentExpYear',
    failedAttempts: 'failedAttempts',
    firstFailedAt: 'firstFailedAt',
    nextRetryAt: 'nextRetryAt',
    downgradedToLiteAt: 'downgradedToLiteAt',
    downgradeReason: 'downgradeReason',
    previousEdition: 'previousEdition',
    liteReadOnlyGraceUntil: 'liteReadOnlyGraceUntil',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SubscriptionEventScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    type: 'type',
    fromJson: 'fromJson',
    toJson: 'toJson',
    actorId: 'actorId',
    at: 'at'
};
exports.SubscriptionNoticeScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    kind: 'kind',
    payload: 'payload',
    notBefore: 'notBefore',
    sentAt: 'sentAt',
    dedupeKey: 'dedupeKey',
    createdAt: 'createdAt'
};
exports.SubscriptionInvoiceScalarFieldEnum = {
    id: 'id',
    orgId: 'orgId',
    number: 'number',
    periodKey: 'periodKey',
    periodStart: 'periodStart',
    periodEnd: 'periodEnd',
    edition: 'edition',
    currency: 'currency',
    subtotal: 'subtotal',
    tax: 'tax',
    total: 'total',
    status: 'status',
    providerRef: 'providerRef',
    attempts: 'attempts',
    issuedAt: 'issuedAt',
    paidAt: 'paidAt'
};
exports.PlanPriceScalarFieldEnum = {
    id: 'id',
    edition: 'edition',
    marketCode: 'marketCode',
    interval: 'interval',
    currency: 'currency',
    amount: 'amount',
    validFrom: 'validFrom',
    validTo: 'validTo',
    priceVersion: 'priceVersion',
    proposalId: 'proposalId',
    proposedBy: 'proposedBy',
    publishedBy: 'publishedBy',
    createdAt: 'createdAt'
};
exports.DemoMarkerScalarFieldEnum = {
    tableName: 'tableName',
    rowId: 'rowId',
    dataClass: 'dataClass',
    batch: 'batch',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map