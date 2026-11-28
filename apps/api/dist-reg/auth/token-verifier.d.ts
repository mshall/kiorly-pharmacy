import { type JWTPayload } from "jose";
export interface VerifiedToken {
    sub: string;
    mfa: boolean;
    claims: JWTPayload;
    staffId?: string;
    passport?: boolean;
    sessionId?: string;
}
export type AuthMode = "local" | "oidc" | "both";
export declare const authMode: () => AuthMode;
export declare const localLoginEnabled: () => boolean;
export declare const mfaEnforced: () => boolean;
export declare const LOCAL_ISSUER = "kiorly-pharmacy-local";
export declare const SESSION_ISSUER = "kiorly-pharmacy-passport-session";
export declare class TokenVerifier {
    issueLocal(sub: string, ttlSeconds?: number): Promise<string>;
    issueSession(staffId: string, mfa: boolean, ttlSeconds?: number, sessionId?: string): Promise<string>;
    issueOwnerClaim(staffId: string, ttlSeconds?: number): Promise<string>;
    readOwnerClaim(token: string): Promise<string>;
    verify(token: string): Promise<VerifiedToken>;
}
