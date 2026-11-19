import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { RequiresFlag, RequiresFlagGuard } from "../../feature-flags/requires-flag.guard";
import { RequiresEntitlement, RequiresEntitlementGuard } from "../../kernel-adapter/requires-entitlement.guard";
import { resolveBranchId } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { ForecastingService } from "./forecasting.service";

/** pharmacy.forecasting (flag, OFF => 403 FEATURE_DISABLED, min/max reorder keeps working) + Pro plan entitlement (402). */
@ApiTags("forecasting")
@ApiBearerAuth()
@UseGuards(RequiresFlagGuard, RequiresEntitlementGuard)
@RequiresFlag("pharmacy.forecasting")
@RequiresEntitlement("forecasting")
@Controller("forecasting")
export class ForecastingController {
  constructor(@Inject(ForecastingService) private readonly svc: ForecastingService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("demand")
  @Perm("forecast.read")
  async demand(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; horizonDays?: string }) {
    return this.svc.forecast(u.orgId, await resolveBranchId(this.prisma, u, q.branchId), Number(q.horizonDays ?? 14));
  }

  @Get("expiry-risk")
  @Perm("forecast.read")
  async expiryRisk(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) {
    return this.svc.expiryRisk(u.orgId, await resolveBranchId(this.prisma, u, branchId));
  }
}
