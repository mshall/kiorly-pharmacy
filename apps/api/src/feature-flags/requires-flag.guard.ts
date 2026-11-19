import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FeatureFlagsService } from "./feature-flags.service";
import type { AuthUser } from "../auth/auth-user";

export const REQUIRES_FLAG = "kx:requires-flag";
/** Never use on a safety path (ADR-025). OFF => 403 FEATURE_DISABLED {key, scope}; OFF never hides or deletes data. */
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
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser; flagContext?: { orgId?: string; market?: string } }>();
    const c = req.user ? { orgId: req.user.orgId, market: req.user.market } : req.flagContext ?? {};
    const d = this.flags.evaluate(key, c);
    if (d.enabled) return true;
    throw new ForbiddenException({ statusCode: 403, code: "FEATURE_DISABLED", key: d.key, scope: d.scope ?? "global", message: "This capability is temporarily unavailable." });
  }
}
