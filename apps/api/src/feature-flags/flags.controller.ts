import { Body, Controller, Get, Headers, HttpCode, Inject, Post, Req, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { verifyWebhook } from "@kiorex/contracts";
import { Public, CurrentUser } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { FeatureFlagsService } from "./feature-flags.service";
import { FLAG_DEFINITIONS } from "./feature-flag-keys";

@ApiTags("feature-flags")
@Controller("feature-flags")
export class FlagsController {
  constructor(@Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService) {}

  /** Effective flags for the caller's org/market (drives the UI; OFF never hides data, it only gates the capability). */
  @Get("effective")
  @ApiBearerAuth()
  effective(@CurrentUser() u: AuthUser) {
    return Object.fromEntries(FLAG_DEFINITIONS.map((f) => {
      const d = this.flags.evaluate(f.key, { orgId: u.orgId, market: u.market });
      return [f.key, { enabled: d.enabled, scope: d.scope ?? null }];
    }));
  }

  /** Push from the Kiorex control plane: `flag.changed`, signed with the webhook scheme and the per-product flags secret. */
  @Post("kiorex/changed")
  @Public()
  @HttpCode(202)
  async changed(@Req() req: { rawBody?: Buffer }, @Headers() headers: Record<string, string>, @Body() _body: unknown) {
    const secret = process.env.KIOREX_FLAGS_WEBHOOK_SECRET ?? process.env.KIOREX_PRODUCT_SECRET ?? "ff_dev_secret_change_me";
    const raw = req.rawBody ?? Buffer.from(JSON.stringify(_body ?? {}));
    const v = verifyWebhook({ secret, body: raw, timestamp: headers["x-kiorly-timestamp"], signature: headers["x-kiorly-signature"] });
    if (!v.ok) throw new UnauthorizedException({ statusCode: 401, code: "BAD_SIGNATURE", message: v.reason });
    const result = await this.flags.refresh();
    return { accepted: true, refresh: result };
  }
}
