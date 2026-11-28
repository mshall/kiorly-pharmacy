export declare const SIGN_IN_METHODS: readonly ["PASSWORD", "PASSPORT"];
export type SignInDefaultMethod = (typeof SIGN_IN_METHODS)[number];
export declare function parseSignInMethod(v: unknown): SignInDefaultMethod | null;
export declare function deploymentDefaultMethod(env?: Record<string, string | undefined>): SignInDefaultMethod;
export interface OrgSignInFacts {
    stored: SignInDefaultMethod | null;
    linkedToKiorex: boolean;
}
export declare function effectiveOrgDefault(o: OrgSignInFacts): SignInDefaultMethod;
export declare function resolvePublicSignInConfig(i: {
    passportAvailable: boolean;
    org: OrgSignInFacts | null;
    deployment: SignInDefaultMethod;
}): {
    passportAvailable: boolean;
    defaultMethod: SignInDefaultMethod;
};
export declare function cleanOrgHint(v: unknown): string | null;
export declare function makeWindowLimiter(max: number, windowMs: number, now?: () => number): (key: string) => boolean;
