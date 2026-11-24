import { Body, Controller, Get, Inject, Param, Patch, Post, Query, Res, StreamableFile, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { AuthUser } from "../../auth/auth-user";
import { CurrentUser } from "../../auth/decorators";
import { RequiresFlag, RequiresFlagGuard } from "../../feature-flags/requires-flag.guard";
import { GrowthInsightsService } from "./growth-insights.service";
import { GROWTH_FLAG, ProviderLinksService, type CreateLinkBody, type UpdateLinkBody } from "./provider-links.service";

/** Growth workspace API for the pharmacy web app (GRW-P4-B1). Role matrix in `growth-access.ts`; every route needs a Kiorex-connected pharmacy (403 KIOREX_NOT_CONNECTED). */
@ApiTags("growth")
@ApiBearerAuth()
@UseGuards(RequiresFlagGuard)
@Controller("growth")
export class ProviderLinksController {
  constructor(@Inject(ProviderLinksService) private readonly links: ProviderLinksService, @Inject(GrowthInsightsService) private readonly insights: GrowthInsightsService) {}

  @Get("access") @ApiOperation({ summary: "What the signed-in user can do in Growth, plan limits, whether the pharmacy is connected to Kiorex" })
  access(@CurrentUser() u: AuthUser) { return this.links.access(u); }

  @Get("links") @ApiOperation({ summary: "Provider links with last-30-day counters (counts only)" })
  list(@CurrentUser() u: AuthUser, @Query("status") status?: string) { return this.links.list(u, { status }); }

  @RequiresFlag(GROWTH_FLAG) @Post("links") @ApiOperation({ summary: "Create a link (ORG, BRANCH or DESK scope); 8-character code, audited, registry event to Kiorex" })
  create(@CurrentUser() u: AuthUser, @Body() b: CreateLinkBody) { return this.links.create(u, b ?? {}); }

  @Patch("links/:id") @ApiOperation({ summary: "Rename, retag, pause, resume or revoke a link (revoke is permanent and immediately stops attribution at Kiorex)" })
  update(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() b: UpdateLinkBody) { return this.links.update(u, id, b ?? {}); }

  // Content-Type is set only after the service succeeded, so an error answers as JSON (a decorator would force the image type onto the error body).
  @RequiresFlag(GROWTH_FLAG) @Get("links/:id/qr.svg")
  @ApiOperation({ summary: "QR code (SVG, error correction M, 4-module quiet zone) for the short link" })
  async qrSvg(@CurrentUser() u: AuthUser, @Param("id") id: string, @Res({ passthrough: true }) res: Response) {
    const svg = await this.links.qrSvgFor(u, id); res.type("image/svg+xml; charset=utf-8").setHeader("Cache-Control", "private, max-age=300"); return svg;
  }

  @RequiresFlag(GROWTH_FLAG) @Get("links/:id/qr.png")
  @ApiOperation({ summary: "QR code (PNG)" })
  async qrPng(@CurrentUser() u: AuthUser, @Param("id") id: string, @Res({ passthrough: true }) res: Response, @Query("width") width?: string) {
    const png = await this.links.qrPngFor(u, id, width ? Number(width) : undefined); res.type("image/png").setHeader("Cache-Control", "private, max-age=300"); return new StreamableFile(png);
  }

  @RequiresFlag(GROWTH_FLAG) @Get("links/:id/poster")
  @ApiOperation({ summary: "Printable HTML poster or counter card (A4 or A5, Arabic or English; print or Save as PDF)" })
  async poster(@CurrentUser() u: AuthUser, @Param("id") id: string, @Res({ passthrough: true }) res: Response, @Query("lang") lang?: string, @Query("size") size?: string, @Query("kind") kind?: string, @Query("print") print?: string) {
    const html = await this.links.posterHtml(u, id, { lang, size, kind, print: print === "1" }); res.type("text/html; charset=utf-8").setHeader("Cache-Control", "no-store"); return html;
  }

  @Get("summary") @ApiOperation({ summary: "Visits, orders and completed through your links (counts only)" })
  summary(@CurrentUser() u: AuthUser, @Query("days") days?: string) { return this.links.summary(u, { days: days ? Number(days) : undefined }); }

  @Get("performance") @ApiOperation({ summary: "Orders originated through your links versus the Kiorex marketplace (counts only, no money)" })
  performance(@CurrentUser() u: AuthUser, @Query("days") days?: string) { return this.insights.performance(u, { days: days ? Number(days) : undefined }); }

  @Get("recommendations") @ApiOperation({ summary: "Recommendations from a closed catalogue of five rules" })
  recommendations(@CurrentUser() u: AuthUser) { return this.insights.recommendations(u); }
}
