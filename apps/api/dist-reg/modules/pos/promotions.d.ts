import { Prisma } from "../../generated/prisma/client";
export interface PromoCartLine {
    drugId: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
    manualDiscount: Prisma.Decimal;
}
export interface PromoDef {
    id: string;
    name: string;
    kind: "PERCENT_OFF" | "AMOUNT_OFF" | "BUY_X_GET_Y" | "BUNDLE_PRICE" | string;
    couponCode?: string | null;
    drugIds: string[];
    params: {
        percent?: number;
        amount?: number | string;
        buy?: number;
        get?: number;
        percentOff?: number;
        items?: Array<{
            drugId: string;
            qty: number;
        }>;
        price?: number | string;
    };
    minSubtotal?: Prisma.Decimal | null;
    priority: number;
    stackable: boolean;
}
export interface AppliedPromo {
    promoId: string;
    name: string;
    amount: Prisma.Decimal;
    couponCode?: string;
}
export interface PromoResult {
    byDrug: Map<string, Prisma.Decimal>;
    applied: AppliedPromo[];
    unusedCoupons: string[];
}
export declare function applyPromotions(cart: PromoCartLine[], promos: readonly PromoDef[], coupons?: readonly string[]): PromoResult;
