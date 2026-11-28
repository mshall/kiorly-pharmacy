import type { JWTVerifyGetKey } from "jose";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { type PassportClaims } from "./passport";
export declare class PassportSessions {
    private readonly prisma;
    private readonly audit;
    private readonly log;
    keyResolver: ((jwksUrl: string) => JWTVerifyGetKey) | null;
    constructor(prisma: PrismaService, audit: AuditService);
    open(staff: {
        id: string;
        orgId: string;
    }, claims: {
        sub: string;
        sid?: string;
    }, ttlSeconds: number): Promise<{
        sub: string;
        id: string;
        createdAt: Date;
        orgId: string;
        staffId: string;
        sid: string | null;
        lastSeenAt: Date;
        expiresAt: Date;
        revokedAt: Date | null;
        revokedReason: string | null;
    }>;
    assertActive(sessionId: string): Promise<void>;
    assertBearerActive(claims: Pick<PassportClaims, "sub" | "sid" | "iat">): Promise<void>;
    revokeForStaff(staffId: string, reason: string): Promise<number>;
    backchannelLogout(logoutToken: unknown): Promise<{
        revoked: number;
    }>;
}
