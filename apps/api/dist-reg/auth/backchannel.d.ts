import { type JWTVerifyGetKey } from "jose";
import type { PassportConfig } from "./passport";
export declare const BACKCHANNEL_LOGOUT_EVENT = "http://schemas.openid.net/event/backchannel-logout";
export declare const KX_EVENT_SUBJECT_DELETED = "https://schemas.kiorex.com/event/subject.deleted";
export declare const LOGOUT_TOKEN_TYP = "logout+jwt";
export declare class LogoutTokenError extends Error {
}
export interface VerifiedLogout {
    jti: string;
    exp: number;
    sub?: string;
    sid?: string;
    subjectDeleted: boolean;
}
export declare function verifyLogoutToken(token: unknown, cfg: PassportConfig, getKey: JWTVerifyGetKey, now?: Date): Promise<VerifiedLogout>;
