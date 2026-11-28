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
exports.DashboardModule = exports.DashboardController = exports.DashboardService = void 0;
const dates_1 = require("../../common/dates");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const decorators_1 = require("../../auth/decorators");
const branch_scope_1 = require("../../common/branch-scope");
const money_1 = require("../../common/money");
const feature_flags_service_1 = require("../../feature-flags/feature-flags.service");
const permissions_service_1 = require("../../auth/permissions.service");
const finance_service_1 = require("../finance/finance.service");
const finance_module_1 = require("../finance/finance.module");
const alerts_service_1 = require("../admin/alerts.service");
const admin_module_1 = require("../admin/admin.module");
let DashboardService = class DashboardService {
    prisma;
    flags;
    perms;
    finance;
    alerts;
    constructor(prisma, flags, perms, finance, alerts) {
        this.prisma = prisma;
        this.flags = flags;
        this.perms = perms;
        this.finance = finance;
        this.alerts = alerts;
    }
    async summary(u, branchId) {
        const start = (0, dates_1.marketToday)();
        const in30 = new Date(start.getTime() + 30 * 86_400_000);
        const ordersOn = this.flags.isEnabled("pharmacy.kiorex_orders", { orgId: u.orgId, market: u.market });
        const [sales, rxQueue, blocked, expiring, expired, shift, orders, pendingDisp, conflicts, lowRows] = await Promise.all([
            this.prisma.sale.aggregate({ where: { orgId: u.orgId, branchId, soldAt: { gte: start }, status: { not: "VOIDED" } }, _sum: { total: true }, _count: true }),
            this.prisma.prescription.count({ where: { orgId: u.orgId, branchId, status: { in: ["RECEIVED", "VALIDATING", "VALIDATED", "PARTIALLY_DISPENSED"] } } }),
            this.prisma.stockLot.count({ where: { orgId: u.orgId, branchId, status: { in: ["QUARANTINE", "RECALLED", "EXPIRED"] }, qtyOnHand: { gt: 0 } } }),
            this.prisma.stockLot.count({ where: { orgId: u.orgId, branchId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 }, expiryDate: { gte: start, lte: in30 } } }),
            this.prisma.stockLot.count({ where: { orgId: u.orgId, branchId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 }, expiryDate: { lt: start } } }),
            this.prisma.shift.findFirst({ where: { orgId: u.orgId, branchId, status: "OPEN" } }),
            ordersOn ? this.prisma.kiorexOrder.count({ where: { orgId: u.orgId, branchId, status: "RECEIVED" } }) : Promise.resolve(null),
            this.prisma.dispensing.count({ where: { orgId: u.orgId, branchId, status: { in: ["RESERVED"] } } }),
            this.prisma.syncConflict.count({ where: { orgId: u.orgId, branchId, resolved: false } }),
            this.prisma.$queryRaw `
        SELECT COUNT(*) AS n FROM "ReorderPolicy" p WHERE p."orgId" = ${u.orgId} AND p."branchId" = ${branchId} AND
        COALESCE((SELECT SUM(l."qtyOnHand" - l."qtyReserved") FROM "StockLot" l WHERE l."branchId" = p."branchId" AND l."drugId" = p."drugId" AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()),0) <= p."minQty"`,
        ]);
        const [trend, top, refills, rxWaiting, discrepancies, can] = await Promise.all([
            this.prisma.$queryRaw `SELECT date_trunc('day', s."soldAt" AT TIME ZONE 'Africa/Cairo')::date AS day, SUM(s.total) AS total FROM "Sale" s WHERE s."orgId" = ${u.orgId} AND s."branchId" = ${branchId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${new Date(start.getTime() - 6 * 86_400_000)} GROUP BY 1 ORDER BY 1`,
            this.prisma.$queryRaw `SELECT d."brandName", SUM(sl.quantity) AS qty FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "Drug" d ON d.id = sl."drugId" WHERE s."orgId" = ${u.orgId} AND s."branchId" = ${branchId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${new Date(start.getTime() - 6 * 86_400_000)} GROUP BY 1 ORDER BY 2 DESC LIMIT 5`,
            this.prisma.prescription.count({ where: { orgId: u.orgId, branchId, status: "DISPENSED", nextRefillDueAt: { not: null, lte: new Date(Date.now() + 3 * 86_400_000) } } }),
            this.prisma.prescription.count({ where: { orgId: u.orgId, branchId, status: { in: ["RECEIVED", "VALIDATING"] } } }),
            this.prisma.controlledDiscrepancy.count({ where: { orgId: u.orgId, branchId, status: "OPEN" } }),
            this.perms.forRole(u.orgId, u.role),
        ]);
        const finance = can.has("finance.read") ? await this.finance.overview({ orgId: u.orgId, branchId, from: start, to: new Date() }) : null;
        return {
            salesTrend: trend.map((r) => ({ day: r.day.toISOString().slice(0, 10), total: (0, money_1.money)(r.total) })), topSellers: top.map((r) => ({ brandName: r.brandName, qty: Number(r.qty) })), refillsDue: refills, rxVerification: rxWaiting, controlledDiscrepancies: discrepancies,
            finance: finance ? { revenueNet: finance.sales.revenueNet, grossMargin: finance.grossMargin, grossMarginPct: finance.grossMarginPct, expenses: finance.expenses.total, receivables: finance.receivables, payables: finance.payables } : null,
            today: { salesCount: sales._count, salesTotal: (0, money_1.money)(sales._sum.total) }, rxQueue, awaitingSignoff: pendingDisp, blockedLots: blocked, expiring30: expiring, expiredInStock: expired, lowStock: Number(lowRows[0]?.n ?? 0),
            openShift: shift ? { id: shift.id, openedAt: shift.openedAt } : null, kiorexOrdersPending: orders, syncConflicts: conflicts,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __param(2, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __param(3, (0, common_1.Inject)(finance_service_1.FinanceService)),
    __param(4, (0, common_1.Inject)(alerts_service_1.AlertsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, feature_flags_service_1.FeatureFlagsService, permissions_service_1.PermissionsService, finance_service_1.FinanceService, alerts_service_1.AlertsService])
], DashboardService);
let DashboardController = class DashboardController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    async get(u, branchId) { return this.svc.summary(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    notifications(u) { return this.prisma.notification.findMany({ where: { orgId: u.orgId }, orderBy: { createdAt: "desc" }, take: 100 }); }
    outbox(u) { return this.prisma.outboxEvent.findMany({ where: { orgId: u.orgId }, orderBy: { occurredAt: "desc" }, take: 100, select: { id: true, type: true, aggregateId: true, status: true, attempts: true, lastError: true, occurredAt: true, sentAt: true } }); }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "get", null);
__decorate([
    (0, common_1.Get)("notifications"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "notifications", null);
__decorate([
    (0, common_1.Get)("outbox"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "outbox", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)("dashboard"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("dashboard"),
    __param(0, (0, common_1.Inject)(DashboardService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [DashboardService, prisma_service_1.PrismaService])
], DashboardController);
let DashboardModule = class DashboardModule {
};
exports.DashboardModule = DashboardModule;
exports.DashboardModule = DashboardModule = __decorate([
    (0, common_1.Module)({ imports: [finance_module_1.FinanceModule, admin_module_1.AdminModule], controllers: [DashboardController], providers: [DashboardService] })
], DashboardModule);
//# sourceMappingURL=dashboard.module.js.map