import { Body, Controller, Get, HttpCode, Inject, Post, UnauthorizedException } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import { CurrentUser, Public } from "./decorators";
import type { AuthUser } from "./auth-user";
import { TokenVerifier, authMode } from "./token-verifier";
import { verifyPassword } from "./password";
import { PermissionsService } from "./permissions.service";
import { TenantModeService } from "../tenancy/tenant-mode.service";
import { FeatureFlagsService } from "../feature-flags/feature-flags.service";
import { FLAG_DEFINITIONS } from "../feature-flags/feature-flag-keys";
import { AuditService } from "../audit/audit.service";
import { DomainError } from "../common/errors";
import { PassportService } from "./passport.service";

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
}

class OidcExchangeDto {
  @IsString() @MaxLength(2048) code!: string;
  @IsString() @MinLength(43) @MaxLength(128) codeVerifier!: string;
  @IsString() @MaxLength(512) redirectUri!: string;
  @IsString() @MaxLength(256) nonce!: string;
}

const attempts = new Map<string, { n: number; t: number }>();
function throttle(key: string) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || now - a.t > 60_000) { attempts.set(key, { n: 1, t: now }); return; }
  if (++a.n > 10) throw new DomainError("RATE_LIMITED", "Too many login attempts, try again in a minute", 429);
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(TokenVerifier) private readonly tokens: TokenVerifier,
    @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(PermissionsService) private readonly perms: PermissionsService,
    @Inject(TenantModeService) private readonly modes: TenantModeService,
    @Inject(PassportService) private readonly passport: PassportService,
  ) {}

  /** Login page configuration: is the password form offered, and is Kiorex Passport (OIDC + PKCE) available. Nothing secret. */
  @Get("config")
  @Public()
  config() {
    return this.passport.publicConfig();
  }

  /** Web Passport sign-in: the SPA did authorize + PKCE; the API redeems the code server-side and issues the staff session. */
  @Post("oidc/exchange")
  @Public()
  @HttpCode(200)
  exchange(@Body() dto: OidcExchangeDto) {
    throttle(`oidc:${dto.codeVerifier.slice(0, 12)}`);
    return this.passport.exchange(dto);
  }

  /** AUTH_MODE=local only (dev/demo/E2E). In AUTH_MODE=oidc sign-in happens at Kiorex Passport and this route is 404-equivalent. */
  @Post("login")
  @Public()
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    if (authMode() !== "local") throw new DomainError("LOCAL_LOGIN_DISABLED", "Sign in with Kiorex Passport", 404);
    throttle(dto.email.toLowerCase());
    const staff = await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!staff || !staff.active || !(await verifyPassword(dto.password, staff.passwordHash))) throw new UnauthorizedException({ statusCode: 401, code: "BAD_CREDENTIALS", message: "Invalid email or password" });
    await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
    await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id });
    return { accessToken: await this.tokens.issueLocal(staff.id) };
  }

  @Get("me")
  @ApiBearerAuth()
  async me(@CurrentUser() u: AuthUser) {
    const [mode, perms] = await Promise.all([this.modes.mode(u.orgId), this.perms.forRole(u.orgId, u.role)]);
    const [tenant, branches] = await Promise.all([
      this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } }),
      this.prisma.branch.findMany({ where: { orgId: u.orgId, active: true, ...(u.branchId ? { id: u.branchId } : {}) }, orderBy: { name: "asc" } }),
    ]);
    return {
      user: { id: u.userId, displayName: u.displayName, role: u.role, branchId: u.branchId, isPharmacist: !!u.pharmacistLicenceNo },
      tenant: { id: tenant.id, name: tenant.name, edition: tenant.edition, market: tenant.marketCode, onboarded: !!tenant.onboardedAt, mode, currency: ((tenant.settings ?? {}) as { currency?: string }).currency ?? "EGP" },
      branches: branches.map((b) => ({ id: b.id, name: b.name, code: b.code })),
      permissions: [...perms],
      flags: Object.fromEntries(FLAG_DEFINITIONS.map((f) => [f.key, this.flags.isEnabled(f.key, { orgId: u.orgId, market: u.market }) && !(mode === "STANDALONE" && f.key === "pharmacy.kiorex_orders")])),
    };
  }
}
