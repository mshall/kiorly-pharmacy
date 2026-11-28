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
exports.PosService = void 0;
const dates_1 = require("../../common/dates");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const stock_ledger_service_1 = require("../inventory/stock-ledger.service");
const price_service_1 = require("../catalogue/price.service");
const sales_service_1 = require("./sales.service");
const approval_service_1 = require("../../auth/approval.service");
const psp_adapter_1 = require("../../platform/adapters/psp.adapter");
const ports_1 = require("../../kernel-adapter/ports");
const receipt_template_1 = require("./receipt-template");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
const loyalty_1 = require("../../common/loyalty");
let PosService = class PosService {
    prisma;
    ledger;
    prices;
    sales;
    approvals;
    psp;
    packs;
    modes;
    constructor(prisma, ledger, prices, sales, approvals, psp, packs, modes) {
        this.prisma = prisma;
        this.ledger = ledger;
        this.prices = prices;
        this.sales = sales;
        this.approvals = approvals;
        this.psp = psp;
        this.packs = packs;
        this.modes = modes;
    }
    async lookup(user, branchId, code) {
        const c = code.trim();
        const drug = await this.prisma.drug.findFirst({ where: { active: true, OR: [{ orgId: null }, { orgId: user.orgId }], AND: [{ OR: [{ gtin: c }, { gtin: c.padStart(14, "0") }, { gtin: c.replace(/^0+/, "") }] }] } });
        if (!drug)
            return { found: false };
        const price = await this.prices.priceAt(user.orgId, branchId, drug.id);
        const plan = await this.ledger.fefoPlan(this.prisma, user.orgId, branchId, drug.id, 1);
        const atp = await this.prisma.stockLot.aggregate({ where: { orgId: user.orgId, branchId, drugId: drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: (0, dates_1.marketToday)() } }, _sum: { qtyOnHand: true, qtyReserved: true } });
        const available = (atp._sum.qtyOnHand ?? 0) - (atp._sum.qtyReserved ?? 0);
        return { found: true, drug: { id: drug.id, brandName: drug.brandName, brandNameAr: drug.brandNameAr, strength: drug.strength, dosageForm: drug.dosageForm, rxOnly: drug.rxOnly, controlled: drug.controlledSchedule !== "NONE" }, price: price?.toFixed(2) ?? null, available, suggestedLot: plan.picks[0] ?? null, requiresPrescription: drug.rxOnly || drug.controlledSchedule !== "NONE" };
    }
    async quote(user, branchId, lines, couponCodes = []) {
        let priced = await this.sales.priceCart(this.prisma, user, branchId, lines, new Date(), false);
        const pr = await this.sales.applyPromos(this.prisma, user, branchId, priced, couponCodes, new Date());
        priced = pr.lines;
        const t = this.sales.totals(priced);
        return {
            lines: priced.map((l) => ({ drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, unitPrice: (0, money_1.money)(l.unitPrice), discount: (0, money_1.money)(l.discount), vatAmount: (0, money_1.money)(l.vatAmount) })),
            subtotal: (0, money_1.money)(t.subtotal), discountTotal: (0, money_1.money)(t.discountTotal), vatTotal: (0, money_1.money)(t.vatTotal), total: (0, money_1.money)(t.total),
            promotions: pr.applied.map((a) => ({ promoId: a.promoId, name: a.name, amount: (0, money_1.money)(a.amount), couponCode: a.couponCode ?? null })), invalidCoupons: pr.unusedCoupons,
        };
    }
    async offlineBundle(user, branchId) {
        const rows = await this.prisma.$queryRaw `
      SELECT d.id, d."brandName", d."brandNameAr", d.gtin, d.strength, d."dosageForm", SUM(l."qtyOnHand" - l."qtyReserved") AS available
      FROM "StockLot" l JOIN "Drug" d ON d.id = l."drugId"
      WHERE l."orgId" = ${user.orgId} AND l."branchId" = ${branchId} AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()
        AND l."qtyOnHand" - l."qtyReserved" > 0 AND d."rxOnly" = false AND d."controlledSchedule" = 'NONE'
      GROUP BY d.id ORDER BY d."brandName" LIMIT 5000`;
        const prices = await this.prices.pricesAt(user.orgId, branchId, rows.map((r) => r.id));
        return { generatedAt: new Date().toISOString(), items: rows.filter((r) => prices.has(r.id)).map((r) => ({ id: r.id, brandName: r.brandName, brandNameAr: r.brandNameAr, gtin: r.gtin, strength: r.strength, dosageForm: r.dosageForm, available: Number(r.available), price: prices.get(r.id).toFixed(2) })) };
    }
    async returnItems(user, saleId, input) {
        const approvedBy = await this.approvals.approver(user, "pos.refund_approve", input.approval);
        const sale = await this.prisma.sale.findFirst({ where: { id: saleId, orgId: user.orgId }, include: { lines: true, returns: true, payments: true } });
        if (!sale)
            throw (0, errors_1.notFound)("Sale", saleId);
        if (sale.status === "VOIDED" || sale.status === "RETURNED")
            throw new errors_1.DomainError("SALE_NOT_RETURNABLE", `Sale is ${sale.status}`, 409);
        if (!input.lines.length)
            throw new errors_1.DomainError("NO_LINES", "Select at least one line", 400);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: sale.lines.map((l) => l.drugId) } } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        const result = await this.prisma.$transaction(async (tx) => {
            let refundTotal = (0, money_1.D)(0);
            for (const rl of input.lines) {
                const line = sale.lines.find((l) => l.id === rl.saleLineId);
                if (!line)
                    throw new errors_1.DomainError("LINE_NOT_IN_SALE", "Line does not belong to this sale", 409);
                const drug = dm.get(line.drugId);
                if (drug.rxOnly || drug.controlledSchedule !== "NONE" || drug.coldChain)
                    throw new errors_1.DomainError("NOT_RESTOCKABLE", `${drug.brandName} cannot be returned to stock (Rx-only / controlled / cold-chain); use a manager adjustment`, 409);
                const already = sale.returns.filter((r) => r.saleLineId === line.id).reduce((a, r) => a + r.quantity, 0);
                if (!Number.isInteger(rl.quantity) || rl.quantity <= 0 || rl.quantity + already > line.quantity)
                    throw new errors_1.DomainError("RETURN_QUANTITY", `Cannot return ${rl.quantity}; ${line.quantity - already} returnable`, 409);
                const perUnit = line.unitPrice.minus(line.discount.div(line.quantity));
                const refund = (0, money_1.round2)(perUnit.mul(rl.quantity));
                refundTotal = refundTotal.plus(refund);
                await this.ledger.post(tx, { orgId: user.orgId, branchId: sale.branchId, lotId: line.lotId, type: "RETURN_FROM_CUSTOMER", quantity: rl.quantity, performedBy: user.userId, reason: input.reason, refType: "SaleReturn", refId: sale.id });
                await tx.saleReturn.create({ data: { saleId, saleLineId: line.id, lotId: line.lotId, quantity: rl.quantity, refund, reason: input.reason, approvedBy, refundMethod: input.refundMethod } });
            }
            const all = await tx.saleReturn.findMany({ where: { saleId } });
            const fullyReturned = sale.lines.every((l) => all.filter((r) => r.saleLineId === l.id).reduce((a, r) => a + r.quantity, 0) >= l.quantity);
            await tx.sale.update({ where: { id: saleId }, data: { status: fullyReturned ? "RETURNED" : "PARTIALLY_RETURNED" } });
            if (input.refundMethod === "CUSTOMER_CREDIT") {
                if (!sale.customerAccountId)
                    throw new errors_1.DomainError("CUSTOMER_REQUIRED", "Sale has no customer account", 409);
                await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: sale.customerAccountId, kind: "PAYMENT", amount: refundTotal.neg(), saleId, note: "return", createdBy: user.userId } });
                await tx.customerAccount.update({ where: { id: sale.customerAccountId }, data: { balance: { decrement: refundTotal } } });
            }
            if (sale.patientId) {
                const cfg = (0, loyalty_1.loyaltyConfig)(await this.modes.settings(user.orgId));
                const cust = await tx.patientRef.findUnique({ where: { id: sale.patientId }, select: { loyaltyPoints: true, loyaltyTier: true } });
                const pts = cust ? Math.min((0, loyalty_1.pointsFor)(refundTotal, cust.loyaltyTier, cfg), cust.loyaltyPoints) : 0;
                if (pts > 0)
                    await (0, loyalty_1.adjustPoints)(tx, { orgId: user.orgId, patientId: sale.patientId, points: -pts, note: `Return on ${sale.receiptNo ?? saleId}`, by: user.userId, kind: "RETURN" }, cfg);
            }
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "sale.return", entityType: "Sale", entityId: saleId, meta: { refund: (0, money_1.money)(refundTotal), approvedBy, reason: input.reason } } });
            return refundTotal;
        });
        const original = sale.payments.find((p) => p.method === input.refundMethod && p.reference);
        if (original?.reference)
            await this.psp.refund({ orgId: user.orgId, reference: original.reference, amount: (0, money_1.money)(result), idempotencyKey: `return:${saleId}:${Date.now()}` });
        return { refund: (0, money_1.money)(result), approvedBy, sale: await this.sales.getSale(user.orgId, saleId) };
    }
    async voidSale(user, saleId, reason, approval) {
        const approvedBy = await this.approvals.approver(user, "pos.refund_approve", approval);
        const sale = await this.prisma.sale.findFirst({ where: { id: saleId, orgId: user.orgId }, include: { lines: true, payments: true, returns: true } });
        if (!sale)
            throw (0, errors_1.notFound)("Sale", saleId);
        if (sale.status !== "COMPLETED")
            throw new errors_1.DomainError("SALE_NOT_VOIDABLE", `Sale is ${sale.status}`, 409);
        if (sale.dispensingId)
            throw new errors_1.DomainError("DISPENSED_SALE", "A dispensed Rx sale cannot be voided; dispensing is a regulated record", 409);
        await this.prisma.$transaction(async (tx) => {
            for (const l of sale.lines)
                await this.ledger.post(tx, { orgId: user.orgId, branchId: sale.branchId, lotId: l.lotId, type: "RETURN_FROM_CUSTOMER", quantity: l.quantity, performedBy: user.userId, reason: `Void: ${reason}`, refType: "SaleVoid", refId: sale.id });
            await tx.sale.update({ where: { id: saleId }, data: { status: "VOIDED", voidedBy: approvedBy, voidReason: reason, voidedAt: new Date() } });
            const credit = (0, money_1.sum)(sale.payments.filter((p) => p.method === "CUSTOMER_CREDIT").map((p) => p.amount));
            if (credit.gt(0) && sale.customerAccountId) {
                await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: sale.customerAccountId, kind: "PAYMENT", amount: credit.neg(), saleId, note: "void", createdBy: user.userId } });
                await tx.customerAccount.update({ where: { id: sale.customerAccountId }, data: { balance: { decrement: credit } } });
            }
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "sale.void", entityType: "Sale", entityId: saleId, meta: { approvedBy, reason, total: (0, money_1.money)(sale.total) } } });
        });
        for (const p of sale.payments)
            if (p.reference && p.method !== "CASH")
                await this.psp.refund({ orgId: user.orgId, reference: p.reference, amount: (0, money_1.money)(p.amount), idempotencyKey: `void:${saleId}` });
        return this.sales.getSale(user.orgId, saleId);
    }
    async sync(user, branchId, queue) {
        const results = [];
        for (const q of [...queue].sort((a, b) => a.clientCreatedAt.localeCompare(b.clientCreatedAt))) {
            const dup = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: q.idempotencyKey } } });
            if (dup) {
                results.push({ idempotencyKey: q.idempotencyKey, status: "DUPLICATE", saleId: dup.id });
                continue;
            }
            const prior = await this.prisma.syncConflict.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: q.idempotencyKey } } });
            if (prior && !prior.resolved) {
                results.push({ idempotencyKey: q.idempotencyKey, status: "CONFLICT", reason: prior.reason, conflictId: prior.id });
                continue;
            }
            try {
                const r = await this.sales.checkout(user, { ...q, branchId, lines: q.lines.map((l) => ({ drugId: l.drugId, quantity: l.quantity, discount: l.discount })), offline: { clientCreatedAt: q.clientCreatedAt } });
                results.push({ idempotencyKey: q.idempotencyKey, status: r.replayed ? "DUPLICATE" : "APPLIED", saleId: r.sale.id });
            }
            catch (e) {
                const code = e instanceof errors_1.DomainError ? e.code : "ERROR";
                const reason = `${code}: ${e.message}`;
                const c = await this.prisma.syncConflict.upsert({
                    where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: q.idempotencyKey } }, create: { orgId: user.orgId, branchId, idempotencyKey: q.idempotencyKey, reason, payload: q }, update: { reason, payload: q },
                });
                await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "pos.sync_conflict", entityType: "SyncConflict", entityId: c.id, meta: { code } } });
                results.push({ idempotencyKey: q.idempotencyKey, status: "CONFLICT", reason, conflictId: c.id });
            }
        }
        return results;
    }
    conflicts(orgId, includeResolved = false) {
        return this.prisma.syncConflict.findMany({ where: { orgId, ...(includeResolved ? {} : { resolved: false }) }, orderBy: { createdAt: "desc" }, take: 100 });
    }
    async resolveConflict(user, id, action, approval) {
        const c = await this.prisma.syncConflict.findFirst({ where: { id, orgId: user.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Sync conflict", id);
        if (c.resolved)
            throw new errors_1.DomainError("ALREADY_RESOLVED", "Conflict already resolved", 409);
        let saleId;
        if (action === "FORCE") {
            const q = c.payload;
            const approver = await this.approvals.approver(user, "inventory.negative_stock", approval);
            const r = await this.sales.checkout(user, { ...q, branchId: c.branchId, approvedByOverride: approver, offline: { clientCreatedAt: q.clientCreatedAt } });
            saleId = r.sale.id;
        }
        await this.prisma.syncConflict.update({ where: { id }, data: { resolved: true, resolvedBy: user.userId } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "pos.sync_conflict_resolve", entityType: "SyncConflict", entityId: id, meta: { action, saleId: saleId ?? null } } });
        return { resolved: true, action, saleId };
    }
    async receipt(orgId, saleId) {
        const sale = await this.sales.getSale(orgId, saleId);
        const [branch, tenant] = await Promise.all([this.prisma.branch.findUniqueOrThrow({ where: { id: sale.branchId } }), this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } })]);
        const pack = this.packs.get(tenant.marketCode);
        const s = (tenant.settings ?? {});
        const [customer, redemptions, earn] = await Promise.all([
            sale.patientId ? this.prisma.patientRef.findUnique({ where: { id: sale.patientId }, select: { displayName: true, customerNo: true, phone: true, loyaltyPoints: true, loyaltyTier: true } }) : null,
            this.prisma.promotionRedemption.findMany({ where: { saleId }, select: { promotionId: true, discountAmount: true } }),
            this.prisma.loyaltyEntry.findFirst({ where: { saleId, kind: "EARN" } }),
        ]);
        const promoNames = redemptions.length ? new Map((await this.prisma.promotion.findMany({ where: { id: { in: redemptions.map((r) => r.promotionId) } }, select: { id: true, name: true } })).map((p) => [p.id, p.name])) : new Map();
        const byRate = new Map();
        for (const l of sale.lines) {
            const k = l.vatRate.toString();
            const gross = l.unitPrice.mul(l.quantity).minus(l.discount);
            const cur = byRate.get(k) ?? { net: (0, money_1.D)(0), vat: (0, money_1.D)(0), gross: (0, money_1.D)(0) };
            byRate.set(k, { net: cur.net.plus(gross.minus(l.vatAmount)), vat: cur.vat.plus(l.vatAmount), gross: cur.gross.plus(gross) });
        }
        return {
            template: { header: s.receipt?.header, showVat: s.receipt?.showVat, showLicence: s.receipt?.showLicence, logoText: s.receipt?.logoText }, customer: customer ? { name: customer.displayName, customerNo: customer.customerNo, phone: customer.phone } : null,
            loyalty: customer && earn ? { earned: earn.points, balance: customer.loyaltyPoints, tier: customer.loyaltyTier } : null, paper: s.receipt ? s.receipt.paper ?? "80mm" : "80mm",
            discounts: redemptions.map((r) => ({ name: promoNames.get(r.promotionId) ?? "Promotion", amount: (0, money_1.money)(r.discountAmount) })),
            vatBreakdown: [...byRate].map(([rate, v]) => ({ rate, net: (0, money_1.money)(v.net), vat: (0, money_1.money)(v.vat), gross: (0, money_1.money)(v.gross) })),
            receiptNo: sale.receiptNo, soldAt: sale.soldAt, pharmacy: tenant.name, branch: branch.name, branchAddress: branch.address, licenceNo: branch.licenceNo, currency: pack.currency, vatLabel: pack.vat.label, vatLabelAr: pack.vat.labelAr,
            lines: sale.lines.map((l) => ({ name: l.drug?.brandName ?? l.drugId, nameAr: l.drug?.brandNameAr ?? null, strength: l.drug?.strength ?? null, lotNumber: l.lot.lotNumber, quantity: l.quantity, unitPrice: (0, money_1.money)(l.unitPrice), discount: (0, money_1.money)(l.discount), lineTotal: (0, money_1.money)(l.unitPrice.mul(l.quantity).minus(l.discount)), vatRate: l.vatRate.toString(), vatAmount: (0, money_1.money)(l.vatAmount) })),
            subtotal: (0, money_1.money)(sale.subtotal), discountTotal: (0, money_1.money)(sale.discountTotal), vatTotal: (0, money_1.money)(sale.vatTotal), total: (0, money_1.money)(sale.total),
            payments: sale.payments.map((p) => ({ method: p.method, amount: (0, money_1.money)(p.amount), reference: p.reference })), status: sale.status, footer: s.receipt?.footer ?? s.receiptFooter ?? null,
            notice: { en: "Payment record. Not a tax invoice.", ar: "إيصال دفع. ليس فاتورة ضريبية." },
        };
    }
    async receiptHtml(orgId, saleId, lang, format) {
        const r = await this.receipt(orgId, saleId);
        return (format ?? (r.paper === "a4" ? "a4" : "thermal")) === "a4" ? (0, receipt_template_1.renderInvoiceA4Html)(r, lang) : (0, receipt_template_1.renderReceiptHtml)(r, lang);
    }
    async exchange(user, saleId, input) {
        const original = await this.prisma.sale.findFirst({ where: { id: saleId, orgId: user.orgId } });
        if (!original)
            throw (0, errors_1.notFound)("Sale", saleId);
        const dup = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: input.idempotencyKey } } });
        if (dup)
            return { replayed: true, replacement: await this.sales.getSale(user.orgId, dup.id), refund: null };
        await this.sales.priceCart(this.prisma, user, original.branchId, input.newLines, new Date(), false);
        const ret = await this.returnItems(user, saleId, { lines: input.returnLines, reason: `Exchange: ${input.reason}`, refundMethod: input.refundMethod, approval: input.approval });
        try {
            const r = await this.sales.checkout(user, { branchId: original.branchId, idempotencyKey: input.idempotencyKey, lines: input.newLines, payments: input.payments, customerAccountId: original.customerAccountId ?? undefined, patientId: original.patientId ?? undefined, exchangeOfSaleId: saleId, couponCodes: input.couponCodes });
            return { replayed: false, refund: ret.refund, replacement: r.sale, change: r.change };
        }
        catch (e) {
            const code = e instanceof errors_1.DomainError ? e.code : "ERROR";
            throw new errors_1.DomainError("EXCHANGE_REPLACEMENT_FAILED", `The return (${ret.refund}) was posted but the replacement sale failed (${code}). Retry the replacement as a normal sale.`, 409, { refund: ret.refund, cause: code });
        }
    }
    async getSale(orgId, id) { return this.sales.getSale(orgId, id); }
    async listSales(orgId, q) {
        const where = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.shiftId ? { shiftId: q.shiftId } : {}) };
        const [items, total] = await Promise.all([this.prisma.sale.findMany({ where, include: { payments: true }, orderBy: { soldAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.sale.count({ where })]);
        return { items, total };
    }
};
exports.PosService = PosService;
exports.PosService = PosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __param(2, (0, common_1.Inject)(price_service_1.PriceService)),
    __param(3, (0, common_1.Inject)(sales_service_1.SalesService)),
    __param(4, (0, common_1.Inject)(approval_service_1.ApprovalService)),
    __param(5, (0, common_1.Inject)(psp_adapter_1.PspAdapter)),
    __param(6, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(7, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_ledger_service_1.StockLedger,
        price_service_1.PriceService,
        sales_service_1.SalesService,
        approval_service_1.ApprovalService,
        psp_adapter_1.PspAdapter, Object, tenant_mode_service_1.TenantModeService])
], PosService);
//# sourceMappingURL=pos.service.js.map