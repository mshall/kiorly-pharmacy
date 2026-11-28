import type { Drug } from "../../generated/prisma/client";
export declare const isKiorexExposable: (d: Pick<Drug, "controlledSchedule" | "active">) => boolean;
export declare function projectDrugForKiorex(d: Drug): {
    sku: string;
    gtin: string | null;
    name: string;
    nameAr: string | null;
    activeIngredient: string;
    strength: string;
    form: string;
    pack: string;
    requiresPrescription: boolean;
    coldChain: boolean;
} | null;
export declare const dosageFormAr: (form: string | null | undefined) => string | undefined;
