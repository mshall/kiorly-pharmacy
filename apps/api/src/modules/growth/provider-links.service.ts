import { Inject, Injectable } from "@nestjs/common";
import { Prisma, type ProviderReferralLink, type ReferralLinkChannelKind, type ReferralLinkOwnerScope, type ReferralLinkStatus } from "../../generated/prisma/client";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { badRequest, conflict, forbidden, notFound } from "../../common/errors";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { OutboxService } from "../../outbox/outbox.service";
import { PrismaService } from "../../prisma/prisma.service";
import { canGrowth, growthLevel, type GrowthAction } from "./growth-access";
import { growthLimitsFor } from "./growth-plan-limits";
import { generateLinkCode, normalizeLinkCode } from "./link-code";
import { bumpLinkCounter, utcDay } from "./link-counters";
import { isKiorexConnected } from "./kiorex-connection";
import { effectiveTags, sanitizeLinkTags } from "./link-tags";
import { REFERRAL_LINK_CREATED, REFERRAL_LINK_REVOKED, linkEventData, toReferralLinkRecord, type ReferralLinkRecord } from "./link-registry";
import { signLinkTouch } from "./link-touch";
import { shortUrl } from "./link-urls";
import { renderPosterHtml, type PosterKind, type PosterLang, type PosterSize } from "./poster-html";
import { qrPng, qrSvg } from "./qr-svg";

export const GROWTH_FLAG = "growth.provider_links";
export const GROWTH_ERROR = {
  LINK_INVALID: "GROWTH_LINK_INVALID",
  LINK_LIMIT: "GROWTH_LINK_LIMIT_REACHED",
  LINK_REVOKED: "GROWTH_LINK_REVOKED",
  FORBIDDEN: "GROWTH_FORBIDDEN",
  SCOPE_FORBIDDEN: "GROWTH_SCOPE_FORBIDDEN",
  NOT_CONNECTED: "KIOREX_NOT_CONNECTED",
} as const;

export interface CreateLinkBody { ownerScope?: string; channelKind?: string; label?: string; branchId?: string; tags?: unknown }
export interface UpdateLinkBody { label?: string; status?: string; channelKind?: string; tags?: unknown }

const SCOPES = new Set<string>(["ORG", "BRANCH", "DESK"]);
const CHANNELS = new Set<string>(["WEB_LINK", "QR_POSTER", "QR_DESK", "SOCIAL", "SMS", "WHATSAPP_SHARE", "EMAIL_SIG", "GOOGLE_PROFILE"]);
const cleanText = (s: string) => s.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();

export type LinkTotals = { visits: number; orders: number; completed: number };
export type LinkDto = {
  id: string; code: string; label: string; ownerScope: ReferralLinkOwnerScope; channelKind: ReferralLinkChannelKind; status: ReferralLinkStatus;
  branchId: string | null; branchName: string | null; tags: Record<string, string>; shortUrl: string; createdAt: string; revokedAt: string | null; last30: LinkTotals;
};

