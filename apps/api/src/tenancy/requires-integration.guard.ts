import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { TenantModeService } from "./tenant-mode.service";
import type { AuthUser } from "../auth/auth-user";

/** Optional Kiorex/Kiorly integration surface: in STANDALONE mode every route behind this guard is 403 STANDALONE_MODE (no external service is ever contacted). */
@Injectable()
export class RequiresIntegrationGuard implements CanActivate {
  constructor(@Inject(TenantModeService) private readonly mode: TenantModeService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser; tenant?: { id: string } }>();
    const orgId = req.user?.orgId ?? req.tenant?.id;
    if (!orgId) return true; // unauthenticated routes verify their own credentials first
    if (await this.mode.isStandalone(orgId)) {
      throw new ForbiddenException({ statusCode: 403, code: "STANDALONE_MODE", message: "This pharmacy runs in standalone mode; Kiorex integration is switched off in Settings." });
    }
    return true;
  }
}
