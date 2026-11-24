import { Controller, Get, Inject, NotFoundException, Param, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../../auth/decorators";
import { MarketplaceHmacGuard } from "../marketplace/marketplace-hmac.guard";
import { ProviderLinksService } from "./provider-links.service";

/**
 * Signed lookup and reconciliation feed for the Kiorex link registry (copy of the Clinic 1.11.0 contract, `product` PHARMACY added; machine API outside /api/v1,
 * request HMAC). The client key binds exactly ONE organisation, so a Kiorex client can only ever read the links of the organisation it is registered for.
 */
@ApiTags("kiorex-links")
@Public()
@UseGuards(MarketplaceHmacGuard)
@Controller("marketplace/v1/referral-links")
export class LinkRegistryLookupController {
  constructor(@Inject(ProviderLinksService) private readonly links: ProviderLinksService) {}

  @Get(":code") @ApiOperation({ summary: "Signed lookup of one referral link (link registry): code, organisation, product, status" })
  async one(@Req() req: { tenant: { id: string } }, @Param("code") code: string) {
    const rec = await this.links.lookupRecord(req.tenant.id, code);
    if (!rec) throw new NotFoundException({ code: "REFERRAL_LINK_NOT_FOUND", message: "No link with this code exists" });
    return rec;
  }

  @Get() @ApiOperation({ summary: "Reconciliation feed: links created or changed since a timestamp, oldest first, cursor paged" })
  feed(@Req() req: { tenant: { id: string } }, @Query("updatedSince") updatedSince?: string, @Query("limit") limit?: string, @Query("cursor") cursor?: string) {
    const since = updatedSince ? new Date(updatedSince) : undefined;
    return this.links.listRecords(req.tenant.id, { updatedSince: since && !Number.isNaN(since.getTime()) ? since : undefined, limit: limit ? Number(limit) : undefined, cursor });
  }
}
