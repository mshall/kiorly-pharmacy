import { Inject, Injectable } from "@nestjs/common";
import { Prisma, type PaymentMethod } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2, sum, vatFromGross } from "../../common/money";
import { StockLedger } from "../inventory/stock-ledger.service";
import { PriceService } from "../catalogue/price.service";
import { PspAdapter, type PspMethod } from "../../platform/adapters/psp.adapter";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import { ApprovalService, type ApprovalDto } from "../../auth/approval.service";
import type { AuthUser } from "../../auth/auth-user";
import { allocateFefo } from "../inventory/lot-guard/lot-guard";

type Tx = Prisma.TransactionClient;

export interface CartLine { drugId: string; quantity: number; lotId?: string; discount?: string }
export interface PaymentInput { method: PaymentMethod; amount: string; walletRef?: string }
export interface CheckoutInput {
  branchId: string;
  idempotencyKey: string;
  shiftId?: string;
  lines: CartLine[];
  payments: PaymentInput[];
  customerAccountId?: string;
  approval?: ApprovalDto;
  /** Already-verified approver (conflict resolution). */
  approvedByOverride?: string;
  /** Offline-queued sale (KPPOS01): prices resolved as of clientCreatedAt; only CASH / CUSTOMER_CREDIT tenders. */
  offline?: { clientCreatedAt: string };
}

export interface PricedLine { drugId: string; lotId: string; quantity: number; unitPrice: Prisma.Decimal; discount: Prisma.Decimal; vatRate: Prisma.Decimal; vatAmount: Prisma.Decimal; negative: boolean }

