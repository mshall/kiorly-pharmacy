export declare function isEntitlementExempt(method: string, path: string): boolean;
export declare function isMobilePlanGated(req: {
    method: string;
    originalUrl?: string;
    url: string;
    headers: Record<string, string | string[] | undefined>;
}): boolean;
