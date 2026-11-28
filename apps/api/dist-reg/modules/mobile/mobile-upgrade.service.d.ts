import type { AuthUser } from "../../auth/auth-user";
import { AuditService } from "../../audit/audit.service";
import { PrismaService } from "../../prisma/prisma.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";
import { PushService } from "./push.service";
export declare const UPGRADE_DEDUPE_MS: number;
export declare const UPGRADE_NOTE_MAX = 500;
export declare const GENERAL_FEATURE = "general";
export declare const isKnownFeature: (k: string) => boolean;
export declare function findDuplicate<T extends {
    createdAt: Date;
}>(rows: T[], now: number, windowMs?: number): T | null;
export declare function cleanNote(v: unknown): string | null;
export declare const OPEN_REQUESTS_MAX = 10;
export interface OpenUpgradeRequest {
    id: string;
    featureKey: string;
    requesterRole: string;
    requesterName: string;
    requestedAt: string;
    note?: string;
}
export declare function shapeOpenRequests(rows: Array<{
    id: string;
    featureKey: string;
    role: string;
    note: string | null;
    createdAt: Date;
    who: string;
}>, names: Map<string, string>): OpenUpgradeRequest[];
export interface UpgradeRequestResult {
    id: string;
    status: "REQUESTED" | "ALREADY_ENTITLED";
    featureKey: string;
    requestedAt: string | null;
    deduped: boolean;
    notified: number;
}
export declare class MobileUpgradeService {
    private readonly prisma;
    private readonly audit;
    private readonly ent;
    private readonly push;
    constructor(prisma: PrismaService, audit: AuditService, ent: MobileEntitlementService, push: PushService);
    request(u: AuthUser, body: {
        featureKey?: unknown;
        note?: unknown;
    }): Promise<UpgradeRequestResult>;
    bootstrapBlock(u: AuthUser, lockedModules: string[]): Promise<{
        lockedModules: string[];
        myRequest: {
            featureKey: string;
            requestedAt: string;
        } | null;
        openRequests: number | null;
        openRequestItems: OpenUpgradeRequest[];
        canApprove: boolean;
    }>;
    private openItems;
}
