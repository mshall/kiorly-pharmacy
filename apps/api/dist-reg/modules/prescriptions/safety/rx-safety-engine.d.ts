import type { SafetyCheckKind, SafetyCheckOutcome } from "../../../generated/prisma/client";
import { type InteractionRule } from "./interaction-dataset";
import type { ClinicalSnapshot } from "../../clinical/knowledge";
export interface EngineItem {
    drugId: string;
    activeIngredient: string;
    quantity: number;
    controlledSchedule: string;
    label: string;
    strength?: string | null;
    directions?: string | null;
}
export interface RecentIngredient {
    ingredient: string;
    dispensedAt: Date;
}
export interface EnginePatient {
    allergies: string[];
    recent: RecentIngredient[];
    pregnant?: boolean;
    lactating?: boolean;
    renalImpairment?: boolean;
    hepaticImpairment?: boolean;
    ageYears?: number | null;
    weightKg?: number | null;
}
export interface EngineRx {
    prescriberName?: string | null;
    prescriberLicenceNo?: string | null;
    prescriberVerifiedBadge?: boolean;
    validUntil?: Date | null;
    hasRx: boolean;
}
export interface EngineOptions {
    now?: Date;
    controlledQuantityLimit: number;
    duplicateWindowDays?: number;
    activeCourseDays?: number;
    rules?: readonly InteractionRule[];
    kb?: Pick<ClinicalSnapshot, "dose" | "pregnancy" | "lactation" | "renal" | "hepatic"> & {
        interactions?: InteractionRule[];
    };
}
export interface CheckResult {
    kind: SafetyCheckKind;
    outcome: SafetyCheckOutcome;
    detail: string | null;
    overridable: boolean;
}
export declare function ingredientsOf(activeIngredient: string): string[];
export declare function runSafetyChecks(items: EngineItem[], patient: EnginePatient, rx: EngineRx, opt: EngineOptions): CheckResult[];
export declare const hasUnresolvedBlock: (results: Array<{
    outcome: SafetyCheckOutcome;
}>) => boolean;
