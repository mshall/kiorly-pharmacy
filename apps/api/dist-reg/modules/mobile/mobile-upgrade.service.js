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
exports.MobileUpgradeService = exports.OPEN_REQUESTS_MAX = exports.isKnownFeature = exports.GENERAL_FEATURE = exports.UPGRADE_NOTE_MAX = exports.UPGRADE_DEDUPE_MS = void 0;
exports.findDuplicate = findDuplicate;
exports.cleanNote = cleanNote;
exports.shapeOpenRequests = shapeOpenRequests;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../../audit/audit.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const mobile_entitlement_service_1 = require("./mobile-entitlement.service");
const mobile_plan_1 = require("./mobile-plan");
const push_service_1 = require("./push.service");
exports.UPGRADE_DEDUPE_MS = 24 * 3_600_000;
exports.UPGRADE_NOTE_MAX = 500;
exports.GENERAL_FEATURE = "general";
const isKnownFeature = (k) => k === exports.GENERAL_FEATURE || mobile_plan_1.MODULE_DEFS.some((m) => m.key === k);
exports.isKnownFeature = isKnownFeature;
function findDuplicate(rows, now, windowMs = exports.UPGRADE_DEDUPE_MS) {
    const live = rows.filter((r) => now - r.createdAt.getTime() < windowMs);
    return live.length ? live.reduce((a, b) => (a.createdAt <= b.createdAt ? a : b)) : null;
}
function cleanNote(v) {
    if (v === undefined || v === null || v === "")
        return null;
    if (typeof v !== "string")
        throw new common_1.BadRequestException("note must be text");
    const t = v.trim();
    return t ? t.slice(0, exports.UPGRADE_NOTE_MAX) : null;
}
exports.OPEN_REQUESTS_MAX = 10;
function shapeOpenRequests(rows, names) {
    return rows.slice(0, exports.OPEN_REQUESTS_MAX).map((r) => ({ id: r.id, featureKey: r.featureKey, requesterRole: r.role, requesterName: names.get(r.who) ?? r.role, requestedAt: r.createdAt.toISOString(), ...(r.note ? { note: r.note } : {}) }));
}
let MobileUpgradeService = class MobileUpgradeService {
    prisma;
    audit;
    ent;
    push;
    constructor(prisma, audit, ent, push) {
        this.prisma = prisma;
        this.audit = audit;
        this.ent = ent;
        this.push = push;
    }
    async request(u, body) {
        const featureKey = typeof body?.featureKey === "string" && body.featureKey ? body.featureKey : exports.GENERAL_FEATURE;
        if (!(0, exports.isKnownFeature)(featureKey))
            throw new common_1.BadRequestException("unknown featureKey");
        const note = cleanNote(body?.note);
        const e = await this.ent.evaluate(u.orgId);
        if (e.enabled)
            return { id: "", status: "ALREADY_ENTITLED", featureKey, requestedAt: null, deduped: true, notified: 0 };
        const recent = await this.prisma.mobileUpgradeRequest.findMany({ where: { orgId: u.orgId, userId: u.userId, featureKey, createdAt: { gt: new Date(Date.now() - exports.UPGRADE_DEDUPE_MS) } }, orderBy: { createdAt: "asc" } });
        const dup = findDuplicate(recent, Date.now());
        if (dup)
            return { id: dup.id, status: "REQUESTED", featureKey, requestedAt: dup.createdAt.toISOString(), deduped: true, notified: 0 };
        const row = await this.prisma.mobileUpgradeRequest.create({ data: { orgId: u.orgId, userId: u.userId, role: u.role, featureKey, plan: e.rawPlan, note } });
        const owners = await this.prisma.staffUser.findMany({ where: { orgId: u.orgId, role: "OWNER", active: true, id: { not: u.userId } }, select: { id: true } });
        const { delivered } = owners.length
            ? await this.push.send({ orgId: u.orgId, ...(0, push_service_1.renderPush)("upgrade.request"), userIds: owners.map((o) => o.id), data: { template: "upgrade.request", requestId: row.id, featureKey, role: u.role }, allowUnentitled: true })
            : { delivered: 0 };
        if (delivered)
            await this.prisma.mobileUpgradeRequest.update({ where: { id: row.id }, data: { notifiedCount: delivered } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.upgrade_requested", entityType: "MobileUpgradeRequest", entityId: row.id, meta: { featureKey, role: u.role, plan: e.rawPlan, notified: delivered } });
        return { id: row.id, status: "REQUESTED", featureKey, requestedAt: row.createdAt.toISOString(), deduped: false, notified: delivered };
    }
    async bootstrapBlock(u, lockedModules) {
        const isAdmin = u.role === "OWNER";
        const mine = await this.prisma.mobileUpgradeRequest.findFirst({ where: { orgId: u.orgId, userId: u.userId, createdAt: { gt: new Date(Date.now() - exports.UPGRADE_DEDUPE_MS) } }, orderBy: { createdAt: "desc" } });
        const open = isAdmin ? await this.prisma.mobileUpgradeRequest.count({ where: { orgId: u.orgId, status: "OPEN", userId: { not: u.userId } } }) : null;
        const openItems = isAdmin ? await this.openItems(u.orgId, u.userId) : [];
        return { lockedModules, myRequest: mine ? { featureKey: mine.featureKey, requestedAt: mine.createdAt.toISOString() } : null, openRequests: open, openRequestItems: openItems, canApprove: isAdmin };
    }
    async openItems(orgId, self) {
        const rows = await this.prisma.mobileUpgradeRequest.findMany({ where: { orgId, status: "OPEN", userId: { not: self } }, orderBy: { createdAt: "desc" }, take: exports.OPEN_REQUESTS_MAX });
        if (!rows.length)
            return [];
        const ids = [...new Set(rows.map((r) => r.userId))];
        const people = await this.prisma.staffUser.findMany({ where: { id: { in: ids } }, select: { id: true, displayName: true } });
        return shapeOpenRequests(rows.map((r) => ({ id: r.id, featureKey: r.featureKey, role: r.role, note: r.note, createdAt: r.createdAt, who: r.userId })), new Map(people.map((p) => [p.id, p.displayName])));
    }
};
exports.MobileUpgradeService = MobileUpgradeService;
exports.MobileUpgradeService = MobileUpgradeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(2, (0, common_1.Inject)(mobile_entitlement_service_1.MobileEntitlementService)),
    __param(3, (0, common_1.Inject)(push_service_1.PushService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        mobile_entitlement_service_1.MobileEntitlementService,
        push_service_1.PushService])
], MobileUpgradeService);
//# sourceMappingURL=mobile-upgrade.service.js.map