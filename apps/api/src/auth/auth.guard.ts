import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";
import { IS_PUBLIC, REQUIRES_PERM } from "./decorators";
import { authMode, TokenVerifier } from "./token-verifier";
import { PRIVILEGED_ROLES, roleHas, type Permission } from "./permissions";
import type { AuthUser } from "./auth-user";
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
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    if (ctx.getType() !== "http") return true;
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [ctx.getHandler(), ctx.getClass()])) return true;
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: AuthUser }>();
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new UnauthorizedException({ statusCode: 401, code: "UNAUTHENTICATED", message: "Missing bearer token" });
    let verified;
    try {
      verified = await this.tokens.verify(header.slice(7));
    } catch {
      throw new UnauthorizedException({ statusCode: 401, code: "INVALID_TOKEN", message: "Invalid or expired token" });
    }
    const staff = await this.prisma.staffUser.findFirst({
      where: authMode() === "local" ? { id: verified.sub } : { subject: verified.sub },
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
    if (need?.length) {
      const missing = need.filter((p) => !roleHas(user.role, p));
      if (missing.length) throw new DomainError("PERMISSION_DENIED", `Missing permission: ${missing.join(", ")}`, 403, { missing });
    }
    return true;
  }
}
