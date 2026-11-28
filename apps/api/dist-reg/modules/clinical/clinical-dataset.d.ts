export type Sev = "MINOR" | "MODERATE" | "MAJOR" | "CONTRAINDICATED";
export interface DoseRule {
    ingredient: string;
    maxDailyMg: number;
    maxSingleMg?: number;
    pediatricMaxMgPerKg?: number;
    note?: string;
}
export interface PregnancyRule {
    ingredient: string;
    category: "A" | "B" | "C" | "D" | "X";
    note: string;
}
export interface PopulationRule {
    ingredient: string;
    severity: Sev;
    note: string;
}
export declare const DOSE_RULES: readonly DoseRule[];
export declare const PREGNANCY_RULES: readonly PregnancyRule[];
export declare const LACTATION_RULES: readonly PopulationRule[];
export declare const RENAL_RULES: readonly PopulationRule[];
export declare const HEPATIC_RULES: readonly PopulationRule[];
