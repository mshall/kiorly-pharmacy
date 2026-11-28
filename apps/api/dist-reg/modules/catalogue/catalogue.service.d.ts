import { type ControlledSchedule } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { PriceService } from "./price.service";
export interface DrugInput {
    sourceKey?: string;
    brandName: string;
    brandNameAr?: string | null;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
    packSize: string;
    gtin?: string | null;
    manufacturer?: string | null;
    price?: string | null;
    rxOnly?: boolean;
    controlledSchedule?: ControlledSchedule;
    coldChain?: boolean;
    otc?: boolean;
    marketCodes?: Record<string, unknown> | null;
    vatRate?: string | null;
    category?: string | null;
    baseUnit?: string | null;
}
export interface DrugSearch {
    category?: string;
    q?: string;
    rxOnly?: boolean;
    controlled?: boolean;
    coldChain?: boolean;
    otc?: boolean;
    skip: number;
    take: number;
}
export declare class CatalogueService {
    private readonly prisma;
    private readonly prices;
    constructor(prisma: PrismaService, prices: PriceService);
    private ensureGroup;
    importDrugs(orgId: string | null, records: DrugInput[], actorId?: string): Promise<{
        created: number;
        updated: number;
    }>;
    search(orgId: string, s: DrugSearch): Promise<{
        items: Array<Record<string, unknown>>;
        total: number;
    }>;
    priceBook(orgId: string, branchId: string, q: {
        q?: string;
        category?: string;
        lowMargin?: boolean;
        skip: number;
        take: number;
    }): Promise<{
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
    get(orgId: string, id: string): Promise<{
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
        controlledSchedule: ControlledSchedule;
        coldChain: boolean;
        otc: boolean;
        marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
        substitutionGroupId: string | null;
        vatRate: import("@prisma/client-runtime-utils").Decimal | null;
        category: string | null;
        baseUnit: string;
        sourceKey: string | null;
    }>;
    create(orgId: string, actorId: string, r: DrugInput): Promise<{
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
        controlledSchedule: ControlledSchedule;
        coldChain: boolean;
        otc: boolean;
        marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
        substitutionGroupId: string | null;
        vatRate: import("@prisma/client-runtime-utils").Decimal | null;
        category: string | null;
        baseUnit: string;
        sourceKey: string | null;
    }>;
    update(orgId: string, actorId: string, id: string, patch: Partial<DrugInput>): Promise<{
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
        controlledSchedule: ControlledSchedule;
        coldChain: boolean;
        otc: boolean;
        marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
        substitutionGroupId: string | null;
        vatRate: import("@prisma/client-runtime-utils").Decimal | null;
        category: string | null;
        baseUnit: string;
        sourceKey: string | null;
    }>;
    substitutes(orgId: string, branchId: string, drugId: string): Promise<{
        drugId: string;
        brandName: string;
        brandNameAr: string | null;
        strength: string;
        dosageForm: string;
        available: number;
        nextExpiry: Date;
        price: string | null;
    }[]>;
    labels(orgId: string, branchId: string | null, ids: string[]): Promise<{
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
}
export declare const startOfToday: () => Date;
