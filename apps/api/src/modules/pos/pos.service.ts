import { Inject, Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2, sum } from "../../common/money";
import { StockLedger } from "../inventory/stock-ledger.service";
import { PriceService } from "../catalogue/price.service";
import { SalesService, type CartLine, type CheckoutInput } from "./sales.service";
import { ApprovalService, type ApprovalDto } from "../../auth/approval.service";
import { PspAdapter } from "../../platform/adapters/psp.adapter";
import type { AuthUser } from "../../auth/auth-user";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import { renderReceiptHtml } from "./receipt-template";

export interface SyncSaleInput extends Omit<CheckoutInput, "branchId" | "offline"> { clientCreatedAt: string }
export type SyncResult = { idempotencyKey: string; status: "APPLIED" | "DUPLICATE" | "CONFLICT"; saleId?: string; reason?: string; conflictId?: string };

@Injectable()
export class PosService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StockLedger) private readonly ledger: StockLedger,
    @Inject(PriceService) private readonly prices: PriceService,
    @Inject(SalesService) private readonly sales: SalesService,
    @Inject(ApprovalService) private readonly approvals: ApprovalService,
    @Inject(PspAdapter) private readonly psp: PspAdapter,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
  ) {}

  /** KPPOS01 lookup by barcode / name: drug + price + FEFO lot + availability + substitutes when short. */
  async lookup(user: AuthUser, branchId: string, code: string) {
    const c = code.trim();
    const drug = await this.prisma.drug.findFirst({ where: { active: true, OR: [{ orgId: null }, { orgId: user.orgId }], AND: [{ OR: [{ gtin: c }, { gtin: c.padStart(14, "0") }, { gtin: c.replace(/^0+/, "") }] }] } });
    if (!drug) return { found: false as const };
    const price = await this.prices.priceAt(user.orgId, branchId, drug.id);
    const plan = await this.ledger.fefoPlan(this.prisma, user.orgId, branchId, drug.id, 1);
    const atp = await this.prisma.stockLot.aggregate({ where: { orgId: user.orgId, branchId, drugId: drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) } }, _sum: { qtyOnHand: true, qtyReserved: true } });
    const available = (atp._sum.qtyOnHand ?? 0) - (atp._sum.qtyReserved ?? 0);
    return { found: true as const, drug: { id: drug.id, brandName: drug.brandName, brandNameAr: drug.brandNameAr, strength: drug.strength, dosageForm: drug.dosageForm, rxOnly: drug.rxOnly, controlled: drug.controlledSchedule !== "NONE" }, price: price?.toFixed(2) ?? null, available, suggestedLot: plan.picks[0] ?? null, requiresPrescription: drug.rxOnly || drug.controlledSchedule !== "NONE" };
  }

  async quote(user: AuthUser, branchId: string, lines: CartLine[]) {
    const priced = await this.sales.priceCart(this.prisma, user, branchId, lines, new Date(), false);
    const t = this.sales.totals(priced);
    return { lines: priced.map((l) => ({ drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, unitPrice: money(l.unitPrice), discount: money(l.discount), vatAmount: money(l.vatAmount) })), subtotal: money(t.subtotal), discountTotal: money(t.discountTotal), vatTotal: money(t.vatTotal), total: money(t.total) };
  }

  /** Offline bundle for the PWA cache: sellable (non-Rx, non-controlled) stocked items with current price + barcode. */
  async offlineBundle(user: AuthUser, branchId: string) {
    const rows = await this.prisma.$queryRaw<Array<{ id: string; brandName: string; brandNameAr: string | null; gtin: string | null; strength: string; dosageForm: string; available: bigint }>>`
      SELECT d.id, d."brandName", d."brandNameAr", d.gtin, d.strength, d."dosageForm", SUM(l."qtyOnHand" - l."qtyReserved") AS available
      FROM "StockLot" l JOIN "Drug" d ON d.id = l."drugId"
      WHERE l."orgId" = ${user.orgId} AND l."branchId" = ${branchId} AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= CURRENT_DATE
        AND l."qtyOnHand" - l."qtyReserved" > 0 AND d."rxOnly" = false AND d."controlledSchedule" = 'NONE'
      GROUP BY d.id ORDER BY d."brandName" LIMIT 5000`;
    const prices = await this.prices.pricesAt(user.orgId, branchId, rows.map((r) => r.id));
    return { generatedAt: new Date().toISOString(), items: rows.filter((r) => prices.has(r.id)).map((r) => ({ id: r.id, brandName: r.brandName, brandNameAr: r.brandNameAr, gtin: r.gtin, strength: r.strength, dosageForm: r.dosageForm, available: Number(r.available), price: prices.get(r.id)!.toFixed(2) })) };
  }

  // ---------------------------------------------------------------- returns & voids (KPPOS03)
  async returnItems(user: AuthUser, saleId: string, input: { lines: Array<{ saleLineId: string; quantity: number }>; reason: string; refundMethod: "CASH" | "CARD" | "INSTAPAY" | "FAWRY" | "WALLET" | "CUSTOMER_CREDIT"; approval?: ApprovalDto }) {
    const approvedBy = await this.approvals.approver(user, "pos.refund_approve", input.approval);
    const sale = await this.prisma.sale.findFirst({ where: { id: saleId, orgId: user.orgId }, include: { lines: true, returns: true, payments: true } });
    if (!sale) throw notFound("Sale", saleId);
    if (sale.status === "VOIDED" || sale.status === "RETURNED") throw new DomainError("SALE_NOT_RETURNABLE", `Sale is ${sale.status}`, 409);
    if (!input.lines.length) throw new DomainError("NO_LINES", "Select at least one line", 400);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: sale.lines.map((l) => l.drugId) } } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    const result = await this.prisma.$transaction(async (tx) => {
      let refundTotal = D(0);
      for (const rl of input.lines) {
        const line = sale.lines.find((l) => l.id === rl.saleLineId);
        if (!line) throw new DomainError("LINE_NOT_IN_SALE", "Line does not belong to this sale", 409);
        const drug = dm.get(line.drugId)!;
        if (drug.rxOnly || drug.controlledSchedule !== "NONE" || drug.coldChain) throw new DomainError("NOT_RESTOCKABLE", `${drug.brandName} cannot be returned to stock (Rx-only / controlled / cold-chain); use a manager adjustment`, 409);
        const already = sale.returns.filter((r) => r.saleLineId === line.id).reduce((a, r) => a + r.quantity, 0);
        if (!Number.isInteger(rl.quantity) || rl.quantity <= 0 || rl.quantity + already > line.quantity) throw new DomainError("RETURN_QUANTITY", `Cannot return ${rl.quantity}; ${line.quantity - already} returnable`, 409);
        const perUnit = line.unitPrice.minus(line.discount.div(line.quantity));
        const refund = round2(perUnit.mul(rl.quantity));
        refundTotal = refundTotal.plus(refund);
        // restock to the SAME lot (traceability). If that lot is blocked now it simply stays blocked.
        await this.ledger.post(tx, { orgId: user.orgId, branchId: sale.branchId, lotId: line.lotId, type: "RETURN_FROM_CUSTOMER", quantity: rl.quantity, performedBy: user.userId, reason: input.reason, refType: "SaleReturn", refId: sale.id });
        await tx.saleReturn.create({ data: { saleId, saleLineId: line.id, lotId: line.lotId, quantity: rl.quantity, refund, reason: input.reason, approvedBy, refundMethod: input.refundMethod } });
      }
      const all = await tx.saleReturn.findMany({ where: { saleId } });
      const fullyReturned = sale.lines.every((l) => all.filter((r) => r.saleLineId === l.id).reduce((a, r) => a + r.quantity, 0) >= l.quantity);
      await tx.sale.update({ where: { id: saleId }, data: { status: fullyReturned ? "RETURNED" : "PARTIALLY_RETURNED" } });
      if (input.refundMethod === "CUSTOMER_CREDIT") {
        if (!sale.customerAccountId) throw new DomainError("CUSTOMER_REQUIRED", "Sale has no customer account", 409);
        await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: sale.customerAccountId, kind: "PAYMENT", amount: refundTotal.neg(), saleId, note: "return", createdBy: user.userId } });
        await tx.customerAccount.update({ where: { id: sale.customerAccountId }, data: { balance: { decrement: refundTotal } } });
      }
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "sale.return", entityType: "Sale", entityId: saleId, meta: { refund: money(refundTotal), approvedBy, reason: input.reason } } });
      return refundTotal;
    });
    const original = sale.payments.find((p) => p.method === input.refundMethod && p.reference);
    if (original?.reference) await this.psp.refund({ orgId: user.orgId, reference: original.reference, amount: money(result), idempotencyKey: `return:${saleId}:${Date.now()}` });
    return { refund: money(result), approvedBy, sale: await this.sales.getSale(user.orgId, saleId) };
  }

  async voidSale(user: AuthUser, saleId: string, reason: string, approval?: ApprovalDto) {
    const approvedBy = await this.approvals.approver(user, "pos.refund_approve", approval);
    const sale = await this.prisma.sale.findFirst({ where: { id: saleId, orgId: user.orgId }, include: { lines: true, payments: true, returns: true } });
    if (!sale) throw notFound("Sale", saleId);
    if (sale.status !== "COMPLETED") throw new DomainError("SALE_NOT_VOIDABLE", `Sale is ${sale.status}`, 409);
    if (sale.dispensingId) throw new DomainError("DISPENSED_SALE", "A dispensed Rx sale cannot be voided; dispensing is a regulated record", 409);
    await this.prisma.$transaction(async (tx) => {
      for (const l of sale.lines) await this.ledger.post(tx, { orgId: user.orgId, branchId: sale.branchId, lotId: l.lotId, type: "RETURN_FROM_CUSTOMER", quantity: l.quantity, performedBy: user.userId, reason: `Void: ${reason}`, refType: "SaleVoid", refId: sale.id });
      await tx.sale.update({ where: { id: saleId }, data: { status: "VOIDED", voidedBy: approvedBy, voidReason: reason, voidedAt: new Date() } });
      const credit = sum(sale.payments.filter((p) => p.method === "CUSTOMER_CREDIT").map((p) => p.amount));
      if (credit.gt(0) && sale.customerAccountId) {
        await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: sale.customerAccountId, kind: "PAYMENT", amount: credit.neg(), saleId, note: "void", createdBy: user.userId } });
        await tx.customerAccount.update({ where: { id: sale.customerAccountId }, data: { balance: { decrement: credit } } });
      }
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "sale.void", entityType: "Sale", entityId: saleId, meta: { approvedBy, reason, total: money(sale.total) } } });
    });
    for (const p of sale.payments) if (p.reference && p.method !== "CASH") await this.psp.refund({ orgId: user.orgId, reference: p.reference, amount: money(p.amount), idempotencyKey: `void:${saleId}` });
    return this.sales.getSale(user.orgId, saleId);
  }

  // ---------------------------------------------------------------- offline sync (KPPOS01, PH-SS03)
  /**
   * Applies a queue of offline sales IN ORDER. Idempotent per idempotencyKey. A sale that cannot be applied as queued (lot blocked since,
   * no stock, no price...) is NEVER dropped or silently forced: it becomes an unresolved SyncConflict for a manager to resolve.
   */
  async sync(user: AuthUser, branchId: string, queue: SyncSaleInput[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    for (const q of [...queue].sort((a, b) => a.clientCreatedAt.localeCompare(b.clientCreatedAt))) {
      const dup = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: q.idempotencyKey } } });
      if (dup) { results.push({ idempotencyKey: q.idempotencyKey, status: "DUPLICATE", saleId: dup.id }); continue; }
      const prior = await this.prisma.syncConflict.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: q.idempotencyKey } } });
      if (prior && !prior.resolved) { results.push({ idempotencyKey: q.idempotencyKey, status: "CONFLICT", reason: prior.reason, conflictId: prior.id }); continue; }
      try {
        const r = await this.sales.checkout(user, { ...q, branchId, lines: q.lines.map((l) => ({ drugId: l.drugId, quantity: l.quantity, discount: l.discount })), offline: { clientCreatedAt: q.clientCreatedAt } });
        results.push({ idempotencyKey: q.idempotencyKey, status: r.replayed ? "DUPLICATE" : "APPLIED", saleId: r.sale.id });
      } catch (e) {
        const code = e instanceof DomainError ? e.code : "ERROR";
        const reason = `${code}: ${(e as Error).message}`;
        const c = await this.prisma.syncConflict.upsert({
          where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: q.idempotencyKey } }, create: { orgId: user.orgId, branchId, idempotencyKey: q.idempotencyKey, reason, payload: q as unknown as Prisma.InputJsonValue }, update: { reason, payload: q as unknown as Prisma.InputJsonValue },
        });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "pos.sync_conflict", entityType: "SyncConflict", entityId: c.id, meta: { code } } });
        results.push({ idempotencyKey: q.idempotencyKey, status: "CONFLICT", reason, conflictId: c.id });
      }
    }
    return results;
  }

  conflicts(orgId: string, includeResolved = false) {
    return this.prisma.syncConflict.findMany({ where: { orgId, ...(includeResolved ? {} : { resolved: false }) }, orderBy: { createdAt: "desc" }, take: 100 });
  }

  /** Manager resolution: FORCE re-applies the queued sale allowing negative stock (needs approval creds / perm); DISCARD records the decision. */
  async resolveConflict(user: AuthUser, id: string, action: "FORCE" | "DISCARD", approval?: ApprovalDto) {
    const c = await this.prisma.syncConflict.findFirst({ where: { id, orgId: user.orgId } });
    if (!c) throw notFound("Sync conflict", id);
    if (c.resolved) throw new DomainError("ALREADY_RESOLVED", "Conflict already resolved", 409);
    let saleId: string | undefined;
    if (action === "FORCE") {
      const q = c.payload as unknown as SyncSaleInput;
      const approver = await this.approvals.approver(user, "inventory.negative_stock", approval);
      const r = await this.sales.checkout(user, { ...q, branchId: c.branchId, approvedByOverride: approver, offline: { clientCreatedAt: q.clientCreatedAt } });
      saleId = r.sale.id;
    }
    await this.prisma.syncConflict.update({ where: { id }, data: { resolved: true, resolvedBy: user.userId } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "pos.sync_conflict_resolve", entityType: "SyncConflict", entityId: id, meta: { action, saleId: saleId ?? null } } });
    return { resolved: true, action, saleId };
  }

  // ---------------------------------------------------------------- receipts (KPPOS06)
  async receipt(orgId: string, saleId: string) {
    const sale = await this.sales.getSale(orgId, saleId);
    const [branch, tenant] = await Promise.all([this.prisma.branch.findUniqueOrThrow({ where: { id: sale.branchId } }), this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } })]);
    const pack = this.packs.get(tenant.marketCode);
    const s = (tenant.settings ?? {}) as { receiptFooter?: string };
    return {
      receiptNo: sale.receiptNo, soldAt: sale.soldAt, pharmacy: tenant.name, branch: branch.name, branchAddress: branch.address, licenceNo: branch.licenceNo, currency: pack.currency, vatLabel: pack.vat.label, vatLabelAr: pack.vat.labelAr,
      lines: sale.lines.map((l) => ({ name: l.drug?.brandName ?? l.drugId, nameAr: l.drug?.brandNameAr ?? null, strength: l.drug?.strength ?? null, lotNumber: l.lot.lotNumber, quantity: l.quantity, unitPrice: money(l.unitPrice), discount: money(l.discount), lineTotal: money(l.unitPrice.mul(l.quantity).minus(l.discount)), vatRate: l.vatRate.toString(), vatAmount: money(l.vatAmount) })),
      subtotal: money(sale.subtotal), discountTotal: money(sale.discountTotal), vatTotal: money(sale.vatTotal), total: money(sale.total),
      payments: sale.payments.map((p) => ({ method: p.method, amount: money(p.amount), reference: p.reference })), status: sale.status, footer: s.receiptFooter ?? null,
      /** Printed payment record only — the pharmacy issues its own fiscal documents; Kiorly submits nothing to any tax authority. */
      notice: { en: "Payment record. Not a tax invoice.", ar: "إيصال دفع. ليس فاتورة ضريبية." },
    };
  }

  async receiptHtml(orgId: string, saleId: string, lang: "ar" | "en") { return renderReceiptHtml(await this.receipt(orgId, saleId), lang); }

  async getSale(orgId: string, id: string) { return this.sales.getSale(orgId, id); }

  async listSales(orgId: string, q: { branchId?: string; shiftId?: string; skip: number; take: number }) {
    const where: Prisma.SaleWhereInput = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.shiftId ? { shiftId: q.shiftId } : {}) };
    const [items, total] = await Promise.all([this.prisma.sale.findMany({ where, include: { payments: true }, orderBy: { soldAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.sale.count({ where })]);
    return { items, total };
  }
}
