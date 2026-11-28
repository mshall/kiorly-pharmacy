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
exports.FinanceService = exports.EXPENSE_CATEGORIES = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const aging_1 = require("../../common/aging");
const cash_service_1 = require("../pos/cash.service");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
exports.EXPENSE_CATEGORIES = ["RENT", "UTILITIES", "SALARIES", "MARKETING", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "BANK_FEES", "INSURANCE", "OTHER"];
const bid = (b) => b ?? null;
let FinanceService = class FinanceService {
    prisma;
    cash;
    modes;
    constructor(prisma, cash, modes) {
        this.prisma = prisma;
        this.cash = cash;
        this.modes = modes;
    }
    async salesTotals(r) {
        const [s] = await this.prisma.$queryRaw `
      SELECT COUNT(DISTINCT s.id) AS sales, COALESCE(SUM(sl."unitPrice" * sl.quantity - sl.discount),0) AS gross, COALESCE(SUM(sl.discount),0) AS discount, COALESCE(SUM(sl."vatAmount"),0) AS vat,
             COALESCE(SUM(sl.quantity * l."unitCost"),0) AS cogs, COALESCE(SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount"),0) AS "revenueNet"
      FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "StockLot" l ON l.id = sl."lotId"
      WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)})`;
        const [ret] = await this.prisma.$queryRaw `
      SELECT COALESCE(SUM(rt.refund),0) AS refund, COALESCE(SUM(rt.refund / (1 + COALESCE(sl."vatRate",0))),0) AS "refundNet", COALESCE(SUM(rt.quantity * l."unitCost"),0) AS cogs
      FROM "SaleReturn" rt JOIN "Sale" s ON s.id = rt."saleId" LEFT JOIN "SaleLine" sl ON sl.id = rt."saleLineId" JOIN "StockLot" l ON l.id = rt."lotId"
      WHERE s."orgId" = ${r.orgId} AND rt."createdAt" >= ${r.from} AND rt."createdAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)})`;
        const revenueNet = (0, money_1.D)(s.revenueNet).minus(ret.refundNet), cogs = (0, money_1.D)(s.cogs).minus(ret.cogs);
        return { sales: Number(s.sales), gross: (0, money_1.D)(s.gross).minus(ret.refund), discount: (0, money_1.D)(s.discount), vat: (0, money_1.D)(s.vat), revenueNet, cogs, margin: revenueNet.minus(cogs), refunds: (0, money_1.D)(ret.refund) };
    }
    async overview(r) {
        const t = await this.salesTotals(r);
        const [expenses, pay, refundsByMethod, daily, expDaily, recv, pays, claims] = await Promise.all([
            this.prisma.expense.groupBy({ by: ["category"], where: { orgId: r.orgId, voidedAt: null, expenseDate: { gte: r.from, lte: r.to }, ...(r.branchId ? { branchId: r.branchId } : {}) }, _sum: { amount: true } }),
            this.prisma.$queryRaw `SELECT sp.method::text AS method, SUM(sp.amount) AS amount FROM "SalePayment" sp JOIN "Sale" s ON s.id = sp."saleId" WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)}) GROUP BY 1 ORDER BY 2 DESC`,
            this.prisma.$queryRaw `SELECT rt."refundMethod"::text AS method, SUM(rt.refund) AS amount FROM "SaleReturn" rt JOIN "Sale" s ON s.id = rt."saleId" WHERE s."orgId" = ${r.orgId} AND rt."createdAt" >= ${r.from} AND rt."createdAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)}) GROUP BY 1`,
            this.prisma.$queryRaw `SELECT date_trunc('day', s."soldAt")::date AS day, SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") AS revenue, SUM(sl.quantity * l."unitCost") AS cogs FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "StockLot" l ON l.id = sl."lotId" WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)}) GROUP BY 1 ORDER BY 1`,
            this.prisma.$queryRaw `SELECT "expenseDate" AS day, SUM(amount) AS amount FROM "Expense" WHERE "orgId" = ${r.orgId} AND "voidedAt" IS NULL AND "expenseDate" >= ${r.from} AND "expenseDate" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR "branchId" = ${bid(r.branchId)}) GROUP BY 1 ORDER BY 1`,
            this.prisma.customerAccount.aggregate({ where: { orgId: r.orgId }, _sum: { balance: true } }),
            this.prisma.supplier.aggregate({ where: { orgId: r.orgId }, _sum: { balance: true } }),
            this.prisma.insurerClaim.findMany({ where: { orgId: r.orgId, status: { in: ["SUBMITTED", "APPROVED"] } }, select: { amountClaimed: true, approvedAmount: true, paidAmount: true, status: true } }),
        ]);
        const expTotal = expenses.reduce((a, e) => a.plus(e._sum.amount ?? 0), (0, money_1.D)(0));
        const rm = new Map(refundsByMethod.map((x) => [x.method, (0, money_1.D)(x.amount)]));
        const em = new Map(expDaily.map((x) => [x.day.toISOString().slice(0, 10), (0, money_1.D)(x.amount)]));
        const days = new Set([...daily.map((d) => d.day.toISOString().slice(0, 10)), ...em.keys()]);
        const dm = new Map(daily.map((d) => [d.day.toISOString().slice(0, 10), d]));
        return {
            range: { from: r.from, to: r.to }, sales: { count: t.sales, gross: (0, money_1.money)(t.gross), discounts: (0, money_1.money)(t.discount), vatIncluded: (0, money_1.money)(t.vat), revenueNet: (0, money_1.money)(t.revenueNet), refunds: (0, money_1.money)(t.refunds) },
            cogs: (0, money_1.money)(t.cogs), grossMargin: (0, money_1.money)(t.margin), grossMarginPct: t.revenueNet.gt(0) ? Math.round(t.margin.div(t.revenueNet).mul(1000).toNumber()) / 10 : 0,
            expenses: { total: (0, money_1.money)(expTotal), byCategory: expenses.map((e) => ({ category: e.category, amount: (0, money_1.money)(e._sum.amount ?? 0) })).sort((a, b) => Number(b.amount) - Number(a.amount)) }, netOperatingProfit: (0, money_1.money)(t.margin.minus(expTotal)),
            paymentsByMethod: pay.map((p) => ({ method: p.method, received: (0, money_1.money)(p.amount), refunded: (0, money_1.money)(rm.get(p.method) ?? 0), net: (0, money_1.money)((0, money_1.D)(p.amount).minus(rm.get(p.method) ?? 0)) })),
            receivables: (0, money_1.money)(recv._sum.balance ?? 0), payables: (0, money_1.money)(pays._sum.balance ?? 0),
            claimsOutstanding: (0, money_1.money)(claims.reduce((a, c) => a.plus(c.status === "APPROVED" ? (0, money_1.D)(c.approvedAmount ?? c.amountClaimed).minus(c.paidAmount) : c.amountClaimed), (0, money_1.D)(0))),
            daily: [...days].sort().map((day) => ({ day, revenue: (0, money_1.money)(dm.get(day)?.revenue ?? 0), cogs: (0, money_1.money)(dm.get(day)?.cogs ?? 0), margin: (0, money_1.money)((0, money_1.D)(dm.get(day)?.revenue ?? 0).minus(dm.get(day)?.cogs ?? 0)), expenses: (0, money_1.money)(em.get(day) ?? 0) })),
        };
    }
    async margin(r, by) {
        const rows = await this.prisma.$queryRaw `
      SELECT ${by === "product" ? client_1.Prisma.sql `d.id` : client_1.Prisma.sql `COALESCE(d.category, '—')`} AS key, ${by === "product" ? client_1.Prisma.sql `d."brandName"` : client_1.Prisma.sql `COALESCE(d.category, '—')`} AS label, ${by === "product" ? client_1.Prisma.sql `d."brandNameAr"` : client_1.Prisma.sql `NULL`} AS "labelAr",
             SUM(sl.quantity) AS units, SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") AS revenue, SUM(sl.quantity * l."unitCost") AS cogs
      FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "StockLot" l ON l.id = sl."lotId" JOIN "Drug" d ON d.id = sl."drugId"
      WHERE s."orgId" = ${r.orgId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${r.from} AND s."soldAt" <= ${r.to} AND (${bid(r.branchId)}::text IS NULL OR s."branchId" = ${bid(r.branchId)})
      GROUP BY 1, 2, 3 ORDER BY SUM(sl."unitPrice" * sl.quantity - sl.discount - sl."vatAmount") - SUM(sl.quantity * l."unitCost") DESC LIMIT 500`;
        return rows.map((x) => { const rev = (0, money_1.D)(x.revenue), cogs = (0, money_1.D)(x.cogs); return { key: x.key, label: x.label, labelAr: x.labelAr, units: Number(x.units), revenue: (0, money_1.money)(rev), cogs: (0, money_1.money)(cogs), margin: (0, money_1.money)(rev.minus(cogs)), marginPct: rev.gt(0) ? Math.round(rev.minus(cogs).div(rev).mul(1000).toNumber()) / 10 : 0 }; });
    }
    async createExpense(u, branchId, d) {
        if (!exports.EXPENSE_CATEGORIES.includes(d.category))
            throw new errors_1.DomainError("INVALID_CATEGORY", `Unknown expense category ${d.category}`, 400, { allowed: exports.EXPENSE_CATEGORIES });
        if ((0, money_1.D)(d.amount).lte(0))
            throw new errors_1.DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
        if ((0, money_1.D)(d.vatAmount ?? 0).gt(d.amount))
            throw new errors_1.DomainError("INVALID_VAT", "VAT cannot exceed the amount", 400);
        if (d.fromDrawer && (d.method ?? "CASH") !== "CASH")
            throw new errors_1.DomainError("DRAWER_CASH_ONLY", "Only cash expenses can be paid from the drawer", 400);
        if (d.supplierId && !(await this.prisma.supplier.findFirst({ where: { id: d.supplierId, orgId: u.orgId } })))
            throw (0, errors_1.notFound)("Supplier", d.supplierId);
        return this.prisma.$transaction(async (tx) => {
            const e = await tx.expense.create({ data: { orgId: u.orgId, branchId, category: d.category, amount: d.amount, vatAmount: d.vatAmount ?? 0, method: d.method ?? "CASH", description: d.description, supplierId: d.supplierId, expenseDate: new Date(`${(d.expenseDate ?? new Date().toISOString()).slice(0, 10)}T00:00:00.000Z`), receiptRef: d.receiptRef, fromDrawer: !!d.fromDrawer, createdBy: u.userId } });
            if (d.fromDrawer) {
                const m = await this.cash.record(u, branchId, { kind: "OUT", category: "EXPENSE", amount: d.amount, reason: `${d.category}: ${d.description}`.slice(0, 200), refType: "Expense", refId: e.id }, tx);
                e.cashMovementId = (await tx.expense.update({ where: { id: e.id }, data: { cashMovementId: m.id } })).cashMovementId;
            }
            await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "expense.create", entityType: "Expense", entityId: e.id, meta: { category: d.category, amount: (0, money_1.money)(d.amount), fromDrawer: !!d.fromDrawer } } });
            return { ...e, amount: (0, money_1.money)(e.amount), vatAmount: (0, money_1.money)(e.vatAmount) };
        });
    }
    async listExpenses(orgId, q) {
        const where = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.category ? { category: q.category } : {}), ...(q.from || q.to ? { expenseDate: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) };
        const [rows, total, agg] = await Promise.all([this.prisma.expense.findMany({ where, orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }], skip: q.skip, take: q.take }), this.prisma.expense.count({ where }), this.prisma.expense.aggregate({ where: { ...where, voidedAt: null }, _sum: { amount: true } })]);
        return { total, sum: (0, money_1.money)(agg._sum.amount ?? 0), items: rows.map((e) => ({ ...e, amount: (0, money_1.money)(e.amount), vatAmount: (0, money_1.money)(e.vatAmount) })) };
    }
    async voidExpense(u, id) {
        const e = await this.prisma.expense.findFirst({ where: { id, orgId: u.orgId } });
        if (!e)
            throw (0, errors_1.notFound)("Expense", id);
        if (e.voidedAt)
            throw new errors_1.DomainError("ALREADY_VOID", "Expense is already voided", 409);
        if (e.fromDrawer)
            throw new errors_1.DomainError("DRAWER_EXPENSE", "An expense paid from the drawer cannot be voided; record a cash-in correction instead", 409);
        const r = await this.prisma.expense.update({ where: { id }, data: { voidedAt: new Date(), voidedBy: u.userId } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "expense.void", entityType: "Expense", entityId: id } });
        return r;
    }
    async receivables(orgId, asOf = new Date()) {
        const days = (await this.modes.settings(orgId)).customerCreditDays ?? 30;
        const accounts = await this.prisma.customerAccount.findMany({ where: { orgId }, include: { patient: { select: { id: true, displayName: true, phone: true, customerNo: true } }, entries: { orderBy: { createdAt: "asc" } } } });
        const rows = accounts.map((a) => {
            const invoices = a.entries.filter((e) => e.amount.gt(0)).map((e) => ({ id: e.id, at: e.createdAt, dueDays: days, amount: e.amount }));
            const credits = a.entries.filter((e) => e.amount.lt(0)).reduce((s, e) => s.plus(e.amount.abs()), (0, money_1.D)(0));
            const r = (0, aging_1.ageInvoices)(invoices, credits, asOf);
            return { accountId: a.id, customer: a.patient, creditLimit: (0, money_1.money)(a.creditLimit), balance: (0, money_1.money)(a.balance), outstanding: (0, money_1.money)(r.outstanding), overLimit: (0, money_1.D)(a.balance).gt(a.creditLimit), buckets: Object.fromEntries(aging_1.AGING_BUCKETS.map((b) => [b, (0, money_1.money)(r.buckets[b])])), oldestDaysPastDue: r.open.reduce((m, o) => Math.max(m, o.daysPastDue), 0) };
        }).filter((r) => (0, money_1.D)(r.outstanding).gt(0));
        return { asOf, creditDays: days, outstanding: (0, money_1.money)(rows.reduce((a, r) => a.plus(r.outstanding), (0, money_1.D)(0))), totals: Object.fromEntries(aging_1.AGING_BUCKETS.map((b) => [b, (0, money_1.money)(rows.reduce((a, r) => a.plus(r.buckets[b]), (0, money_1.D)(0)))])), customers: rows.sort((a, b) => Number(b.outstanding) - Number(a.outstanding)) };
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(cash_service_1.CashService)),
    __param(2, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, cash_service_1.CashService, tenant_mode_service_1.TenantModeService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map