import { marketToday } from "../../common/dates";
import { Controller, Get, Inject, Injectable, Module, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { resolveBranchId } from "../../common/branch-scope";
import { money } from "../../common/money";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";

@Injectable()
export class DashboardService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService) {}

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
    return {
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

@Module({ controllers: [DashboardController], providers: [DashboardService] })
export class DashboardModule {}
