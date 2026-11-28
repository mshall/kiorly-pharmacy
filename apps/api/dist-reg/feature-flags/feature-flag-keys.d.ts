export type FlagClass = "Module" | "AI" | "Integration" | "Launch-locked";
export interface FlagDefinition {
    key: string;
    cls: FlagClass;
    dependsOn: string[];
    launchLocked: boolean;
    offBehaviour: string;
}
export declare const FLAG_DEFINITIONS: readonly FlagDefinition[];
export declare const FLAG_KEYS: string[];
export type FlagKey = string;
export declare const isKnownFlagKey: (key: string) => boolean;
