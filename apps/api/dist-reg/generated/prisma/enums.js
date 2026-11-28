"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferralLinkStatus = exports.ReferralLinkChannelKind = exports.ReferralLinkOwnerScope = exports.ConsentStatus = exports.PayLinkStatus = exports.OutboxStatus = exports.NotificationStatus = exports.NotificationChannel = exports.ClaimStatus = exports.SupplierLedgerType = exports.KiorexOrderStatus = exports.TransferStatus = exports.PaymentMethod = exports.SaleChannel = exports.SaleStatus = exports.ShiftStatus = exports.SafetyCheckOutcome = exports.SafetyCheckKind = exports.DispensingStatus = exports.RxStatus = exports.RxSource = exports.StockCountStatus = exports.StockCountType = exports.RecallStatus = exports.PurchaseOrderStatus = exports.StockMovementType = exports.LotStatus = exports.ControlledSchedule = exports.StaffRole = exports.SignInMethod = exports.Edition = void 0;
exports.Edition = {
    LITE: 'LITE',
    PRO: 'PRO',
    CHAIN: 'CHAIN',
    ENTERPRISE: 'ENTERPRISE'
};
exports.SignInMethod = {
    PASSWORD: 'PASSWORD',
    PASSPORT: 'PASSPORT'
};
exports.StaffRole = {
    OWNER: 'OWNER',
    PHARMACIST: 'PHARMACIST',
    CASHIER: 'CASHIER',
    BRANCH_MANAGER: 'BRANCH_MANAGER',
    CHAIN_OPS: 'CHAIN_OPS',
    ASSISTANT: 'ASSISTANT'
};
exports.ControlledSchedule = {
    NONE: 'NONE',
    SCHEDULE_1: 'SCHEDULE_1',
    SCHEDULE_2: 'SCHEDULE_2',
    SCHEDULE_3: 'SCHEDULE_3',
    SCHEDULE_4: 'SCHEDULE_4'
};
exports.LotStatus = {
    RECEIVED: 'RECEIVED',
    AVAILABLE: 'AVAILABLE',
    RESERVED: 'RESERVED',
    DISPENSED: 'DISPENSED',
    QUARANTINE: 'QUARANTINE',
    EXPIRED: 'EXPIRED',
    RECALLED: 'RECALLED'
};
exports.StockMovementType = {
    RECEIPT: 'RECEIPT',
    SALE: 'SALE',
    DISPENSE: 'DISPENSE',
    RETURN_FROM_CUSTOMER: 'RETURN_FROM_CUSTOMER',
    RETURN_TO_SUPPLIER: 'RETURN_TO_SUPPLIER',
    ADJUSTMENT: 'ADJUSTMENT',
    EXPIRY_WRITE_OFF: 'EXPIRY_WRITE_OFF',
    RECALL_WRITE_OFF: 'RECALL_WRITE_OFF',
    TRANSFER_OUT: 'TRANSFER_OUT',
    TRANSFER_IN: 'TRANSFER_IN',
    RESERVE: 'RESERVE',
    RELEASE_RESERVATION: 'RELEASE_RESERVATION',
    COUNT_VARIANCE: 'COUNT_VARIANCE'
};
exports.PurchaseOrderStatus = {
    DRAFT: 'DRAFT',
    SENT: 'SENT',
    PARTIALLY_RECEIVED: 'PARTIALLY_RECEIVED',
    RECEIVED: 'RECEIVED',
    CANCELLED: 'CANCELLED'
};
exports.RecallStatus = {
    ACTIVE: 'ACTIVE',
    LIFTED: 'LIFTED'
};
exports.StockCountType = {
    CYCLE: 'CYCLE',
    FULL: 'FULL'
};
exports.StockCountStatus = {
    OPEN: 'OPEN',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
};
exports.RxSource = {
    PAPER_SCAN: 'PAPER_SCAN',
    KIORLY_E_RX: 'KIORLY_E_RX',
    KIOREX_UPLOAD: 'KIOREX_UPLOAD',
    MANUAL_ENTRY: 'MANUAL_ENTRY',
    TRANSFER_IN: 'TRANSFER_IN'
};
exports.RxStatus = {
    RECEIVED: 'RECEIVED',
    VALIDATING: 'VALIDATING',
    VALIDATED: 'VALIDATED',
    REJECTED: 'REJECTED',
    PARTIALLY_DISPENSED: 'PARTIALLY_DISPENSED',
    DISPENSED: 'DISPENSED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED',
    TRANSFERRED_OUT: 'TRANSFERRED_OUT'
};
exports.DispensingStatus = {
    DRAFT: 'DRAFT',
    VALIDATED: 'VALIDATED',
    RESERVED: 'RESERVED',
    SIGNED_OFF: 'SIGNED_OFF',
    DISPENSED: 'DISPENSED',
    CANCELLED: 'CANCELLED'
};
exports.SafetyCheckKind = {
    INTERACTION: 'INTERACTION',
    ALLERGY: 'ALLERGY',
    DUPLICATE_THERAPY: 'DUPLICATE_THERAPY',
    DOSE_QUANTITY: 'DOSE_QUANTITY',
    PRESCRIBER: 'PRESCRIBER',
    CONTROLLED_LIMIT: 'CONTROLLED_LIMIT',
    DOSE_RANGE: 'DOSE_RANGE',
    PREGNANCY_LACTATION: 'PREGNANCY_LACTATION',
    RENAL_HEPATIC: 'RENAL_HEPATIC'
};
exports.SafetyCheckOutcome = {
    PASS: 'PASS',
    WARN: 'WARN',
    BLOCK: 'BLOCK',
    OVERRIDDEN_BY_PHARMACIST: 'OVERRIDDEN_BY_PHARMACIST'
};
exports.ShiftStatus = {
    OPEN: 'OPEN',
    CLOSED: 'CLOSED'
};
exports.SaleStatus = {
    OPEN: 'OPEN',
    COMPLETED: 'COMPLETED',
    VOIDED: 'VOIDED',
    PARTIALLY_RETURNED: 'PARTIALLY_RETURNED',
    RETURNED: 'RETURNED'
};
exports.SaleChannel = {
    POS: 'POS',
    KIOREX_ORDER: 'KIOREX_ORDER'
};
exports.PaymentMethod = {
    CASH: 'CASH',
    CARD: 'CARD',
    INSTAPAY: 'INSTAPAY',
    FAWRY: 'FAWRY',
    WALLET: 'WALLET',
    CUSTOMER_CREDIT: 'CUSTOMER_CREDIT',
    LOYALTY_POINTS: 'LOYALTY_POINTS',
    KIOREX_PREPAID: 'KIOREX_PREPAID'
};
exports.TransferStatus = {
    REQUESTED: 'REQUESTED',
    IN_TRANSIT: 'IN_TRANSIT',
    RECEIVED: 'RECEIVED',
    CANCELLED: 'CANCELLED'
};
exports.KiorexOrderStatus = {
    RECEIVED: 'RECEIVED',
    ACCEPTED: 'ACCEPTED',
    PARTIALLY_ACCEPTED: 'PARTIALLY_ACCEPTED',
    REJECTED: 'REJECTED',
    READY: 'READY',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DISPENSED: 'DISPENSED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED'
};
exports.SupplierLedgerType = {
    INVOICE: 'INVOICE',
    PAYMENT: 'PAYMENT',
    RETURN_CREDIT: 'RETURN_CREDIT',
    ADJUSTMENT: 'ADJUSTMENT'
};
exports.ClaimStatus = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    PAID: 'PAID'
};
exports.NotificationChannel = {
    WHATSAPP: 'WHATSAPP',
    SMS: 'SMS',
    EMAIL: 'EMAIL',
    PUSH: 'PUSH'
};
exports.NotificationStatus = {
    QUEUED: 'QUEUED',
    SENT: 'SENT',
    DELIVERED: 'DELIVERED',
    FAILED: 'FAILED'
};
exports.OutboxStatus = {
    PENDING: 'PENDING',
    SENT: 'SENT',
    FAILED: 'FAILED'
};
exports.PayLinkStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
    EXPIRED: 'EXPIRED',
    REFUND_PENDING: 'REFUND_PENDING',
    REFUNDED: 'REFUNDED'
};
exports.ConsentStatus = {
    ACTIVE: 'ACTIVE',
    REVOKED: 'REVOKED',
    EXPIRED: 'EXPIRED'
};
exports.ReferralLinkOwnerScope = {
    ORG: 'ORG',
    BRANCH: 'BRANCH',
    DESK: 'DESK'
};
exports.ReferralLinkChannelKind = {
    WEB_LINK: 'WEB_LINK',
    QR_POSTER: 'QR_POSTER',
    QR_DESK: 'QR_DESK',
    SOCIAL: 'SOCIAL',
    SMS: 'SMS',
    WHATSAPP_SHARE: 'WHATSAPP_SHARE',
    EMAIL_SIG: 'EMAIL_SIG',
    GOOGLE_PROFILE: 'GOOGLE_PROFILE'
};
exports.ReferralLinkStatus = {
    ACTIVE: 'ACTIVE',
    PAUSED: 'PAUSED',
    REVOKED: 'REVOKED'
};
//# sourceMappingURL=enums.js.map