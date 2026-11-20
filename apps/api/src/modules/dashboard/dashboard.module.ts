import { marketToday } from "../../common/dates";
import { Controller, Get, Inject, Injectable, Module, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { resolveBranchId } from "../../common/branch-scope";
import { money } from "../../common/money";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { PermissionsService } from "../../auth/permissions.service";
import { FinanceService } from "../finance/finance.service";
import { FinanceModule } from "../finance/finance.module";
import { AlertsService } from "../admin/alerts.service";
import { AdminModule } from "../admin/admin.module";

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService, @Inject(PermissionsService) private readonly perms: PermissionsService, @Inject(FinanceService) private readonly finance: FinanceService, @Inject(AlertsService) private readonly alerts: AlertsService) {}

  async summary(u: AuthUser, branchId: string) {
    const start = marketToday();
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
      this.prisma.$queryRaw<Array<{ n: bigint }>>`
        SELECT COUNT(*) AS n FROM "ReorderPolicy" p WHERE p."orgId" = ${u.orgId} AND p."branchId" = ${branchId} AND
        COALESCE((SELECT SUM(l."qtyOnHand" - l."qtyReserved") FROM "StockLot" l WHERE l."branchId" = p."branchId" AND l."drugId" = p."drugId" AND l.status IN ('AVAILABLE','RESERVED') AND l."expiryDate" >= kx_today()),0) <= p."minQty"`,
    ]);
    const [trend, top, refills, rxWaiting, discrepancies, can] = await Promise.all([
      this.prisma.$queryRaw<Array<{ day: Date; total: string }>>`SELECT date_trunc('day', s."soldAt" AT TIME ZONE 'Africa/Cairo')::date AS day, SUM(s.total) AS total FROM "Sale" s WHERE s."orgId" = ${u.orgId} AND s."branchId" = ${branchId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${new Date(start.getTime() - 6 * 86_400_000)} GROUP BY 1 ORDER BY 1`,
      this.prisma.$queryRaw<Array<{ brandName: string; qty: bigint }>>`SELECT d."brandName", SUM(sl.quantity) AS qty FROM "SaleLine" sl JOIN "Sale" s ON s.id = sl."saleId" JOIN "Drug" d ON d.id = sl."drugId" WHERE s."orgId" = ${u.orgId} AND s."branchId" = ${branchId} AND s.status <> 'VOIDED' AND s."soldAt" >= ${new Date(start.getTime() - 6 * 86_400_000)} GROUP BY 1 ORDER BY 2 DESC LIMIT 5`,
      this.prisma.prescription.count({ where: { orgId: u.orgId, branchId, status: "DISPENSED", nextRefillDueAt: { not: null, lte: new Date(Date.now() + 3 * 86_400_000) } } }),
      this.prisma.prescription.count({ where: { orgId: u.orgId, branchId, status: { in: ["RECEIVED", "VALIDATING"] } } }),
      this.prisma.controlledDiscrepancy.count({ where: { orgId: u.orgId, branchId, status: "OPEN" } }),
      this.perms.forRole(u.orgId, u.role),
    ]);
    const finance = can.has("finance.read") ? await this.finance.overview({ orgId: u.orgId, branchId, from: start, to: new Date() }) : null;
    return {
      salesTrend: trend.map((r) => ({ day: r.day.toISOString().slice(0, 10), total: money(r.total) })), topSellers: top.map((r) => ({ brandName: r.brandName, qty: Number(r.qty) })), refillsDue: refills, rxVerification: rxWaiting, controlledDiscrepancies: discrepancies,
      finance: finance ? { revenueNet: finance.sales.revenueNet, grossMargin: finance.grossMargin, grossMarginPct: finance.grossMarginPct, expenses: finance.expenses.total, receivables: finance.receivables, payables: finance.payables } : null,
      today: { salesCount: sales._count, salesTotal: money(sales._sum.total) }, rxQueue, awaitingSignoff: pendingDisp, blockedLots: blocked, expiring30: expiring, expiredInStock: expired, lowStock: Number(lowRows[0]?.n ?? 0),
      openShift: shift ? { id: shift.id, openedAt: shift.openedAt } : null, kiorexOrdersPending: orders, syncConflicts: conflicts,
    };
  }
}

@ApiTags("dashboard")
@ApiBearerAuth()
@Controller("dashboard")
export class DashboardController {
  constructor(@Inject(DashboardService) private readonly svc: DashboardService, @Inject(PrismaService) private readonly prisma: PrismaService) {}
  @Get() @Perm("catalogue.read")
  async get(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.summary(u, await resolveBranchId(this.prisma, u, branchId)); }

  /** Dev inbox of every (mock) outbound message — WhatsApp / SMS / email. */
  @Get("notifications") @Perm("settings.read")
  notifications(@CurrentUser() u: AuthUser) { return this.prisma.notification.findMany({ where: { orgId: u.orgId }, orderBy: { createdAt: "desc" }, take: 100 }); }

  /** Outbox visibility for operators (events to Kiorex and their delivery state). */
  @Get("outbox") @Perm("settings.read")
  outbox(@CurrentUser() u: AuthUser) { return this.prisma.outboxEvent.findMany({ where: { orgId: u.orgId }, orderBy: { occurredAt: "desc" }, take: 100, select: { id: true, type: true, aggregateId: true, status: true, attempts: true, lastError: true, occurredAt: true, sentAt: true } }); }
}

@Module({ imports: [FinanceModule, AdminModule], controllers: [DashboardController], providers: [DashboardService] })
export class DashboardModule {}
