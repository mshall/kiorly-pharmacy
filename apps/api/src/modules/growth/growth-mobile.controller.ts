import { Body, Controller, Get, HttpCode, Inject, Param, Patch, Post, Query, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { badRequest } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { CurrentUser } from "../../auth/decorators";
import { RequiresFlag, RequiresFlagGuard } from "../../feature-flags/requires-flag.guard";
import { GrowthMobileService } from "./growth-mobile.service";
import { GROWTH_FLAG, type CreateLinkBody, type UpdateLinkBody } from "./provider-links.service";

/** Kiorly staff app Growth tab API, Pharmacy roles (GRW-P4-B1). Plan gate `mobile_staff_app` first (global MobileClientGuard), then role and Kiorex connection. */
@ApiTags("mobile")
@ApiBearerAuth()
@UseGuards(RequiresFlagGuard)
@Controller("mobile/growth")
export class GrowthMobileController {
  constructor(@Inject(GrowthMobileService) private readonly svc: GrowthMobileService) {}

  @Get() @ApiOperation({ summary: "Growth tab payload: links with 30-day counts, performance, recommendations, profile link" })
  overview(@CurrentUser() u: AuthUser) { return this.svc.overview(u); }

  @Get("links") @ApiOperation({ summary: "My provider links with last-30-day counts" })
  links(@CurrentUser() u: AuthUser) { return this.svc.linksOnly(u); }

  @Get("commission-rate") @ApiOperation({ summary: "COM-2: the Kiorex commission rate, read only (owner, branch manager, chain operations)" })
  commissionRate(@CurrentUser() u: AuthUser) { return this.svc.commissionRate(u); }

  @Get("commission-statement") @ApiOperation({ summary: "COM-3: settlement statement of one period YYYY-MM, read only (owner, branch manager, chain operations)" })
  commissionStatement(@CurrentUser() u: AuthUser, @Query("period") period?: string) { return this.svc.commissionStatement(u, period); }

  @Get("qr") @ApiOperation({ summary: "QR (SVG) of a link" })
  async qr(@CurrentUser() u: AuthUser, @Res({ passthrough: true }) res: Response, @Query("linkId") linkId?: string, @Query("format") format?: string) {
    if (!linkId) throw badRequest("GROWTH_LINK_INVALID", "linkId is required");
    if (format === "json") return this.svc.qrJson(u, linkId); // the staff app client reads JSON only
    const svg = await this.svc.qr(u, linkId); res.type("image/svg+xml; charset=utf-8"); return svg;
  }

  @RequiresFlag(GROWTH_FLAG) @Post("links") @HttpCode(201) @ApiOperation({ summary: "Create a link (plan link limits apply)" })
  create(@CurrentUser() u: AuthUser, @Body() b: CreateLinkBody) { return this.svc.create(u, b ?? {}); }

  @Patch("links/:id") @ApiOperation({ summary: "Pause or resume a link (revoke is web only)" })
  update(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() b: UpdateLinkBody) { return this.svc.update(u, id, b ?? {}); }
}
