import { CanActivate, ExecutionContext, HttpException, Inject, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { KERNEL, type Capability, type EntitlementsPort } from "./ports";
import type { AuthUser } from "../auth/auth-user";

export const REQUIRES_ENTITLEMENT = "kx:entitlement";
/** Plan capability gate (HTTP 402 ENTITLEMENT_REQUIRED). Separate from feature flags (403) and never used on safety paths: safety is in every edition. */
export const RequiresEntitlement = (cap: Capability) => SetMetadata(REQUIRES_ENTITLEMENT, cap);

@Injectable()
export class RequiresEntitlementGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector, @Inject(KERNEL.entitlements) private readonly ent: EntitlementsPort) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const cap = this.reflector.getAllAndOverride<Capability | undefined>(REQUIRES_ENTITLEMENT, [ctx.getHandler(), ctx.getClass()]);
    if (!cap) return true;
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser; method?: string }>();
    const user = req.user;
    const m = (req.method ?? "GET").toUpperCase();
    if (!user) return false;
    if (await this.ent.isEntitled(user.orgId, cap, { readOnlyRequest: m === "GET" || m === "HEAD" })) return true;
    throw new HttpException({ statusCode: 402, code: "ENTITLEMENT_REQUIRED", capability: cap, edition: user.edition, message: `Your plan does not include ${cap}` }, 402);
  }
}
