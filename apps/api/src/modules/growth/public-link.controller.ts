import { Controller, Get, Header, Headers, HttpStatus, Inject, NotFoundException, Param, Req, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { Public } from "../../auth/decorators";
import { DomainError } from "../../common/errors";
import { PgRateLimiter, type RawSql } from "../../common/pg-rate-limit";
import { PrismaService } from "../../prisma/prisma.service";
import { isLikelyBot } from "./link-counters";
import { normalizeLinkCode } from "./link-code";
import { assertAllowedRedirect, kiorexLandingUrl } from "./link-urls";
import { ProviderLinksService } from "./provider-links.service";

/**
 * Public short-link resolver (no auth, no cookies, nothing stored about the visitor): `GET /api/v1/public/links/q/:code`. It never redirects to a caller-supplied
 * URL: the destination is the Kiorex pharmacy page built from configuration, with the signed touch (`lt`) and the link's UTM tags, and it is re-checked against
 * the configured host allow-list before the 302. A paused, revoked, unknown-organisation or not-connected link still opens the plain Kiorex page (a printed QR must not
 * break), without attribution and without counting. Malformed codes are a plain 404.
 */
@ApiTags("public")
@Public()
@Controller("public/links")
export class PublicLinkController {
  private limiter?: PgRateLimiter;
  constructor(@Inject(ProviderLinksService) private readonly links: ProviderLinksService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  private async throttle(code: string) {
    this.limiter ??= new PgRateLimiter(this.prisma as unknown as RawSql);
    // keyed by the code, never by the visitor: no IP or device is stored
    const r = await this.limiter.hit(`plink:${code}`, Number(process.env.PUBLIC_LINK_RATE_PER_MINUTE) || 300, 60_000);
    if (!r.ok) throw new DomainError("RATE_LIMITED", "Too many requests, try again shortly", 429, { retryAfterSec: r.retryAfterSec });
  }

  @Get("q/:code") @Header("Cache-Control", "no-store") @Header("Referrer-Policy", "no-referrer")
  @ApiOperation({ summary: "QR short link: 302 to the Kiorex pharmacy page with the signed touch (JSON `{target,status}` when Accept: application/json)" })
  async resolve(@Param("code") rawCode: string, @Headers("accept") accept: string | undefined, @Req() req: Request, @Res() res: Response) {
    const code = normalizeLinkCode(rawCode);
    if (!code) throw new NotFoundException("Link not found");
    await this.throttle(code);
    const link = await this.links.findByCode(code);
    if (!link) throw new NotFoundException("Link not found");
    const touch = await this.links.touch(code, { bot: isLikelyBot(req.headers) });
    const url = kiorexLandingUrl({ product: "PHARMACY", lt: touch?.lt ?? null, channelKind: touch?.link.channelKind, tags: touch?.link.tags });
    const safe = assertAllowedRedirect(url);
    if (accept?.includes("application/json")) return res.status(HttpStatus.OK).json({ target: safe, status: link.status });
    return res.redirect(HttpStatus.FOUND, safe);
  }
}
