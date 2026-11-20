import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { SuppliersService } from "../suppliers/suppliers.service";

/** Request-for-quotation lifecycle: DRAFT -> SENT -> QUOTED -> AWARDED (POs created) | CANCELLED. */
@Injectable()
export class RfqService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(NotificationsService) private readonly notify: NotificationsService, @Inject(SuppliersService) private readonly suppliers: SuppliersService) {}

  private async nextNumber(orgId: string) {
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const n = await this.prisma.requestForQuote.count({ where: { orgId, number: { startsWith: `RFQ-${day}` } } });
    return `RFQ-${day}-${String(n + 1).padStart(4, "0")}`;
  }

  async create(u: AuthUser, branchId: string, d: { notes?: string; dueAt?: string; lines: Array<{ drugId: string; qty: number }>; supplierIds: string[] }) {
    if (!d.lines.length) throw new DomainError("NO_LINES", "An RFQ needs at least one line", 400);
    if (!d.supplierIds.length) throw new DomainError("NO_SUPPLIERS", "Invite at least one supplier", 400);
    const [sups, drugs] = await Promise.all([this.prisma.supplier.count({ where: { id: { in: d.supplierIds }, orgId: u.orgId, active: true } }), this.prisma.drug.count({ where: { id: { in: d.lines.map((l) => l.drugId) }, OR: [{ orgId: null }, { orgId: u.orgId }] } })]);
    if (sups !== new Set(d.supplierIds).size) throw notFound("Supplier");
    if (drugs !== new Set(d.lines.map((l) => l.drugId)).size) throw notFound("Drug");
    for (let attempt = 0; ; attempt++) {
      try {
        const r = await this.prisma.requestForQuote.create({ data: { orgId: u.orgId, branchId, number: await this.nextNumber(u.orgId), notes: d.notes, dueAt: d.dueAt ? new Date(d.dueAt) : null, createdBy: u.userId, lines: { create: d.lines.map((l) => ({ drugId: l.drugId, qty: l.qty })) }, quotes: { create: [...new Set(d.supplierIds)].map((supplierId) => ({ supplierId })) } } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.create", entityType: "RequestForQuote", entityId: r.id, meta: { lines: d.lines.length, suppliers: d.supplierIds.length } } });
        return this.get(u.orgId, r.id);
      } catch (e) { if (attempt >= 3 || (e as { code?: string }).code !== "P2002") throw e; }
    }
  }

  async list(orgId: string, q: { status?: string; branchId?: string }) {
    const rows = await this.prisma.requestForQuote.findMany({ where: { orgId, ...(q.status ? { status: q.status } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, include: { lines: true, quotes: true }, orderBy: { createdAt: "desc" }, take: 100 });
    return rows.map((r) => ({ ...r, lineCount: r.lines.length, quoted: r.quotes.filter((x) => x.status === "QUOTED" || x.status === "AWARDED").length, invited: r.quotes.length }));
  }

  /** RFQ with the comparison matrix: per line, each supplier's price, the best price, and per supplier totals (only suppliers quoting every line are comparable). */
  async get(orgId: string, id: string) {
    const r = await this.prisma.requestForQuote.findFirst({ where: { id, orgId }, include: { lines: true, quotes: { include: { lines: true } } } });
    if (!r) throw notFound("RFQ", id);
    const [drugs, sups] = await Promise.all([this.prisma.drug.findMany({ where: { id: { in: r.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true } }), this.prisma.supplier.findMany({ where: { id: { in: r.quotes.map((q) => q.supplierId) } }, select: { id: true, name: true } })]);
    const dm = new Map(drugs.map((x) => [x.id, x])), sm = new Map(sups.map((x) => [x.id, x.name]));
    const price = (q: (typeof r.quotes)[number], lineId: string) => q.lines.find((x) => x.rfqLineId === lineId)?.unitPrice ?? null;
    const lines = r.lines.map((l) => {
      const offers = r.quotes.filter((q) => q.status === "QUOTED" || q.status === "AWARDED").map((q) => ({ supplierId: q.supplierId, unitPrice: price(q, l.id) })).filter((o) => o.unitPrice != null);
      const best = offers.length ? offers.reduce((m, o) => (o.unitPrice!.lt(m.unitPrice!) ? o : m)) : null;
      return { id: l.id, drugId: l.drugId, qty: l.qty, drug: dm.get(l.drugId) ?? null, bestSupplierId: best?.supplierId ?? null, bestPrice: best ? money(best.unitPrice!) : null, offers: offers.map((o) => ({ supplierId: o.supplierId, unitPrice: money(o.unitPrice!) })) };
    });
    const quotes = r.quotes.map((q) => ({ id: q.id, supplierId: q.supplierId, supplierName: sm.get(q.supplierId) ?? q.supplierId, status: q.status, leadTimeDays: q.leadTimeDays, validUntil: q.validUntil, notes: q.notes, receivedAt: q.receivedAt, complete: r.lines.every((l) => price(q, l.id) != null), total: money(r.lines.reduce((a, l) => a.plus((price(q, l.id) ?? D(0)).mul(l.qty)), D(0))) }));
    return { ...r, quotes, lines };
  }

  async send(u: AuthUser, id: string) {
    const r = await this.get(u.orgId, id);
    if (r.status !== "DRAFT") throw new DomainError("RFQ_NOT_DRAFT", `RFQ is ${r.status}`, 409);
    const branch = await this.prisma.branch.findUniqueOrThrow({ where: { id: r.branchId } });
    const sups = await this.prisma.supplier.findMany({ where: { id: { in: r.quotes.map((q) => q.supplierId) } } });
    const lineText = r.lines.map((l) => `${l.drug?.brandName} x${l.qty}`).join(", ");
    let sent = 0;
    for (const s of sups) { const to = s.email ?? s.phone; if (!to) continue; await this.notify.send({ orgId: u.orgId, channel: s.email ? "EMAIL" : "WHATSAPP", recipient: to, template: "rfq.send", locale: "ar", vars: { rfq: r.number, branch: branch.name, lines: lineText, due: (r.dueAt ?? new Date(Date.now() + 3 * 86_400_000)).toISOString().slice(0, 10) }, refType: "RequestForQuote", refId: id }); sent++; }
    await this.prisma.requestForQuote.update({ where: { id }, data: { status: "SENT" } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.send", entityType: "RequestForQuote", entityId: id, meta: { sent } } });
    return { ...(await this.get(u.orgId, id)), notified: sent };
  }

  /** Staff keys in the prices a supplier quoted (phone / email / PDF). Missing lines are allowed (partial quote). */
  async recordQuote(u: AuthUser, id: string, supplierId: string, d: { lines: Array<{ rfqLineId: string; unitPrice: string }>; leadTimeDays?: number; validUntil?: string; notes?: string }) {
    const r = await this.get(u.orgId, id);
    if (!["SENT", "QUOTED"].includes(r.status)) throw new DomainError("RFQ_NOT_OPEN", `Quotes can be recorded while the RFQ is SENT or QUOTED (is ${r.status})`, 409);
    const q = r.quotes.find((x) => x.supplierId === supplierId);
    if (!q) throw notFound("Supplier invitation", supplierId);
    for (const l of d.lines) { if (!r.lines.some((x) => x.id === l.rfqLineId)) throw new DomainError("LINE_NOT_IN_RFQ", "Line does not belong to this RFQ", 409); if (D(l.unitPrice).lte(0)) throw new DomainError("INVALID_PRICE", "Prices must be positive", 400); }
    await this.prisma.$transaction(async (tx) => {
      await tx.rfqQuoteLine.deleteMany({ where: { quoteId: q.id } });
      await tx.rfqQuoteLine.createMany({ data: d.lines.map((l) => ({ quoteId: q.id, rfqLineId: l.rfqLineId, unitPrice: l.unitPrice })) });
      await tx.rfqQuote.update({ where: { id: q.id }, data: { status: "QUOTED", leadTimeDays: d.leadTimeDays, validUntil: d.validUntil ? new Date(d.validUntil) : null, notes: d.notes, receivedAt: new Date() } });
      await tx.requestForQuote.update({ where: { id }, data: { status: "QUOTED" } });
      await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.quote", entityType: "RequestForQuote", entityId: id, meta: { supplierId, lines: d.lines.length } } });
    });
    return this.get(u.orgId, id);
  }

  async decline(u: AuthUser, id: string, supplierId: string) {
    const q = await this.prisma.rfqQuote.findFirst({ where: { rfqId: id, supplierId, rfq: { orgId: u.orgId } } });
    if (!q) throw notFound("Supplier invitation", supplierId);
    await this.prisma.rfqQuote.update({ where: { id: q.id }, data: { status: "DECLINED" } });
    return this.get(u.orgId, id);
  }

  /** Award: CHEAPEST_PER_LINE splits the order across suppliers by best price per line (tie: shorter lead time); SUPPLIER gives everything to one supplier that quoted every line. Creates DRAFT POs. */
  async award(u: AuthUser, id: string, d: { mode: "CHEAPEST_PER_LINE" | "SUPPLIER"; supplierId?: string }) {
    const r = await this.get(u.orgId, id);
    if (!["SENT", "QUOTED"].includes(r.status)) throw new DomainError("RFQ_NOT_OPEN", `RFQ is ${r.status}`, 409);
    const live = r.quotes.filter((q) => q.status === "QUOTED");
    if (!live.length) throw new DomainError("NO_QUOTES", "No supplier has quoted yet", 409);
    const raw = await this.prisma.rfqQuote.findMany({ where: { rfqId: id }, include: { lines: true } });
    const priceOf = (supplierId: string, lineId: string) => raw.find((q) => q.supplierId === supplierId)?.lines.find((x) => x.rfqLineId === lineId)?.unitPrice ?? null;
    const lead = (supplierId: string) => raw.find((q) => q.supplierId === supplierId)?.leadTimeDays ?? 999;
    const bySupplier = new Map<string, Array<{ drugId: string; qtyOrdered: number; unitCost: string }>>();
    for (const l of r.lines) {
      let pick: string | null = null;
      if (d.mode === "SUPPLIER") {
        if (!d.supplierId) throw new DomainError("SUPPLIER_REQUIRED", "Choose the supplier to award", 400);
        if (!live.some((q) => q.supplierId === d.supplierId)) throw new DomainError("SUPPLIER_NOT_QUOTED", "That supplier has not quoted", 409);
        if (priceOf(d.supplierId, l.id) == null) throw new DomainError("QUOTE_INCOMPLETE", "That supplier did not quote every line", 409);
        pick = d.supplierId;
      } else {
        let best: { s: string; p: Prisma.Decimal } | null = null;
        for (const q of live) { const p = priceOf(q.supplierId, l.id); if (p && (!best || p.lt(best.p) || (p.equals(best.p) && lead(q.supplierId) < lead(best.s)))) best = { s: q.supplierId, p }; }
        pick = best?.s ?? null;
      }
      if (!pick) throw new DomainError("LINE_NOT_QUOTED", `No supplier quoted ${l.drug?.brandName ?? l.drugId}`, 409, { lineId: l.id });
      (bySupplier.get(pick) ?? bySupplier.set(pick, []).get(pick)!).push({ drugId: l.drugId, qtyOrdered: l.qty, unitCost: priceOf(pick, l.id)!.toFixed(2) });
    }
    const pos = [];
    for (const [supplierId, lines] of bySupplier) pos.push(await this.suppliers.createPo(u, { branchId: r.branchId, supplierId, lines, origin: "RFQ", notes: `RFQ ${r.number}` }));
    await this.prisma.$transaction([
      this.prisma.rfqQuote.updateMany({ where: { rfqId: id, supplierId: { in: [...bySupplier.keys()] } }, data: { status: "AWARDED" } }),
      this.prisma.requestForQuote.update({ where: { id }, data: { status: "AWARDED", awardedAt: new Date() } }),
      this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "rfq.award", entityType: "RequestForQuote", entityId: id, meta: { mode: d.mode, pos: pos.length } } }),
    ]);
    return { rfq: await this.get(u.orgId, id), purchaseOrders: pos };
  }

  async cancel(u: AuthUser, id: string) {
    const r = await this.get(u.orgId, id);
    if (r.status === "AWARDED") throw new DomainError("RFQ_AWARDED", "An awarded RFQ cannot be cancelled", 409);
    await this.prisma.requestForQuote.update({ where: { id }, data: { status: "CANCELLED" } });
    return this.get(u.orgId, id);
  }

  /** Start an RFQ from the current reorder suggestions (min/max + forecast) so quoting follows what is actually short. */
  async fromSuggestions(u: AuthUser, branchId: string, supplierIds: string[], dueAt?: string) {
    const sug = await this.suppliers.suggestions(u, branchId);
    if (!sug.items.length) throw new DomainError("NOTHING_TO_ORDER", "No reorder suggestions right now", 409);
    return this.create(u, branchId, { supplierIds, dueAt, notes: `From reorder suggestions (${sug.method})`, lines: sug.items.map((i) => ({ drugId: i.drugId, qty: i.suggestedQty })) });
  }
}
