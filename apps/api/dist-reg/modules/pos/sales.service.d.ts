import { Prisma, type PaymentMethod } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "../inventory/stock-ledger.service";
import { PriceService } from "../catalogue/price.service";
import { PspAdapter } from "../../platform/adapters/psp.adapter";
import { type MarketPackPort } from "../../kernel-adapter/ports";
import { ApprovalService, type ApprovalDto } from "../../auth/approval.service";
import type { AuthUser } from "../../auth/auth-user";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
import { type AppliedPromo } from "./promotions";
type Tx = Prisma.TransactionClient;
export interface CartLine {
    drugId: string;
    quantity: number;
    lotId?: string;
    discount?: string;
}
export interface PaymentInput {
    method: PaymentMethod;
    amount: string;
    walletRef?: string;
}
export interface CheckoutInput {
    branchId: string;
    idempotencyKey: string;
    shiftId?: string;
    lines: CartLine[];
    payments: PaymentInput[];
    customerAccountId?: string;
    patientId?: string;
    couponCodes?: string[];
    exchangeOfSaleId?: string;
    approval?: ApprovalDto;
    approvedByOverride?: string;
    offline?: {
        clientCreatedAt: string;
    };
}
export interface PricedLine {
    drugId: string;
    lotId: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
    discount: Prisma.Decimal;
    vatRate: Prisma.Decimal;
    vatAmount: Prisma.Decimal;
    negative: boolean;
}
export declare class SalesService {
    private readonly prisma;
    private readonly ledger;
    private readonly prices;
    private readonly psp;
    private readonly packs;
    private readonly approvals;
    private readonly modes;
    constructor(prisma: PrismaService, ledger: StockLedger, prices: PriceService, psp: PspAdapter, packs: MarketPackPort, approvals: ApprovalService, modes: TenantModeService);
    vatRateFor(orgId: string, drug: {
        vatRate: Prisma.Decimal | null;
    }): Promise<Prisma.Decimal>;
    priceCart(db: Tx | PrismaService, user: AuthUser, branchId: string, lines: CartLine[], at: Date, allowNegative: boolean): Promise<PricedLine[]>;
    applyPromos(db: Tx | PrismaService, user: AuthUser, branchId: string, priced: PricedLine[], coupons: string[], at: Date): Promise<{
        lines: PricedLine[];
        applied: AppliedPromo[];
        unusedCoupons: string[];
    }>;
    guardManualDiscount(user: AuthUser, priced: PricedLine[], approval?: ApprovalDto): Promise<string | undefined>;
    totals(lines: PricedLine[]): {
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountTotal: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        vatTotal: import("@prisma/client-runtime-utils").Decimal;
    };
    private nextReceiptNo;
    persist(tx: Tx, p: {
        user: AuthUser;
        branchId: string;
        shiftId: string | null;
        idempotencyKey: string;
        lines: PricedLine[];
        payments: Array<{
            method: PaymentMethod;
            amount: Prisma.Decimal;
            reference?: string;
            status?: string;
        }>;
        customerAccountId?: string;
        patientId?: string;
        exchangeOfSaleId?: string;
        dispensingId?: string;
        stockAlreadyPosted?: boolean;
        approvedBy?: string;
        offline?: {
            clientCreatedAt: string;
        };
        channel?: "POS" | "KIOREX_ORDER";
        promos?: AppliedPromo[];
    }): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").SaleStatus;
        patientId: string | null;
        dispensingId: string | null;
        shiftId: string | null;
        channel: import("../../generated/prisma/enums").SaleChannel;
        idempotencyKey: string;
        receiptNo: string | null;
        customerAccountId: string | null;
        exchangeOfSaleId: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountTotal: import("@prisma/client-runtime-utils").Decimal;
        vatTotal: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        offline: boolean;
        clientCreatedAt: Date | null;
        voidedBy: string | null;
        voidReason: string | null;
        voidedAt: Date | null;
        soldBy: string;
        soldAt: Date;
    }>;
    capturePayments(user: AuthUser, key: string, total: Prisma.Decimal, payments: PaymentInput[], customerAccountId?: string, offline?: boolean, patientId?: string): Promise<{
        payments: {
            method: PaymentMethod;
            amount: Prisma.Decimal;
            reference?: string;
            status: string;
        }[];
        change: import("@prisma/client-runtime-utils").Decimal;
    }>;
    checkout(user: AuthUser, input: CheckoutInput): Promise<{
        sale: Awaited<ReturnType<SalesService["getSale"]>>;
        change: string;
        replayed: boolean;
    }>;
    private resolveShift;
    getSale(orgId: string, id: string): Promise<{
        lines: {
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | undefined;
            lot: {
                lotNumber: string;
                expiryDate: Date;
            };
            id: string;
            vatRate: import("@prisma/client-runtime-utils").Decimal;
            drugId: string;
            lotId: string;
            saleId: string;
            quantity: number;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            discount: import("@prisma/client-runtime-utils").Decimal;
            vatAmount: import("@prisma/client-runtime-utils").Decimal;
        }[];
        returns: {
            id: string;
            createdAt: Date;
            reason: string;
            lotId: string;
            approvedBy: string;
            saleId: string;
            quantity: number;
            saleLineId: string | null;
            refundMethod: PaymentMethod;
            refund: import("@prisma/client-runtime-utils").Decimal;
        }[];
        payments: {
            id: string;
            status: string;
            saleId: string;
            method: PaymentMethod;
            amount: import("@prisma/client-runtime-utils").Decimal;
            reference: string | null;
            paidAt: Date;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").SaleStatus;
        patientId: string | null;
        dispensingId: string | null;
        shiftId: string | null;
        channel: import("../../generated/prisma/enums").SaleChannel;
        idempotencyKey: string;
        receiptNo: string | null;
        customerAccountId: string | null;
        exchangeOfSaleId: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountTotal: import("@prisma/client-runtime-utils").Decimal;
        vatTotal: import("@prisma/client-runtime-utils").Decimal;
        total: import("@prisma/client-runtime-utils").Decimal;
        offline: boolean;
        clientCreatedAt: Date | null;
        voidedBy: string | null;
        voidReason: string | null;
        voidedAt: Date | null;
        soldBy: string;
        soldAt: Date;
    }>;
}
export {};
