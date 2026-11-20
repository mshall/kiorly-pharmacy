import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2 } from "../../common/money";
import { AGING_BUCKETS, ageInvoices, termsDays } from "../../common/aging";
import type { AuthUser } from "../../auth/auth-user";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Supplier ledger views (aging, statements), cost price variance, supplier returns, PO edit / close / print. */
@Injectable()
export class PurchasingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** Accounts-payable aging per supplier: INVOICE entries age from their date + the supplier's payment terms; payments and return credits clear the oldest first. */
  async aging(orgId: string, asOf = new Date()) {
    const [suppliers, entries] = await Promise.all([this.prisma.supplier.findMany({ where: { orgId }, orderBy: { name: "asc" } }), this.prisma.supplierLedgerEntry.findMany({ where: { orgId }, orderBy: { createdAt: "asc" } })]);
    const rows = suppliers.map((s) => {
      const mine = entries.filter((e) => e.supplierId === s.id);
      const days = termsDays(s.paymentTerms);
      const invoices = mine.filter((e) => e.amount.gt(0)).map((e) => ({ id: e.id, at: e.createdAt, dueDays: days, amount: e.amount }));
      const credits = mine.filter((e) => e.amount.lt(0)).reduce((a, e) => a.plus(e.amount.abs()), D(0));
      const r = ageInvoices(invoices, credits, asOf);
      return { supplierId: s.id, name: s.name, paymentTerms: s.paymentTerms, creditLimit: s.creditLimit ? money(s.creditLimit) : null, overLimit: !!s.creditLimit && r.outstanding.gt(s.creditLimit), outstanding: money(r.outstanding), advance: money(r.credit), buckets: Object.fromEntries(AGING_BUCKETS.map((b) => [b, money(r.buckets[b])])) as Record<(typeof AGING_BUCKETS)[number], string>, oldestDaysPastDue: r.open.reduce((m, o) => Math.max(m, o.daysPastDue), 0) };
    }).filter((r) => D(r.outstanding).gt(0) || D(r.advance).gt(0));
    const totals = Object.fromEntries(AGING_BUCKETS.map((b) => [b, money(rows.reduce((a, r) => a.plus(r.buckets[b]), D(0)))]));
    return { asOf, totals, outstanding: money(rows.reduce((a, r) => a.plus(r.outstanding), D(0))), suppliers: rows };
  }

  /** Statement of account: every ledger entry with the running balance, optionally within a date range. */
  async statement(orgId: string, supplierId: string, q: { from?: Date; to?: Date }) {
    const s = await this.prisma.supplier.findFirst({ where: { id: supplierId, orgId } });
    if (!s) throw notFound("Supplier", supplierId);
    const all = await this.prisma.supplierLedgerEntry.findMany({ where: { orgId, supplierId }, orderBy: { createdAt: "asc" } });
    let bal = D(0);
    const rows = all.map((e) => { bal = bal.plus(e.amount); return { id: e.id, at: e.createdAt, type: e.type, note: e.note, amount: money(e.amount), balance: money(bal), refType: e.refType, refId: e.refId }; });
    const inRange = rows.filter((r) => (!q.from || r.at >= q.from) && (!q.to || r.at <= q.to));
    return { supplier: { id: s.id, name: s.name, paymentTerms: s.paymentTerms }, openingBalance: inRange.length ? money(D(inRange[0]!.balance).minus(inRange[0]!.amount)) : money(bal), closingBalance: inRange.length ? inRange[inRange.length - 1]!.balance : money(bal), entries: inRange };
  }

  /** Cost price variance: every received line whose cost differs from the PO cost or from the previous receipt, newest first. */
  async costVariance(orgId: string, q: { from?: Date; to?: Date; minPct: number; branchId?: string }) {
    const lines = await this.prisma.goodsReceiptLine.findMany({ where: { receipt: { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.from || q.to ? { receivedAt: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) }, OR: [{ poUnitCost: { not: null } }, { prevUnitCost: { not: null } }] }, include: { receipt: { select: { receivedAt: true, supplierId: true, invoiceNo: true, purchaseOrderId: true } } }, orderBy: { receipt: { receivedAt: "desc" } }, take: 1000 });
    const [drugs, sups] = await Promise.all([this.prisma.drug.findMany({ where: { id: { in: [...new Set(lines.map((l) => l.drugId))] } }, select: { id: true, brandName: true, brandNameAr: true } }), this.prisma.supplier.findMany({ where: { id: { in: [...new Set(lines.map((l) => l.receipt.supplierId).filter((x): x is string => !!x))] } }, select: { id: true, name: true } })]);
    const dm = new Map(drugs.map((d) => [d.id, d])), sm = new Map(sups.map((s) => [s.id, s.name]));
    const items = lines.map((l) => {
      const pct = (b: typeof l.poUnitCost) => (b && b.gt(0) ? Math.round(l.unitCost.minus(b).div(b).mul(1000).toNumber()) / 10 : null);
      const vsPo = pct(l.poUnitCost), vsPrev = pct(l.prevUnitCost);
      const worst = Math.max(Math.abs(vsPo ?? 0), Math.abs(vsPrev ?? 0));
      return { receiptLineId: l.id, receivedAt: l.receipt.receivedAt, invoiceNo: l.receipt.invoiceNo, drugId: l.drugId, brandName: dm.get(l.drugId)?.brandName ?? l.drugId, brandNameAr: dm.get(l.drugId)?.brandNameAr ?? null, supplier: l.receipt.supplierId ? sm.get(l.receipt.supplierId) ?? null : null, quantity: l.quantity, unitCost: money(l.unitCost), poUnitCost: l.poUnitCost ? money(l.poUnitCost) : null, prevUnitCost: l.prevUnitCost ? money(l.prevUnitCost) : null, pctVsPo: vsPo, pctVsPrev: vsPrev, extraCost: l.poUnitCost ? money(l.unitCost.minus(l.poUnitCost).mul(l.quantity)) : null, worst };
    }).filter((i) => i.worst >= q.minPct);
    return { minPct: q.minPct, count: items.length, extraCostVsPo: money(items.reduce((a, i) => a.plus(i.extraCost ?? 0), D(0))), items };
  }

  async supplierReturns(orgId: string, q: { supplierId?: string; branchId?: string }) {
    const rows = await this.prisma.supplierReturn.findMany({ where: { orgId, ...(q.supplierId ? { supplierId: q.supplierId } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, orderBy: { createdAt: "desc" }, take: 200 });
    const [sups, lots] = await Promise.all([this.prisma.supplier.findMany({ where: { id: { in: rows.map((r) => r.supplierId) } }, select: { id: true, name: true } }), this.prisma.stockLot.findMany({ where: { id: { in: rows.map((r) => r.lotId) } }, select: { id: true, lotNumber: true, drug: { select: { brandName: true, brandNameAr: true } } } })]);
    const sm = new Map(sups.map((s) => [s.id, s.name])), lm = new Map(lots.map((l) => [l.id, l]));
    return rows.map((r) => ({ ...r, creditAmount: money(r.creditAmount), supplierName: sm.get(r.supplierId) ?? null, lotNumber: lm.get(r.lotId)?.lotNumber ?? null, brandName: lm.get(r.lotId)?.drug.brandName ?? null, brandNameAr: lm.get(r.lotId)?.drug.brandNameAr ?? null }));
  }

  /** Edit a DRAFT purchase order (lines, notes, expected date). */
  async updatePo(u: AuthUser, id: string, d: { notes?: string; expectedAt?: string; lines?: Array<{ drugId: string; qtyOrdered: number; unitCost: string }> }) {
    const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId: u.orgId } });
    if (!po) throw notFound("Purchase order", id);
    if (po.status !== "DRAFT") throw new DomainError("PO_NOT_DRAFT", `Only a DRAFT purchase order can be edited (is ${po.status})`, 409);
    if (d.lines && !d.lines.length) throw new DomainError("NO_LINES", "A purchase order needs at least one line", 400);
    return this.prisma.$transaction(async (tx) => {
      if (d.lines) {
        await tx.purchaseOrderLine.deleteMany({ where: { purchaseOrderId: id } });
        await tx.purchaseOrderLine.createMany({ data: d.lines.map((l) => ({ purchaseOrderId: id, drugId: l.drugId, qtyOrdered: l.qtyOrdered, unitCost: l.unitCost })) });
      }
      const total = d.lines ? d.lines.reduce((a, l) => a.plus(D(l.unitCost).mul(l.qtyOrdered)), D(0)) : po.totalCost;
      const r = await tx.purchaseOrder.update({ where: { id }, data: { ...(d.notes !== undefined ? { notes: d.notes } : {}), ...(d.expectedAt ? { expectedAt: new Date(d.expectedAt) } : {}), totalCost: round2(total) }, include: { lines: true } });
      await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "po.update", entityType: "PurchaseOrder", entityId: id } });
      return r;
    });
  }

  /** Short-close a partially received PO: the remaining quantity is abandoned and the PO is closed. */
  async closePo(u: AuthUser, id: string, reason: string) {
    const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId: u.orgId } });
    if (!po) throw notFound("Purchase order", id);
    if (po.status !== "PARTIALLY_RECEIVED") throw new DomainError("PO_NOT_PARTIAL", "Only a partially received purchase order can be short-closed", 409);
    const r = await this.prisma.purchaseOrder.update({ where: { id }, data: { status: "RECEIVED", notes: [po.notes, `Short-closed: ${reason}`].filter(Boolean).join(" | ") } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "po.short_close", entityType: "PurchaseOrder", entityId: id, meta: { reason } } });
    return r;
  }

  async poHtml(orgId: string, id: string, lang: "ar" | "en") {
    const po = await this.prisma.purchaseOrder.findFirst({ where: { id, orgId }, include: { lines: true, supplier: true } });
    if (!po) throw notFound("Purchase order", id);
    const [tenant, branch, drugs] = await Promise.all([this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }), this.prisma.branch.findUnique({ where: { id: po.branchId } }), this.prisma.drug.findMany({ where: { id: { in: po.lines.map((l) => l.drugId) } } })]);
    const dm = new Map(drugs.map((d) => [d.id, d])), rtl = lang === "ar";
    const L = rtl ? { h: "أمر شراء", to: "المورد", from: "من", item: "الصنف", qty: "الكمية", cost: "التكلفة", total: "الإجمالي", date: "التاريخ", expected: "التسليم المتوقع", notes: "ملاحظات" } : { h: "Purchase order", to: "Supplier", from: "From", item: "Item", qty: "Qty", cost: "Unit cost", total: "Total", date: "Date", expected: "Expected", notes: "Notes" };
    return `<!doctype html><html lang="${lang}" dir="${rtl ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${L.h} ${esc(po.poNumber)}</title><style>@page{size:A4;margin:14mm}body{font:12px/1.5 system-ui,"Noto Sans Arabic",sans-serif}h1{color:#3730A3;font-size:20px;margin:0}table{width:100%;border-collapse:collapse;margin:12px 0}th{background:#F4F6FC;text-align:start}th,td{padding:6px 8px;border-bottom:1px solid #ddd}.n{text-align:${rtl ? "left" : "right"}}</style></head><body><h1>${L.h} ${esc(po.poNumber)}</h1><p>${L.from}: <b>${esc(tenant.name)}</b> — ${esc(branch?.name)}<br>${L.to}: <b>${esc(po.supplier.name)}</b> ${esc(po.supplier.phone ?? "")}<br>${L.date}: ${po.createdAt.toISOString().slice(0, 10)}${po.expectedAt ? ` · ${L.expected}: ${po.expectedAt.toISOString().slice(0, 10)}` : ""}</p>
<table><tr><th>${L.item}</th><th class="n">${L.qty}</th><th class="n">${L.cost}</th><th class="n">${L.total}</th></tr>${po.lines.map((l) => `<tr><td>${esc(rtl && dm.get(l.drugId)?.brandNameAr ? dm.get(l.drugId)!.brandNameAr : dm.get(l.drugId)?.brandName)} ${esc(dm.get(l.drugId)?.strength ?? "")}</td><td class="n">${l.qtyOrdered}</td><td class="n">${money(l.unitCost)}</td><td class="n">${money(l.unitCost.mul(l.qtyOrdered))}</td></tr>`).join("")}<tr><td colspan="3"><b>${L.total}</b></td><td class="n"><b>${money(po.totalCost)}</b></td></tr></table>${po.notes ? `<p>${L.notes}: ${esc(po.notes)}</p>` : ""}</body></html>`;
  }
}
