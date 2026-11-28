import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare const PROMO_KINDS: readonly ["PERCENT_OFF", "AMOUNT_OFF", "BUY_X_GET_Y", "BUNDLE_PRICE"];
export interface PromotionInput {
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
export declare class PromotionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private view;
    list(orgId: string, q: {
        active?: boolean;
        q?: string;
    }): Promise<{
        totalDiscount: string;
        state: string;
        minSubtotal: string | null;
    }[]>;
    create(u: AuthUser, d: PromotionInput): Promise<{
        minSubtotal: string | null;
    }>;
    update(u: AuthUser, id: string, d: Partial<PromotionInput>): Promise<{
        minSubtotal: string | null;
    }>;
}
