import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
export declare const sha256: (s: string) => string;
export declare const isDeviceAdmin: (u: AuthUser) => boolean;
export declare class MobileDevicesService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    register(u: AuthUser, d: {
        deviceId: string;
        platform: string;
        name: string;
        appVersion?: string;
        pushToken?: string;
    }): Promise<{
        id: string;
        deviceToken: string;
        status: "ACTIVE";
    }>;
    list(u: AuthUser): Promise<{
        items: {
            id: string;
            deviceId: string;
            userId: string;
            userName: string | null;
            platform: string;
            name: string;
            appVersion: string | null;
            status: string;
            pushRegistered: boolean;
            pushProvider: string | null;
            lastSeenAt: Date | null;
            createdAt: Date;
            revokedAt: Date | null;
        }[];
    }>;
    revoke(u: AuthUser, id: string): Promise<{
        id: string;
        deviceId: string;
        userId: string;
        userName: string | null;
        platform: string;
        name: string;
        appVersion: string | null;
        status: string;
        pushRegistered: boolean;
        pushProvider: string | null;
        lastSeenAt: Date | null;
        createdAt: Date;
        revokedAt: Date | null;
    }>;
    setPushToken(u: AuthUser, id: string, token: string, provider: "expo" | "mock"): Promise<{
        id: string;
        deviceId: string;
        userId: string;
        userName: string | null;
        platform: string;
        name: string;
        appVersion: string | null;
        status: string;
        pushRegistered: boolean;
        pushProvider: string | null;
        lastSeenAt: Date | null;
        createdAt: Date;
        revokedAt: Date | null;
    }>;
    verify(u: AuthUser, deviceRef: string | undefined, token: string | undefined): Promise<{
        id: string;
        status: string;
    } | null>;
    peek(u: AuthUser, deviceRef: string | undefined): Promise<{
        id: string;
        status: string;
    } | null>;
}
