import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { TokenVerifier } from "./token-verifier";
import { PassportSessions } from "./passport-sessions.service";
import { type PassportClaims, type PassportConfig } from "./passport";
export interface ExchangeInput {
    code: string;
    codeVerifier: string;
    redirectUri: string;
    nonce: string;
    claim?: string;
}
export declare class PassportService {
    private readonly prisma;
    private readonly audit;
    private readonly tokens;
    private readonly sessions?;
    private readonly log;
    fetchImpl: typeof fetch;
    constructor(prisma: PrismaService, audit: AuditService, tokens: TokenVerifier, sessions?: PassportSessions | undefined);
    publicConfig(): Promise<{
        localLogin: boolean;
        passport: null;
    } | {
        localLogin: boolean;
        passport: {
            issuer: string;
            clientId: string;
            authorizationEndpoint: string;
            scope: string;
            endSession: boolean;
        };
    }>;
    resolveStaff(claims: PassportClaims, cfg: PassportConfig): Promise<({
        tenant: {
            id: string;
            externalOrgId: string | null;
            name: string;
            edition: import("../generated/prisma/enums").Edition;
            marketCode: string;
            subscriptionStatus: string;
            defaultSignInMethod: import("../generated/prisma/enums").SignInMethod | null;
            settings: import("@prisma/client/runtime/client").JsonValue | null;
            onboardedAt: Date | null;
            createdAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        subject: string | null;
        displayName: string;
        role: import("../generated/prisma/enums").StaffRole;
        pharmacistLicenceNo: string | null;
        email: string | null;
        passwordHash: string | null;
        branchId: string | null;
        mfaEnrolled: boolean;
        dismissedCards: import("@prisma/client/runtime/client").JsonValue;
        lastLoginAt: Date | null;
    }) | {
        subject: string | undefined;
        tenant: {
            id: string;
            externalOrgId: string | null;
            name: string;
            edition: import("../generated/prisma/enums").Edition;
            marketCode: string;
            subscriptionStatus: string;
            defaultSignInMethod: import("../generated/prisma/enums").SignInMethod | null;
            settings: import("@prisma/client/runtime/client").JsonValue | null;
            onboardedAt: Date | null;
            createdAt: Date;
        };
        id: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        displayName: string;
        role: import("../generated/prisma/enums").StaffRole;
        pharmacistLicenceNo: string | null;
        email: string | null;
        passwordHash: string | null;
        branchId: string | null;
        mfaEnrolled: boolean;
        dismissedCards: import("@prisma/client/runtime/client").JsonValue;
        lastLoginAt: Date | null;
    }>;
    bindOwnerClaim(claim: string, claims: PassportClaims): Promise<void>;
    exchange(input: ExchangeInput): Promise<{
        endSessionUrl?: string | undefined;
        accessToken: string;
        expiresIn: number;
    }>;
}
