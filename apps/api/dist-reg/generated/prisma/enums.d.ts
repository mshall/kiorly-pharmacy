export declare const Edition: {
    readonly LITE: "LITE";
    readonly PRO: "PRO";
    readonly CHAIN: "CHAIN";
    readonly ENTERPRISE: "ENTERPRISE";
};
export type Edition = (typeof Edition)[keyof typeof Edition];
export declare const SignInMethod: {
    readonly PASSWORD: "PASSWORD";
    readonly PASSPORT: "PASSPORT";
};
export type SignInMethod = (typeof SignInMethod)[keyof typeof SignInMethod];
export declare const StaffRole: {
    readonly OWNER: "OWNER";
    readonly PHARMACIST: "PHARMACIST";
    readonly CASHIER: "CASHIER";
    readonly BRANCH_MANAGER: "BRANCH_MANAGER";
    readonly CHAIN_OPS: "CHAIN_OPS";
    readonly ASSISTANT: "ASSISTANT";
};
export type StaffRole = (typeof StaffRole)[keyof typeof StaffRole];
export declare const ControlledSchedule: {
    readonly NONE: "NONE";
    readonly SCHEDULE_1: "SCHEDULE_1";
    readonly SCHEDULE_2: "SCHEDULE_2";
    readonly SCHEDULE_3: "SCHEDULE_3";
    readonly SCHEDULE_4: "SCHEDULE_4";
};
export type ControlledSchedule = (typeof ControlledSchedule)[keyof typeof ControlledSchedule];
export declare const LotStatus: {
    readonly RECEIVED: "RECEIVED";
    readonly AVAILABLE: "AVAILABLE";
    readonly RESERVED: "RESERVED";
    readonly DISPENSED: "DISPENSED";
    readonly QUARANTINE: "QUARANTINE";
    readonly EXPIRED: "EXPIRED";
    readonly RECALLED: "RECALLED";
};
export type LotStatus = (typeof LotStatus)[keyof typeof LotStatus];
export declare const StockMovementType: {
    readonly RECEIPT: "RECEIPT";
    readonly SALE: "SALE";
    readonly DISPENSE: "DISPENSE";
    readonly RETURN_FROM_CUSTOMER: "RETURN_FROM_CUSTOMER";
    readonly RETURN_TO_SUPPLIER: "RETURN_TO_SUPPLIER";
    readonly ADJUSTMENT: "ADJUSTMENT";
    readonly EXPIRY_WRITE_OFF: "EXPIRY_WRITE_OFF";
    readonly RECALL_WRITE_OFF: "RECALL_WRITE_OFF";
    readonly TRANSFER_OUT: "TRANSFER_OUT";
    readonly TRANSFER_IN: "TRANSFER_IN";
    readonly RESERVE: "RESERVE";
    readonly RELEASE_RESERVATION: "RELEASE_RESERVATION";
    readonly COUNT_VARIANCE: "COUNT_VARIANCE";
};
export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType];
export declare const PurchaseOrderStatus: {
    readonly DRAFT: "DRAFT";
    readonly SENT: "SENT";
    readonly PARTIALLY_RECEIVED: "PARTIALLY_RECEIVED";
    readonly RECEIVED: "RECEIVED";
    readonly CANCELLED: "CANCELLED";
};
export type PurchaseOrderStatus = (typeof PurchaseOrderStatus)[keyof typeof PurchaseOrderStatus];
export declare const RecallStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly LIFTED: "LIFTED";
};
export type RecallStatus = (typeof RecallStatus)[keyof typeof RecallStatus];
export declare const StockCountType: {
    readonly CYCLE: "CYCLE";
    readonly FULL: "FULL";
};
export type StockCountType = (typeof StockCountType)[keyof typeof StockCountType];
export declare const StockCountStatus: {
    readonly OPEN: "OPEN";
    readonly PENDING_APPROVAL: "PENDING_APPROVAL";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
};
export type StockCountStatus = (typeof StockCountStatus)[keyof typeof StockCountStatus];
export declare const RxSource: {
    readonly PAPER_SCAN: "PAPER_SCAN";
    readonly KIORLY_E_RX: "KIORLY_E_RX";
    readonly KIOREX_UPLOAD: "KIOREX_UPLOAD";
    readonly MANUAL_ENTRY: "MANUAL_ENTRY";
    readonly TRANSFER_IN: "TRANSFER_IN";
};
export type RxSource = (typeof RxSource)[keyof typeof RxSource];
export declare const RxStatus: {
    readonly RECEIVED: "RECEIVED";
    readonly VALIDATING: "VALIDATING";
    readonly VALIDATED: "VALIDATED";
    readonly REJECTED: "REJECTED";
    readonly PARTIALLY_DISPENSED: "PARTIALLY_DISPENSED";
    readonly DISPENSED: "DISPENSED";
    readonly CANCELLED: "CANCELLED";
    readonly EXPIRED: "EXPIRED";
    readonly TRANSFERRED_OUT: "TRANSFERRED_OUT";
};
export type RxStatus = (typeof RxStatus)[keyof typeof RxStatus];
export declare const DispensingStatus: {
    readonly DRAFT: "DRAFT";
    readonly VALIDATED: "VALIDATED";
    readonly RESERVED: "RESERVED";
    readonly SIGNED_OFF: "SIGNED_OFF";
    readonly DISPENSED: "DISPENSED";
    readonly CANCELLED: "CANCELLED";
};
export type DispensingStatus = (typeof DispensingStatus)[keyof typeof DispensingStatus];
export declare const SafetyCheckKind: {
    readonly INTERACTION: "INTERACTION";
    readonly ALLERGY: "ALLERGY";
    readonly DUPLICATE_THERAPY: "DUPLICATE_THERAPY";
    readonly DOSE_QUANTITY: "DOSE_QUANTITY";
    readonly PRESCRIBER: "PRESCRIBER";
    readonly CONTROLLED_LIMIT: "CONTROLLED_LIMIT";
    readonly DOSE_RANGE: "DOSE_RANGE";
    readonly PREGNANCY_LACTATION: "PREGNANCY_LACTATION";
    readonly RENAL_HEPATIC: "RENAL_HEPATIC";
};
export type SafetyCheckKind = (typeof SafetyCheckKind)[keyof typeof SafetyCheckKind];
export declare const SafetyCheckOutcome: {
    readonly PASS: "PASS";
    readonly WARN: "WARN";
    readonly BLOCK: "BLOCK";
    readonly OVERRIDDEN_BY_PHARMACIST: "OVERRIDDEN_BY_PHARMACIST";
};
export type SafetyCheckOutcome = (typeof SafetyCheckOutcome)[keyof typeof SafetyCheckOutcome];
export declare const ShiftStatus: {
    readonly OPEN: "OPEN";
    readonly CLOSED: "CLOSED";
};
export type ShiftStatus = (typeof ShiftStatus)[keyof typeof ShiftStatus];
export declare const SaleStatus: {
    readonly OPEN: "OPEN";
    readonly COMPLETED: "COMPLETED";
    readonly VOIDED: "VOIDED";
    readonly PARTIALLY_RETURNED: "PARTIALLY_RETURNED";
    readonly RETURNED: "RETURNED";
};
export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus];
export declare const SaleChannel: {
    readonly POS: "POS";
    readonly KIOREX_ORDER: "KIOREX_ORDER";
};
export type SaleChannel = (typeof SaleChannel)[keyof typeof SaleChannel];
export declare const PaymentMethod: {
    readonly CASH: "CASH";
    readonly CARD: "CARD";
    readonly INSTAPAY: "INSTAPAY";
    readonly FAWRY: "FAWRY";
    readonly WALLET: "WALLET";
    readonly CUSTOMER_CREDIT: "CUSTOMER_CREDIT";
    readonly LOYALTY_POINTS: "LOYALTY_POINTS";
    readonly KIOREX_PREPAID: "KIOREX_PREPAID";
};
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export declare const TransferStatus: {
    readonly REQUESTED: "REQUESTED";
    readonly IN_TRANSIT: "IN_TRANSIT";
    readonly RECEIVED: "RECEIVED";
    readonly CANCELLED: "CANCELLED";
};
export type TransferStatus = (typeof TransferStatus)[keyof typeof TransferStatus];
export declare const KiorexOrderStatus: {
    readonly RECEIVED: "RECEIVED";
    readonly ACCEPTED: "ACCEPTED";
    readonly PARTIALLY_ACCEPTED: "PARTIALLY_ACCEPTED";
    readonly REJECTED: "REJECTED";
    readonly READY: "READY";
    readonly OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY";
    readonly DISPENSED: "DISPENSED";
    readonly CANCELLED: "CANCELLED";
    readonly EXPIRED: "EXPIRED";
};
export type KiorexOrderStatus = (typeof KiorexOrderStatus)[keyof typeof KiorexOrderStatus];
export declare const SupplierLedgerType: {
    readonly INVOICE: "INVOICE";
    readonly PAYMENT: "PAYMENT";
    readonly RETURN_CREDIT: "RETURN_CREDIT";
    readonly ADJUSTMENT: "ADJUSTMENT";
};
export type SupplierLedgerType = (typeof SupplierLedgerType)[keyof typeof SupplierLedgerType];
export declare const ClaimStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly PAID: "PAID";
};
export type ClaimStatus = (typeof ClaimStatus)[keyof typeof ClaimStatus];
export declare const NotificationChannel: {
    readonly WHATSAPP: "WHATSAPP";
    readonly SMS: "SMS";
    readonly EMAIL: "EMAIL";
    readonly PUSH: "PUSH";
};
export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
export declare const NotificationStatus: {
    readonly QUEUED: "QUEUED";
    readonly SENT: "SENT";
    readonly DELIVERED: "DELIVERED";
    readonly FAILED: "FAILED";
};
export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
export declare const OutboxStatus: {
    readonly PENDING: "PENDING";
    readonly SENT: "SENT";
    readonly FAILED: "FAILED";
};
export type OutboxStatus = (typeof OutboxStatus)[keyof typeof OutboxStatus];
export declare const PayLinkStatus: {
    readonly PENDING: "PENDING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly EXPIRED: "EXPIRED";
    readonly REFUND_PENDING: "REFUND_PENDING";
    readonly REFUNDED: "REFUNDED";
};
export type PayLinkStatus = (typeof PayLinkStatus)[keyof typeof PayLinkStatus];
export declare const ConsentStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly REVOKED: "REVOKED";
    readonly EXPIRED: "EXPIRED";
};
export type ConsentStatus = (typeof ConsentStatus)[keyof typeof ConsentStatus];
export declare const ReferralLinkOwnerScope: {
    readonly ORG: "ORG";
    readonly BRANCH: "BRANCH";
    readonly DESK: "DESK";
};
export type ReferralLinkOwnerScope = (typeof ReferralLinkOwnerScope)[keyof typeof ReferralLinkOwnerScope];
export declare const ReferralLinkChannelKind: {
    readonly WEB_LINK: "WEB_LINK";
    readonly QR_POSTER: "QR_POSTER";
    readonly QR_DESK: "QR_DESK";
    readonly SOCIAL: "SOCIAL";
    readonly SMS: "SMS";
    readonly WHATSAPP_SHARE: "WHATSAPP_SHARE";
    readonly EMAIL_SIG: "EMAIL_SIG";
    readonly GOOGLE_PROFILE: "GOOGLE_PROFILE";
};
export type ReferralLinkChannelKind = (typeof ReferralLinkChannelKind)[keyof typeof ReferralLinkChannelKind];
export declare const ReferralLinkStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly PAUSED: "PAUSED";
    readonly REVOKED: "REVOKED";
};
export type ReferralLinkStatus = (typeof ReferralLinkStatus)[keyof typeof ReferralLinkStatus];
