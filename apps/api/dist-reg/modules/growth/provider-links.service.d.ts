import { type ProviderReferralLink, type ReferralLinkChannelKind, type ReferralLinkOwnerScope, type ReferralLinkStatus } from "../../generated/prisma/client";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { OutboxService } from "../../outbox/outbox.service";
import { PrismaService } from "../../prisma/prisma.service";
import { type GrowthAction } from "./growth-access";
import { type ReferralLinkRecord } from "./link-registry";
export declare const GROWTH_FLAG = "growth.provider_links";
export declare const GROWTH_ERROR: {
    readonly LINK_INVALID: "GROWTH_LINK_INVALID";
    readonly LINK_LIMIT: "GROWTH_LINK_LIMIT_REACHED";
    readonly LINK_REVOKED: "GROWTH_LINK_REVOKED";
    readonly FORBIDDEN: "GROWTH_FORBIDDEN";
    readonly SCOPE_FORBIDDEN: "GROWTH_SCOPE_FORBIDDEN";
    readonly NOT_CONNECTED: "KIOREX_NOT_CONNECTED";
};
export interface CreateLinkBody {
    ownerScope?: string;
    channelKind?: string;
    label?: string;
    branchId?: string;
    tags?: unknown;
}
export interface UpdateLinkBody {
    label?: string;
    status?: string;
    channelKind?: string;
    tags?: unknown;
}
export type LinkTotals = {
    visits: number;
    orders: number;
    completed: number;
};
export type LinkDto = {
    id: string;
    code: string;
    label: string;
    ownerScope: ReferralLinkOwnerScope;
    channelKind: ReferralLinkChannelKind;
    status: ReferralLinkStatus;
    branchId: string | null;
    branchName: string | null;
    tags: Record<string, string>;
    shortUrl: string;
    createdAt: string;
    revokedAt: string | null;
    last30: LinkTotals;
};
export declare class ProviderLinksService {
    private readonly prisma;
    private readonly audit;
    private readonly outbox;
    private readonly flags;
    constructor(prisma: PrismaService, audit: AuditService, outbox: OutboxService, flags: FeatureFlagsService);
    assert(user: AuthUser, action: GrowthAction): string;
    assertConnected(orgId: string): Promise<void>;
    private scopeWhere;
    private loadLink;
    access(user: AuthUser): Promise<{
        level: import("./growth-access").GrowthLevel;
        connected: boolean;
        branchScoped: boolean;
        can: {
            view: boolean;
            create: boolean;
            update: boolean;
            revoke: boolean;
        };
        plan: {
            linksUsed: number;
            maxActiveLinks: number;
            trendDays: number;
            key: import("../../generated/prisma/enums").Edition;
        };
    }>;
    list(user: AuthUser, q?: {
        status?: string;
    }): Promise<{
        items: LinkDto[];
    }>;
    toDtos(orgId: string, rows: ProviderReferralLink[]): Promise<LinkDto[]>;
    create(user: AuthUser, body: CreateLinkBody): Promise<LinkDto>;
    update(user: AuthUser, id: string, body: UpdateLinkBody, opts?: {
        allowRevoke?: boolean;
    }): Promise<LinkDto>;
    private qrTarget;
    qrSvgFor(user: AuthUser, id: string): Promise<string>;
    qrPayloadFor(user: AuthUser, id: string): Promise<{
        url: string;
        svg: string;
        linkId: string;
    }>;
    qrPngFor(user: AuthUser, id: string, width?: number): Promise<Buffer>;
    posterHtml(user: AuthUser, id: string, opts: {
        lang?: string;
        size?: string;
        kind?: string;
        print?: boolean;
    }): Promise<string>;
    summary(user: AuthUser, q?: {
        days?: number;
    }): Promise<{
        days: number;
        totals: LinkTotals;
        byLink: {
            visits: number;
            orders: number;
            completed: number;
            linkId: string;
            code: string;
            label: string;
            status: ReferralLinkStatus;
        }[];
        trend: {
            visits: number;
            orders: number;
            completed: number;
            date: string;
        }[];
        note: string;
    }>;
    findByCode(rawCode: unknown): Promise<ProviderReferralLink | null>;
    touch(rawCode: unknown, opts: {
        bot: boolean;
        now?: Date;
    }): Promise<{
        link: ProviderReferralLink;
        lt: string | null;
    } | null>;
    lookupRecord(orgId: string, rawCode: unknown): Promise<ReferralLinkRecord | null>;
    listRecords(orgId: string, opts: {
        updatedSince?: Date;
        limit?: number;
        cursor?: string;
    }): Promise<{
        items: ReferralLinkRecord[];
        nextCursor: string | null;
    }>;
}
