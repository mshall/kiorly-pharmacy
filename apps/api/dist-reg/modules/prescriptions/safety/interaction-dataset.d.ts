export type Severity = "MINOR" | "MODERATE" | "MAJOR" | "CONTRAINDICATED";
export interface InteractionRule {
    a: string;
    b: string;
    severity: Severity;
    note: string;
}
export declare const INTERACTION_RULES: readonly InteractionRule[];
export declare const INGREDIENT_CLASSES: Readonly<Record<string, readonly string[]>>;
export declare const CROSS_CLASS: ReadonlyArray<readonly [string, string]>;
