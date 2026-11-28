export type ReconciliationStatus = "MATCHED" | "UNMATCHED" | "DISPUTED";
export type StatementReconciliation = ReconciliationStatus | "NO_PAYOUT";
export type StatementPayout = {
    payoutRef: string;
    paidAt: string | null;
    cashMinor: number;
    commissionDeductedMinor: number;
    bankReference: string | null;
    reconciliation: ReconciliationStatus;
};
export type TenderKindFigures = {
    accruedMinor: number;
    nettedMinor: number;
    openMinor: number;
    charges: number;
};
export type CashBreakdown = {
    cash: TenderKindFigures;
    cashTransfer: TenderKindFigures & {
        byDetail: Record<string, number>;
        unspecifiedDetail: number;
    };
};
export type StatementView = {
    source: "KIOREX";
    orgRef: string;
    period: {
        from: string;
        to: string;
    };
    currency: string;
    payoutMethod: "BANK_TRANSFER";
    onlineCollectionsMinor: number;
    cashVisitCommissionAccruedMinor: number;
    cashVisitCommissionNettedMinor: number;
    cashVisitCommissionOpenMinor: number;
    cashVisitCharges: number;
    cashBreakdown: CashBreakdown | null;
    unknownTender: {
        charges: number;
        commissionMinor: number;
    } | null;
    deductions: {
        commissionMinor: number;
        feesMinor: number | null;
        refundsMinor: number | null;
        chargebacksMinor: number | null;
    };
    commission: {
        totalMinor: number;
        collectedMinor: number;
        openMinor: number;
        disputedOpen: number;
    };
    netPayableMinor: number;
    paidByBankTransferMinor: number;
    payouts: StatementPayout[];
    reconciliation: StatementReconciliation;
};
export declare function periodRange(period: string | undefined, now?: Date): {
    from: Date;
    to: Date;
    key: string;
} | null;
export declare function normalizeStatement(raw: unknown, fallback: {
    orgRef: string;
    from: Date;
    to: Date;
}): StatementView | null;
export declare function isStatementNotConnected(e: unknown): boolean;
