import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { MobileDevicesService } from "./mobile-devices.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";

/** Routes the Kiorly Work client may call even without the mobile_staff_app entitlement (login, bootstrap, safety alerts ADR-025, own sign-out). */
export function isEntitlementExempt(method: string, path: string): boolean {
  const p = path.split("?")[0]!.replace(/\/+$/, "");
  if (/^\/api\/v1\/auth(\/|$)/.test(p) || p === "/api/v1/mobile/bootstrap") return true;
  if (/^\/api\/v1\/mobile\/alerts(\/|$)/.test(p)) return true;
  if (method === "POST" && p === "/api/v1/mobile/upgrade-request") return true;
  return method === "DELETE" && /^\/api\/v1\/mobile\/devices\/[^/]+$/.test(p);
}

/**
 * Global guard (registered after AuthGuard). 1) Device-bound sessions: X-Kiorly-Device + X-Kiorly-Device-Token must match an ACTIVE device of the
 * caller, else 401 DEVICE_REVOKED (remote sign-out takes effect on the next request). 2) Client entitlement: requests from the Kiorly Work client
 * (X-Kiorly-Client: kiorly-work/<version>) on a tenant without mobile_staff_app get 403 FEATURE_DISABLED, except the exempt routes above.
 */
@Injectable()
export class MobileClientGuard implements CanActivate {
  constructor(@Inject(MobileDevicesService) private readonly devices: MobileDevicesService, @Inject(MobileEntitlementService) private readonly ent: MobileEntitlementService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (ctx.getType() !== "http") return true;
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser; method: string; originalUrl?: string; url: string; headers: Record<string, string | string[] | undefined> }>();
    if (!req.user) return true;
    const h = (n: string) => { const v = req.headers[n]; return Array.isArray(v) ? v[0] : v; };
    await this.devices.verify(req.user, h("x-kiorly-device"), h("x-kiorly-device-token"));
    if (h("x-kiorly-client")?.startsWith("kiorly-work") && !isEntitlementExempt(req.method, req.originalUrl ?? req.url)) {
      await this.ent.assertEnabled(req.user.orgId);
    }
    return true;
  }
}
