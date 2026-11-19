import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FeatureFlagsService } from "./feature-flags.service";

export const REQUIRES_FLAG = "kx:requires-flag";
/** Never use on a safety path (ADR-025). OFF => 403 FEATURE_DISABLED {key, scope}. */
export const RequiresFlag = (key: string) => SetMetadata(REQUIRES_FLAG, key);

@Injectable()
export class RequiresFlagGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService,
  ) {}

  canActivate(ctx: ExecutionContext): boolean {
    const key = this.reflector.getAllAndOverride<string | undefined>(REQUIRES_FLAG, [ctx.getHandler(), ctx.getClass()]);
    if (!key) return true;
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    // TODO(auth): orgId/market come from the verified Kiorex Account token once auth lands.
    const d = this.flags.evaluate(key, { orgId: req.headers["x-org-id"], market: req.headers["x-market"] });
    if (d.enabled) return true;
    throw new ForbiddenException({ code: "FEATURE_DISABLED", key: d.key, scope: d.scope });
  }
}
