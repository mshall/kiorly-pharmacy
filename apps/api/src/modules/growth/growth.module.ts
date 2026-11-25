import { Module } from "@nestjs/common";
import { MarketplaceHmacGuard } from "../marketplace/marketplace-hmac.guard";
import { CommissionRateService } from "./commission-rate.service";
import { GrowthInsightsService } from "./growth-insights.service";
import { GrowthMobileController } from "./growth-mobile.controller";
import { GrowthMobileService } from "./growth-mobile.service";
import { LinkRegistryLookupController } from "./link-registry.lookup.controller";
import { ProviderLinksController } from "./provider-links.controller";
import { ProviderLinksService } from "./provider-links.service";
import { PublicLinkController } from "./public-link.controller";

/** GRW-P4-B1 provider links for Kiorly Pharmacy. Prisma, audit, outbox and flags are global modules. Docs/GROWTH.md. */
@Module({
  controllers: [ProviderLinksController, GrowthMobileController, PublicLinkController, LinkRegistryLookupController],
  providers: [ProviderLinksService, GrowthInsightsService, CommissionRateService, GrowthMobileService, MarketplaceHmacGuard],
  exports: [ProviderLinksService, CommissionRateService],
})
export class GrowthModule {}
