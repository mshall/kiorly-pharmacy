import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money, round2, sum } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import { NotificationsService } from "../../platform/adapters/notifications.service";

@Injectable()
export class ShiftsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
  ) {}

  async open(user: AuthUser, branchId: string, openingFloat: string) {
    const open = await this.prisma.shift.findFirst({ where: { orgId: user.orgId, branchId, status: "OPEN" } });
    if (open) throw new DomainError("SHIFT_ALREADY_OPEN", "A shift is already open for this branch", 409, { shiftId: open.id });
    if (D(openingFloat).isNeg()) throw new DomainError("INVALID_AMOUNT", "Opening float must be >= 0", 400);
    const s = await this.prisma.shift.create({ data: { orgId: user.orgId, branchId, openedBy: user.userId, openingFloat } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "shift.open", entityType: "Shift", entityId: s.id, meta: { openingFloat: money(openingFloat) } } });
    return s;
  }

  current(orgId: string, branchId: string) {
    return this.prisma.shift.findFirst({ where: { orgId, branchId, status: "OPEN" } });
  }

  list(orgId: string, branchId?: string) {
    return this.prisma.shift.findMany({ where: { orgId, ...(branchId ? { branchId } : {}) }, orderBy: { openedAt: "desc" }, take: 50 });
  }

  /** Z-report: sales by tender, returns, voids, VAT lines (for the accountant — never submitted to any authority), expected cash. */
  async zReport(orgId: string, shiftId: string, until?: Date) {
    const shift = await this.prisma.shift.findFirst({ where: { id: shiftId, orgId } });
    if (!shift) throw notFound("Shift", shiftId);
    const end = until ?? shift.closedAt ?? new Date();
    const sales = await this.prisma.sale.findMany({ where: { orgId, shiftId }, include: { payments: true, returns: true } });
    const completed = sales.filter((s) => s.status !== "VOIDED");
    const voided = sales.filter((s) => s.status === "VOIDED");
    const byMethod: Record<string, string> = {};
    for (const s of completed) for (const p of s.payments) byMethod[p.method] = money(D(byMethod[p.method] ?? 0).plus(p.amount));
    const returns = sales.flatMap((s) => s.returns);
    const cashRefunds = sum(returns.filter((r) => r.refundMethod === "CASH").map((r) => r.refund));
    const cashSales = sum(completed.flatMap((s) => s.payments.filter((p) => p.method === "CASH").map((p) => p.amount)));
    const creditPayments = await this.prisma.customerCreditEntry.aggregate({ where: { orgId, kind: "PAYMENT", createdAt: { gte: shift.openedAt, lte: end }, note: { startsWith: `cash:${shift.branchId}` } }, _sum: { amount: true } });
    const collected = D(creditPayments._sum.amount ?? 0).abs();
    const expectedCash = round2(D(shift.openingFloat).plus(cashSales).minus(cashRefunds).plus(collected));
    return {
      shiftId, branchId: shift.branchId, openedAt: shift.openedAt, closedAt: shift.closedAt, openingFloat: money(shift.openingFloat),
      salesCount: completed.length, grossSales: money(sum(completed.map((s) => s.total))), vatTotal: money(sum(completed.map((s) => s.vatTotal))), discountTotal: money(sum(completed.map((s) => s.discountTotal))),
      byMethod, returnsCount: returns.length, returnsTotal: money(sum(returns.map((r) => r.refund))), voidsCount: voided.length, voidsTotal: money(sum(voided.map((s) => s.total))),
      cashSales: money(cashSales), cashRefunds: money(cashRefunds), customerCreditCollected: money(collected), expectedCash: money(expectedCash),
    };
  }

  async close(user: AuthUser, id: string, countedCash: string) {
    const shift = await this.prisma.shift.findFirst({ where: { id, orgId: user.orgId } });
    if (!shift) throw notFound("Shift", id);
    if (shift.status !== "OPEN") throw new DomainError("SHIFT_CLOSED", "Shift already closed", 409);
    const z = await this.zReport(user.orgId, id, new Date());
    const variance = round2(D(countedCash).minus(z.expectedCash));
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
    const settings = (tenant.settings ?? {}) as { shiftVarianceThreshold?: string; ownerPhone?: string; defaultLocale?: "ar" | "en" };
    const pack = this.packs.get(tenant.marketCode);
    const threshold = D(settings.shiftVarianceThreshold ?? pack.shiftVarianceThreshold);
    const alert = variance.abs().gt(threshold);
    const closed = await this.prisma.shift.update({
      where: { id }, data: { status: "CLOSED", closedBy: user.userId, closedAt: new Date(), countedCash, expectedCash: z.expectedCash, variance, varianceAlerted: alert, zReport: { ...z, countedCash: money(countedCash), variance: money(variance) } },
    });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "shift.close", entityType: "Shift", entityId: id, meta: { variance: money(variance), alerted: alert } } });
    if (alert && settings.ownerPhone) {
      const branch = await this.prisma.branch.findUniqueOrThrow({ where: { id: shift.branchId } });
      await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: settings.ownerPhone, template: "shift.variance", locale: settings.defaultLocale ?? "ar", vars: { branch: branch.name, variance: money(variance), currency: pack.currency, threshold: money(threshold) }, refType: "Shift", refId: id });
    }
    return { shift: closed, zReport: closed.zReport, varianceAlert: alert };
  }
}
