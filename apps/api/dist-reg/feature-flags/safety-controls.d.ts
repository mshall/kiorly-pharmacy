export declare const SAFETY_CONTROL_IDS: readonly string[];
export declare const SAFETY_PATH_DIRS: readonly string[];
export declare class SafetyControlNotAFlagError extends Error {
    readonly key: string;
    constructor(key: string);
}
export declare function isSafetyControlKey(key: string): boolean;
