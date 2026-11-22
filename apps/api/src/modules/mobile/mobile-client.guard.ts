import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { PermissionsService } from "../../auth/permissions.service";
import type { Permission } from "../../auth/permissions";
import { DomainError } from "../../common/errors";
import { MobileDevicesService } from "./mobile-devices.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";

import { isEntitlementExempt, isMobilePlanGated } from "./mobile-gate";
export { isEntitlementExempt };

/**
 * Global guard (registered after AuthGuard). 1) Device-bound sessions: X-Kiorly-Device + X-Kiorly-Device-Token must match an ACTIVE device of the
 * caller, else 401 DEVICE_REVOKED (remote sign-out takes effect on the next request). 2) Client entitlement: requests from the Kiorly Team client
 * (X-Kiorly-Client: kiorly-work/<version>) or any /mobile/* route, on a tenant without mobile_staff_app get 403 FEATURE_DISABLED, except the exempt routes above.
 */
@Injectable()
export class MobileClientGuard implements CanActivate {
  constructor(
    @Inject(MobileDevicesService) private readonly devices: MobileDevicesService,
    @Inject(MobileEntitlementService) private readonly ent: MobileEntitlementService,
    @Inject(PermissionsService) private readonly perms: PermissionsService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (ctx.getType() !== "http") return true;
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser; method: string; originalUrl?: string; url: string; headers: Record<string, string | string[] | undefined> }>();
    if (!req.user) return true;
    const h = (n: string) => { const v = req.headers[n]; return Array.isArray(v) ? v[0] : v; };
    await this.devices.verify(req.user, h("x-kiorly-device"), h("x-kiorly-device-token"));
    if (isMobilePlanGated(req)) {
      await this.ent.assertEnabled(req.user.orgId);
      // RBAC deferred by AuthGuard so the plan gate answers first
      const need = (req as { deferredPerms?: Permission[] }).deferredPerms;
      if (need?.length) {
        const have = await this.perms.forRole(req.user.orgId, req.user.role);
        const missing = need.filter((p) => !have.has(p));
        if (missing.length) throw new DomainError("PERMISSION_DENIED", `Missing permission: ${missing.join(", ")}`, 403, { missing });
      }
    }
    return true;
  }
}
