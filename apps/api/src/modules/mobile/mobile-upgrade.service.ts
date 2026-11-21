import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { AuditService } from "../../audit/audit.service";
import { PrismaService } from "../../prisma/prisma.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";
import { MODULE_DEFS } from "./mobile-plan";
import { PushService, renderPush } from "./push.service";

/** A repeat request by the same user for the same feature inside this window returns the original (idempotent, no second notification). */
export const UPGRADE_DEDUPE_MS = 24 * 3_600_000;
export const UPGRADE_NOTE_MAX = 500;
export const GENERAL_FEATURE = "general";

export const isKnownFeature = (k: string): boolean => k === GENERAL_FEATURE || MODULE_DEFS.some((m) => m.key === k);

/** Pure: the earliest-created request that still blocks a new one (inside the window), else null. */
export function findDuplicate<T extends { createdAt: Date }>(rows: T[], now: number, windowMs = UPGRADE_DEDUPE_MS): T | null {
  const live = rows.filter((r) => now - r.createdAt.getTime() < windowMs);
  return live.length ? live.reduce((a, b) => (a.createdAt <= b.createdAt ? a : b)) : null;
}

export function cleanNote(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null;
  if (typeof v !== "string") throw new BadRequestException("note must be text");
  const t = v.trim();
  return t ? t.slice(0, UPGRADE_NOTE_MAX) : null;
}

export interface UpgradeRequestResult { id: string; status: "REQUESTED" | "ALREADY_ENTITLED"; featureKey: string; requestedAt: string | null; deduped: boolean; notified: number }

/**
 * POST /mobile/upgrade-request. NOT entitlement-gated (exempt like the alert inbox) because the people who need it are on Basic. Records requester,
 * role, org, feature, note, time; de-duplicates per (user, feature) for 24h; notifies the org owner(s) via the mock push inbox + audit trail.
 */
@Injectable()
export class MobileUpgradeService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(MobileEntitlementService) private readonly ent: MobileEntitlementService,
    @Inject(PushService) private readonly push: PushService,
  ) {}

  async request(u: AuthUser, body: { featureKey?: unknown; note?: unknown }): Promise<UpgradeRequestResult> {
    const featureKey = typeof body?.featureKey === "string" && body.featureKey ? body.featureKey : GENERAL_FEATURE;
    if (!isKnownFeature(featureKey)) throw new BadRequestException("unknown featureKey");
    const note = cleanNote(body?.note);
    const e = await this.ent.evaluate(u.orgId);
    if (e.enabled) return { id: "", status: "ALREADY_ENTITLED", featureKey, requestedAt: null, deduped: true, notified: 0 };

    const recent = await this.prisma.mobileUpgradeRequest.findMany({ where: { orgId: u.orgId, userId: u.userId, featureKey, createdAt: { gt: new Date(Date.now() - UPGRADE_DEDUPE_MS) } }, orderBy: { createdAt: "asc" } });
    const dup = findDuplicate(recent, Date.now());
    if (dup) return { id: dup.id, status: "REQUESTED", featureKey, requestedAt: dup.createdAt.toISOString(), deduped: true, notified: 0 };

    const row = await this.prisma.mobileUpgradeRequest.create({ data: { orgId: u.orgId, userId: u.userId, role: u.role, featureKey, plan: e.rawPlan, note } });
    const owners = await this.prisma.staffUser.findMany({ where: { orgId: u.orgId, role: "OWNER", active: true, id: { not: u.userId } }, select: { id: true } });
    const { delivered } = owners.length
      ? await this.push.send({ orgId: u.orgId, ...renderPush("upgrade.request"), userIds: owners.map((o) => o.id), data: { template: "upgrade.request", requestId: row.id, featureKey, role: u.role }, allowUnentitled: true })
      : { delivered: 0 };
    if (delivered) await this.prisma.mobileUpgradeRequest.update({ where: { id: row.id }, data: { notifiedCount: delivered } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.upgrade_requested", entityType: "MobileUpgradeRequest", entityId: row.id, meta: { featureKey, role: u.role, plan: e.rawPlan, notified: delivered } });
    return { id: row.id, status: "REQUESTED", featureKey, requestedAt: row.createdAt.toISOString(), deduped: false, notified: delivered };
  }

  /** Bootstrap block for non-entitled orgs: what is locked for this role, my latest request, and (owner/admin only) how many are open. */
  async bootstrapBlock(u: AuthUser, lockedModules: string[]) {
    const isAdmin = u.role === "OWNER";
    const mine = await this.prisma.mobileUpgradeRequest.findFirst({ where: { orgId: u.orgId, userId: u.userId, createdAt: { gt: new Date(Date.now() - UPGRADE_DEDUPE_MS) } }, orderBy: { createdAt: "desc" } });
    const open = isAdmin ? await this.prisma.mobileUpgradeRequest.count({ where: { orgId: u.orgId, status: "OPEN" } }) : null;
    return { lockedModules, myRequest: mine ? { featureKey: mine.featureKey, requestedAt: mine.createdAt.toISOString() } : null, openRequests: open, canApprove: isAdmin };
  }
}