/** Link management for Kiorly Pharmacy (GRW-P4-B1): CRUD and lifecycle (ORG, BRANCH, DESK scopes), QR, printable cards, daily counters, registry events. */
@Injectable()
export class ProviderLinksService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(OutboxService) private readonly outbox: OutboxService,
    @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService,
  ) {}

  /** Role gate. A user without the action gets 403 GROWTH_FORBIDDEN. */
  assert(user: AuthUser, action: GrowthAction): string {
    if (!canGrowth(user.role, action)) throw forbidden(GROWTH_ERROR.FORBIDDEN, "Your role cannot do this in Growth");
    return user.orgId;
  }

  /** Every Growth route needs a Kiorex-connected pharmacy (links hand off to Kiorex): 403 KIOREX_NOT_CONNECTED otherwise. */
  async assertConnected(orgId: string): Promise<void> {
    if (!(await isKiorexConnected(this.prisma, orgId))) throw forbidden(GROWTH_ERROR.NOT_CONNECTED, "Connect this pharmacy to Kiorex to use Growth links");
  }

  /** A branch-scoped user (branchId set) may only see org-wide links and links of their own branch. */
  private scopeWhere(user: AuthUser): Prisma.ProviderReferralLinkWhereInput {
    const where: Prisma.ProviderReferralLinkWhereInput = { orgId: user.orgId };
    if (user.branchId) where.OR = [{ ownerScope: "ORG" }, { branchRef: user.branchId }];
    return where;
  }

  private async loadLink(user: AuthUser, id: string, action: GrowthAction): Promise<ProviderReferralLink> {
    this.assert(user, action);
    const row = await this.prisma.providerReferralLink.findFirst({ where: { AND: [{ id }, this.scopeWhere(user)] } });
    if (!row) throw notFound("Link", id); // same answer for another organisation's id and for a branch the user cannot see (no existence leak)
    if (action !== "view" && user.branchId && row.ownerScope === "ORG") throw forbidden(GROWTH_ERROR.SCOPE_FORBIDDEN, "Only head office can change organisation-wide links");
    return row;
  }

  async access(user: AuthUser) {
    const orgId = user.orgId;
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { edition: true } });
    const limits = growthLimitsFor(t.edition);
    const used = await this.prisma.providerReferralLink.count({ where: { orgId, status: { not: "REVOKED" } } });
    return {
      level: growthLevel(user.role),
      connected: await isKiorexConnected(this.prisma, orgId),
      branchScoped: Boolean(user.branchId),
      can: { view: canGrowth(user.role, "view"), create: canGrowth(user.role, "create"), update: canGrowth(user.role, "update"), revoke: canGrowth(user.role, "revoke") },
      plan: { key: t.edition, ...limits, linksUsed: used },
    };
  }

  // ---------------------------------------------------------------- links

  async list(user: AuthUser, q: { status?: string } = {}): Promise<{ items: LinkDto[] }> {
    this.assert(user, "view");
    await this.assertConnected(user.orgId);
    const where = this.scopeWhere(user);
    if (q.status && ["ACTIVE", "PAUSED", "REVOKED"].includes(q.status)) where.status = q.status as ReferralLinkStatus;
    const rows = await this.prisma.providerReferralLink.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 });
    return { items: await this.toDtos(user.orgId, rows) };
  }

  async toDtos(orgId: string, rows: ProviderReferralLink[]): Promise<LinkDto[]> {
    if (!rows.length) return [];
    const since = utcDay(new Date(Date.now() - 29 * 86_400_000));
    const [sums, branches] = await Promise.all([
      this.prisma.providerReferralLinkDaily.groupBy({ by: ["linkId"], where: { orgId, linkId: { in: rows.map((r) => r.id) }, date: { gte: since } }, _sum: { visits: true, orders: true, completed: true } }),
      this.prisma.branch.findMany({ where: { orgId, id: { in: [...new Set(rows.map((r) => r.branchRef).filter((x): x is string => Boolean(x)))] } }, select: { id: true, name: true } }),
    ]);
    const sumBy = new Map(sums.map((s) => [s.linkId, s._sum]));
    const branchBy = new Map(branches.map((b) => [b.id, b.name]));
    return rows.map((r) => {
      const s = sumBy.get(r.id);
      return {
        id: r.id, code: r.code, label: r.label, ownerScope: r.ownerScope, channelKind: r.channelKind, status: r.status,
        branchId: r.branchRef, branchName: r.branchRef ? branchBy.get(r.branchRef) ?? null : null,
        tags: effectiveTags(r.channelKind, r.tags) as Record<string, string>, shortUrl: shortUrl(r.code),
        createdAt: r.createdAt.toISOString(), revokedAt: r.revokedAt?.toISOString() ?? null,
        last30: { visits: s?.visits ?? 0, orders: s?.orders ?? 0, completed: s?.completed ?? 0 },
      };
    });
  }

  async create(user: AuthUser, body: CreateLinkBody): Promise<LinkDto> {
    const orgId = this.assert(user, "create");
    await this.assertConnected(orgId);
    const label = cleanText(String(body.label ?? ""));
    if (label.length < 2 || label.length > 80) throw badRequest(GROWTH_ERROR.LINK_INVALID, "label must be 2 to 80 characters");
    const ownerScope = String(body.ownerScope ?? "ORG");
    if (!SCOPES.has(ownerScope)) throw badRequest(GROWTH_ERROR.LINK_INVALID, "Unknown ownerScope");
    const channelKind = String(body.channelKind ?? (ownerScope === "DESK" ? "QR_DESK" : "WEB_LINK"));
    if (!CHANNELS.has(channelKind)) throw badRequest(GROWTH_ERROR.LINK_INVALID, "Unknown channelKind");
    const tags = sanitizeLinkTags(body.tags);
    if (!tags.ok) throw badRequest(GROWTH_ERROR.LINK_INVALID, `Invalid tag ${tags.key}`, { field: tags.key });

    let branchRef: string | null = null;
    if (ownerScope === "ORG") {
      if (user.branchId) throw forbidden(GROWTH_ERROR.SCOPE_FORBIDDEN, "Only head office can create organisation-wide links");
    } else {
      const wanted = body.branchId ?? user.branchId ?? undefined;
      if (!wanted) throw badRequest(GROWTH_ERROR.LINK_INVALID, "branchId is required for a branch or counter link");
      if (user.branchId && wanted !== user.branchId) throw forbidden(GROWTH_ERROR.SCOPE_FORBIDDEN, "You can only create links for your own branch");
      const branch = await this.prisma.branch.findFirst({ where: { id: wanted, orgId, active: true }, select: { id: true } });
      if (!branch) throw notFound("Branch");
      branchRef = branch.id;
    }

    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { edition: true, marketCode: true } });
    const limits = growthLimitsFor(t.edition);
    const used = await this.prisma.providerReferralLink.count({ where: { orgId, status: { not: "REVOKED" } } });
    if (used >= limits.maxActiveLinks) throw conflict(GROWTH_ERROR.LINK_LIMIT, "Your plan's link limit is reached. Revoke a link you no longer use or upgrade.", { limit: limits.maxActiveLinks, plan: t.edition });

    const emit = this.flags.isEnabled(GROWTH_FLAG, { orgId, market: t.marketCode }); // flag-gated registry emission (a connected organisation is already required above)
    let created: ProviderReferralLink | null = null;
    for (let attempt = 0; attempt < 8 && !created; attempt += 1) {
      try {
        created = await this.prisma.$transaction(async (tx) => {
          const link = await tx.providerReferralLink.create({
            data: { orgId, branchRef, ownerScope: ownerScope as ReferralLinkOwnerScope, channelKind: channelKind as ReferralLinkChannelKind, code: generateLinkCode(), label, tags: (tags.tags ?? undefined) as Prisma.InputJsonValue | undefined, createdBy: user.userId },
          });
          if (emit) await this.outbox.enqueue({ orgId, type: REFERRAL_LINK_CREATED, aggregateType: "ProviderReferralLink", aggregateId: link.id, data: linkEventData(REFERRAL_LINK_CREATED, link), dedupeKey: `link:created:${link.id}` }, tx);
          await this.audit.record({ orgId, actorId: user.userId, action: "growth.link.created", entityType: "ProviderReferralLink", entityId: link.id, meta: { code: link.code, ownerScope, channelKind, branchRef } }, tx);
          return link;
        });
      } catch (e) {
        if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e;
      }
    }
    if (!created) throw conflict(GROWTH_ERROR.LINK_INVALID, "Could not allocate a link code, try again");
    return (await this.toDtos(orgId, [created]))[0]!;
  }

  async update(user: AuthUser, id: string, body: UpdateLinkBody, opts: { allowRevoke?: boolean } = { allowRevoke: true }): Promise<LinkDto> {
    const existing = await this.loadLink(user, id, "update");
    await this.assertConnected(user.orgId);
    const data: Prisma.ProviderReferralLinkUpdateInput = {};
    const meta: Record<string, unknown> = {};
    if (body.label !== undefined) {
      const label = cleanText(String(body.label));
      if (label.length < 2 || label.length > 80) throw badRequest(GROWTH_ERROR.LINK_INVALID, "label must be 2 to 80 characters");
      data.label = label;
    }
    if (body.channelKind !== undefined) {
      if (!CHANNELS.has(body.channelKind)) throw badRequest(GROWTH_ERROR.LINK_INVALID, "Unknown channelKind");
      data.channelKind = body.channelKind as ReferralLinkChannelKind;
    }
    if (body.tags !== undefined) {
      const tags = sanitizeLinkTags(body.tags);
      if (!tags.ok) throw badRequest(GROWTH_ERROR.LINK_INVALID, `Invalid tag ${tags.key}`, { field: tags.key });
      data.tags = tags.tags ? (tags.tags as Prisma.InputJsonValue) : Prisma.DbNull;
    }
    let action = "growth.link.updated";
    let revoked = false;
    if (body.status !== undefined) {
      if (existing.status === "REVOKED") throw conflict(GROWTH_ERROR.LINK_REVOKED, "A revoked link cannot be changed");
      if (body.status === "REVOKED") {
        if (opts.allowRevoke === false) throw forbidden(GROWTH_ERROR.FORBIDDEN, "A link can only be revoked on the web");
        this.assert(user, "revoke");
        data.status = "REVOKED"; data.revokedAt = new Date(); data.revokedBy = user.userId; action = "growth.link.revoked"; revoked = true;
      } else if (body.status === "ACTIVE" || body.status === "PAUSED") {
        data.status = body.status as ReferralLinkStatus;
        action = body.status === "PAUSED" ? "growth.link.paused" : "growth.link.resumed";
      } else throw badRequest(GROWTH_ERROR.LINK_INVALID, "Unknown status");
      meta.status = body.status;
    }
    const row = await this.prisma.$transaction(async (tx) => {
      const r = await tx.providerReferralLink.update({ where: { id }, data });
      // a revoked code must stop deciding provider-led at Kiorex: always sent when connected (removal can only help the customer), never flag-gated
      if (revoked) await this.outbox.enqueue({ orgId: r.orgId, type: REFERRAL_LINK_REVOKED, aggregateType: "ProviderReferralLink", aggregateId: r.id, data: linkEventData(REFERRAL_LINK_REVOKED, r, "PROVIDER_REQUEST"), dedupeKey: `link:revoked:${r.id}` }, tx);
      await this.audit.record({ orgId: r.orgId, actorId: user.userId, action, entityType: "ProviderReferralLink", entityId: id, meta: { code: existing.code, ...meta } }, tx);
      return r;
    });
    return (await this.toDtos(row.orgId, [row]))[0]!;
  }

  // ---------------------------------------------------------------- QR and cards

  private qrTarget(link: ProviderReferralLink): string {
    if (link.status === "REVOKED") throw conflict(GROWTH_ERROR.LINK_REVOKED, "This link was revoked");
    return shortUrl(link.code);
  }

  async qrSvgFor(user: AuthUser, id: string): Promise<string> {
    const link = await this.loadLink(user, id, "view");
    await this.assertConnected(user.orgId);
    return qrSvg(this.qrTarget(link));
  }

  async qrPngFor(user: AuthUser, id: string, width?: number): Promise<Buffer> {
    const link = await this.loadLink(user, id, "view");
    await this.assertConnected(user.orgId);
    return qrPng(this.qrTarget(link), width);
  }

  async posterHtml(user: AuthUser, id: string, opts: { lang?: string; size?: string; kind?: string; print?: boolean }): Promise<string> {
    const link = await this.loadLink(user, id, "view");
    await this.assertConnected(user.orgId);
    const lang: PosterLang = opts.lang === "en" ? "en" : "ar";
    const size: PosterSize = opts.size === "A5" ? "A5" : "A4";
    const requested = String(opts.kind ?? "").toUpperCase();
    const kind: PosterKind = requested === "DESK" || (!requested && link.ownerScope === "DESK") ? "DESK" : "POSTER";
    const url = this.qrTarget(link);
    const [tenant, branch] = await Promise.all([
      this.prisma.tenant.findUniqueOrThrow({ where: { id: link.orgId }, select: { name: true } }),
      link.branchRef ? this.prisma.branch.findFirst({ where: { id: link.branchRef, orgId: link.orgId }, select: { name: true } }) : null,
    ]);
    const name = branch?.name ? `${tenant.name} · ${branch.name}` : tenant.name;
    return renderPosterHtml({ product: "PHARMACY", kind, lang, size, nameEn: name, nameAr: name, subtitleEn: link.ownerScope === "DESK" ? link.label : null, subtitleAr: link.ownerScope === "DESK" ? link.label : null, shortUrl: url, qrSvg: await qrSvg(url), autoPrint: opts.print === true });
  }

  // ---------------------------------------------------------------- summary (counts only)

  async summary(user: AuthUser, q: { days?: number } = {}) {
    this.assert(user, "view");
    await this.assertConnected(user.orgId);
    const days = Math.min(365, Math.max(1, Math.round(q.days ?? 30)));
    const since = utcDay(new Date(Date.now() - (days - 1) * 86_400_000));
    const links = await this.prisma.providerReferralLink.findMany({ where: this.scopeWhere(user), select: { id: true, code: true, label: true, status: true } });
    const ids = links.map((l) => l.id);
    const rows = ids.length ? await this.prisma.providerReferralLinkDaily.findMany({ where: { orgId: user.orgId, linkId: { in: ids }, date: { gte: since } }, orderBy: { date: "asc" } }) : [];
    const zero = (): LinkTotals => ({ visits: 0, orders: 0, completed: 0 });
    const byLink = new Map<string, LinkTotals>(); const byDay = new Map<string, LinkTotals>(); const totals = zero();
    for (const r of rows) {
      for (const [map, key] of [[byLink, r.linkId], [byDay, r.date.toISOString().slice(0, 10)]] as const) {
        const x = map.get(key) ?? zero(); x.visits += r.visits; x.orders += r.orders; x.completed += r.completed; map.set(key, x);
      }
      totals.visits += r.visits; totals.orders += r.orders; totals.completed += r.completed;
    }
    return {
      days, totals,
      byLink: links.map((l) => ({ linkId: l.id, code: l.code, label: l.label, status: l.status, ...(byLink.get(l.id) ?? zero()) })),
      trend: [...byDay.entries()].map(([date, v]) => ({ date, ...v })),
      note: "Counts only. No visitor, customer or device identifiers are stored.",
    };
  }

  // ---------------------------------------------------------------- public side (no auth)

  async findByCode(rawCode: unknown): Promise<ProviderReferralLink | null> {
    const code = normalizeLinkCode(rawCode);
    return code ? this.prisma.providerReferralLink.findUnique({ where: { code } }) : null;
  }

  /**
   * Public short link visit: counts one non-bot visit and returns the signed `lt`, only for an ACTIVE link of a connected organisation. Anything else
   * returns null (the caller still sends the visitor to the plain Kiorex page, no attribution, no error and no signal).
   */
  async touch(rawCode: unknown, opts: { bot: boolean; now?: Date }): Promise<{ link: ProviderReferralLink; lt: string | null } | null> {
    const link = await this.findByCode(rawCode);
    if (!link || link.status !== "ACTIVE" || !(await isKiorexConnected(this.prisma, link.orgId))) return null;
    if (!opts.bot) await bumpLinkCounter(this.prisma, link, "visits", opts.now);
    return { link, lt: signLinkTouch({ orgId: link.orgId, code: link.code, now: opts.now }) };
  }

  // ---------------------------------------------------------------- signed lookup for Kiorex (client key binds ONE organisation)

  async lookupRecord(orgId: string, rawCode: unknown): Promise<ReferralLinkRecord | null> {
    const code = normalizeLinkCode(rawCode);
    if (!code) return null;
    const link = await this.prisma.providerReferralLink.findFirst({ where: { code, orgId } });
    return link ? toReferralLinkRecord(link) : null;
  }

  async listRecords(orgId: string, opts: { updatedSince?: Date; limit?: number; cursor?: string }): Promise<{ items: ReferralLinkRecord[]; nextCursor: string | null }> {
    const limit = Math.min(Math.max(Math.floor(opts.limit ?? 200), 1), 500);
    let after: { at: Date; id: string } | null = null;
    if (opts.cursor) {
      const [ms, id] = Buffer.from(opts.cursor, "base64url").toString("utf8").split("|");
      if (ms && id && Number.isFinite(Number(ms))) after = { at: new Date(Number(ms)), id };
    }
    const where: Prisma.ProviderReferralLinkWhereInput = { orgId };
    if (after) where.OR = [{ updatedAt: { gt: after.at } }, { updatedAt: after.at, id: { gt: after.id } }];
    else if (opts.updatedSince) where.updatedAt = { gte: opts.updatedSince };
    const rows = await this.prisma.providerReferralLink.findMany({ where, orderBy: [{ updatedAt: "asc" }, { id: "asc" }], take: limit + 1 });
    const page = rows.slice(0, limit);
    const last = page[page.length - 1];
    return { items: page.map(toReferralLinkRecord), nextCursor: rows.length > limit && last ? Buffer.from(`${last.updatedAt.getTime()}|${last.id}`).toString("base64url") : null };
  }
}
