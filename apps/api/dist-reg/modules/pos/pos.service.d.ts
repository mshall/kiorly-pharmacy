import type { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "../inventory/stock-ledger.service";
import { PriceService } from "../catalogue/price.service";
import { SalesService, type CartLine, type CheckoutInput } from "./sales.service";
import { ApprovalService, type ApprovalDto } from "../../auth/approval.service";
import { PspAdapter } from "../../platform/adapters/psp.adapter";
import type { PaymentMethod } from "../../generated/prisma/client";
import type { AuthUser } from "../../auth/auth-user";
import { type MarketPackPort } from "../../kernel-adapter/ports";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
export interface SyncSaleInput extends Omit<CheckoutInput, "branchId" | "offline"> {
    clientCreatedAt: string;
}
export type SyncResult = {
    idempotencyKey: string;
    status: "APPLIED" | "DUPLICATE" | "CONFLICT";
    saleId?: string;
    reason?: string;
    conflictId?: string;
};
export declare class PosService {
    private readonly prisma;
    private readonly ledger;
    private readonly prices;
    private readonly sales;
    private readonly approvals;
    private readonly psp;
    private readonly packs;
    private readonly modes;
    constructor(prisma: PrismaService, ledger: StockLedger, prices: PriceService, sales: SalesService, approvals: ApprovalService, psp: PspAdapter, packs: MarketPackPort, modes: TenantModeService);
    lookup(user: AuthUser, branchId: string, code: string): Promise<{
        found: false;
        drug?: undefined;
        price?: undefined;
        available?: undefined;
        suggestedLot?: undefined;
        requiresPrescription?: undefined;
    } | {
        found: true;
        drug: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            dosageForm: string;
            rxOnly: boolean;
            controlled: boolean;
        };
        price: string | null;
        available: number;
        suggestedLot: import("../inventory/lot-guard/lot-guard").PickLine & {
            lotNumber: string;
            expiryDate: Date;
        };
        requiresPrescription: boolean;
    }>;
    quote(user: AuthUser, branchId: string, lines: CartLine[], couponCodes?: string[]): Promise<{
        lines: {
            drugId: string;
            lotId: string;
            quantity: number;
            unitPrice: string;
            discount: string;
            vatAmount: string;
        }[];
        subtotal: string;
        discountTotal: string;
        vatTotal: string;
        total: string;
        promotions: {
            promoId: string;
            name: string;
            amount: string;
            couponCode: string | null;
        }[];
        invalidCoupons: string[];
    }>;
    offlineBundle(user: AuthUser, branchId: string): Promise<{
        generatedAt: string;
        items: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            gtin: string | null;
            strength: string;
            dosageForm: string;
            available: number;
            price: string;
        }[];
    }>;
    returnItems(user: AuthUser, saleId: string, input: {
        lines: Array<{
            saleLineId: string;
            quantity: number;
        }>;
        reason: string;
        refundMethod: "CASH" | "CARD" | "INSTAPAY" | "FAWRY" | "WALLET" | "CUSTOMER_CREDIT";
        approval?: ApprovalDto;
    }): Promise<{
        refund: string;
        approvedBy: string;
        sale: {
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
        };
    }>;
    voidSale(user: AuthUser, saleId: string, reason: string, approval?: ApprovalDto): Promise<{
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
    sync(user: AuthUser, branchId: string, queue: SyncSaleInput[]): Promise<SyncResult[]>;
    conflicts(orgId: string, includeResolved?: boolean): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        reason: string;
        idempotencyKey: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolved: boolean;
        resolvedBy: string | null;
    }[]>;
    resolveConflict(user: AuthUser, id: string, action: "FORCE" | "DISCARD", approval?: ApprovalDto): Promise<{
        resolved: boolean;
        action: "FORCE" | "DISCARD";
        saleId: string | undefined;
    }>;
    receipt(orgId: string, saleId: string): Promise<{
        template: {
            header: string | undefined;
            showVat: boolean | undefined;
            showLicence: boolean | undefined;
            logoText: string | undefined;
        };
        customer: {
            name: string;
            customerNo: string | null;
            phone: string | null;
        } | null;
        loyalty: {
            earned: number;
            balance: number;
            tier: string;
        } | null;
        paper: string;
        discounts: {
            name: string;
            amount: string;
        }[];
        vatBreakdown: {
            rate: string;
            net: string;
            vat: string;
            gross: string;
        }[];
        receiptNo: string | null;
        soldAt: Date;
        pharmacy: string;
        branch: string;
        branchAddress: string | null;
        licenceNo: string | null;
        currency: string;
        vatLabel: string;
        vatLabelAr: string;
        lines: {
            name: string;
            nameAr: string | null;
            strength: string | null;
            lotNumber: string;
            quantity: number;
            unitPrice: string;
            discount: string;
            lineTotal: string;
            vatRate: string;
            vatAmount: string;
        }[];
        subtotal: string;
        discountTotal: string;
        vatTotal: string;
        total: string;
        payments: {
            method: PaymentMethod;
            amount: string;
            reference: string | null;
        }[];
        status: import("../../generated/prisma/enums").SaleStatus;
        footer: string | null;
        notice: {
            en: string;
            ar: string;
        };
    }>;
    receiptHtml(orgId: string, saleId: string, lang: "ar" | "en", format?: "thermal" | "a4"): Promise<string>;
    exchange(user: AuthUser, saleId: string, input: {
        returnLines: Array<{
            saleLineId: string;
            quantity: number;
        }>;
        reason: string;
        refundMethod: "CASH" | "CARD" | "INSTAPAY" | "FAWRY" | "WALLET" | "CUSTOMER_CREDIT";
        approval?: ApprovalDto;
        newLines: CartLine[];
        payments: Array<{
            method: PaymentMethod;
            amount: string;
            walletRef?: string;
        }>;
        idempotencyKey: string;
        couponCodes?: string[];
    }): Promise<{
        replayed: boolean;
        replacement: {
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
        };
        refund: string | null;
        change?: undefined;
    } | {
        replayed: boolean;
        refund: string;
        replacement: {
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
        };
        change: string;
    }>;
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
    listSales(orgId: string, q: {
        branchId?: string;
        shiftId?: string;
        skip: number;
        take: number;
    }): Promise<{
        items: ({
            payments: {
                id: string;
                status: string;
                saleId: string;
                method: PaymentMethod;
                amount: import("@prisma/client-runtime-utils").Decimal;
                reference: string | null;
                paidAt: Date;
            }[];
        } & {
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
        })[];
        total: number;
    }>;
}
