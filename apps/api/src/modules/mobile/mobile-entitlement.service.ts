import { ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { MOBILE_FLAG, normalisePlan, planIncludesMobile } from "./mobile-plan";

export interface MobileEntitlement {
  key: "mobile_staff_app";
  enabled: boolean;
  requiredPlan: "PRO";
  reason: null | "PLAN_BELOW_PRO" | "FLAG_OFF";
  scope: "org" | "global" | "market" | "dependency" | "launch-locked" | "entitlement";
}

/** mobile_staff_app = plan >= PRO (entitlement input to the flag evaluator) AND the Kiorex flag layers (global/market/org kill switches). */
@Injectable()
export class MobileEntitlementService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService) {}

  async tenant(orgId: string) { return this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }); }

  async evaluate(orgId: string): Promise<MobileEntitlement & { plan: ReturnType<typeof normalisePlan>; rawPlan: string }> {
    const t = await this.tenant(orgId);
    const entitled = planIncludesMobile(t.edition, t.subscriptionStatus);
    const d = this.flags.evaluate(MOBILE_FLAG, { orgId, market: t.marketCode, entitled });
    const base = { key: MOBILE_FLAG as "mobile_staff_app", requiredPlan: "PRO" as const, plan: normalisePlan(t.edition), rawPlan: t.edition };
    if (d.enabled) return { ...base, enabled: true, reason: null, scope: "org" };
    if (!entitled || d.scope === "entitlement") return { ...base, enabled: false, reason: "PLAN_BELOW_PRO", scope: "org" };
    return { ...base, enabled: false, reason: "FLAG_OFF", scope: d.scope ?? "global" };
  }

  /** Throws the standard 403 FEATURE_DISABLED {key, scope} when the org lacks the entitlement. */
  async assertEnabled(orgId: string): Promise<void> {
    const e = await this.evaluate(orgId);
    if (!e.enabled) throw new ForbiddenException({ statusCode: 403, code: "FEATURE_DISABLED", key: "mobile_staff_app", scope: e.reason === "FLAG_OFF" ? e.scope : "org", message: "Kiorly Team is not included in your plan." });
  }
}
