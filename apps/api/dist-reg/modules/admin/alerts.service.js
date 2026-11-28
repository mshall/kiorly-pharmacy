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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const dates_1 = require("../../common/dates");
const DAY = 86_400_000;
let AlertsService = class AlertsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async candidates(orgId) {
        const today = (0, dates_1.marketToday)(), day = today.toISOString().slice(0, 10), out = [];
        const [low, near, expired, refills, rxWait, disc, claims, conflicts, cold, pos, shifts, recalls, credit] = await Promise.all([
            this.prisma.$queryRaw `SELECT COUNT(*) AS n FROM "ReorderPolicy" p WHERE p."orgId" = ${orgId} AND COALESCE((SELECT SUM(l."qtyOnHand" - l."qtyReserved") FROM "StockLot" l WHERE l."branchId" = p."branchId" AND l."drugId" = p."drugId" AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()),0) <= p."minQty"`,
            this.prisma.stockLot.count({ where: { orgId, qtyOnHand: { gt: 0 }, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: today, lte: new Date(today.getTime() + 30 * DAY) } } }),
            this.prisma.stockLot.count({ where: { orgId, qtyOnHand: { gt: 0 }, expiryDate: { lt: today }, status: { notIn: ["RECALLED"] } } }),
            this.prisma.prescription.count({ where: { orgId, status: "DISPENSED", nextRefillDueAt: { not: null, lte: new Date(Date.now() + 3 * DAY) } } }),
            this.prisma.prescription.count({ where: { orgId, status: { in: ["RECEIVED", "VALIDATING"] }, receivedAt: { lt: new Date(Date.now() - 60 * 60_000) } } }),
            this.prisma.controlledDiscrepancy.findMany({ where: { orgId, status: "OPEN" }, select: { id: true, branchId: true, difference: true } }),
            this.prisma.insurerClaim.count({ where: { orgId, OR: [{ status: "SUBMITTED", submittedAt: { lt: new Date(Date.now() - 30 * DAY) } }, { status: "APPROVED", dueAt: { lt: new Date() } }] } }),
            this.prisma.syncConflict.count({ where: { orgId, resolved: false } }),
            this.prisma.stockLot.findMany({ where: { orgId, status: "QUARANTINE", drug: { coldChain: true }, qtyOnHand: { gt: 0 } }, select: { id: true, branchId: true, lotNumber: true } }),
            this.prisma.purchaseOrder.findMany({ where: { orgId, status: { in: ["SENT", "PARTIALLY_RECEIVED"] }, expectedAt: { lt: new Date() } }, select: { id: true, poNumber: true, branchId: true } }),
            this.prisma.shift.findMany({ where: { orgId, status: "OPEN", openedAt: { lt: new Date(Date.now() - 16 * 3600_000) } }, select: { id: true, branchId: true } }),
            this.prisma.recallNotice.findMany({ where: { orgId, status: "ACTIVE" }, select: { id: true, reason: true } }),
            this.prisma.customerAccount.findMany({ where: { orgId, balance: { gt: 0 } }, select: { id: true, balance: true, creditLimit: true, patient: { select: { displayName: true } } }, take: 500 }),
        ]);
        const lowN = Number(low[0]?.n ?? 0);
        if (lowN)
            out.push({ kind: "LOW_STOCK", severity: "WARN", title: `${lowN}`, body: "items at or below their minimum", link: "/purchasing", dedupeKey: `LOW_STOCK:${day}` });
        if (near)
            out.push({ kind: "NEAR_EXPIRY", severity: "WARN", title: `${near}`, body: "lots expire within 30 days", link: "/inventory", dedupeKey: `NEAR_EXPIRY:${day}` });
        if (expired)
            out.push({ kind: "EXPIRED_STOCK", severity: "CRITICAL", title: `${expired}`, body: "expired lots still in stock (blocked from sale)", link: "/inventory", dedupeKey: `EXPIRED_STOCK:${day}` });
        if (refills)
            out.push({ kind: "REFILLS_DUE", severity: "INFO", title: `${refills}`, body: "prescription refills due within 3 days", link: "/rx", dedupeKey: `REFILLS_DUE:${day}` });
        if (rxWait)
            out.push({ kind: "RX_WAITING", severity: "WARN", title: `${rxWait}`, body: "prescriptions waiting for verification over an hour", link: "/rx", dedupeKey: `RX_WAITING:${day}` });
        for (const d of disc)
            out.push({ kind: "CONTROLLED_DISCREPANCY", severity: "CRITICAL", title: `${d.difference}`, body: "controlled-substance discrepancy awaiting resolution", link: "/controlled", refType: "ControlledDiscrepancy", refId: d.id, branchId: d.branchId, dedupeKey: `DISC:${d.id}` });
        if (claims)
            out.push({ kind: "CLAIMS_OVERDUE", severity: "WARN", title: `${claims}`, body: "insurer claims overdue", link: "/finance", dedupeKey: `CLAIMS_OVERDUE:${day}` });
        if (conflicts)
            out.push({ kind: "SYNC_CONFLICTS", severity: "WARN", title: `${conflicts}`, body: "offline sales need a manager decision", link: "/pos", dedupeKey: `SYNC_CONFLICTS:${day}` });
        for (const c of cold)
            out.push({ kind: "COLD_CHAIN", severity: "CRITICAL", title: c.lotNumber, body: "cold-chain lot quarantined after a temperature excursion", link: "/inventory", refType: "StockLot", refId: c.id, branchId: c.branchId, dedupeKey: `COLD:${c.id}` });
        for (const p of pos)
            out.push({ kind: "PO_OVERDUE", severity: "INFO", title: p.poNumber ?? p.id.slice(-6), body: "purchase order is past its expected date", link: "/purchasing", refType: "PurchaseOrder", refId: p.id, branchId: p.branchId, dedupeKey: `PO:${p.id}` });
        for (const s of shifts)
            out.push({ kind: "SHIFT_OPEN", severity: "INFO", title: s.id.slice(-6), body: "a shift has been open for more than 16 hours", link: "/pos", refType: "Shift", refId: s.id, branchId: s.branchId, dedupeKey: `SHIFT:${s.id}` });
        for (const r of recalls)
            out.push({ kind: "RECALL_ACTIVE", severity: "CRITICAL", title: r.reason.slice(0, 60), body: "an active recall is blocking stock", link: "/purchasing", refType: "RecallNotice", refId: r.id, dedupeKey: `RECALL:${r.id}` });
        for (const c of credit)
            if (c.balance.gt(c.creditLimit))
                out.push({ kind: "CREDIT_LIMIT", severity: "WARN", title: c.patient.displayName, body: "customer is over their credit limit", link: "/customers", refType: "CustomerAccount", refId: c.id, dedupeKey: `CREDIT:${c.id}` });
        return out;
    }
    async scan(orgId) {
        const cands = await this.candidates(orgId);
        const keys = new Set(cands.map((c) => c.dedupeKey));
        let created = 0;
        for (const c of cands) {
            const ex = await this.prisma.alert.findUnique({ where: { orgId_dedupeKey: { orgId, dedupeKey: c.dedupeKey } } });
            if (ex) {
                if (ex.resolvedAt)
                    await this.prisma.alert.update({ where: { id: ex.id }, data: { resolvedAt: null, readBy: [] } });
                continue;
            }
            await this.prisma.alert.create({ data: { orgId, branchId: c.branchId, kind: c.kind, severity: c.severity, title: c.title, body: c.body, link: c.link, refType: c.refType, refId: c.refId, dedupeKey: c.dedupeKey, readBy: [] } });
            created++;
        }
        const open = await this.prisma.alert.findMany({ where: { orgId, resolvedAt: null }, select: { id: true, dedupeKey: true } });
        const gone = open.filter((a) => !keys.has(a.dedupeKey)).map((a) => a.id);
        if (gone.length)
            await this.prisma.alert.updateMany({ where: { id: { in: gone } }, data: { resolvedAt: new Date() } });
        return { created, resolved: gone.length, open: open.length - gone.length };
    }
    async feed(u, q) {
        const rows = await this.prisma.alert.findMany({ where: { orgId: u.orgId, ...(q.includeResolved ? {} : { resolvedAt: null }), ...(u.branchId ? { OR: [{ branchId: null }, { branchId: u.branchId }] } : {}) }, orderBy: [{ createdAt: "desc" }], take: q.take });
        const items = rows.map((a) => ({ ...a, read: a.readBy.includes(u.userId), readBy: undefined }));
        return { unread: items.filter((i) => !i.read && !i.resolvedAt).length, items: q.unread ? items.filter((i) => !i.read) : items };
    }
    async unreadCount(u) {
        const rows = await this.prisma.alert.findMany({ where: { orgId: u.orgId, resolvedAt: null, NOT: { readBy: { has: u.userId } }, ...(u.branchId ? { OR: [{ branchId: null }, { branchId: u.branchId }] } : {}) }, select: { severity: true } });
        return { unread: rows.length, critical: rows.filter((r) => r.severity === "CRITICAL").length };
    }
    async markRead(u, id) {
        const a = await this.prisma.alert.findFirst({ where: { id, orgId: u.orgId } });
        if (!a)
            throw (0, errors_1.notFound)("Alert", id);
        if (!a.readBy.includes(u.userId))
            await this.prisma.alert.update({ where: { id }, data: { readBy: { push: u.userId } } });
        return { ok: true };
    }
    async markAllRead(u) {
        const rows = await this.prisma.alert.findMany({ where: { orgId: u.orgId, resolvedAt: null, NOT: { readBy: { has: u.userId } } }, select: { id: true } });
        for (const r of rows)
            await this.prisma.alert.update({ where: { id: r.id }, data: { readBy: { push: u.userId } } });
        return { marked: rows.length };
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map