export declare function strengthToMg(strength: string | null | undefined): number | null;
export declare function dosesPerDay(sig: string): number | null;
export declare function unitsPerDose(sig: string): number;
export interface DailyDose {
    perDoseMg: number;
    dosesPerDay: number;
    dailyMg: number;
}
export declare function dailyDoseMg(sig: string | null | undefined, strength: string | null | undefined): DailyDose | null;
