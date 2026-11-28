import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { PermissionsService } from "../../auth/permissions.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";
import { MobileDevicesService } from "./mobile-devices.service";
import { MobileAlertsService } from "./mobile-alerts.service";
import { MobileUpgradeService } from "./mobile-upgrade.service";
import { PushService } from "./push.service";
declare class RegisterDeviceDto {
    deviceId: string;
    platform: string;
    name: string;
    appVersion?: string;
    pushToken?: string;
}
declare class PushTokenDto {
    token: string;
    provider: "expo" | "mock";
}
declare class UpgradeRequestDto {
    featureKey?: string;
    note?: string;
}
declare class AckDto {
    note?: string;
}
export declare class MobileController {
    private readonly prisma;
    private readonly perms;
    private readonly modes;
    private readonly flags;
    private readonly ent;
    private readonly devices;
    private readonly alerts;
    private readonly push;
    private readonly upgrade;
    constructor(prisma: PrismaService, perms: PermissionsService, modes: TenantModeService, flags: FeatureFlagsService, ent: MobileEntitlementService, devices: MobileDevicesService, alerts: MobileAlertsService, push: PushService, upgrade: MobileUpgradeService);
    bootstrap(u: AuthUser, req: {
        headers: Record<string, string | string[] | undefined>;
    }): Promise<{
        apiVersion: number;
        product: "pharmacy";
        serverTime: string;
        user: {
            id: string;
            name: string;
            email: string | null;
            role: import("../../generated/prisma/enums").StaffRole;
            roles: import("../../generated/prisma/enums").StaffRole[];
            locale: string;
            branchId: string | null;
            isPharmacist: boolean;
        };
        org: {
            id: string;
            name: string;
            slug: string | null;
            plan: import("./mobile-plan").MobilePlan;
            rawPlan: string;
            mode: import("../../tenancy/tenant-mode.service").OperatingMode;
        };
        entitlement: {
            key: "mobile_staff_app";
            enabled: boolean;
            requiredPlan: "PRO";
            reason: "PLAN_BELOW_PRO" | "FLAG_OFF" | null;
        };
        safetyAlertsOnly: boolean;
        modules: {
            key: string;
            enabled: boolean;
            screens: string[];
        }[];
        upgrade: {
            lockedModules: string[];
            myRequest: {
                featureKey: string;
                requestedAt: string;
            } | null;
            openRequests: number | null;
            openRequestItems: import("./mobile-upgrade.service").OpenUpgradeRequest[];
            canApprove: boolean;
        } | null;
        device: {
            id: string;
            status: string;
        } | null;
    }>;
    upgradeRequest(u: AuthUser, d: UpgradeRequestDto): Promise<import("./mobile-upgrade.service").UpgradeRequestResult>;
    register(u: AuthUser, d: RegisterDeviceDto): Promise<{
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
    pushToken(u: AuthUser, id: string, d: PushTokenDto): Promise<{
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
    inbox(u: AuthUser, q: {
        limit?: string;
        cursor?: string;
    }): Promise<{
        items: {
            id: string;
            kind: string;
            title: string;
            titleAr: string;
            body: string;
            bodyAr: string;
            data: import("@prisma/client/runtime/client").JsonValue;
            createdAt: Date;
            readAt: Date | null;
        }[];
        nextCursor: string | null;
        unread: number;
    }>;
    readAll(u: AuthUser): Promise<{
        updated: number;
    }>;
    read(u: AuthUser, id: string): Promise<{
        id: string;
        updated: number;
    }>;
    test(u: AuthUser): Promise<{
        delivered: number;
    }>;
    alertList(u: AuthUser, status?: string): Promise<{
        items: import("./mobile-alerts.service").MobileAlert[];
    }>;
    ack(u: AuthUser, id: string, d: AckDto): Promise<import("./mobile-alerts.service").MobileAlert>;
    private requireEntitlement;
}
export {};
