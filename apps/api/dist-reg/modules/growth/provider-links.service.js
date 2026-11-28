"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderLinksService = exports.GROWTH_ERROR = exports.GROWTH_FLAG = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const audit_service_1 = require("../../audit/audit.service");
const errors_1 = require("../../common/errors");
const feature_flags_service_1 = require("../../feature-flags/feature-flags.service");
const outbox_service_1 = require("../../outbox/outbox.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const growth_access_1 = require("./growth-access");
const growth_plan_limits_1 = require("./growth-plan-limits");
const link_code_1 = require("./link-code");
const link_counters_1 = require("./link-counters");
const kiorex_connection_1 = require("./kiorex-connection");
const link_tags_1 = require("./link-tags");
const link_registry_1 = require("./link-registry");
const link_touch_1 = require("./link-touch");
const link_urls_1 = require("./link-urls");
const poster_html_1 = require("./poster-html");
const qr_svg_1 = require("./qr-svg");
exports.GROWTH_FLAG = "growth.provider_links";
exports.GROWTH_ERROR = {
    LINK_INVALID: "GROWTH_LINK_INVALID",
    LINK_LIMIT: "GROWTH_LINK_LIMIT_REACHED",
    LINK_REVOKED: "GROWTH_LINK_REVOKED",
    FORBIDDEN: "GROWTH_FORBIDDEN",
    SCOPE_FORBIDDEN: "GROWTH_SCOPE_FORBIDDEN",
    NOT_CONNECTED: "KIOREX_NOT_CONNECTED",
};
const SCOPES = new Set(["ORG", "BRANCH", "DESK"]);
const CHANNELS = new Set(["WEB_LINK", "QR_POSTER", "QR_DESK", "SOCIAL", "SMS", "WHATSAPP_SHARE", "EMAIL_SIG", "GOOGLE_PROFILE"]);
const cleanText = (s) => s.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim();
let ProviderLinksService = class ProviderLinksService {
    prisma;
    audit;
    outbox;
    flags;
    constructor(prisma, audit, outbox, flags) {
        this.prisma = prisma;
        this.audit = audit;
        this.outbox = outbox;
        this.flags = flags;
    }
    assert(user, action) {
        if (!(0, growth_access_1.canGrowth)(user.role, action))
            throw (0, errors_1.forbidden)(exports.GROWTH_ERROR.FORBIDDEN, "Your role cannot do this in Growth");
        return user.orgId;
    }
    async assertConnected(orgId) {
        if (!(await (0, kiorex_connection_1.isKiorexConnected)(this.prisma, orgId)))
            throw (0, errors_1.forbidden)(exports.GROWTH_ERROR.NOT_CONNECTED, "Connect this pharmacy to Kiorex to use Growth links");
    }
    scopeWhere(user) {
        const where = { orgId: user.orgId };
        if (user.branchId)
            where.OR = [{ ownerScope: "ORG" }, { branchRef: user.branchId }];
        return where;
    }
    async loadLink(user, id, action) {
        this.assert(user, action);
        const row = await this.prisma.providerReferralLink.findFirst({ where: { AND: [{ id }, this.scopeWhere(user)] } });
        if (!row)
            throw (0, errors_1.notFound)("Link", id);
        if (action !== "view" && user.branchId && row.ownerScope === "ORG")
            throw (0, errors_1.forbidden)(exports.GROWTH_ERROR.SCOPE_FORBIDDEN, "Only head office can change organisation-wide links");
        return row;
    }
    async access(user) {
        const orgId = user.orgId;
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { edition: true } });
        const limits = (0, growth_plan_limits_1.growthLimitsFor)(t.edition);
        const used = await this.prisma.providerReferralLink.count({ where: { orgId, status: { not: "REVOKED" } } });
        return {
            level: (0, growth_access_1.growthLevel)(user.role),
            connected: await (0, kiorex_connection_1.isKiorexConnected)(this.prisma, orgId),
            branchScoped: Boolean(user.branchId),
            can: { view: (0, growth_access_1.canGrowth)(user.role, "view"), create: (0, growth_access_1.canGrowth)(user.role, "create"), update: (0, growth_access_1.canGrowth)(user.role, "update"), revoke: (0, growth_access_1.canGrowth)(user.role, "revoke") },
            plan: { key: t.edition, ...limits, linksUsed: used },
        };
    }
    async list(user, q = {}) {
        this.assert(user, "view");
        await this.assertConnected(user.orgId);
        const where = this.scopeWhere(user);
        if (q.status && ["ACTIVE", "PAUSED", "REVOKED"].includes(q.status))
            where.status = q.status;
        const rows = await this.prisma.providerReferralLink.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 });
        return { items: await this.toDtos(user.orgId, rows) };
    }
    async toDtos(orgId, rows) {
        if (!rows.length)
            return [];
        const since = (0, link_counters_1.utcDay)(new Date(Date.now() - 29 * 86_400_000));
        const [sums, branches] = await Promise.all([
            this.prisma.providerReferralLinkDaily.groupBy({ by: ["linkId"], where: { orgId, linkId: { in: rows.map((r) => r.id) }, date: { gte: since } }, _sum: { visits: true, orders: true, completed: true } }),
            this.prisma.branch.findMany({ where: { orgId, id: { in: [...new Set(rows.map((r) => r.branchRef).filter((x) => Boolean(x)))] } }, select: { id: true, name: true } }),
        ]);
        const sumBy = new Map(sums.map((s) => [s.linkId, s._sum]));
        const branchBy = new Map(branches.map((b) => [b.id, b.name]));
        return rows.map((r) => {
            const s = sumBy.get(r.id);
            return {
                id: r.id, code: r.code, label: r.label, ownerScope: r.ownerScope, channelKind: r.channelKind, status: r.status,
                branchId: r.branchRef, branchName: r.branchRef ? branchBy.get(r.branchRef) ?? null : null,
                tags: (0, link_tags_1.effectiveTags)(r.channelKind, r.tags), shortUrl: (0, link_urls_1.shortUrl)(r.code),
                createdAt: r.createdAt.toISOString(), revokedAt: r.revokedAt?.toISOString() ?? null,
                last30: { visits: s?.visits ?? 0, orders: s?.orders ?? 0, completed: s?.completed ?? 0 },
            };
        });
    }
    async create(user, body) {
        const orgId = this.assert(user, "create");
        await this.assertConnected(orgId);
        const label = cleanText(String(body.label ?? ""));
        if (label.length < 2 || label.length > 80)
            throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "label must be 2 to 80 characters");
        const ownerScope = String(body.ownerScope ?? "ORG");
        if (!SCOPES.has(ownerScope))
            throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "Unknown ownerScope");
        const channelKind = String(body.channelKind ?? (ownerScope === "DESK" ? "QR_DESK" : "WEB_LINK"));
        if (!CHANNELS.has(channelKind))
            throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "Unknown channelKind");
        const tags = (0, link_tags_1.sanitizeLinkTags)(body.tags);
        if (!tags.ok)
            throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, `Invalid tag ${tags.key}`, { field: tags.key });
        let branchRef = null;
        if (ownerScope === "ORG") {
            if (user.branchId)
                throw (0, errors_1.forbidden)(exports.GROWTH_ERROR.SCOPE_FORBIDDEN, "Only head office can create organisation-wide links");
        }
        else {
            const wanted = body.branchId ?? user.branchId ?? undefined;
            if (!wanted)
                throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "branchId is required for a branch or counter link");
            if (user.branchId && wanted !== user.branchId)
                throw (0, errors_1.forbidden)(exports.GROWTH_ERROR.SCOPE_FORBIDDEN, "You can only create links for your own branch");
            const branch = await this.prisma.branch.findFirst({ where: { id: wanted, orgId, active: true }, select: { id: true } });
            if (!branch)
                throw (0, errors_1.notFound)("Branch");
            branchRef = branch.id;
        }
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { edition: true, marketCode: true } });
        const limits = (0, growth_plan_limits_1.growthLimitsFor)(t.edition);
        const used = await this.prisma.providerReferralLink.count({ where: { orgId, status: { not: "REVOKED" } } });
        if (used >= limits.maxActiveLinks)
            throw (0, errors_1.conflict)(exports.GROWTH_ERROR.LINK_LIMIT, "Your plan's link limit is reached. Revoke a link you no longer use or upgrade.", { limit: limits.maxActiveLinks, plan: t.edition });
        const emit = this.flags.isEnabled(exports.GROWTH_FLAG, { orgId, market: t.marketCode });
        let created = null;
        for (let attempt = 0; attempt < 8 && !created; attempt += 1) {
            try {
                created = await this.prisma.$transaction(async (tx) => {
                    const link = await tx.providerReferralLink.create({
                        data: { orgId, branchRef, ownerScope: ownerScope, channelKind: channelKind, code: (0, link_code_1.generateLinkCode)(), label, tags: (tags.tags ?? undefined), createdBy: user.userId },
                    });
                    if (emit)
                        await this.outbox.enqueue({ orgId, type: link_registry_1.REFERRAL_LINK_CREATED, aggregateType: "ProviderReferralLink", aggregateId: link.id, data: (0, link_registry_1.linkEventData)(link_registry_1.REFERRAL_LINK_CREATED, link), dedupeKey: `link:created:${link.id}` }, tx);
                    await this.audit.record({ orgId, actorId: user.userId, action: "growth.link.created", entityType: "ProviderReferralLink", entityId: link.id, meta: { code: link.code, ownerScope, channelKind, branchRef } }, tx);
                    return link;
                });
            }
            catch (e) {
                if (!(e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002"))
                    throw e;
            }
        }
        if (!created)
            throw (0, errors_1.conflict)(exports.GROWTH_ERROR.LINK_INVALID, "Could not allocate a link code, try again");
        return (await this.toDtos(orgId, [created]))[0];
    }
    async update(user, id, body, opts = { allowRevoke: true }) {
        const existing = await this.loadLink(user, id, "update");
        await this.assertConnected(user.orgId);
        const data = {};
        const meta = {};
        if (body.label !== undefined) {
            const label = cleanText(String(body.label));
            if (label.length < 2 || label.length > 80)
                throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "label must be 2 to 80 characters");
            data.label = label;
        }
        if (body.channelKind !== undefined) {
            if (!CHANNELS.has(body.channelKind))
                throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "Unknown channelKind");
            data.channelKind = body.channelKind;
        }
        if (body.tags !== undefined) {
            const tags = (0, link_tags_1.sanitizeLinkTags)(body.tags);
            if (!tags.ok)
                throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, `Invalid tag ${tags.key}`, { field: tags.key });
            data.tags = tags.tags ? tags.tags : client_1.Prisma.DbNull;
        }
        let action = "growth.link.updated";
        let revoked = false;
        if (body.status !== undefined) {
            if (existing.status === "REVOKED")
                throw (0, errors_1.conflict)(exports.GROWTH_ERROR.LINK_REVOKED, "A revoked link cannot be changed");
            if (body.status === "REVOKED") {
                if (opts.allowRevoke === false)
                    throw (0, errors_1.forbidden)(exports.GROWTH_ERROR.FORBIDDEN, "A link can only be revoked on the web");
                this.assert(user, "revoke");
                data.status = "REVOKED";
                data.revokedAt = new Date();
                data.revokedBy = user.userId;
                action = "growth.link.revoked";
                revoked = true;
            }
            else if (body.status === "ACTIVE" || body.status === "PAUSED") {
                data.status = body.status;
                action = body.status === "PAUSED" ? "growth.link.paused" : "growth.link.resumed";
            }
            else
                throw (0, errors_1.badRequest)(exports.GROWTH_ERROR.LINK_INVALID, "Unknown status");
            meta.status = body.status;
        }
        const row = await this.prisma.$transaction(async (tx) => {
            const r = await tx.providerReferralLink.update({ where: { id }, data });
            if (revoked)
                await this.outbox.enqueue({ orgId: r.orgId, type: link_registry_1.REFERRAL_LINK_REVOKED, aggregateType: "ProviderReferralLink", aggregateId: r.id, data: (0, link_registry_1.linkEventData)(link_registry_1.REFERRAL_LINK_REVOKED, r, "PROVIDER_REQUEST"), dedupeKey: `link:revoked:${r.id}` }, tx);
            await this.audit.record({ orgId: r.orgId, actorId: user.userId, action, entityType: "ProviderReferralLink", entityId: id, meta: { code: existing.code, ...meta } }, tx);
            return r;
        });
        return (await this.toDtos(row.orgId, [row]))[0];
    }
    qrTarget(link) {
        if (link.status === "REVOKED")
            throw (0, errors_1.conflict)(exports.GROWTH_ERROR.LINK_REVOKED, "This link was revoked");
        return (0, link_urls_1.shortUrl)(link.code);
    }
    async qrSvgFor(user, id) {
        const link = await this.loadLink(user, id, "view");
        await this.assertConnected(user.orgId);
        return (0, qr_svg_1.qrSvg)(this.qrTarget(link));
    }
    async qrPayloadFor(user, id) {
        const link = await this.loadLink(user, id, "view");
        await this.assertConnected(user.orgId);
        const url = this.qrTarget(link);
        return { url, svg: await (0, qr_svg_1.qrSvg)(url), linkId: link.id };
    }
    async qrPngFor(user, id, width) {
        const link = await this.loadLink(user, id, "view");
        await this.assertConnected(user.orgId);
        return (0, qr_svg_1.qrPng)(this.qrTarget(link), width);
    }
    async posterHtml(user, id, opts) {
        const link = await this.loadLink(user, id, "view");
        await this.assertConnected(user.orgId);
        const lang = opts.lang === "en" ? "en" : "ar";
        const size = opts.size === "A5" ? "A5" : "A4";
        const requested = String(opts.kind ?? "").toUpperCase();
        const kind = requested === "DESK" || (!requested && link.ownerScope === "DESK") ? "DESK" : "POSTER";
        const url = this.qrTarget(link);
        const [tenant, branch] = await Promise.all([
            this.prisma.tenant.findUniqueOrThrow({ where: { id: link.orgId }, select: { name: true } }),
            link.branchRef ? this.prisma.branch.findFirst({ where: { id: link.branchRef, orgId: link.orgId }, select: { name: true } }) : null,
        ]);
        const name = branch?.name ? `${tenant.name} · ${branch.name}` : tenant.name;
        return (0, poster_html_1.renderPosterHtml)({ product: "PHARMACY", kind, lang, size, nameEn: name, nameAr: name, subtitleEn: link.ownerScope === "DESK" ? link.label : null, subtitleAr: link.ownerScope === "DESK" ? link.label : null, shortUrl: url, qrSvg: await (0, qr_svg_1.qrSvg)(url), autoPrint: opts.print === true });
    }
    async summary(user, q = {}) {
        this.assert(user, "view");
        await this.assertConnected(user.orgId);
        const days = Math.min(365, Math.max(1, Math.round(q.days ?? 30)));
        const since = (0, link_counters_1.utcDay)(new Date(Date.now() - (days - 1) * 86_400_000));
        const links = await this.prisma.providerReferralLink.findMany({ where: this.scopeWhere(user), select: { id: true, code: true, label: true, status: true } });
        const ids = links.map((l) => l.id);
        const rows = ids.length ? await this.prisma.providerReferralLinkDaily.findMany({ where: { orgId: user.orgId, linkId: { in: ids }, date: { gte: since } }, orderBy: { date: "asc" } }) : [];
        const zero = () => ({ visits: 0, orders: 0, completed: 0 });
        const byLink = new Map();
        const byDay = new Map();
        const totals = zero();
        for (const r of rows) {
            for (const [map, key] of [[byLink, r.linkId], [byDay, r.date.toISOString().slice(0, 10)]]) {
                const x = map.get(key) ?? zero();
                x.visits += r.visits;
                x.orders += r.orders;
                x.completed += r.completed;
                map.set(key, x);
            }
            totals.visits += r.visits;
            totals.orders += r.orders;
            totals.completed += r.completed;
        }
        return {
            days, totals,
            byLink: links.map((l) => ({ linkId: l.id, code: l.code, label: l.label, status: l.status, ...(byLink.get(l.id) ?? zero()) })),
            trend: [...byDay.entries()].map(([date, v]) => ({ date, ...v })),
            note: "Counts only. No visitor, customer or device identifiers are stored.",
        };
    }
    async findByCode(rawCode) {
        const code = (0, link_code_1.normalizeLinkCode)(rawCode);
        return code ? this.prisma.providerReferralLink.findUnique({ where: { code } }) : null;
    }
    async touch(rawCode, opts) {
        const link = await this.findByCode(rawCode);
        if (!link || link.status !== "ACTIVE" || !(await (0, kiorex_connection_1.isKiorexConnected)(this.prisma, link.orgId)))
            return null;
        if (!opts.bot)
            await (0, link_counters_1.bumpLinkCounter)(this.prisma, link, "visits", opts.now);
        return { link, lt: (0, link_touch_1.signLinkTouch)({ orgId: link.orgId, code: link.code, now: opts.now }) };
    }
    async lookupRecord(orgId, rawCode) {
        const code = (0, link_code_1.normalizeLinkCode)(rawCode);
        if (!code)
            return null;
        const link = await this.prisma.providerReferralLink.findFirst({ where: { code, orgId } });
        return link ? (0, link_registry_1.toReferralLinkRecord)(link) : null;
    }
    async listRecords(orgId, opts) {
        const limit = Math.min(Math.max(Math.floor(opts.limit ?? 200), 1), 500);
        let after = null;
        if (opts.cursor) {
            const [ms, id] = Buffer.from(opts.cursor, "base64url").toString("utf8").split("|");
            if (ms && id && Number.isFinite(Number(ms)))
                after = { at: new Date(Number(ms)), id };
        }
        const where = { orgId };
        if (after)
            where.OR = [{ updatedAt: { gt: after.at } }, { updatedAt: after.at, id: { gt: after.id } }];
        else if (opts.updatedSince)
            where.updatedAt = { gte: opts.updatedSince };
        const rows = await this.prisma.providerReferralLink.findMany({ where, orderBy: [{ updatedAt: "asc" }, { id: "asc" }], take: limit + 1 });
        const page = rows.slice(0, limit);
        const last = page[page.length - 1];
        return { items: page.map(link_registry_1.toReferralLinkRecord), nextCursor: rows.length > limit && last ? Buffer.from(`${last.updatedAt.getTime()}|${last.id}`).toString("base64url") : null };
    }
};
exports.ProviderLinksService = ProviderLinksService;
exports.ProviderLinksService = ProviderLinksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(2, (0, common_1.Inject)(outbox_service_1.OutboxService)),
    __param(3, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        outbox_service_1.OutboxService,
        feature_flags_service_1.FeatureFlagsService])
], ProviderLinksService);
//# sourceMappingURL=provider-links.service.js.map