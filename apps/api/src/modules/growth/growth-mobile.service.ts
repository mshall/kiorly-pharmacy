import { Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { webBaseUrl } from "../../auth/handoff";
import { CommissionRateService, RATE_ROLES } from "./commission-rate.service";
import { CommissionStatementService } from "./commission-statement.service";
import { isStatementNotConnected, periodRange } from "./commission-statement";
import { GrowthInsightsService } from "./growth-insights.service";
import { kiorexWebBase, PRODUCT_LANDING_PATH } from "./link-urls";
import { ProviderLinksService, type CreateLinkBody, type UpdateLinkBody } from "./provider-links.service";

/**
 * Kiorly staff app Growth payload for Pharmacy roles (GRW-P4-B1). `/mobile/*` is plan-gated by MobileClientGuard (`mobile_staff_app`, 403 FEATURE_DISABLED)
 * before any of this runs; the role matrix and the Kiorex connection are enforced here. No customer data is returned; money appears only in the read-only commission rate and settlement statement (COM-2/COM-3).
 */
@Injectable()
export class GrowthMobileService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(ProviderLinksService) private readonly links: ProviderLinksService,
    @Inject(GrowthInsightsService) private readonly insights: GrowthInsightsService,
    @Inject(CommissionRateService) private readonly rates: CommissionRateService,
    @Inject(CommissionStatementService) private readonly statements: CommissionStatementService,
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
      level: access.level, can: { ...access.can, revoke: false /* revoke is web only */, commission: RATE_ROLES.has(u.role) }, plan: access.plan, branchScoped: access.branchScoped,
      profileUrl: `${kiorexWebBase()}${PRODUCT_LANDING_PATH.PHARMACY}`,
      links: list.items,
      performance: { days: performance.days, links: performance.links, providerOriginated: performance.providerOriginated, marketplaceOriginated: performance.marketplaceOriginated, acquisitionPending: performance.acquisitionPending },
      recommendations: recs.items.slice(0, 5),
      statement: performance.statement,
      organisation: tenant.name,
      webGrowthPath: "/growth",
      /** Absolute web workspace URL (this product's own web, WEB_APP_URL); null when the deployment has not set it. */
      webGrowthUrl: ((b) => (b ? `${b}/growth` : null))(webBaseUrl()),
    };
  }

  /** COM-2 / COM-3 read-only cards: the Kiorex commission rate and the settlement statement of one month (owner, branch manager, chain operations; others get 403). */
  commissionRate(u: AuthUser) { return this.rates.rate(u); }
  /**
   * The staff app reads the statement on a normal screen, so "Kiorex is not connected for this organisation yet" is an ANSWER, not a server fault: 200 `{ connected: false, code: "STATEMENT_NOT_CONNECTED", period }`
   * (the web workspace route keeps its 503 with the same code). A real failure (Kiorex unreachable, unreadable statement) and a role refusal still throw.
   */
  async commissionStatement(u: AuthUser, period?: string) {
    try { return { connected: true as const, ...(await this.statements.statement(u, period)) }; }
    catch (e) {
      if (isStatementNotConnected(e)) return { connected: false as const, code: "STATEMENT_NOT_CONNECTED" as const, period: periodRange(period)?.key ?? null };
      throw e;
    }
  }
  async linksOnly(u: AuthUser) { const o = await this.links.list(u); const a = await this.links.access(u); return { items: o.items, can: { ...a.can, revoke: false }, plan: a.plan }; }
  qr(u: AuthUser, linkId: string) { return this.links.qrSvgFor(u, linkId); }
  qrJson(u: AuthUser, linkId: string) { return this.links.qrPayloadFor(u, linkId); }
  create(u: AuthUser, b: CreateLinkBody) { return this.links.create(u, b); }
  update(u: AuthUser, id: string, b: UpdateLinkBody) { return this.links.update(u, id, { status: b.status, label: b.label }, { allowRevoke: false }); }
}
