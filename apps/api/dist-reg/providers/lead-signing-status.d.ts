type Env = Record<string, string | undefined>;
export declare const MIN_PROD_LEAD_SECRET_LENGTH = 32;
export interface LeadSigningStatus {
    status: "configured" | "not configured";
}
export declare function leadSigningStatus(env?: Env): LeadSigningStatus;
export declare function warnIfLeadSigningMissing(log?: (message: string) => void, env?: Env): void;
export {};
