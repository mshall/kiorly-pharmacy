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
exports.RfqService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const notifications_service_1 = require("../../platform/adapters/notifications.service");
const suppliers_service_1 = require("../suppliers/suppliers.service");
let RfqService = class RfqService {
    prisma;
    notify;
    suppliers;
    constructor(prisma, notify, suppliers) {
        this.prisma = prisma;
        this.notify = notify;
        this.suppliers = suppliers;
    }
    async nextNumber(orgId) {
        const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const n = await this.prisma.requestForQuote.count({ where: { orgId, number: { startsWith: `RFQ-${day}` } } });
        return `RFQ-${day}-${String(n + 1).padStart(4, "0")}`;
    }
    async create(u, branchId, d) {
        if (!d.lines.length)
            throw new errors_1.DomainError("NO_LINES", "An RFQ needs at least one line", 400);
        if (!d.supplierIds.length)
            throw new errors_1.DomainError("NO_SUPPLIERS", "Invite at least one supplier", 400);
        const [sups, drugs] = await Promise.all([this.prisma.supplier.count({ where: { id: { in: d.supplierIds }, orgId: u.orgId, active: true } }), this.prisma.drug.count({ where: { id: { in: d.lines.map((l) => l.drugId) }, OR: [{ orgId: null }, { orgId: u.orgId }] } })]);
        if (sups !== new Set(d.supplierIds).size)
            throw (0, errors_1.notFound)("Supplier");
        if (drugs !== new Set(d.lines.map((l) => l.drugId)).size)
            throw (0, errors_1.notFound)("Drug");
        for (let attempt = 0;; attempt++) {
            try {
                const r = await this.prisma.requestForQuote.create({ data: { orgId: u.orgId, branchId, number: await this.nextNumber(u.orgId), notes: d.notes, dueAt: d.dueAt ? new Date(d.dueAt) : null, createdBy: u.userId, lines: { create: d.lines.map((l) => ({ drugId: l.drugId, qty: l.qty })) }, quotes: { create: [...new Set(d.supplierIds)].map((supplierId) => ({ supplierId })) } } });
                await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.create", entityType: "RequestForQuote", entityId: r.id, meta: { lines: d.lines.length, suppliers: d.supplierIds.length } } });
                return this.get(u.orgId, r.id);
            }
            catch (e) {
                if (attempt >= 3 || e.code !== "P2002")
                    throw e;
            }
        }
    }
    async list(orgId, q) {
        const rows = await this.prisma.requestForQuote.findMany({ where: { orgId, ...(q.status ? { status: q.status } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, include: { lines: true, quotes: true }, orderBy: { createdAt: "desc" }, take: 100 });
        return rows.map((r) => ({ ...r, lineCount: r.lines.length, quoted: r.quotes.filter((x) => x.status === "QUOTED" || x.status === "AWARDED").length, invited: r.quotes.length }));
    }
    async get(orgId, id) {
        const r = await this.prisma.requestForQuote.findFirst({ where: { id, orgId }, include: { lines: true, quotes: { include: { lines: true } } } });
        if (!r)
            throw (0, errors_1.notFound)("RFQ", id);
        const [drugs, sups] = await Promise.all([this.prisma.drug.findMany({ where: { id: { in: r.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true } }), this.prisma.supplier.findMany({ where: { id: { in: r.quotes.map((q) => q.supplierId) } }, select: { id: true, name: true } })]);
        const dm = new Map(drugs.map((x) => [x.id, x])), sm = new Map(sups.map((x) => [x.id, x.name]));
        const price = (q, lineId) => q.lines.find((x) => x.rfqLineId === lineId)?.unitPrice ?? null;
        const lines = r.lines.map((l) => {
            const offers = r.quotes.filter((q) => q.status === "QUOTED" || q.status === "AWARDED").map((q) => ({ supplierId: q.supplierId, unitPrice: price(q, l.id) })).filter((o) => o.unitPrice != null);
            const best = offers.length ? offers.reduce((m, o) => (o.unitPrice.lt(m.unitPrice) ? o : m)) : null;
            return { id: l.id, drugId: l.drugId, qty: l.qty, drug: dm.get(l.drugId) ?? null, bestSupplierId: best?.supplierId ?? null, bestPrice: best ? (0, money_1.money)(best.unitPrice) : null, offers: offers.map((o) => ({ supplierId: o.supplierId, unitPrice: (0, money_1.money)(o.unitPrice) })) };
        });
        const quotes = r.quotes.map((q) => ({ id: q.id, supplierId: q.supplierId, supplierName: sm.get(q.supplierId) ?? q.supplierId, status: q.status, leadTimeDays: q.leadTimeDays, validUntil: q.validUntil, notes: q.notes, receivedAt: q.receivedAt, complete: r.lines.every((l) => price(q, l.id) != null), total: (0, money_1.money)(r.lines.reduce((a, l) => a.plus((price(q, l.id) ?? (0, money_1.D)(0)).mul(l.qty)), (0, money_1.D)(0))) }));
        return { ...r, quotes, lines };
    }
    async send(u, id) {
        const r = await this.get(u.orgId, id);
        if (r.status !== "DRAFT")
            throw new errors_1.DomainError("RFQ_NOT_DRAFT", `RFQ is ${r.status}`, 409);
        const branch = await this.prisma.branch.findUniqueOrThrow({ where: { id: r.branchId } });
        const sups = await this.prisma.supplier.findMany({ where: { id: { in: r.quotes.map((q) => q.supplierId) } } });
        const lineText = r.lines.map((l) => `${l.drug?.brandName} x${l.qty}`).join(", ");
        let sent = 0;
        for (const s of sups) {
            const to = s.email ?? s.phone;
            if (!to)
                continue;
            await this.notify.send({ orgId: u.orgId, channel: s.email ? "EMAIL" : "WHATSAPP", recipient: to, template: "rfq.send", locale: "ar", vars: { rfq: r.number, branch: branch.name, lines: lineText, due: (r.dueAt ?? new Date(Date.now() + 3 * 86_400_000)).toISOString().slice(0, 10) }, refType: "RequestForQuote", refId: id });
            sent++;
        }
        await this.prisma.requestForQuote.update({ where: { id }, data: { status: "SENT" } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.send", entityType: "RequestForQuote", entityId: id, meta: { sent } } });
        return { ...(await this.get(u.orgId, id)), notified: sent };
    }
    async recordQuote(u, id, supplierId, d) {
        const r = await this.get(u.orgId, id);
        if (!["SENT", "QUOTED"].includes(r.status))
            throw new errors_1.DomainError("RFQ_NOT_OPEN", `Quotes can be recorded while the RFQ is SENT or QUOTED (is ${r.status})`, 409);
        const q = r.quotes.find((x) => x.supplierId === supplierId);
        if (!q)
            throw (0, errors_1.notFound)("Supplier invitation", supplierId);
        for (const l of d.lines) {
            if (!r.lines.some((x) => x.id === l.rfqLineId))
                throw new errors_1.DomainError("LINE_NOT_IN_RFQ", "Line does not belong to this RFQ", 409);
            if ((0, money_1.D)(l.unitPrice).lte(0))
                throw new errors_1.DomainError("INVALID_PRICE", "Prices must be positive", 400);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.rfqQuoteLine.deleteMany({ where: { quoteId: q.id } });
            await tx.rfqQuoteLine.createMany({ data: d.lines.map((l) => ({ quoteId: q.id, rfqLineId: l.rfqLineId, unitPrice: l.unitPrice })) });
            await tx.rfqQuote.update({ where: { id: q.id }, data: { status: "QUOTED", leadTimeDays: d.leadTimeDays, validUntil: d.validUntil ? new Date(d.validUntil) : null, notes: d.notes, receivedAt: new Date() } });
            await tx.requestForQuote.update({ where: { id }, data: { status: "QUOTED" } });
            await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.quote", entityType: "RequestForQuote", entityId: id, meta: { supplierId, lines: d.lines.length } } });
        });
        return this.get(u.orgId, id);
    }
    async decline(u, id, supplierId) {
        const q = await this.prisma.rfqQuote.findFirst({ where: { rfqId: id, supplierId, rfq: { orgId: u.orgId } } });
        if (!q)
            throw (0, errors_1.notFound)("Supplier invitation", supplierId);
        await this.prisma.rfqQuote.update({ where: { id: q.id }, data: { status: "DECLINED" } });
        return this.get(u.orgId, id);
    }
    async award(u, id, d) {
        const r = await this.get(u.orgId, id);
        if (!["SENT", "QUOTED"].includes(r.status))
            throw new errors_1.DomainError("RFQ_NOT_OPEN", `RFQ is ${r.status}`, 409);
        const live = r.quotes.filter((q) => q.status === "QUOTED");
        if (!live.length)
            throw new errors_1.DomainError("NO_QUOTES", "No supplier has quoted yet", 409);
        const raw = await this.prisma.rfqQuote.findMany({ where: { rfqId: id }, include: { lines: true } });
        const priceOf = (supplierId, lineId) => raw.find((q) => q.supplierId === supplierId)?.lines.find((x) => x.rfqLineId === lineId)?.unitPrice ?? null;
        const lead = (supplierId) => raw.find((q) => q.supplierId === supplierId)?.leadTimeDays ?? 999;
        const bySupplier = new Map();
        for (const l of r.lines) {
            let pick = null;
            if (d.mode === "SUPPLIER") {
                if (!d.supplierId)
                    throw new errors_1.DomainError("SUPPLIER_REQUIRED", "Choose the supplier to award", 400);
                if (!live.some((q) => q.supplierId === d.supplierId))
                    throw new errors_1.DomainError("SUPPLIER_NOT_QUOTED", "That supplier has not quoted", 409);
                if (priceOf(d.supplierId, l.id) == null)
                    throw new errors_1.DomainError("QUOTE_INCOMPLETE", "That supplier did not quote every line", 409);
                pick = d.supplierId;
            }
            else {
                let best = null;
                for (const q of live) {
                    const p = priceOf(q.supplierId, l.id);
                    if (p && (!best || p.lt(best.p) || (p.equals(best.p) && lead(q.supplierId) < lead(best.s))))
                        best = { s: q.supplierId, p };
                }
                pick = best?.s ?? null;
            }
            if (!pick)
                throw new errors_1.DomainError("LINE_NOT_QUOTED", `No supplier quoted ${l.drug?.brandName ?? l.drugId}`, 409, { lineId: l.id });
            (bySupplier.get(pick) ?? bySupplier.set(pick, []).get(pick)).push({ drugId: l.drugId, qtyOrdered: l.qty, unitCost: priceOf(pick, l.id).toFixed(2) });
        }
        const pos = [];
        for (const [supplierId, lines] of bySupplier)
            pos.push(await this.suppliers.createPo(u, { branchId: r.branchId, supplierId, lines, origin: "RFQ", notes: `RFQ ${r.number}` }));
        await this.prisma.$transaction([
            this.prisma.rfqQuote.updateMany({ where: { rfqId: id, supplierId: { in: [...bySupplier.keys()] } }, data: { status: "AWARDED" } }),
            this.prisma.requestForQuote.update({ where: { id }, data: { status: "AWARDED", awardedAt: new Date() } }),
            this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.award", entityType: "RequestForQuote", entityId: id, meta: { mode: d.mode, pos: pos.length } } }),
        ]);
        return { rfq: await this.get(u.orgId, id), purchaseOrders: pos };
    }
    async cancel(u, id) {
        const r = await this.get(u.orgId, id);
        if (r.status === "AWARDED")
            throw new errors_1.DomainError("RFQ_AWARDED", "An awarded RFQ cannot be cancelled", 409);
        await this.prisma.requestForQuote.update({ where: { id }, data: { status: "CANCELLED" } });
        return this.get(u.orgId, id);
    }
    async fromSuggestions(u, branchId, supplierIds, dueAt) {
        const sug = await this.suppliers.suggestions(u, branchId);
        if (!sug.items.length)
            throw new errors_1.DomainError("NOTHING_TO_ORDER", "No reorder suggestions right now", 409);
        return this.create(u, branchId, { supplierIds, dueAt, notes: `From reorder suggestions (${sug.method})`, lines: sug.items.map((i) => ({ drugId: i.drugId, qty: i.suggestedQty })) });
    }
};
exports.RfqService = RfqService;
exports.RfqService = RfqService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(2, (0, common_1.Inject)(suppliers_service_1.SuppliersService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService, suppliers_service_1.SuppliersService])
], RfqService);
//# sourceMappingURL=rfq.service.js.map