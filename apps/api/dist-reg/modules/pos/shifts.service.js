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
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const ports_1 = require("../../kernel-adapter/ports");
const notifications_service_1 = require("../../platform/adapters/notifications.service");
const cash_service_1 = require("./cash.service");
let ShiftsService = class ShiftsService {
    prisma;
    packs;
    notify;
    cash;
    constructor(prisma, packs, notify, cash) {
        this.prisma = prisma;
        this.packs = packs;
        this.notify = notify;
        this.cash = cash;
    }
    async open(user, branchId, openingFloat) {
        const open = await this.prisma.shift.findFirst({ where: { orgId: user.orgId, branchId, status: "OPEN" } });
        if (open)
            throw new errors_1.DomainError("SHIFT_ALREADY_OPEN", "A shift is already open for this branch", 409, { shiftId: open.id });
        if ((0, money_1.D)(openingFloat).isNeg())
            throw new errors_1.DomainError("INVALID_AMOUNT", "Opening float must be >= 0", 400);
        const s = await this.prisma.shift.create({ data: { orgId: user.orgId, branchId, openedBy: user.userId, openingFloat } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "shift.open", entityType: "Shift", entityId: s.id, meta: { openingFloat: (0, money_1.money)(openingFloat) } } });
        return s;
    }
    current(orgId, branchId) {
        return this.prisma.shift.findFirst({ where: { orgId, branchId, status: "OPEN" } });
    }
    list(orgId, branchId) {
        return this.prisma.shift.findMany({ where: { orgId, ...(branchId ? { branchId } : {}) }, orderBy: { openedAt: "desc" }, take: 50 });
    }
    async zReport(orgId, shiftId, until) {
        const shift = await this.prisma.shift.findFirst({ where: { id: shiftId, orgId } });
        if (!shift)
            throw (0, errors_1.notFound)("Shift", shiftId);
        const end = until ?? shift.closedAt ?? new Date();
        const sales = await this.prisma.sale.findMany({ where: { orgId, shiftId }, include: { payments: true, returns: true } });
        const completed = sales.filter((s) => s.status !== "VOIDED");
        const voided = sales.filter((s) => s.status === "VOIDED");
        const byMethod = {};
        for (const s of completed)
            for (const p of s.payments)
                byMethod[p.method] = (0, money_1.money)((0, money_1.D)(byMethod[p.method] ?? 0).plus(p.amount));
        const returns = sales.flatMap((s) => s.returns);
        const cashRefunds = (0, money_1.sum)(returns.filter((r) => r.refundMethod === "CASH").map((r) => r.refund));
        const cashSales = (0, money_1.sum)(completed.flatMap((s) => s.payments.filter((p) => p.method === "CASH").map((p) => p.amount)));
        const creditPayments = await this.prisma.customerCreditEntry.aggregate({ where: { orgId, kind: "PAYMENT", createdAt: { gte: shift.openedAt, lte: end }, note: { startsWith: `cash:${shift.branchId}` } }, _sum: { amount: true } });
        const collected = (0, money_1.D)(creditPayments._sum.amount ?? 0).abs();
        const drawer = await this.cash.totals(orgId, shiftId);
        const expectedCash = (0, money_1.round2)((0, money_1.D)(shift.openingFloat).plus(cashSales).minus(cashRefunds).plus(collected).plus(drawer.cashIn).minus(drawer.cashOut));
        return {
            shiftId, branchId: shift.branchId, openedAt: shift.openedAt, closedAt: shift.closedAt, openingFloat: (0, money_1.money)(shift.openingFloat),
            salesCount: completed.length, grossSales: (0, money_1.money)((0, money_1.sum)(completed.map((s) => s.total))), vatTotal: (0, money_1.money)((0, money_1.sum)(completed.map((s) => s.vatTotal))), discountTotal: (0, money_1.money)((0, money_1.sum)(completed.map((s) => s.discountTotal))),
            byMethod, returnsCount: returns.length, returnsTotal: (0, money_1.money)((0, money_1.sum)(returns.map((r) => r.refund))), voidsCount: voided.length, voidsTotal: (0, money_1.money)((0, money_1.sum)(voided.map((s) => s.total))),
            cashSales: (0, money_1.money)(cashSales), cashRefunds: (0, money_1.money)(cashRefunds), cashIn: (0, money_1.money)(drawer.cashIn), cashOut: (0, money_1.money)(drawer.cashOut), report: until || shift.closedAt ? "Z" : "X", customerCreditCollected: (0, money_1.money)(collected), expectedCash: (0, money_1.money)(expectedCash),
        };
    }
    async close(user, id, countedCash) {
        const shift = await this.prisma.shift.findFirst({ where: { id, orgId: user.orgId } });
        if (!shift)
            throw (0, errors_1.notFound)("Shift", id);
        if (shift.status !== "OPEN")
            throw new errors_1.DomainError("SHIFT_CLOSED", "Shift already closed", 409);
        const z = await this.zReport(user.orgId, id, new Date());
        const variance = (0, money_1.round2)((0, money_1.D)(countedCash).minus(z.expectedCash));
        const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
        const settings = (tenant.settings ?? {});
        const pack = this.packs.get(tenant.marketCode);
        const threshold = (0, money_1.D)(settings.shiftVarianceThreshold ?? pack.shiftVarianceThreshold);
        const alert = variance.abs().gt(threshold);
        const closed = await this.prisma.shift.update({
            where: { id }, data: { status: "CLOSED", closedBy: user.userId, closedAt: new Date(), countedCash, expectedCash: z.expectedCash, variance, varianceAlerted: alert, zReport: { ...z, countedCash: (0, money_1.money)(countedCash), variance: (0, money_1.money)(variance) } },
        });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "shift.close", entityType: "Shift", entityId: id, meta: { variance: (0, money_1.money)(variance), alerted: alert } } });
        if (alert && settings.ownerPhone) {
            const branch = await this.prisma.branch.findUniqueOrThrow({ where: { id: shift.branchId } });
            await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: settings.ownerPhone, template: "shift.variance", locale: settings.defaultLocale ?? "ar", vars: { branch: branch.name, variance: (0, money_1.money)(variance), currency: pack.currency, threshold: (0, money_1.money)(threshold) }, refType: "Shift", refId: id });
        }
        return { shift: closed, zReport: closed.zReport, varianceAlert: alert };
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(2, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(3, (0, common_1.Inject)(cash_service_1.CashService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object, notifications_service_1.NotificationsService,
        cash_service_1.CashService])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map