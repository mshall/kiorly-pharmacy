import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import { AGING_BUCKETS, ageInvoices } from "../../common/aging";
import type { AuthUser } from "../../auth/auth-user";
import { CashService } from "../pos/cash.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";

export const EXPENSE_CATEGORIES = ["RENT", "UTILITIES", "SALARIES", "MARKETING", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "BANK_FEES", "INSURANCE", "OTHER"] as const;
export interface Range { orgId: string; branchId?: string; from: Date; to: Date }
const bid = (b?: string) => b ?? null;

/** Finance: P&L style overview (sales, COGS, gross margin, expenses), margin by product / category, expenses, customer receivables. VAT is shown as an included line only; nothing is submitted to any authority. */
@Injectable()
export class FinanceService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(CashService) private readonly cash: CashService, @Inject(TenantModeService) private readonly modes: TenantModeService) {}

  /** Net revenue (ex VAT), VAT included, discounts, COGS and gross margin for the range, returns netted out. */
  private async salesTotals(r: Range) {
    const [s] = await this.prisma.$queryRaw<Array<{ sales: bigint; gross: string; discount: string; vat: string; cogs: string; revenueNet: string }>>`
      SELECT COUNT(DISTINCT s.id) AS sales, COALESCE(SUM(sl."unitPrice" * sl.quantity - sl.discount),0) AS gross, COALESCE(SUM(sl.discount),0) AS discount, COALESCE(SUM(sl."vatAmount"),0) AS vat,
             COALESCE(SUM(sl.quantity * l."unitCost"),0) AS cogs, COALESCE(SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount"),0) AS "revenueNet"
      FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "StockLot" l ON l.id = sl."lotId"
      WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)})`;
    const [ret] = await this.prisma.$queryRaw<Array<{ refund: string; refundNet: string; cogs: string }>>`
      SELECT COALESCE(SUM(rt.refund),0) AS refund, COALESCE(SUM(rt.refund / (1 + COALESCE(sl."vatRate",0))),0) AS "refundNet", COALESCE(SUM(rt.quantity * l."unitCost"),0) AS cogs
      FROM "SaleReturn" rt JOIN "Sale" s ON s.id = rt."saleId" LEFT JOIN "SaleLine" sl ON sl.id = rt."saleLineId" JOIN "StockLot" l ON l.id = rt."lotId"
      WHERE s."orgId" = ${r.orgId} AND rt."createdAt" >= ${r.from} AND rt."createdAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)})`;
    const revenueNet = D(s!.revenueNet).minus(ret!.refundNet), cogs = D(s!.cogs).minus(ret!.cogs);
    return { sales: Number(s!.sales), gross: D(s!.gross).minus(ret!.refund), discount: D(s!.discount), vat: D(s!.vat), revenueNet, cogs, margin: revenueNet.minus(cogs), refunds: D(ret!.refund) };
  }

  async overview(r: Range) {
    const t = await this.salesTotals(r);
    const [expenses, pay, refundsByMethod, daily, expDaily, recv, pays, claims] = await Promise.all([
      this.prisma.expense.groupBy({ by: ["category"], where: { orgId: r.orgId, voidedAt: null, expenseDate: { gte: r.from, lte: r.to }, ...(r.branchId ? { branchId: r.branchId } : {}) }, _sum: { amount: true } }),
      this.prisma.$queryRaw<Array<{ method: string; amount: string }>>`SELECT sp.method::text AS method, SUM(sp.amount) AS amount FROM "SalePayment" sp JOIN "Sale" s ON s.id = sp."saleId" WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)}) GROUP BY 1 ORDER BY 2 DESC`,
      this.prisma.$queryRaw<Array<{ method: string; amount: string }>>`SELECT rt."refundMethod"::text AS method, SUM(rt.refund) AS amount FROM "SaleReturn" rt JOIN "Sale" s ON s.id = rt."saleId" WHERE s."orgId" = ${r.orgId} AND rt."createdAt" >= ${r.from} AND rt."createdAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)}) GROUP BY 1`,
      this.prisma.$queryRaw<Array<{ day: Date; revenue: string; cogs: string }>>`SELECT date_trunc('day', s."soldAt")::date AS day, SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") AS revenue, SUM(sl.quantity * l."unitCost") AS cogs FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "StockLot" l ON l.id = sl."lotId" WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)}) GROUP BY 1 ORDER BY 1`,
      this.prisma.$queryRaw<Array<{ day: Date; amount: string }>>`SELECT "expenseDate" AS day, SUM(amount) AS amount FROM "Expense" WHERE "orgId" = ${r.orgId} AND "voidedAt" IS NULL AND "expenseDate" >= ${r.from} AND "expenseDate" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR "branchId" = ${bid(r.branchId)}) GROUP BY 1 ORDER BY 1`,
      this.prisma.customerAccount.aggregate({ where: { orgId: r.orgId }, _sum: { balance: true } }),
      this.prisma.supplier.aggregate({ where: { orgId: r.orgId }, _sum: { balance: true } }),
      this.prisma.insurerClaim.findMany({ where: { orgId: r.orgId, status: { in: ["SUBMITTED", "APPROVED"] } }, select: { amountClaimed: true, approvedAmount: true, paidAmount: true, status: true } }),
    ]);
    const expTotal = expenses.reduce((a, e) => a.plus(e._sum.amount ?? 0), D(0));
    const rm = new Map(refundsByMethod.map((x) => [x.method, D(x.amount)]));
    const em = new Map(expDaily.map((x) => [x.day.toISOString().slice(0, 10), D(x.amount)]));
    const days = new Set([...daily.map((d) => d.day.toISOString().slice(0, 10)), ...em.keys()]);
    const dm = new Map(daily.map((d) => [d.day.toISOString().slice(0, 10), d]));
    return {
      range: { from: r.from, to: r.to }, sales: { count: t.sales, gross: money(t.gross), discounts: money(t.discount), vatIncluded: money(t.vat), revenueNet: money(t.revenueNet), refunds: money(t.refunds) },
      cogs: money(t.cogs), grossMargin: money(t.margin), grossMarginPct: t.revenueNet.gt(0) ? Math.round(t.margin.div(t.revenueNet).mul(1000).toNumber()) / 10 : 0,
      expenses: { total: money(expTotal), byCategory: expenses.map((e) => ({ category: e.category, amount: money(e._sum.amount ?? 0) })).sort((a, b) => Number(b.amount) - Number(a.amount)) }, netOperatingProfit: money(t.margin.minus(expTotal)),
      paymentsByMethod: pay.map((p) => ({ method: p.method, received: money(p.amount), refunded: money(rm.get(p.method) ?? 0), net: money(D(p.amount).minus(rm.get(p.method) ?? 0)) })),
      receivables: money(recv._sum.balance ?? 0), payables: money(pays._sum.balance ?? 0),
      claimsOutstanding: money(claims.reduce((a, c) => a.plus(c.status === "APPROVED" ? D(c.approvedAmount ?? c.amountClaimed).minus(c.paidAmount) : c.amountClaimed), D(0))),
      daily: [...days].sort().map((day) => ({ day, revenue: money(dm.get(day)?.revenue ?? 0), cogs: money(dm.get(day)?.cogs ?? 0), margin: money(D(dm.get(day)?.revenue ?? 0).minus(dm.get(day)?.cogs ?? 0)), expenses: money(em.get(day) ?? 0) })),
    };
  }

  /** Gross margin per product or per category (ex VAT). Sorted by margin amount. */
  async margin(r: Range, by: "product" | "category") {
    const rows = await this.prisma.$queryRaw<Array<{ key: string; label: string; labelAr: string | null; units: bigint; revenue: string; cogs: string }>>`
      SELECT ${by === "product" ? Prisma.sql`d.id` : Prisma.sql`COALESCE(d.category, '—')`} AS key, ${by === "product" ? Prisma.sql`d."brandName"` : Prisma.sql`COALESCE(d.category, '—')`} AS label, ${by === "product" ? Prisma.sql`d."brandNameAr"` : Prisma.sql`NULL`} AS "labelAr",
             SUM(sl.quantity) AS units, SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") AS revenue, SUM(sl.quantity * l."unitCost") AS cogs
      FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "StockLot" l ON l.id = sl."lotId" JOIN "Drug" d ON d.id = sl."drugId"
      WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)})
      GROUP BY 1, 2, 3 ORDER BY SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") - SUM(sl.quantity * l."unitCost") DESC LIMIT 500`;
    return rows.map((x) => { const rev = D(x.revenue), cogs = D(x.cogs); return { key: x.key, label: x.label, labelAr: x.labelAr, units: Number(x.units), revenue: money(rev), cogs: money(cogs), margin: money(rev.minus(cogs)), marginPct: rev.gt(0) ? Math.round(rev.minus(cogs).div(rev).mul(1000).toNumber()) / 10 : 0 }; });
  }

  // ----------------------------------------------------------------------------------------------- expenses
  async createExpense(u: AuthUser, branchId: string, d: { category: string; amount: string; vatAmount?: string; method?: string; description: string; supplierId?: string; expenseDate?: string; receiptRef?: string; fromDrawer?: boolean }) {
    if (!EXPENSE_CATEGORIES.includes(d.category as never)) throw new DomainError("INVALID_CATEGORY", `Unknown expense category ${d.category}`, 400, { allowed: EXPENSE_CATEGORIES });
    if (D(d.amount).lte(0)) throw new DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
    if (D(d.vatAmount ?? 0).gt(d.amount)) throw new DomainError("INVALID_VAT", "VAT cannot exceed the amount", 400);
    if (d.fromDrawer && (d.method ?? "CASH") !== "CASH") throw new DomainError("DRAWER_CASH_ONLY", "Only cash expenses can be paid from the drawer", 400);
    if (d.supplierId && !(await this.prisma.supplier.findFirst({ where: { id: d.supplierId, orgId: u.orgId } }))) throw notFound("Supplier", d.supplierId);
    return this.prisma.$transaction(async (tx) => {
      const e = await tx.expense.create({ data: { orgId: u.orgId, branchId, category: d.category, amount: d.amount, vatAmount: d.vatAmount ?? 0, method: d.method ?? "CASH", description: d.description, supplierId: d.supplierId, expenseDate: new Date(`${(d.expenseDate ?? new Date().toISOString()).slice(0, 10)}T00:00:00.000Z`), receiptRef: d.receiptRef, fromDrawer: !!d.fromDrawer, createdBy: u.userId } });
      if (d.fromDrawer) {
        const m = await this.cash.record(u, branchId, { kind: "OUT", category: "EXPENSE", amount: d.amount, reason: `${d.category}: ${d.description}`.slice(0, 200), refType: "Expense", refId: e.id }, tx as never);
        e.cashMovementId = (await tx.expense.update({ where: { id: e.id }, data: { cashMovementId: m.id } })).cashMovementId;
      }
      await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "expense.create", entityType: "Expense", entityId: e.id, meta: { category: d.category, amount: money(d.amount), fromDrawer: !!d.fromDrawer } } });
      return { ...e, amount: money(e.amount), vatAmount: money(e.vatAmount) };
    });
  }

  async listExpenses(orgId: string, q: { branchId?: string; category?: string; from?: Date; to?: Date; skip: number; take: number }) {
    const where: Prisma.ExpenseWhereInput = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.category ? { category: q.category } : {}), ...(q.from || q.to ? { expenseDate: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) };
    const [rows, total, agg] = await Promise.all([this.prisma.expense.findMany({ where, orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }], skip: q.skip, take: q.take }), this.prisma.expense.count({ where }), this.prisma.expense.aggregate({ where: { ...where, voidedAt: null }, _sum: { amount: true } })]);
    return { total, sum: money(agg._sum.amount ?? 0), items: rows.map((e) => ({ ...e, amount: money(e.amount), vatAmount: money(e.vatAmount) })) };
  }

  async voidExpense(u: AuthUser, id: string) {
    const e = await this.prisma.expense.findFirst({ where: { id, orgId: u.orgId } });
    if (!e) throw notFound("Expense", id);
    if (e.voidedAt) throw new DomainError("ALREADY_VOID", "Expense is already voided", 409);
    if (e.fromDrawer) throw new DomainError("DRAWER_EXPENSE", "An expense paid from the drawer cannot be voided; record a cash-in correction instead", 409);
    const r = await this.prisma.expense.update({ where: { id }, data: { voidedAt: new Date(), voidedBy: u.userId } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "expense.void", entityType: "Expense", entityId: id } });
    return r;
  }

  // ----------------------------------------------------------------------------------------------- receivables
  /** Customer credit (receivables) aging: CHARGE entries age from their date + the tenant's credit days (default 30); payments and returns clear the oldest first. */
  async receivables(orgId: string, asOf = new Date()) {
    const days = (await this.modes.settings(orgId)).customerCreditDays ?? 30;
    const accounts = await this.prisma.customerAccount.findMany({ where: { orgId }, include: { patient: { select: { id: true, displayName: true, phone: true, customerNo: true } }, entries: { orderBy: { createdAt: "asc" } } } });
    const rows = accounts.map((a) => {
      const invoices = a.entries.filter((e) => e.amount.gt(0)).map((e) => ({ id: e.id, at: e.createdAt, dueDays: days, amount: e.amount }));
      const credits = a.entries.filter((e) => e.amount.lt(0)).reduce((s, e) => s.plus(e.amount.abs()), D(0));
      const r = ageInvoices(invoices, credits, asOf);
      return { accountId: a.id, customer: a.patient, creditLimit: money(a.creditLimit), balance: money(a.balance), outstanding: money(r.outstanding), overLimit: D(a.balance).gt(a.creditLimit), buckets: Object.fromEntries(AGING_BUCKETS.map((b) => [b, money(r.buckets[b])])) as Record<(typeof AGING_BUCKETS)[number], string>, oldestDaysPastDue: r.open.reduce((m, o) => Math.max(m, o.daysPastDue), 0) };
    }).filter((r) => D(r.outstanding).gt(0));
    return { asOf, creditDays: days, outstanding: money(rows.reduce((a, r) => a.plus(r.outstanding), D(0))), totals: Object.fromEntries(AGING_BUCKETS.map((b) => [b, money(rows.reduce((a, r) => a.plus(r.buckets[b]), D(0)))])), customers: rows.sort((a, b) => Number(b.outstanding) - Number(a.outstanding)) };
  }
}
