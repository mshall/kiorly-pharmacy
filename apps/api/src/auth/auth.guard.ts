import { CanActivate, ExecutionContext, Inject, Injectable, Optional, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";
import { IS_PUBLIC, REQUIRES_PERM } from "./decorators";
import { authMode, TokenVerifier } from "./token-verifier";
import { PassportService } from "./passport.service";
import { passportConfig } from "./passport";
import { PRIVILEGED_ROLES, type Permission } from "./permissions";
import { PermissionsService } from "./permissions.service";
import type { AuthUser } from "./auth-user";
import { isMobilePlanGated } from "../modules/mobile/mobile-gate";
import { DomainError, forbidden } from "../common/errors";

/**
 * Global guard: authenticates (JWT), loads the staff user + tenant, and enforces @Perm(...) permissions.
 * Tenant isolation (safety control) is structural: orgId ONLY ever comes from the verified token's staff row, never from the request.
 * Not flag-controlled (ADR-025).
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(TokenVerifier) private readonly tokens: TokenVerifier,
    @Inject(PermissionsService) private readonly perms: PermissionsService,
    @Optional() @Inject(PassportService) private readonly passport?: PassportService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (ctx.getType() !== "http") return true;
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()])) return true;
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: AuthUser; method: string; originalUrl?: string; url: string }>();
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedException({ statusCode: 401, code: "UNAUTHENTICATED", message: "Missing bearer token" });
    let verified;
    try {
      verified = await this.tokens.verify(header.slice(7));
    } catch {
      throw new UnauthorizedException({ statusCode: 401, code: "INVALID_TOKEN", message: "Invalid or expired token" });
    }
    // product tokens carry the staff id; a raw Passport access token (staff mobile app) maps by subject, linking by verified phone on first login
    const cfg = verified.passport ? passportConfig() : null;
    const staff = verified.passport && cfg && this.passport
      ? await this.passport.resolveStaff(verified.claims, cfg)
      : await this.prisma.staffUser.findFirst({
        where: verified.staffId ? { id: verified.staffId } : authMode() === "local" ? { id: verified.sub } : { subject: verified.sub },
        include: { tenant: true },
      });
    if (!staff || !staff.active) throw new UnauthorizedException({ statusCode: 401, code: "UNKNOWN_STAFF", message: "No active staff account" });
    if (process.env.NODE_ENV === "production" && authMode() === "oidc" && PRIVILEGED_ROLES.includes(staff.role) && !verified.mfa) {
      throw forbidden("MFA_REQUIRED", "Privileged roles require multi-factor authentication");
    }
    const user: AuthUser = {
      userId: staff.id, orgId: staff.orgId, role: staff.role, displayName: staff.displayName, branchId: staff.branchId,
      market: staff.tenant.marketCode, edition: staff.tenant.edition, pharmacistLicenceNo: staff.pharmacistLicenceNo, mfa: verified.mfa,
    };
    req.user = user;
    const need = this.reflector.getAllAndOverride<Permission[] | undefined>(REQUIRES_PERM, [ctx.getHandler(), ctx.getClass()]);
    if (need?.length && isMobilePlanGated(req)) {
      // plan-gated /mobile routes: FEATURE_DISABLED must win over PERMISSION_DENIED, so MobileClientGuard runs this check after the entitlement check
      (req as { deferredPerms?: Permission[] }).deferredPerms = need;
      return true;
    }
    if (need?.length) {
      const have = await this.perms.forRole(user.orgId, user.role);
      const missing = need.filter((p) => !have.has(p));
      if (missing.length) throw new DomainError("PERMISSION_DENIED", `Missing permission: ${missing.join(", ")}`, 403, { missing });
    }
    return true;
  }
}
