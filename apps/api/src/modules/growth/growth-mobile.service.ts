import { Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { GrowthInsightsService } from "./growth-insights.service";
import { kiorexWebBase, PRODUCT_LANDING_PATH } from "./link-urls";
import { ProviderLinksService, type CreateLinkBody, type UpdateLinkBody } from "./provider-links.service";

/**
 * Kiorly staff app Growth payload for Pharmacy roles (GRW-P4-B1). `/mobile/*` is plan-gated by MobileClientGuard (`mobile_staff_app`, 403 FEATURE_DISABLED)
 * before any of this runs; the role matrix and the Kiorex connection are enforced here. No customer data and no money are returned anywhere.
 */
@Injectable()
export class GrowthMobileService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ProviderLinksService) private readonly links: ProviderLinksService,
    @Inject(GrowthInsightsService) private readonly insights: GrowthInsightsService,
  ) {}

  async overview(u: AuthUser) {
    this.links.assert(u, "view");
    await this.links.assertConnected(u.orgId);
    const [access, list, performance, recs, tenant] = await Promise.all([
      this.links.access(u), this.links.list(u), this.insights.performance(u, { days: 30 }), this.insights.recommendations(u),
      this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId }, select: { name: true } }),
    ]);
    return {
      product: "PHARMACY" as const,
      level: access.level, can: { ...access.can, revoke: false /* revoke is web only */ }, plan: access.plan, branchScoped: access.branchScoped,
      profileUrl: `${kiorexWebBase()}${PRODUCT_LANDING_PATH.PHARMACY}`,
      links: list.items,
      performance: { days: performance.days, links: performance.links, providerOriginated: performance.providerOriginated, marketplaceOriginated: performance.marketplaceOriginated, acquisitionPending: performance.acquisitionPending },
      recommendations: recs.items.slice(0, 5),
      statement: performance.statement,
      organisation: tenant.name,
      webGrowthPath: "/growth",
    };
  }

  async linksOnly(u: AuthUser) { const o = await this.links.list(u); const a = await this.links.access(u); return { items: o.items, can: { ...a.can, revoke: false }, plan: a.plan }; }
  qr(u: AuthUser, linkId: string) { return this.links.qrSvgFor(u, linkId); }
  create(u: AuthUser, b: CreateLinkBody) { return this.links.create(u, b); }
  update(u: AuthUser, id: string, b: UpdateLinkBody) { return this.links.update(u, id, { status: b.status, label: b.label }, { allowRevoke: false }); }
}
