export declare const ORG_TYPE: "pharmacy";
export interface Coverage {
    enabled: boolean;
    types: Record<string, {
        mandatory: string[];
        partial: string[];
    }>;
}
export type CoverageFetcher = (url: string) => Promise<Coverage>;
export declare function setCoverageFetcher(f: CoverageFetcher | undefined, reset?: boolean): void;
export declare const resetMfaPolicyCache: () => void;
export declare function roleCovered(c: Coverage | null, role: string, includePartial: boolean, orgType?: string): boolean;
export declare function mfaMandatoryForRole(role: string, includePartial?: boolean, env?: NodeJS.ProcessEnv): Promise<boolean>;
