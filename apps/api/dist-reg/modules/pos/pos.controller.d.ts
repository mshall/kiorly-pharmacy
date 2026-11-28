import type { AuthUser } from "../../auth/auth-user";
import { ApprovalDto } from "../../auth/approval.service";
import { PosService } from "./pos.service";
import { SalesService } from "./sales.service";
import { ShiftsService } from "./shifts.service";
import { CustomersService } from "./customers.service";
import { PromotionsService, PROMO_KINDS } from "./promotions.service";
import { HeldCartsService } from "./held-carts.service";
import { CashService } from "./cash.service";
import { PayLinksService } from "./paylinks.service";
import { UomService } from "../inventory/uom.service";
import { PrismaService } from "../../prisma/prisma.service";
declare const METHODS: readonly ["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT", "LOYALTY_POINTS"];
declare class CartLineDto {
    drugId: string;
    quantity: number;
    lotId?: string;
    discount?: string;
    uom?: string;
}
declare class PaymentDto {
    method: (typeof METHODS)[number];
    amount: string;
    walletRef?: string;
}
declare class CheckoutDto {
    branchId?: string;
    idempotencyKey: string;
    shiftId?: string;
    lines: CartLineDto[];
    payments: PaymentDto[];
    customerAccountId?: string;
    patientId?: string;
    couponCodes?: string[];
    approval?: ApprovalDto;
}
declare class QuoteDto {
    branchId?: string;
    couponCodes?: string[];
    lines: CartLineDto[];
}
declare class SyncSaleDto {
    idempotencyKey: string;
    clientCreatedAt: string;
    lines: CartLineDto[];
    payments: PaymentDto[];
    customerAccountId?: string;
}
declare class SyncDto {
    branchId?: string;
    sales: SyncSaleDto[];
}
declare class ResolveDto {
    action: "FORCE" | "DISCARD";
    approval?: ApprovalDto;
}
declare class ReturnLineDto {
    saleLineId: string;
    quantity: number;
}
declare class ReturnDto {
    lines: ReturnLineDto[];
    reason: string;
    refundMethod: Exclude<(typeof METHODS)[number], "LOYALTY_POINTS">;
    approval?: ApprovalDto;
}
declare class ExchangeDto {
    returnLines: ReturnLineDto[];
    reason: string;
    refundMethod: Exclude<(typeof METHODS)[number], "LOYALTY_POINTS">;
    newLines: CartLineDto[];
    payments: PaymentDto[];
    idempotencyKey: string;
    couponCodes?: string[];
    approval?: ApprovalDto;
}
declare class HoldDto {
    branchId?: string;
    label?: string;
    patientId?: string;
    payload: Record<string, unknown>;
}
declare class CashDto {
    branchId?: string;
    kind: "IN" | "OUT";
    category: string;
    amount: string;
    reason: string;
}
declare class PromoDto {
    name: string;
    nameAr?: string;
    kind: (typeof PROMO_KINDS)[number];
    couponCode?: string;
    drugIds?: string[];
    params: Record<string, unknown>;
    startsAt?: string;
    endsAt?: string;
    minSubtotal?: string;
    maxUses?: number;
    priority?: number;
    stackable?: boolean;
    branchId?: string;
    active?: boolean;
}
declare class PromoPatchDto {
    name?: string;
    nameAr?: string;
    kind?: (typeof PROMO_KINDS)[number];
    params?: Record<string, unknown>;
    drugIds?: string[];
    endsAt?: string;
    minSubtotal?: string;
    maxUses?: number;
    priority?: number;
    stackable?: boolean;
    active?: boolean;
}
declare class VoidDto {
    reason: string;
    approval?: ApprovalDto;
}
declare class OpenShiftDto {
    branchId?: string;
    openingFloat: string;
}
declare class CloseShiftDto {
    countedCash: string;
}
declare class CustomerDto {
    displayName: string;
    phone?: string;
    creditLimit: string;
}
declare class LimitDto {
    creditLimit: string;
}
declare class SendViaDto {
    channel: "SMS" | "EMAIL" | "WHATSAPP";
    to?: string;
}
declare class PayLinkDto {
    amount?: string;
    expiresInHours?: number;
    sendVia?: SendViaDto;
}
declare class PayLinkRefundDto {
    amount?: string;
    reason?: string;
}
declare class ReceiptSendDto {
    channel: "SMS" | "EMAIL" | "WHATSAPP";
    to?: string;
}
declare class CustPayDto {
    amount: string;
    branchId?: string;
}
export declare class PosController {
    private readonly pos;
    private readonly sales;
    private readonly shifts;
    private readonly customers;
    private readonly promos;
    private readonly held;
    private readonly cash;
    private readonly payLinks;
    private readonly uoms;
    private readonly prisma;
    constructor(pos: PosService, sales: SalesService, shifts: ShiftsService, customers: CustomersService, promos: PromotionsService, held: HeldCartsService, cash: CashService, payLinks: PayLinksService, uoms: UomService, prisma: PrismaService);
    private expand;
    lookup(u: AuthUser, code: string, branchId?: string): Promise<{
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
    quote(u: AuthUser, d: QuoteDto): Promise<{
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
    bundle(u: AuthUser, branchId?: string): Promise<{
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
    checkout(u: AuthUser, d: CheckoutDto): Promise<{
        sale: Awaited<ReturnType<SalesService["getSale"]>>;
        change: string;
        replayed: boolean;
    }>;
    list(u: AuthUser, q: {
        branchId?: string;
        shiftId?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
        items: ({
            payments: {
                id: string;
                status: string;
                saleId: string;
                method: import("../../generated/prisma/enums").PaymentMethod;
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
    get(u: AuthUser, id: string): Promise<{
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
            refundMethod: import("../../generated/prisma/enums").PaymentMethod;
            refund: import("@prisma/client-runtime-utils").Decimal;
        }[];
        payments: {
            id: string;
            status: string;
            saleId: string;
            method: import("../../generated/prisma/enums").PaymentMethod;
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
    receipt(u: AuthUser, id: string): Promise<{
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
            method: import("../../generated/prisma/enums").PaymentMethod;
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
    receiptHtml(u: AuthUser, id: string, lang?: string, format?: string): Promise<string>;
    ret(u: AuthUser, id: string, d: ReturnDto): Promise<{
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
                refundMethod: import("../../generated/prisma/enums").PaymentMethod;
                refund: import("@prisma/client-runtime-utils").Decimal;
            }[];
            payments: {
                id: string;
                status: string;
                saleId: string;
                method: import("../../generated/prisma/enums").PaymentMethod;
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
    exchange(u: AuthUser, id: string, d: ExchangeDto): Promise<{
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
                refundMethod: import("../../generated/prisma/enums").PaymentMethod;
                refund: import("@prisma/client-runtime-utils").Decimal;
            }[];
            payments: {
                id: string;
                status: string;
                saleId: string;
                method: import("../../generated/prisma/enums").PaymentMethod;
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
                refundMethod: import("../../generated/prisma/enums").PaymentMethod;
                refund: import("@prisma/client-runtime-utils").Decimal;
            }[];
            payments: {
                id: string;
                status: string;
                saleId: string;
                method: import("../../generated/prisma/enums").PaymentMethod;
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
    void(u: AuthUser, id: string, d: VoidDto): Promise<{
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
            refundMethod: import("../../generated/prisma/enums").PaymentMethod;
            refund: import("@prisma/client-runtime-utils").Decimal;
        }[];
        payments: {
            id: string;
            status: string;
            saleId: string;
            method: import("../../generated/prisma/enums").PaymentMethod;
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
    sync(u: AuthUser, d: SyncDto): Promise<{
        results: import("./pos.service").SyncResult[];
    }>;
    conflicts(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    resolve(u: AuthUser, id: string, d: ResolveDto): Promise<{
        resolved: boolean;
        action: "FORCE" | "DISCARD";
        saleId: string | undefined;
    }>;
    open(u: AuthUser, d: OpenShiftDto): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").ShiftStatus;
        closedAt: Date | null;
        openedBy: string;
        closedBy: string | null;
        openingFloat: import("@prisma/client-runtime-utils").Decimal;
        countedCash: import("@prisma/client-runtime-utils").Decimal | null;
        expectedCash: import("@prisma/client-runtime-utils").Decimal | null;
        variance: import("@prisma/client-runtime-utils").Decimal | null;
        varianceAlerted: boolean;
        zReport: import("@prisma/client/runtime/client").JsonValue | null;
        openedAt: Date;
    }>;
    current(u: AuthUser, branchId?: string): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").ShiftStatus;
        closedAt: Date | null;
        openedBy: string;
        closedBy: string | null;
        openingFloat: import("@prisma/client-runtime-utils").Decimal;
        countedCash: import("@prisma/client-runtime-utils").Decimal | null;
        expectedCash: import("@prisma/client-runtime-utils").Decimal | null;
        variance: import("@prisma/client-runtime-utils").Decimal | null;
        varianceAlerted: boolean;
        zReport: import("@prisma/client/runtime/client").JsonValue | null;
        openedAt: Date;
    } | null>;
    shiftList(u: AuthUser, branchId?: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").ShiftStatus;
        closedAt: Date | null;
        openedBy: string;
        closedBy: string | null;
        openingFloat: import("@prisma/client-runtime-utils").Decimal;
        countedCash: import("@prisma/client-runtime-utils").Decimal | null;
        expectedCash: import("@prisma/client-runtime-utils").Decimal | null;
        variance: import("@prisma/client-runtime-utils").Decimal | null;
        varianceAlerted: boolean;
        zReport: import("@prisma/client/runtime/client").JsonValue | null;
        openedAt: Date;
    }[]>;
    x(u: AuthUser, id: string): Promise<{
        shiftId: string;
        branchId: string;
        openedAt: Date;
        closedAt: Date | null;
        openingFloat: string;
        salesCount: number;
        grossSales: string;
        vatTotal: string;
        discountTotal: string;
        byMethod: Record<string, string>;
        returnsCount: number;
        returnsTotal: string;
        voidsCount: number;
        voidsTotal: string;
        cashSales: string;
        cashRefunds: string;
        cashIn: string;
        cashOut: string;
        report: string;
        customerCreditCollected: string;
        expectedCash: string;
    }>;
    z(u: AuthUser, id: string): Promise<{
        shiftId: string;
        branchId: string;
        openedAt: Date;
        closedAt: Date | null;
        openingFloat: string;
        salesCount: number;
        grossSales: string;
        vatTotal: string;
        discountTotal: string;
        byMethod: Record<string, string>;
        returnsCount: number;
        returnsTotal: string;
        voidsCount: number;
        voidsTotal: string;
        cashSales: string;
        cashRefunds: string;
        cashIn: string;
        cashOut: string;
        report: string;
        customerCreditCollected: string;
        expectedCash: string;
    }>;
    close(u: AuthUser, id: string, d: CloseShiftDto): Promise<{
        shift: {
            id: string;
            orgId: string;
            branchId: string;
            status: import("../../generated/prisma/enums").ShiftStatus;
            closedAt: Date | null;
            openedBy: string;
            closedBy: string | null;
            openingFloat: import("@prisma/client-runtime-utils").Decimal;
            countedCash: import("@prisma/client-runtime-utils").Decimal | null;
            expectedCash: import("@prisma/client-runtime-utils").Decimal | null;
            variance: import("@prisma/client-runtime-utils").Decimal | null;
            varianceAlerted: boolean;
            zReport: import("@prisma/client/runtime/client").JsonValue | null;
            openedAt: Date;
        };
        zReport: import("@prisma/client/runtime/client").JsonValue;
        varianceAlert: boolean;
    }>;
    custList(u: AuthUser, q?: string): Promise<{
        id: string;
        displayName: string;
        phone: string | null;
        creditLimit: string;
        balance: string;
        available: string;
    }[]>;
    custCreate(u: AuthUser, d: CustomerDto): Promise<{
        displayName: string;
        phone: string | null;
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    custGet(u: AuthUser, id: string): Promise<{
        entries: {
            id: string;
            createdAt: Date;
            orgId: string;
            kind: string;
            createdBy: string;
            saleId: string | null;
            note: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
            accountId: string;
        }[];
        patient: {
            phone: string | null;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    custLimit(u: AuthUser, id: string, d: LimitDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    payLink(u: AuthUser, id: string, d: PayLinkDto, key?: string): Promise<{
        link: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            createdBy: string;
            status: import("../../generated/prisma/enums").PayLinkStatus;
            updatedAt: Date;
            idempotencyKey: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            accountId: string;
            currency: string;
            providerRef: string | null;
            payUrl: string | null;
            entryId: string | null;
            failureReason: string | null;
            refundedAmount: import("@prisma/client-runtime-utils").Decimal;
            refundRef: string | null;
            refundAmount: import("@prisma/client-runtime-utils").Decimal | null;
        } & {
            amount: string;
            refundedAmount: string;
            refundAmount: string | null;
        };
        replayed: boolean;
        notification?: undefined;
    } | {
        link: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            createdBy: string;
            status: import("../../generated/prisma/enums").PayLinkStatus;
            updatedAt: Date;
            idempotencyKey: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            accountId: string;
            currency: string;
            providerRef: string | null;
            payUrl: string | null;
            entryId: string | null;
            failureReason: string | null;
            refundedAmount: import("@prisma/client-runtime-utils").Decimal;
            refundRef: string | null;
            refundAmount: import("@prisma/client-runtime-utils").Decimal | null;
        } & {
            amount: string;
            refundedAmount: string;
            refundAmount: string | null;
        };
        replayed: boolean;
        notification: {
            id: string;
            status: string;
        } | undefined;
    }>;
    payLinksFor(u: AuthUser, id: string): Promise<({
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        createdBy: string;
        status: import("../../generated/prisma/enums").PayLinkStatus;
        updatedAt: Date;
        idempotencyKey: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        accountId: string;
        currency: string;
        providerRef: string | null;
        payUrl: string | null;
        entryId: string | null;
        failureReason: string | null;
        refundedAmount: import("@prisma/client-runtime-utils").Decimal;
        refundRef: string | null;
        refundAmount: import("@prisma/client-runtime-utils").Decimal | null;
    } & {
        amount: string;
        refundedAmount: string;
        refundAmount: string | null;
    })[]>;
    refundPayLink(u: AuthUser, id: string, d: PayLinkRefundDto): Promise<{
        link: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            createdBy: string;
            status: import("../../generated/prisma/enums").PayLinkStatus;
            updatedAt: Date;
            idempotencyKey: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            accountId: string;
            currency: string;
            providerRef: string | null;
            payUrl: string | null;
            entryId: string | null;
            failureReason: string | null;
            refundedAmount: import("@prisma/client-runtime-utils").Decimal;
            refundRef: string | null;
            refundAmount: import("@prisma/client-runtime-utils").Decimal | null;
        } & {
            amount: string;
            refundedAmount: string;
            refundAmount: string | null;
        };
        pending: boolean;
    }>;
    sendReceipt(u: AuthUser, id: string, d: ReceiptSendDto): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").NotificationStatus;
    }>;
    custPay(u: AuthUser, id: string, d: CustPayDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        creditLimit: import("@prisma/client-runtime-utils").Decimal;
        balance: import("@prisma/client-runtime-utils").Decimal;
        patientId: string;
    }>;
    hold(u: AuthUser, d: HoldDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: string;
        patientId: string | null;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolvedAt: Date | null;
        userId: string;
        label: string;
    }>;
    heldList(u: AuthUser, branchId?: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: string;
        patientId: string | null;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolvedAt: Date | null;
        userId: string;
        label: string;
    }[]>;
    resume(u: AuthUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: string;
        patientId: string | null;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolvedAt: Date | null;
        userId: string;
        label: string;
    }>;
    discard(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    cashMove(u: AuthUser, d: CashDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        kind: string;
        category: string;
        createdBy: string;
        reason: string;
        refType: string | null;
        refId: string | null;
        shiftId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    cashList(u: AuthUser, q: {
        shiftId?: string;
        branchId?: string;
    }): Promise<{
        amount: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        kind: string;
        category: string;
        createdBy: string;
        reason: string;
        refType: string | null;
        refId: string | null;
        shiftId: string;
    }[]>;
    promoList(u: AuthUser, q: {
        active?: string;
        q?: string;
    }): Promise<{
        totalDiscount: string;
        state: string;
        minSubtotal: string | null;
    }[]>;
    promoCreate(u: AuthUser, d: PromoDto): Promise<{
        minSubtotal: string | null;
    }>;
    promoUpdate(u: AuthUser, id: string, d: PromoPatchDto): Promise<{
        minSubtotal: string | null;
    }>;
}
export {};
