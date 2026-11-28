import type { AuthUser } from "../../auth/auth-user";
import { CatalogueService } from "./catalogue.service";
import { PriceService } from "./price.service";
import { PrismaService } from "../../prisma/prisma.service";
import { type MarketPackPort } from "../../kernel-adapter/ports";
declare const SCHEDULES: readonly ["NONE", "SCHEDULE_1", "SCHEDULE_2", "SCHEDULE_3", "SCHEDULE_4"];
export declare class DrugDto {
    sourceKey?: string;
    brandName: string;
    brandNameAr?: string;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
    packSize: string;
    gtin?: string;
    manufacturer?: string;
    price?: string;
    rxOnly?: boolean;
    controlledSchedule?: (typeof SCHEDULES)[number];
    coldChain?: boolean;
    otc?: boolean;
    vatRate?: string;
    category?: string;
    baseUnit?: string;
}
declare class DrugPatchDto {
    brandName?: string;
    brandNameAr?: string;
    activeIngredient?: string;
    strength?: string;
    dosageForm?: string;
    packSize?: string;
    gtin?: string;
    manufacturer?: string;
    rxOnly?: boolean;
    controlledSchedule?: (typeof SCHEDULES)[number];
    coldChain?: boolean;
    otc?: boolean;
    vatRate?: string;
    category?: string;
    baseUnit?: string;
}
declare class ImportDto {
    drugs: DrugDto[];
}
declare class PriceItemDto {
    drugId: string;
    price: string;
    branchId?: string;
}
declare class BulkPriceDto {
    effectiveFrom: string;
    items: PriceItemDto[];
}
declare class SearchQuery {
    q?: string;
    category?: string;
    rxOnly?: boolean;
    controlled?: boolean;
    coldChain?: boolean;
    otc?: boolean;
    page?: string;
    pageSize?: string;
}
export declare class CatalogueController {
    private readonly svc;
    private readonly prices;
    private readonly prisma;
    private readonly packs;
    constructor(svc: CatalogueService, prices: PriceService, prisma: PrismaService, packs: MarketPackPort);
    search(u: AuthUser, q: SearchQuery): Promise<{
        page: number;
        pageSize: number;
        items: Array<Record<string, unknown>>;
        total: number;
    }>;
    priceBook(u: AuthUser, q: {
        q?: string;
        category?: string;
        lowMargin?: string;
        branchId?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
        page: number;
        pageSize: number;
        total: number;
        items: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            dosageForm: string;
            category: string | null;
            price: string;
            since: Date;
            cost: string | null;
            marginPct: number | null;
            onHand: number;
        }[];
    }>;
    categories(u: AuthUser): Promise<(string | null)[]>;
    get(u: AuthUser, id: string): Promise<{
        substitutionGroup: {
            id: string;
            activeIngredient: string;
            strength: string;
            dosageForm: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        orgId: string | null;
        active: boolean;
        brandName: string;
        brandNameAr: string | null;
        activeIngredient: string;
        strength: string;
        dosageForm: string;
        packSize: string;
        gtin: string | null;
        manufacturer: string | null;
        rxOnly: boolean;
        controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
        coldChain: boolean;
        otc: boolean;
        marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
        substitutionGroupId: string | null;
        vatRate: import("@prisma/client-runtime-utils").Decimal | null;
        category: string | null;
        baseUnit: string;
        sourceKey: string | null;
    }>;
    create(u: AuthUser, dto: DrugDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string | null;
        active: boolean;
        brandName: string;
        brandNameAr: string | null;
        activeIngredient: string;
        strength: string;
        dosageForm: string;
        packSize: string;
        gtin: string | null;
        manufacturer: string | null;
        rxOnly: boolean;
        controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
        coldChain: boolean;
        otc: boolean;
        marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
        substitutionGroupId: string | null;
        vatRate: import("@prisma/client-runtime-utils").Decimal | null;
        category: string | null;
        baseUnit: string;
        sourceKey: string | null;
    }>;
    update(u: AuthUser, id: string, dto: DrugPatchDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string | null;
        active: boolean;
        brandName: string;
        brandNameAr: string | null;
        activeIngredient: string;
        strength: string;
        dosageForm: string;
        packSize: string;
        gtin: string | null;
        manufacturer: string | null;
        rxOnly: boolean;
        controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
        coldChain: boolean;
        otc: boolean;
        marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
        substitutionGroupId: string | null;
        vatRate: import("@prisma/client-runtime-utils").Decimal | null;
        category: string | null;
        baseUnit: string;
        sourceKey: string | null;
    }>;
    import(u: AuthUser, dto: ImportDto): Promise<{
        created: number;
        updated: number;
    }>;
    substitutes(u: AuthUser, id: string, branchId?: string): Promise<{
        drugId: string;
        brandName: string;
        brandNameAr: string | null;
        strength: string;
        dosageForm: string;
        available: number;
        nextExpiry: Date;
        price: string | null;
    }[]>;
    history(u: AuthUser, drugId: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string | null;
        drugId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        createdBy: string | null;
    }[]>;
    priceAt(u: AuthUser, drugId: string, date?: string, branchId?: string): Promise<{
        drugId: string;
        at: string;
        price: string | null;
    }>;
    bulk(u: AuthUser, dto: BulkPriceDto): Promise<{
        updated: number;
    }>;
    labels(u: AuthUser, drugIds: string, branchId?: string): Promise<{
        drugId: string;
        brandName: string;
        brandNameAr: string | null;
        activeIngredient: string;
        strength: string;
        dosageForm: string;
        packSize: string;
        barcode: string | null;
        price: string | null;
    }[]>;
    print(u: AuthUser, drugIds: string, lang?: "ar" | "en", branchId?: string): Promise<string>;
}
export {};
