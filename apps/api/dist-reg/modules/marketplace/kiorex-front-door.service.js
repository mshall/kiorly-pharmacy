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
exports.KiorexFrontDoorService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../../audit/audit.service");
const errors_1 = require("../../common/errors");
const prisma_service_1 = require("../../prisma/prisma.service");
const kiorex_connect_core_1 = require("./kiorex-connect.core");
const kiorex_connect_service_1 = require("./kiorex-connect.service");
const kiorex_front_door_core_1 = require("./kiorex-front-door.core");
const KEY = "kiorexFrontDoor";
const deliveryFee = (settings) => { const n = Number(settings?.kiorexDeliveryFeeMinor); return Number.isFinite(n) && n > 0 ? Math.round(n) : null; };
const monthStart = () => { const d = new Date(); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)); };
let KiorexFrontDoorService = class KiorexFrontDoorService {
    prisma;
    audit;
    connect;
    log = new common_1.Logger("kiorex-front-door");
    constructor(prisma, audit, connect) {
        this.prisma = prisma;
        this.audit = audit;
        this.connect = connect;
    }
    async tenant(orgId) { return this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }); }
    flags(settings) { return settings?.[KEY] ?? {}; }
    async setFlags(orgId, patch) {
        const t = await this.tenant(orgId);
        await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: { ...(t.settings ?? {}), [KEY]: { ...this.flags(t.settings), ...patch } } } });
    }
    async get(orgId) {
        const c = await this.connect.get(orgId);
        const t = await this.tenant(orgId);
        const f = this.flags(t.settings);
        const state = (0, kiorex_front_door_core_1.frontDoorState)({ legacy: c.legacy, status: c.status, started: !!f.startedAt || !!c.terms });
        let month = null;
        let recent = [];
        let branches = [];
        if (state === "LIVE" || state === "ATTENTION") {
            const rows = await this.prisma.kiorexOrder.findMany({ where: { orgId, createdAt: { gte: monthStart() } }, select: { status: true, orderValue: true } });
            month = { orders: rows.length, completed: rows.filter((r) => r.status === "DISPENSED").length, rejected: rows.filter((r) => r.status === "REJECTED").length, value: Math.round(rows.filter((r) => r.status === "DISPENSED").reduce((s, r) => s + Number(r.orderValue.toString()), 0) * 100) / 100 };
            const bs = await this.prisma.branch.findMany({ where: { orgId, active: true }, select: { id: true, name: true } });
            const bname = new Map(bs.map((b) => [b.id, b.name]));
            const last = await this.prisma.kiorexOrder.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 8, select: { id: true, createdAt: true, status: true, branchId: true, deliveryMethod: true, orderValue: true } });
            recent = last.map((o) => ({ id: o.id, createdAt: o.createdAt, status: o.status, branch: bname.get(o.branchId) ?? "", delivery: o.deliveryMethod, value: Number(o.orderValue.toString()) }));
            const opted = new Set((await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true }, select: { branchId: true } })).map((x) => x.branchId));
            branches = bs.map((b) => ({ id: b.id, name: b.name, optedIn: opted.has(b.id) }));
        }
        return { state, listing: { paused: !!(0, kiorex_front_door_core_1.listingPause)(t.settings), pausedAt: (0, kiorex_front_door_core_1.listingPause)(t.settings)?.pausedAt ?? null, reason: (0, kiorex_front_door_core_1.listingPause)(t.settings)?.reason ?? null }, status: c.status, legacy: c.legacy, started: !!f.startedAt || !!c.terms, interestedAt: f.interestAt ?? null, leadAt: f.leadAt ?? null, currency: (t.settings?.currency) ?? null, deliveryFeeMinor: deliveryFee(t.settings), month, recent, branches, connect: c };
    }
    async pauseListing(u, reason) {
        const st = await this.get(u.orgId);
        if (st.state !== "LIVE")
            throw (0, errors_1.conflict)("NOT_LIVE", "Only a live Kiorex listing can be paused");
        if (st.listing.paused)
            return st;
        const t = await this.tenant(u.orgId);
        const why = (0, kiorex_front_door_core_1.cleanPauseReason)(reason);
        await this.prisma.tenant.update({ where: { id: u.orgId }, data: { settings: { ...(t.settings ?? {}), [kiorex_front_door_core_1.LISTING_KEY]: { paused: true, pausedAt: new Date().toISOString(), by: u.userId, ...(why ? { reason: why } : {}) } } } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_listing.paused", entityType: "Tenant", entityId: u.orgId, meta: { reason: why ?? null } });
        return this.get(u.orgId);
    }
    async resumeListing(u) {
        const t = await this.tenant(u.orgId);
        if (!(0, kiorex_front_door_core_1.listingPause)(t.settings))
            return this.get(u.orgId);
        await this.prisma.tenant.update({ where: { id: u.orgId }, data: { settings: { ...(t.settings ?? {}), [kiorex_front_door_core_1.LISTING_KEY]: { paused: false, resumedAt: new Date().toISOString(), by: u.userId } } } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_listing.resumed", entityType: "Tenant", entityId: u.orgId });
        return this.get(u.orgId);
    }
    async interest(orgId) {
        const c = await this.connect.get(orgId, { pull: false });
        const t = await this.tenant(orgId);
        const f = this.flags(t.settings);
        if (c.legacy || c.status !== "STANDALONE" || f.interestAt)
            return { sent: false };
        const ok = await this.sendFunnel(orgId, t.marketCode, "INTERESTED");
        if (ok)
            await this.setFlags(orgId, { interestAt: new Date().toISOString() });
        return { sent: ok };
    }
    async start(u) {
        const c = await this.connect.get(u.orgId, { pull: false });
        if (c.legacy)
            throw (0, errors_1.conflict)("ALREADY_CONNECTED", "This pharmacy is already connected");
        const t = await this.tenant(u.orgId);
        if (c.status === "STANDALONE" && !this.flags(t.settings).startedAt) {
            await this.setFlags(u.orgId, { startedAt: new Date().toISOString() });
            await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.started", entityType: "Tenant", entityId: u.orgId });
            void this.sendFunnel(u.orgId, t.marketCode, "STARTED");
        }
        return this.get(u.orgId);
    }
    async talk(u, input) {
        const c = await this.connect.get(u.orgId, { pull: false });
        if (c.legacy)
            throw (0, errors_1.conflict)("ALREADY_CONNECTED", "This pharmacy is already connected");
        let clean;
        try {
            clean = (0, kiorex_front_door_core_1.cleanTalkToUs)(input ?? {});
        }
        catch (e) {
            if (e instanceof kiorex_front_door_core_1.LeadInputError)
                throw (0, errors_1.badRequest)(e.code, "Check the form", { field: e.field });
            throw e;
        }
        const secret = (0, kiorex_front_door_core_1.leadSigningSecret)();
        const t = await this.tenant(u.orgId);
        if (!secret)
            throw (0, errors_1.conflict)("KIOREX_NOT_CONFIGURED", "Kiorex connection is not configured for this deployment");
        const body = JSON.stringify({ nonce: (0, kiorex_front_door_core_1.newLeadNonce)(), kind: "PHARMACY", orgRef: u.orgId, orgName: t.name, ...clean, locale: "en", market: t.marketCode, consent: true });
        let res;
        try {
            res = await fetch(`${(0, kiorex_connect_core_1.kiorexHost)()}/api/v1/partners/v1/leads`, { method: "POST", headers: (0, kiorex_front_door_core_1.leadHeaders)(secret, Math.floor(Date.now() / 1000), body), body, signal: AbortSignal.timeout(8000) });
        }
        catch {
            throw (0, errors_1.conflict)("KIOREX_UNREACHABLE", "Kiorex could not be reached. Nothing was sent. Try again.");
        }
        if (!res.ok)
            throw (0, errors_1.conflict)(res.status === 429 ? "KIOREX_BUSY" : "KIOREX_REJECTED_REQUEST", "Kiorex did not accept the request", { status: res.status });
        await this.setFlags(u.orgId, { leadAt: new Date().toISOString(), interestAt: this.flags(t.settings).interestAt ?? new Date().toISOString() });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.talk_to_us", entityType: "Tenant", entityId: u.orgId });
        return this.get(u.orgId);
    }
    async sendFunnel(orgId, _market, stage) {
        const secret = (0, kiorex_front_door_core_1.leadSigningSecret)();
        if (!secret)
            return false;
        const body = JSON.stringify({ nonce: (0, kiorex_front_door_core_1.newLeadNonce)(), kind: "PHARMACY", orgRef: orgId, stage });
        try {
            const r = await fetch(`${(0, kiorex_connect_core_1.kiorexHost)()}/api/v1/partners/v1/funnel`, { method: "POST", headers: (0, kiorex_front_door_core_1.leadHeaders)(secret, Math.floor(Date.now() / 1000), body), body, signal: AbortSignal.timeout(4000) });
            return r.ok;
        }
        catch (e) {
            this.log.warn(`funnel marker not sent (${e.name})`);
            return false;
        }
    }
};
exports.KiorexFrontDoorService = KiorexFrontDoorService;
exports.KiorexFrontDoorService = KiorexFrontDoorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(2, (0, common_1.Inject)(kiorex_connect_service_1.KiorexConnectService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService, kiorex_connect_service_1.KiorexConnectService])
], KiorexFrontDoorService);
//# sourceMappingURL=kiorex-front-door.service.js.map