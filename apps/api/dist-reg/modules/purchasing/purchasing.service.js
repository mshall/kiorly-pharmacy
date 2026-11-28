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
exports.PurchasingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const aging_1 = require("../../common/aging");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let PurchasingService = class PurchasingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async aging(orgId, asOf = new Date()) {
        const [suppliers, entries] = await Promise.all([this.prisma.supplier.findMany({ where: { orgId }, orderBy: { name: "asc" } }), this.prisma.supplierLedgerEntry.findMany({ where: { orgId }, orderBy: { createdAt: "asc" } })]);
        const rows = suppliers.map((s) => {
            const mine = entries.filter((e) => e.supplierId === s.id);
            const days = (0, aging_1.termsDays)(s.paymentTerms);
            const invoices = mine.filter((e) => e.amount.gt(0)).map((e) => ({ id: e.id, at: e.createdAt, dueDays: days, amount: e.amount }));
            const credits = mine.filter((e) => e.amount.lt(0)).reduce((a, e) => a.plus(e.amount.abs()), (0, money_1.D)(0));
            const r = (0, aging_1.ageInvoices)(invoices, credits, asOf);
            return { supplierId: s.id, name: s.name, paymentTerms: s.paymentTerms, creditLimit: s.creditLimit ? (0, money_1.money)(s.creditLimit) : null, overLimit: !!s.creditLimit && r.outstanding.gt(s.creditLimit), outstanding: (0, money_1.money)(r.outstanding), advance: (0, money_1.money)(r.credit), buckets: Object.fromEntries(aging_1.AGING_BUCKETS.map((b) => [b, (0, money_1.money)(r.buckets[b])])), oldestDaysPastDue: r.open.reduce((m, o) => Math.max(m, o.daysPastDue), 0) };
        }).filter((r) => (0, money_1.D)(r.outstanding).gt(0) || (0, money_1.D)(r.advance).gt(0));
        const totals = Object.fromEntries(aging_1.AGING_BUCKETS.map((b) => [b, (0, money_1.money)(rows.reduce((a, r) => a.plus(r.buckets[b]), (0, money_1.D)(0)))]));
        return { asOf, totals, outstanding: (0, money_1.money)(rows.reduce((a, r) => a.plus(r.outstanding), (0, money_1.D)(0))), suppliers: rows };
    }
    async statement(orgId, supplierId, q) {
        const s = await this.prisma.supplier.findFirst({ where: { id: supplierId, orgId } });
        if (!s)
            throw (0, errors_1.notFound)("Supplier", supplierId);
        const all = await this.prisma.supplierLedgerEntry.findMany({ where: { orgId, supplierId }, orderBy: { createdAt: "asc" } });
        let bal = (0, money_1.D)(0);
        const rows = all.map((e) => { bal = bal.plus(e.amount); return { id: e.id, at: e.createdAt, type: e.type, note: e.note, amount: (0, money_1.money)(e.amount), balance: (0, money_1.money)(bal), refType: e.refType, refId: e.refId }; });
        const inRange = rows.filter((r) => (!q.from || r.at >= q.from) && (!q.to || r.at <= q.to));
        return { supplier: { id: s.id, name: s.name, paymentTerms: s.paymentTerms }, openingBalance: inRange.length ? (0, money_1.money)((0, money_1.D)(inRange[0].balance).minus(inRange[0].amount)) : (0, money_1.money)(bal), closingBalance: inRange.length ? inRange[inRange.length - 1].balance : (0, money_1.money)(bal), entries: inRange };
    }
    async costVariance(orgId, q) {
        const lines = await this.prisma.goodsReceiptLine.findMany({ where: { receipt: { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.from || q.to ? { receivedAt: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) }, OR: [{ poUnitCost: { not: null } }, { prevUnitCost: { not: null } }] }, include: { receipt: { select: { receivedAt: true, supplierId: true, invoiceNo: true, purchaseOrderId: true } } }, orderBy: { receipt: { receivedAt: "desc" } }, take: 1000 });
        const [drugs, sups] = await Promise.all([this.prisma.drug.findMany({ where: { id: { in: [...new Set(lines.map((l) => l.drugId))] } }, select: { id: true, brandName: true, brandNameAr: true } }), this.prisma.supplier.findMany({ where: { id: { in: [...new Set(lines.map((l) => l.receipt.supplierId).filter((x) => !!x))] } }, select: { id: true, name: true } })]);
        const dm = new Map(drugs.map((d) => [d.id, d])), sm = new Map(sups.map((s) => [s.id, s.name]));
        const items = lines.map((l) => {
            const pct = (b) => (b && b.gt(0) ? Math.round(l.unitCost.minus(b).div(b).mul(1000).toNumber()) / 10 : null);
            const vsPo = pct(l.poUnitCost), vsPrev = pct(l.prevUnitCost);
            const worst = Math.max(Math.abs(vsPo ?? 0), Math.abs(vsPrev ?? 0));
            return { receiptLineId: l.id, receivedAt: l.receipt.receivedAt, invoiceNo: l.receipt.invoiceNo, drugId: l.drugId, brandName: dm.get(l.drugId)?.brandName ?? l.drugId, brandNameAr: dm.get(l.drugId)?.brandNameAr ?? null, supplier: l.receipt.supplierId ? sm.get(l.receipt.supplierId) ?? null : null, quantity: l.quantity, unitCost: (0, money_1.money)(l.unitCost), poUnitCost: l.poUnitCost ? (0, money_1.money)(l.poUnitCost) : null, prevUnitCost: l.prevUnitCost ? (0, money_1.money)(l.prevUnitCost) : null, pctVsPo: vsPo, pctVsPrev: vsPrev, extraCost: l.poUnitCost ? (0, money_1.money)(l.unitCost.minus(l.poUnitCost).mul(l.quantity)) : null, worst };
        }).filter((i) => i.worst >= q.minPct);
        return { minPct: q.minPct, count: items.length, extraCostVsPo: (0, money_1.money)(items.reduce((a, i) => a.plus(i.extraCost ?? 0), (0, money_1.D)(0))), items };
    }
    async supplierReturns(orgId, q) {
        const rows = await this.prisma.supplierReturn.findMany({ where: { orgId, ...(q.supplierId ? { supplierId: q.supplierId } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, orderBy: { createdAt: "desc" }, take: 200 });
        const [sups, lots] = await Promise.all([this.prisma.supplier.findMany({ where: { id: { in: rows.map((r) => r.supplierId) } }, select: { id: true, name: true } }), this.prisma.stockLot.findMany({ where: { id: { in: rows.map((r) => r.lotId) } }, select: { id: true, lotNumber: true, drug: { select: { brandName: true, brandNameAr: true } } } })]);
        const sm = new Map(sups.map((s) => [s.id, s.name])), lm = new Map(lots.map((l) => [l.id, l]));
        return rows.map((r) => ({ ...r, creditAmount: (0, money_1.money)(r.creditAmount), supplierName: sm.get(r.supplierId) ?? null, lotNumber: lm.get(r.lotId)?.lotNumber ?? null, brandName: lm.get(r.lotId)?.drug.brandName ?? null, brandNameAr: lm.get(r.lotId)?.drug.brandNameAr ?? null }));
    }
    async updatePo(u, id, d) {
        const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId: u.orgId } });
        if (!po)
            throw (0, errors_1.notFound)("Purchase order", id);
        if (po.status !== "DRAFT")
            throw new errors_1.DomainError("PO_NOT_DRAFT", `Only a DRAFT purchase order can be edited (is ${po.status})`, 409);
        if (d.lines && !d.lines.length)
            throw new errors_1.DomainError("NO_LINES", "A purchase order needs at least one line", 400);
        return this.prisma.$transaction(async (tx) => {
            if (d.lines) {
                await tx.purchaseOrderLine.deleteMany({ where: { purchaseOrderId: id } });
                await tx.purchaseOrderLine.createMany({ data: d.lines.map((l) => ({ purchaseOrderId: id, drugId: l.drugId, qtyOrdered: l.qtyOrdered, unitCost: l.unitCost })) });
            }
            const total = d.lines ? d.lines.reduce((a, l) => a.plus((0, money_1.D)(l.unitCost).mul(l.qtyOrdered)), (0, money_1.D)(0)) : po.totalCost;
            const r = await tx.purchaseOrder.update({ where: { id }, data: { ...(d.notes !== undefined ? { notes: d.notes } : {}), ...(d.expectedAt ? { expectedAt: new Date(d.expectedAt) } : {}), totalCost: (0, money_1.round2)(total) }, include: { lines: true } });
            await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "po.update", entityType: "PurchaseOrder", entityId: id } });
            return r;
        });
    }
    async closePo(u, id, reason) {
        const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId: u.orgId } });
        if (!po)
            throw (0, errors_1.notFound)("Purchase order", id);
        if (po.status !== "PARTIALLY_RECEIVED")
            throw new errors_1.DomainError("PO_NOT_PARTIAL", "Only a partially received purchase order can be short-closed", 409);
        const r = await this.prisma.purchaseOrder.update({ where: { id }, data: { status: "RECEIVED", notes: [po.notes, `Short-closed: ${reason}`].filter(Boolean).join(" | ") } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "po.short_close", entityType: "PurchaseOrder", entityId: id, meta: { reason } } });
        return r;
    }
    async poHtml(orgId, id, lang) {
        const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId }, include: { lines: true, supplier: true } });
        if (!po)
            throw (0, errors_1.notFound)("Purchase order", id);
        const [tenant, branch, drugs] = await Promise.all([this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }), this.prisma.branch.findUnique({ where: { id: po.branchId } }), this.prisma.drug.findMany({ where: { id: { in: po.lines.map((l) => l.drugId) } } })]);
        const dm = new Map(drugs.map((d) => [d.id, d])), rtl = lang === "ar";
        const L = rtl ? { h: "أمر شراء", to: "المورد", from: "من", item: "الصنف", qty: "الكمية", cost: "التكلفة", total: "الإجمالي", date: "التاريخ", expected: "التسليم المتوقع", notes: "ملاحظات" } : { h: "Purchase order", to: "Supplier", from: "From", item: "Item", qty: "Qty", cost: "Unit cost", total: "Total", date: "Date", expected: "Expected", notes: "Notes" };
        return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${L.h} ${esc(po.poNumber)}</title><style>@page{size:A4;margin:14mm}body{font:12px/1.5 system-ui,"Noto Sans Arabic",sans-serif}h1{color:#3730A3;font-size:20px;margin:0}table{width:100%;border-collapse:collapse;margin:12px 0}th{background:#F4F6FC;text-align:start}th,td{padding:6px 8px;border-bottom:1px solid #ddd}.n{text-align:${rtl ? "left" : "right"}}</style></head><body><h1>${L.h} ${esc(po.poNumber)}</h1><p>${L.from}: <b>${esc(tenant.name)}</b> — ${esc(branch?.name)}<br>${L.to}: <b>${esc(po.supplier.name)}</b> ${esc(po.supplier.phone ?? "")}<br>${L.date}: ${po.createdAt.toISOString().slice(0, 10)}${po.expectedAt ? ` · ${L.expected}: ${po.expectedAt.toISOString().slice(0, 10)}` : ""}</p>
<table><tr><th>${L.item}</th><th class="n">${L.qty}</th><th class="n">${L.cost}</th><th class="n">${L.total}</th></tr>${po.lines.map((l) => `<tr><td>${esc(rtl && dm.get(l.drugId)?.brandNameAr ? dm.get(l.drugId).brandNameAr : dm.get(l.drugId)?.brandName)} ${esc(dm.get(l.drugId)?.strength ?? "")}</td><td class="n">${l.qtyOrdered}</td><td class="n">${(0, money_1.money)(l.unitCost)}</td><td class="n">${(0, money_1.money)(l.unitCost.mul(l.qtyOrdered))}</td></tr>`).join("")}<tr><td colspan="3"><b>${L.total}</b></td><td class="n"><b>${(0, money_1.money)(po.totalCost)}</b></td></tr></table>${po.notes ? `<p>${L.notes}: ${esc(po.notes)}</p>` : ""}</body></html>`;
    }
};
exports.PurchasingService = PurchasingService;
exports.PurchasingService = PurchasingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PurchasingService);
//# sourceMappingURL=purchasing.service.js.map