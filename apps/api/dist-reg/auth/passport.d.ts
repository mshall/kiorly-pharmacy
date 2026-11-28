import { type JWTPayload } from "jose";
export interface PassportConfig {
    issuer: string;
    jwksUrl: string;
    audiences: string[];
    allowedClients: string[];
    webClientId: string;
    phoneLink: boolean;
    sessionMaxAgeSeconds: number;
}
export declare function sessionMaxAge(v: string | undefined): number;
export declare function sessionIdleMinutes(v: string | undefined): number;
export declare function passportConfig(env?: NodeJS.ProcessEnv): PassportConfig | null;
export interface Discovery {
    authorization_endpoint: string;
    token_endpoint: string;
    end_session_endpoint?: string;
    jwks_uri?: string;
}
export declare function discover(issuer: string, fetchImpl?: typeof fetch): Promise<Discovery>;
export declare const resetDiscoveryCache: () => void;
export declare const jwks: (url: string) => import("jose").RemoteJWKSet;
export declare const peekAlg: (token: string) => string | undefined;
export interface PassportClaims extends JWTPayload {
    phone_number?: string;
    phone_number_verified?: boolean;
    name?: string;
    sid?: string;
    acr?: string;
    amr?: string[];
    client_id?: string;
}
export declare function verifyPassportAccessToken(token: string, cfg: PassportConfig): Promise<PassportClaims>;
export declare const hasMfa: (c: PassportClaims) => boolean;
export declare function verifyPassportIdToken(idToken: string, cfg: PassportConfig, nonce: string): Promise<PassportClaims>;
export declare function normalizePhone(p: string | null | undefined): string | null;
