import { Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { growthLimitsFor } from "./growth-plan-limits";
import { buildPerformance } from "./growth-metrics";
import { THRESHOLDS, buildRecommendations } from "./growth-recommendations";
import { utcDay } from "./link-counters";
import { ProviderLinksService } from "./provider-links.service";

/** Performance and recommendations for the Growth workspace. Aggregates only; no order lines, no customer data and no money leave the database. */
@Injectable()
export class GrowthInsightsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(ProviderLinksService) private readonly links: ProviderLinksService) {}

  async performance(user: AuthUser, q: { days?: number } = {}) {
    const orgId = this.links.assert(user, "view");
    await this.links.assertConnected(orgId);
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { edition: true } });
    const days = Math.min(growthLimitsFor(t.edition).trendDays, Math.max(7, Math.round(q.days ?? 30)));
    const since = utcDay(new Date(Date.now() - (days - 1) * 86_400_000));
    const orderWhere = { orgId, createdAt: { gte: since }, ...(user.branchId ? { branchId: user.branchId } : {}) };
    const linkWhere = { orgId, date: { gte: since }, ...(user.branchId ? { link: { OR: [{ ownerScope: "ORG" as const }, { branchRef: user.branchId }] } } : {}) };
    const [byStatus, daily] = await Promise.all([
      this.prisma.kiorexOrder.groupBy({ by: ["status"], where: orderWhere, _count: { _all: true } }),
      this.prisma.providerReferralLinkDaily.aggregate({ where: linkWhere, _sum: { visits: true, orders: true, completed: true } }),
    ]);
    const n = (...s: string[]) => byStatus.filter((r) => s.includes(r.status)).reduce((a, r) => a + r._count._all, 0);
    const perf = buildPerformance(
      { total: byStatus.reduce((a, r) => a + r._count._all, 0), completed: n("DISPENSED"), rejectedOrCancelled: n("REJECTED", "CANCELLED", "EXPIRED") },
      { visits: daily._sum.visits ?? 0, orders: daily._sum.orders ?? 0, completed: daily._sum.completed ?? 0 },
    );
    return { days, ...perf, statement: { configured: false, note: "No commission is configured for pharmacy orders." } };
  }

  async recommendations(user: AuthUser) {
    const orgId = this.links.assert(user, "view");
    await this.links.assertConnected(orgId);
    const since30 = new Date(Date.now() - 30 * 86_400_000);
    const stale = new Date(Date.now() - THRESHOLDS.unusedAfterDays * 86_400_000);
    const branchFilter = user.branchId ? { id: user.branchId } : {};
    const [active, notListed, visits, byStatus] = await Promise.all([
      this.prisma.providerReferralLink.findMany({ where: { ...{ orgId, status: "ACTIVE" as const }, ...(user.branchId ? { OR: [{ ownerScope: "ORG" as const }, { branchRef: user.branchId }] } : {}) }, select: { id: true, ownerScope: true, createdAt: true } }),
      this.prisma.branch.count({ where: { orgId, active: true, ...branchFilter, NOT: { id: { in: (await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true }, select: { branchId: true } })).map((s) => s.branchId) } } } }),
      this.prisma.providerReferralLinkDaily.groupBy({ by: ["linkId"], where: { orgId, date: { gte: utcDay(since30) } }, _sum: { visits: true } }),
      this.prisma.kiorexOrder.groupBy({ by: ["status"], where: { orgId, createdAt: { gte: since30 }, ...(user.branchId ? { branchId: user.branchId } : {}) }, _count: { _all: true } }),
    ]);
    const visited = new Set(visits.filter((v) => (v._sum.visits ?? 0) > 0).map((v) => v.linkId));
    const total = byStatus.reduce((a, r) => a + r._count._all, 0);
    const bad = byStatus.filter((r) => ["REJECTED", "CANCELLED", "EXPIRED"].includes(r.status)).reduce((a, r) => a + r._count._all, 0);
    const items = buildRecommendations({
      activeLinks: active.length,
      hasDeskLink: active.some((l) => l.ownerScope === "DESK"),
      branchesNotListed: notListed,
      unusedLinks: active.filter((l) => l.createdAt < stale && !visited.has(l.id)).length,
      kiorexOrders30d: total,
      rejectedOrCancelled30d: bad,
    });
    return { items, guardrail: "Recommendations never suggest extra purchases, price pressure on customers or review tactics, and never use what a customer ordered." };
  }
}
