export declare const LINK_TOUCH_VERSION = 1;
export declare const LINK_TOUCH_DEFAULT_TTL_MS: number;
export interface LinkTouchClaims {
    o: string;
    c: string;
    t: number;
    v: 1;
}
export declare function linkTouchSecret(env?: NodeJS.ProcessEnv): string | null;
export declare function signLinkTouch(input: {
    orgId: string;
    code: string;
    now?: Date;
}, secret?: string | null): string | null;
export type LinkTouchVerdict = {
    ok: true;
    claims: LinkTouchClaims;
} | {
    ok: false;
    reason: "MALFORMED" | "BAD_SIGNATURE" | "EXPIRED" | "NO_SECRET";
};
export declare function verifyLinkTouch(token: unknown, opts?: {
    now?: Date;
    ttlMs?: number;
    secret?: string | null;
}): LinkTouchVerdict;