@Injectable()
export class SalesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(StockLedger) private readonly ledger: StockLedger,
    @Inject(PriceService) private readonly prices: PriceService,
    @Inject(PspAdapter) private readonly psp: PspAdapter,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
    @Inject(ApprovalService) private readonly approvals: ApprovalService,
  ) {}

  async vatRateFor(orgId: string, drug: { vatRate: Prisma.Decimal | null }): Promise<Prisma.Decimal> {
    if (drug.vatRate != null) return drug.vatRate;
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    const s = (t.settings ?? {}) as { vatRate?: string };
    return D(s.vatRate ?? this.packs.get(t.marketCode).vat.defaultRate);
  }

  /** Resolves lots (FEFO unless a lot is chosen) and prices for a cart. Pure read apart from the optional negative-stock approval. */
  async priceCart(db: Tx | PrismaService, user: AuthUser, branchId: string, lines: CartLine[], at: Date, allowNegative: boolean): Promise<PricedLine[]> {
    const out: PricedLine[] = [];
    // aggregate the same drug across lines so FEFO does not double-allocate the same free units
    const taken = new Map<string, number>();
    for (const cl of lines) {
      if (!Number.isInteger(cl.quantity) || cl.quantity <= 0) throw new DomainError("INVALID_QUANTITY", "Quantity must be a positive whole number", 400);
      const drug = await db.drug.findFirst({ where: { id: cl.drugId, active: true, OR: [{ orgId: null }, { orgId: user.orgId }] } });
      if (!drug) throw notFound("Drug", cl.drugId);
      if (drug.rxOnly || drug.controlledSchedule !== "NONE") throw new DomainError("RX_REQUIRED", `${drug.brandName} requires a prescription and pharmacist sign-off; dispense it from the Rx queue`, 409, { drugId: drug.id });
      const price = await this.prices.priceAt(user.orgId, branchId, drug.id, at, db);
      if (!price) throw new DomainError("NO_PRICE", `No price in the price book for ${drug.brandName}`, 409, { drugId: drug.id });
      const vatRate = await this.vatRateFor(user.orgId, drug);
      const discountTotal = D(cl.discount ?? 0);
      if (discountTotal.isNeg() || discountTotal.gt(price.mul(cl.quantity))) throw new DomainError("INVALID_DISCOUNT", "Discount must be between 0 and the line total", 400);

      let picks: Array<{ lotId: string; quantity: number; negative: boolean }>;
      if (cl.lotId) {
        const lot = await db.stockLot.findFirst({ where: { id: cl.lotId, orgId: user.orgId, branchId, drugId: drug.id } });
        if (!lot) throw new DomainError("LOT_NOT_FOUND", "Lot not found for this drug/branch", 404);
        picks = [{ lotId: lot.id, quantity: cl.quantity, negative: false }];
      } else {
        const lots = (await db.stockLot.findMany({ where: { orgId: user.orgId, branchId, drugId: drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } })).map((l) => ({ ...l, qtyReserved: l.qtyReserved + (taken.get(l.id) ?? 0) }));
        const { picks: p, shortage } = allocateFefo(lots, cl.quantity);
        picks = p.map((x) => ({ ...x, negative: false }));
        if (shortage > 0) {
          if (!allowNegative) throw new DomainError("INSUFFICIENT_STOCK", `Not enough stock for ${drug.brandName} (short by ${shortage})`, 409, { drugId: drug.id, shortage });
          const fallback = await db.stockLot.findFirst({ where: { orgId: user.orgId, branchId, drugId: drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) } }, orderBy: [{ expiryDate: "asc" }, { receivedAt: "asc" }] });
          if (!fallback) throw new DomainError("NO_SELLABLE_LOT", `No sellable lot exists for ${drug.brandName}; blocked lots can never be sold`, 409, { drugId: drug.id });
          picks.push({ lotId: fallback.id, quantity: shortage, negative: true });
        }
      }
      let remainingDiscount = discountTotal;
      for (const [i, p] of picks.entries()) {
        taken.set(p.lotId, (taken.get(p.lotId) ?? 0) + p.quantity);
        const share = i === picks.length - 1 ? remainingDiscount : round2(discountTotal.mul(p.quantity).div(cl.quantity));
        remainingDiscount = remainingDiscount.minus(share);
        const gross = price.mul(p.quantity).minus(share);
        out.push({ drugId: drug.id, lotId: p.lotId, quantity: p.quantity, unitPrice: price, discount: share, vatRate, vatAmount: vatFromGross(gross, vatRate), negative: p.negative });
      }
    }
    return out;
  }

  totals(lines: PricedLine[]) {
    const subtotal = sum(lines.map((l) => l.unitPrice.mul(l.quantity)));
    const discountTotal = sum(lines.map((l) => l.discount));
    return { subtotal: round2(subtotal), discountTotal: round2(discountTotal), total: round2(subtotal.minus(discountTotal)), vatTotal: round2(sum(lines.map((l) => l.vatAmount))) };
  }

  private async nextReceiptNo(tx: Tx, branchId: string): Promise<string> {
    const b = await tx.branch.update({ where: { id: branchId }, data: { receiptCounter: { increment: 1 } } });
    const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `${b.code ?? "BR"}-${day}-${String(b.receiptCounter).padStart(5, "0")}`;
  }

  /** Persists a sale + lines (+ SALE movements unless stock was already posted by a dispensing) + payments. Call inside a transaction. */
  async persist(tx: Tx, p: {
    user: AuthUser; branchId: string; shiftId: string | null; idempotencyKey: string; lines: PricedLine[]; payments: Array<{ method: PaymentMethod; amount: Prisma.Decimal; reference?: string; status?: string }>;
    customerAccountId?: string; dispensingId?: string; stockAlreadyPosted?: boolean; approvedBy?: string; offline?: { clientCreatedAt: string }; channel?: "POS" | "KIOREX_ORDER";
  }) {
    const t = this.totals(p.lines);
    const receiptNo = await this.nextReceiptNo(tx, p.branchId);
    const sale = await tx.sale.create({
      data: {
        orgId: p.user.orgId, branchId: p.branchId, shiftId: p.shiftId, channel: p.channel ?? "POS", status: "COMPLETED", idempotencyKey: p.idempotencyKey, receiptNo, customerAccountId: p.customerAccountId, dispensingId: p.dispensingId,
        subtotal: t.subtotal, discountTotal: t.discountTotal, vatTotal: t.vatTotal, total: t.total, soldBy: p.user.userId, offline: !!p.offline, clientCreatedAt: p.offline ? new Date(p.offline.clientCreatedAt) : undefined,
        soldAt: p.offline ? new Date(p.offline.clientCreatedAt) : new Date(),
      },
    });
    for (const l of p.lines) {
      await tx.saleLine.create({ data: { saleId: sale.id, drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, unitPrice: l.unitPrice, discount: l.discount, vatRate: l.vatRate, vatAmount: l.vatAmount } });
      if (!p.stockAlreadyPosted) {
        await this.ledger.post(tx, { orgId: p.user.orgId, branchId: p.branchId, lotId: l.lotId, type: "SALE", quantity: l.quantity, performedBy: p.user.userId, refType: "Sale", refId: sale.id, approvedBy: l.negative ? p.approvedBy : undefined });
      }
    }
    for (const pay of p.payments) await tx.salePayment.create({ data: { saleId: sale.id, method: pay.method, amount: pay.amount, reference: pay.reference, status: pay.status ?? "CAPTURED" } });
    await tx.auditLog.create({ data: { orgId: p.user.orgId, actorId: p.user.userId, action: "sale.complete", entityType: "Sale", entityId: sale.id, meta: { total: money(t.total), lines: p.lines.length, offline: !!p.offline, dispensingId: p.dispensingId ?? null } } });
    return sale;
  }

  /** Charges non-cash tenders through the PSP adapter (mock by default) BEFORE the DB transaction; returns captured payments. */
  async capturePayments(user: AuthUser, key: string, total: Prisma.Decimal, payments: PaymentInput[], customerAccountId?: string, offline?: boolean) {
    const paid = sum(payments.map((p) => p.amount));
    if (paid.lt(total)) throw new DomainError("UNDERPAID", `Payments (${money(paid)}) do not cover the total (${money(total)})`, 402, { total: money(total), paid: money(paid) });
    const nonCash = sum(payments.filter((p) => p.method !== "CASH").map((p) => p.amount));
    if (nonCash.gt(total)) throw new DomainError("OVERPAID_NON_CASH", "Only cash can be over-tendered", 400);
    const change = paid.minus(total);
    const hasCash = payments.some((p) => p.method === "CASH");
    if (change.gt(0) && (!hasCash || change.gt(sum(payments.filter((p) => p.method === "CASH").map((p) => p.amount))))) throw new DomainError("OVERPAID_NON_CASH", "Only cash can be over-tendered", 400);
    const out: Array<{ method: PaymentMethod; amount: Prisma.Decimal; reference?: string; status: string }> = [];
    let changeLeft = change;
    for (const [i, p] of payments.entries()) {
      let amount = D(p.amount);
      if (amount.lte(0)) throw new DomainError("INVALID_AMOUNT", "Payment amounts must be positive", 400);
      if (p.method === "CASH" && changeLeft.gt(0)) { const cut = Prisma.Decimal.min(changeLeft, amount); amount = amount.minus(cut); changeLeft = changeLeft.minus(cut); if (amount.isZero()) continue; }
      if (p.method === "KIOREX_PREPAID") throw new DomainError("METHOD_NOT_ALLOWED", "KIOREX_PREPAID is only valid for Kiorex orders", 400);
      if (p.method === "CUSTOMER_CREDIT") {
        if (!customerAccountId) throw new DomainError("CUSTOMER_REQUIRED", "Customer credit needs a customer account", 400);
        out.push({ method: p.method, amount, status: "CAPTURED" });
        continue;
      }
      if (p.method === "CASH") { out.push({ method: "CASH", amount, status: "CAPTURED" }); continue; }
      if (offline) throw new DomainError("OFFLINE_METHOD_NOT_SUPPORTED", `${p.method} cannot be taken offline`, 409);
      const r = await this.psp.charge({ orgId: user.orgId, method: p.method as PspMethod, amount: money(amount), idempotencyKey: `${key}:${i}`, walletRef: p.walletRef });
      if (r.status !== "CAPTURED") throw new DomainError("PAYMENT_DECLINED", `Payment declined (${r.declineReason ?? "declined"})`, 402, { method: p.method, reference: r.reference });
      out.push({ method: p.method, amount, reference: r.reference, status: "CAPTURED" });
    }
    return { payments: out, change: round2(change) };
  }

  /** KPPOS01/02 checkout. Idempotent on (orgId, idempotencyKey): a replay returns the original sale. */
  async checkout(user: AuthUser, input: CheckoutInput): Promise<{ sale: Awaited<ReturnType<SalesService["getSale"]>>; change: string; replayed: boolean }> {
    const existing = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: input.idempotencyKey } } });
    if (existing) return { sale: await this.getSale(user.orgId, existing.id), change: "0.00", replayed: true };
    if (!input.lines.length) throw new DomainError("EMPTY_CART", "Cart is empty", 400);

    const shiftId = await this.resolveShift(user, input.branchId, input.shiftId, !!input.offline);
    const at = input.offline ? new Date(input.offline.clientCreatedAt) : new Date();
    let approvedBy: string | undefined;
    let priced: PricedLine[];
    try {
      priced = await this.priceCart(this.prisma, user, input.branchId, input.lines, at, false);
    } catch (e) {
      if (e instanceof DomainError && e.code === "INSUFFICIENT_STOCK" && (input.approval || input.approvedByOverride)) {
        approvedBy = input.approvedByOverride ?? (await this.approvals.approver(user, "inventory.negative_stock", input.approval));
        priced = await this.priceCart(this.prisma, user, input.branchId, input.lines, at, true);
      } else throw e;
    }
    const total = this.totals(priced).total;
    if (input.customerAccountId) {
      const acct = await this.prisma.customerAccount.findFirst({ where: { id: input.customerAccountId, orgId: user.orgId } });
      if (!acct) throw notFound("Customer account", input.customerAccountId);
    }
    const { payments, change } = await this.capturePayments(user, input.idempotencyKey, total, input.payments, input.customerAccountId, !!input.offline);
    const credit = sum(payments.filter((p) => p.method === "CUSTOMER_CREDIT").map((p) => p.amount));

    try {
      const sale = await this.prisma.$transaction(async (tx) => {
        if (credit.gt(0)) {
          const [acct] = await tx.$queryRaw<Array<{ balance: Prisma.Decimal; creditLimit: Prisma.Decimal }>>`SELECT balance, "creditLimit" FROM "CustomerAccount" WHERE id = ${input.customerAccountId} AND "orgId" = ${user.orgId} FOR UPDATE`;
          if (!acct || D(acct.balance).plus(credit).gt(acct.creditLimit)) throw new DomainError("CREDIT_LIMIT_EXCEEDED", "Customer credit limit would be exceeded", 402, { balance: money(acct?.balance), limit: money(acct?.creditLimit) });
        }
        const s = await this.persist(tx, { user, branchId: input.branchId, shiftId, idempotencyKey: input.idempotencyKey, lines: priced, payments, customerAccountId: input.customerAccountId, approvedBy, offline: input.offline });
        if (credit.gt(0)) {
          await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: input.customerAccountId!, kind: "CHARGE", amount: credit, saleId: s.id, createdBy: user.userId } });
          await tx.customerAccount.update({ where: { id: input.customerAccountId! }, data: { balance: { increment: credit } } });
        }
        return s;
      }, { timeout: 20_000 });
      return { sale: await this.getSale(user.orgId, sale.id), change: money(change), replayed: false };
    } catch (e) {
      // compensate captured PSP payments if the sale could not be recorded
      for (const p of payments) if (p.reference && p.method !== "CASH") await this.psp.refund({ orgId: user.orgId, reference: p.reference, amount: money(p.amount), idempotencyKey: `${input.idempotencyKey}:compensate` }).catch(() => undefined);
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        const dup = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: input.idempotencyKey } } });
        if (dup) return { sale: await this.getSale(user.orgId, dup.id), change: "0.00", replayed: true };
      }
      throw e;
    }
  }

  private async resolveShift(user: AuthUser, branchId: string, shiftId: string | undefined, offline: boolean): Promise<string | null> {
    if (shiftId) {
      const s = await this.prisma.shift.findFirst({ where: { id: shiftId, orgId: user.orgId, branchId } });
      if (!s) throw notFound("Shift", shiftId);
      if (s.status !== "OPEN" && !offline) throw new DomainError("SHIFT_CLOSED", "Shift is closed", 409);
      return s.status === "OPEN" ? s.id : null;
    }
    const open = await this.prisma.shift.findFirst({ where: { orgId: user.orgId, branchId, status: "OPEN" }, orderBy: { openedAt: "desc" } });
    if (!open && !offline) throw new DomainError("SHIFT_REQUIRED", "Open a shift before selling", 409);
    return open?.id ?? null;
  }

  async getSale(orgId: string, id: string) {
    const sale = await this.prisma.sale.findFirst({ where: { id, orgId }, include: { lines: { include: { lot: { select: { lotNumber: true, expiryDate: true } } } }, payments: true, returns: true } });
    if (!sale) throw notFound("Sale", id);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: sale.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    return { ...sale, lines: sale.lines.map((l) => ({ ...l, drug: dm.get(l.drugId) })) };
  }
}
