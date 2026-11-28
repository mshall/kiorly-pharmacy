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
exports.SalesService = void 0;
const dates_1 = require("../../common/dates");
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const stock_ledger_service_1 = require("../inventory/stock-ledger.service");
const price_service_1 = require("../catalogue/price.service");
const psp_adapter_1 = require("../../platform/adapters/psp.adapter");
const ports_1 = require("../../kernel-adapter/ports");
const approval_service_1 = require("../../auth/approval.service");
const lot_guard_1 = require("../inventory/lot-guard/lot-guard");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
const loyalty_1 = require("../../common/loyalty");
const promotions_1 = require("./promotions");
let SalesService = class SalesService {
    prisma;
    ledger;
    prices;
    psp;
    packs;
    approvals;
    modes;
    constructor(prisma, ledger, prices, psp, packs, approvals, modes) {
        this.prisma = prisma;
        this.ledger = ledger;
        this.prices = prices;
        this.psp = psp;
        this.packs = packs;
        this.approvals = approvals;
        this.modes = modes;
    }
    async vatRateFor(orgId, drug) {
        if (drug.vatRate != null)
            return drug.vatRate;
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        const s = (t.settings ?? {});
        return (0, money_1.D)(s.vatRate ?? this.packs.get(t.marketCode).vat.defaultRate);
    }
    async priceCart(db, user, branchId, lines, at, allowNegative) {
        const out = [];
        const taken = new Map();
        for (const cl of lines) {
            if (!Number.isInteger(cl.quantity) || cl.quantity <= 0)
                throw new errors_1.DomainError("INVALID_QUANTITY", "Quantity must be a positive whole number", 400);
            const drug = await db.drug.findFirst({ where: { id: cl.drugId, active: true, OR: [{ orgId: null }, { orgId: user.orgId }] } });
            if (!drug)
                throw (0, errors_1.notFound)("Drug", cl.drugId);
            if (drug.rxOnly || drug.controlledSchedule !== "NONE")
                throw new errors_1.DomainError("RX_REQUIRED", `${drug.brandName} requires a prescription and pharmacist sign-off; dispense it from the Rx queue`, 409, { drugId: drug.id });
            const price = await this.prices.priceAt(user.orgId, branchId, drug.id, at, db);
            if (!price)
                throw new errors_1.DomainError("NO_PRICE", `No price in the price book for ${drug.brandName}`, 409, { drugId: drug.id });
            const vatRate = await this.vatRateFor(user.orgId, drug);
            const discountTotal = (0, money_1.D)(cl.discount ?? 0);
            if (discountTotal.isNeg() || discountTotal.gt(price.mul(cl.quantity)))
                throw new errors_1.DomainError("INVALID_DISCOUNT", "Discount must be between 0 and the line total", 400);
            let picks;
            if (cl.lotId) {
                const lot = await db.stockLot.findFirst({ where: { id: cl.lotId, orgId: user.orgId, branchId, drugId: drug.id } });
                if (!lot)
                    throw new errors_1.DomainError("LOT_NOT_FOUND", "Lot not found for this drug/branch", 404);
                (0, lot_guard_1.assertSellable)(lot);
                picks = [{ lotId: lot.id, quantity: cl.quantity, negative: false }];
            }
            else {
                const lots = (await db.stockLot.findMany({ where: { orgId: user.orgId, branchId, drugId: drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } })).map((l) => ({ ...l, qtyReserved: l.qtyReserved + (taken.get(l.id) ?? 0) }));
                const { picks: p, shortage } = (0, lot_guard_1.allocateFefo)(lots, cl.quantity);
                picks = p.map((x) => ({ ...x, negative: false }));
                if (shortage > 0) {
                    if (!allowNegative)
                        throw new errors_1.DomainError("INSUFFICIENT_STOCK", `Not enough stock for ${drug.brandName} (short by ${shortage})`, 409, { drugId: drug.id, shortage });
                    const fallback = await db.stockLot.findFirst({ where: { orgId: user.orgId, branchId, drugId: drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, expiryDate: { gte: (0, dates_1.marketToday)() } }, orderBy: [{ expiryDate: "asc" }, { receivedAt: "asc" }] });
                    if (!fallback)
                        throw new errors_1.DomainError("NO_SELLABLE_LOT", `No sellable lot exists for ${drug.brandName}; blocked lots can never be sold`, 409, { drugId: drug.id });
                    picks.push({ lotId: fallback.id, quantity: shortage, negative: true });
                }
            }
            let remainingDiscount = discountTotal;
            for (const [i, p] of picks.entries()) {
                taken.set(p.lotId, (taken.get(p.lotId) ?? 0) + p.quantity);
                const share = i === picks.length - 1 ? remainingDiscount : (0, money_1.round2)(discountTotal.mul(p.quantity).div(cl.quantity));
                remainingDiscount = remainingDiscount.minus(share);
                const gross = price.mul(p.quantity).minus(share);
                out.push({ drugId: drug.id, lotId: p.lotId, quantity: p.quantity, unitPrice: price, discount: share, vatRate, vatAmount: (0, money_1.vatFromGross)(gross, vatRate), negative: p.negative });
            }
        }
        return out;
    }
    async applyPromos(db, user, branchId, priced, coupons, at) {
        const promos = await db.promotion.findMany({ where: { orgId: user.orgId, active: true, startsAt: { lte: at }, AND: [{ OR: [{ endsAt: null }, { endsAt: { gt: at } }] }, { OR: [{ branchId: null }, { branchId }] }] } });
        const live = promos.filter((p) => p.maxUses == null || p.usedCount < p.maxUses);
        const cart = new Map();
        for (const l of priced) {
            const c = cart.get(l.drugId);
            if (c) {
                c.quantity += l.quantity;
                c.manualDiscount = c.manualDiscount.plus(l.discount);
            }
            else
                cart.set(l.drugId, { quantity: l.quantity, unitPrice: l.unitPrice, manualDiscount: l.discount });
        }
        const r = (0, promotions_1.applyPromotions)([...cart].map(([drugId, c]) => ({ drugId, ...c })), live.map((p) => ({ id: p.id, name: p.name, kind: p.kind, couponCode: p.couponCode, drugIds: p.drugIds, params: p.params, minSubtotal: p.minSubtotal, priority: p.priority, stackable: p.stackable })), coupons);
        if (!r.byDrug.size)
            return { lines: priced, applied: r.applied, unusedCoupons: r.unusedCoupons };
        const lines = priced.map((l) => ({ ...l }));
        for (const [drugId, amount] of r.byDrug) {
            const mine = lines.filter((l) => l.drugId === drugId);
            const qty = mine.reduce((a, l) => a + l.quantity, 0);
            let left = amount;
            mine.forEach((l, i) => {
                const share = i === mine.length - 1 ? left : (0, money_1.round2)(amount.mul(l.quantity).div(qty));
                left = left.minus(share);
                l.discount = l.discount.plus(share);
                l.vatAmount = (0, money_1.vatFromGross)(l.unitPrice.mul(l.quantity).minus(l.discount), l.vatRate);
            });
        }
        return { lines, applied: r.applied, unusedCoupons: r.unusedCoupons };
    }
    async guardManualDiscount(user, priced, approval) {
        const subtotal = (0, money_1.sum)(priced.map((l) => l.unitPrice.mul(l.quantity)));
        const manual = (0, money_1.sum)(priced.map((l) => l.discount));
        if (subtotal.lte(0) || manual.lte(0))
            return undefined;
        const limit = (await this.modes.settings(user.orgId)).maxCashierDiscountPct ?? 10;
        if (manual.div(subtotal).mul(100).lte(limit))
            return undefined;
        return this.approvals.approver(user, "pos.discount_override", approval);
    }
    totals(lines) {
        const subtotal = (0, money_1.sum)(lines.map((l) => l.unitPrice.mul(l.quantity)));
        const discountTotal = (0, money_1.sum)(lines.map((l) => l.discount));
        return { subtotal: (0, money_1.round2)(subtotal), discountTotal: (0, money_1.round2)(discountTotal), total: (0, money_1.round2)(subtotal.minus(discountTotal)), vatTotal: (0, money_1.round2)((0, money_1.sum)(lines.map((l) => l.vatAmount))) };
    }
    async nextReceiptNo(tx, branchId) {
        const b = await tx.branch.update({ where: { id: branchId }, data: { receiptCounter: { increment: 1 } } });
        const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        return `${b.code ?? "BR"}-${day}-${String(b.receiptCounter).padStart(5, "0")}`;
    }
    async persist(tx, p) {
        const t = this.totals(p.lines);
        const receiptNo = await this.nextReceiptNo(tx, p.branchId);
        const patientId = p.patientId ?? (p.customerAccountId ? (await tx.customerAccount.findUnique({ where: { id: p.customerAccountId }, select: { patientId: true } }))?.patientId : undefined);
        const sale = await tx.sale.create({
            data: {
                orgId: p.user.orgId, branchId: p.branchId, shiftId: p.shiftId, channel: p.channel ?? "POS", status: "COMPLETED", idempotencyKey: p.idempotencyKey, receiptNo, customerAccountId: p.customerAccountId, patientId, exchangeOfSaleId: p.exchangeOfSaleId, dispensingId: p.dispensingId,
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
        for (const pay of p.payments)
            await tx.salePayment.create({ data: { saleId: sale.id, method: pay.method, amount: pay.amount, reference: pay.reference, status: pay.status ?? "CAPTURED" } });
        for (const a of p.promos ?? []) {
            const ok = await tx.promotion.updateMany({ where: { id: a.promoId, orgId: p.user.orgId, OR: [{ maxUses: null }, { usedCount: { lt: (await tx.promotion.findUniqueOrThrow({ where: { id: a.promoId }, select: { maxUses: true } })).maxUses ?? 2_147_483_647 } }] }, data: { usedCount: { increment: 1 } } });
            if (!ok.count)
                throw new errors_1.DomainError("PROMOTION_EXHAUSTED", "A promotion in this sale has reached its usage limit", 409, { promotionId: a.promoId });
            await tx.promotionRedemption.create({ data: { orgId: p.user.orgId, promotionId: a.promoId, saleId: sale.id, patientId, discountAmount: a.amount, couponCode: a.couponCode } });
        }
        if (patientId && p.channel !== "KIOREX_ORDER") {
            const cfg = (0, loyalty_1.loyaltyConfig)(await this.modes.settings(p.user.orgId));
            const loyaltyPaid = (0, money_1.sum)(p.payments.filter((x) => x.method === "LOYALTY_POINTS").map((x) => x.amount));
            if (loyaltyPaid.gt(0)) {
                const pts = loyaltyPaid.div(cfg.redeemValue).ceil().toNumber();
                if (!(await (0, loyalty_1.redeemPoints)(tx, { orgId: p.user.orgId, patientId, points: pts, saleId: sale.id, by: p.user.userId }, cfg)))
                    throw new errors_1.DomainError("INSUFFICIENT_POINTS", "Not enough loyalty points", 409, { needed: pts });
            }
            await (0, loyalty_1.earnForSale)(tx, { orgId: p.user.orgId, patientId, saleId: sale.id, total: t.total.minus(loyaltyPaid), by: p.user.userId }, cfg);
        }
        else if (p.payments.some((x) => x.method === "LOYALTY_POINTS"))
            throw new errors_1.DomainError("CUSTOMER_REQUIRED", "Loyalty points need a customer", 400);
        await tx.auditLog.create({ data: { orgId: p.user.orgId, actorId: p.user.userId, action: "sale.complete", entityType: "Sale", entityId: sale.id, meta: { total: (0, money_1.money)(t.total), lines: p.lines.length, offline: !!p.offline, dispensingId: p.dispensingId ?? null } } });
        return sale;
    }
    async capturePayments(user, key, total, payments, customerAccountId, offline, patientId) {
        const paid = (0, money_1.sum)(payments.map((p) => p.amount));
        if (paid.lt(total))
            throw new errors_1.DomainError("UNDERPAID", `Payments (${(0, money_1.money)(paid)}) do not cover the total (${(0, money_1.money)(total)})`, 402, { total: (0, money_1.money)(total), paid: (0, money_1.money)(paid) });
        const nonCash = (0, money_1.sum)(payments.filter((p) => p.method !== "CASH").map((p) => p.amount));
        if (nonCash.gt(total))
            throw new errors_1.DomainError("OVERPAID_NON_CASH", "Only cash can be over-tendered", 400);
        const change = paid.minus(total);
        const hasCash = payments.some((p) => p.method === "CASH");
        if (change.gt(0) && (!hasCash || change.gt((0, money_1.sum)(payments.filter((p) => p.method === "CASH").map((p) => p.amount)))))
            throw new errors_1.DomainError("OVERPAID_NON_CASH", "Only cash can be over-tendered", 400);
        const out = [];
        let changeLeft = change;
        for (const [i, p] of payments.entries()) {
            let amount = (0, money_1.D)(p.amount);
            if (amount.lte(0))
                throw new errors_1.DomainError("INVALID_AMOUNT", "Payment amounts must be positive", 400);
            if (p.method === "CASH" && changeLeft.gt(0)) {
                const cut = client_1.Prisma.Decimal.min(changeLeft, amount);
                amount = amount.minus(cut);
                changeLeft = changeLeft.minus(cut);
                if (amount.isZero())
                    continue;
            }
            if (p.method === "KIOREX_PREPAID")
                throw new errors_1.DomainError("METHOD_NOT_ALLOWED", "KIOREX_PREPAID is only valid for Kiorex orders", 400);
            if (p.method === "CUSTOMER_CREDIT") {
                if (!customerAccountId)
                    throw new errors_1.DomainError("CUSTOMER_REQUIRED", "Customer credit needs a customer account", 400);
                out.push({ method: p.method, amount, status: "CAPTURED" });
                continue;
            }
            if (p.method === "CASH") {
                out.push({ method: "CASH", amount, status: "CAPTURED" });
                continue;
            }
            if (p.method === "LOYALTY_POINTS") {
                if (!patientId && !customerAccountId)
                    throw new errors_1.DomainError("CUSTOMER_REQUIRED", "Loyalty points need a customer", 400);
                if (offline)
                    throw new errors_1.DomainError("OFFLINE_METHOD_NOT_SUPPORTED", "Loyalty points cannot be redeemed offline", 409);
                out.push({ method: p.method, amount, status: "CAPTURED" });
                continue;
            }
            if (offline)
                throw new errors_1.DomainError("OFFLINE_METHOD_NOT_SUPPORTED", `${p.method} cannot be taken offline`, 409);
            const r = await this.psp.charge({ orgId: user.orgId, method: p.method, amount: (0, money_1.money)(amount), idempotencyKey: `${key}:${i}`, walletRef: p.walletRef });
            if (r.status !== "CAPTURED")
                throw new errors_1.DomainError("PAYMENT_DECLINED", `Payment declined (${r.declineReason ?? "declined"})`, 402, { method: p.method, reference: r.reference });
            out.push({ method: p.method, amount, reference: r.reference, status: "CAPTURED" });
        }
        return { payments: out, change: (0, money_1.round2)(change) };
    }
    async checkout(user, input) {
        const existing = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: input.idempotencyKey } } });
        if (existing)
            return { sale: await this.getSale(user.orgId, existing.id), change: "0.00", replayed: true };
        if (!input.lines.length)
            throw new errors_1.DomainError("EMPTY_CART", "Cart is empty", 400);
        const shiftId = await this.resolveShift(user, input.branchId, input.shiftId, !!input.offline);
        const at = input.offline ? new Date(input.offline.clientCreatedAt) : new Date();
        let approvedBy;
        let priced;
        let promos = [];
        try {
            priced = await this.priceCart(this.prisma, user, input.branchId, input.lines, at, false);
        }
        catch (e) {
            if (e instanceof errors_1.DomainError && e.code === "INSUFFICIENT_STOCK" && (input.approval || input.approvedByOverride)) {
                approvedBy = input.approvedByOverride ?? (await this.approvals.approver(user, "inventory.negative_stock", input.approval));
                priced = await this.priceCart(this.prisma, user, input.branchId, input.lines, at, true);
            }
            else
                throw e;
        }
        if (!input.offline) {
            await this.guardManualDiscount(user, priced, input.approval);
            const pr = await this.applyPromos(this.prisma, user, input.branchId, priced, input.couponCodes ?? [], at);
            if (pr.unusedCoupons.length)
                throw new errors_1.DomainError("INVALID_COUPON", `Coupon not valid for this cart: ${pr.unusedCoupons.join(", ")}`, 409, { coupons: pr.unusedCoupons });
            priced = pr.lines;
            promos = pr.applied;
        }
        const total = this.totals(priced).total;
        if (input.customerAccountId) {
            const acct = await this.prisma.customerAccount.findFirst({ where: { id: input.customerAccountId, orgId: user.orgId } });
            if (!acct)
                throw (0, errors_1.notFound)("Customer account", input.customerAccountId);
        }
        if (input.patientId && !(await this.prisma.patientRef.findFirst({ where: { id: input.patientId, orgId: user.orgId, active: true } })))
            throw (0, errors_1.notFound)("Customer", input.patientId);
        const { payments, change } = await this.capturePayments(user, input.idempotencyKey, total, input.payments, input.customerAccountId, !!input.offline, input.patientId);
        const credit = (0, money_1.sum)(payments.filter((p) => p.method === "CUSTOMER_CREDIT").map((p) => p.amount));
        try {
            const sale = await this.prisma.$transaction(async (tx) => {
                if (credit.gt(0)) {
                    const [acct] = await tx.$queryRaw `SELECT balance, "creditLimit" FROM "CustomerAccount" WHERE id = ${input.customerAccountId} AND "orgId" = ${user.orgId} FOR UPDATE`;
                    if (!acct || (0, money_1.D)(acct.balance).plus(credit).gt(acct.creditLimit))
                        throw new errors_1.DomainError("CREDIT_LIMIT_EXCEEDED", "Customer credit limit would be exceeded", 402, { balance: (0, money_1.money)(acct?.balance), limit: (0, money_1.money)(acct?.creditLimit) });
                }
                const s = await this.persist(tx, { user, branchId: input.branchId, shiftId, idempotencyKey: input.idempotencyKey, lines: priced, payments, customerAccountId: input.customerAccountId, patientId: input.patientId, exchangeOfSaleId: input.exchangeOfSaleId, approvedBy, offline: input.offline, promos });
                if (credit.gt(0)) {
                    await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: input.customerAccountId, kind: "CHARGE", amount: credit, saleId: s.id, createdBy: user.userId } });
                    await tx.customerAccount.update({ where: { id: input.customerAccountId }, data: { balance: { increment: credit } } });
                }
                return s;
            }, { timeout: 20_000 });
            return { sale: await this.getSale(user.orgId, sale.id), change: (0, money_1.money)(change), replayed: false };
        }
        catch (e) {
            for (const p of payments)
                if (p.reference && p.method !== "CASH")
                    await this.psp.refund({ orgId: user.orgId, reference: p.reference, amount: (0, money_1.money)(p.amount), idempotencyKey: `${input.idempotencyKey}:compensate` }).catch(() => undefined);
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                const dup = await this.prisma.sale.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: input.idempotencyKey } } });
                if (dup)
                    return { sale: await this.getSale(user.orgId, dup.id), change: "0.00", replayed: true };
            }
            throw e;
        }
    }
    async resolveShift(user, branchId, shiftId, offline) {
        if (shiftId) {
            const s = await this.prisma.shift.findFirst({ where: { id: shiftId, orgId: user.orgId, branchId } });
            if (!s)
                throw (0, errors_1.notFound)("Shift", shiftId);
            if (s.status !== "OPEN" && !offline)
                throw new errors_1.DomainError("SHIFT_CLOSED", "Shift is closed", 409);
            return s.status === "OPEN" ? s.id : null;
        }
        const open = await this.prisma.shift.findFirst({ where: { orgId: user.orgId, branchId, status: "OPEN" }, orderBy: { openedAt: "desc" } });
        if (!open && !offline)
            throw new errors_1.DomainError("SHIFT_REQUIRED", "Open a shift before selling", 409);
        return open?.id ?? null;
    }
    async getSale(orgId, id) {
        const sale = await this.prisma.sale.findFirst({ where: { id, orgId }, include: { lines: { include: { lot: { select: { lotNumber: true, expiryDate: true } } } }, payments: true, returns: true } });
        if (!sale)
            throw (0, errors_1.notFound)("Sale", id);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: sale.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        return { ...sale, lines: sale.lines.map((l) => ({ ...l, drug: dm.get(l.drugId) })) };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __param(2, (0, common_1.Inject)(price_service_1.PriceService)),
    __param(3, (0, common_1.Inject)(psp_adapter_1.PspAdapter)),
    __param(4, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(5, (0, common_1.Inject)(approval_service_1.ApprovalService)),
    __param(6, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_ledger_service_1.StockLedger,
        price_service_1.PriceService,
        psp_adapter_1.PspAdapter, Object, approval_service_1.ApprovalService,
        tenant_mode_service_1.TenantModeService])
], SalesService);
//# sourceMappingURL=sales.service.js.map