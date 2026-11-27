import { Body, Controller, Get, Headers, HttpCode, Inject, Post, Query, Req, Res, UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from "express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import { CurrentUser, Public } from "./decorators";
import type { AuthUser } from "./auth-user";
import { TokenVerifier, localLoginEnabled, mfaEnforced } from "./token-verifier";
import { PRIVILEGED_ROLES } from "./permissions";
import { verifyPassword } from "./password";
import { PermissionsService } from "./permissions.service";
import { TenantModeService } from "../tenancy/tenant-mode.service";
import { FeatureFlagsService } from "../feature-flags/feature-flags.service";
import { FLAG_DEFINITIONS } from "../feature-flags/feature-flag-keys";
import { AuditService } from "../audit/audit.service";
import { DomainError } from "../common/errors";
import { PassportService } from "./passport.service";
import { PassportSessions } from "./passport-sessions.service";
import { HandoffCodes, HandoffError, isHomeOrigin, webBaseUrl } from "./handoff";
import { PrismaHandoffStore } from "./handoff.store";
import { deploymentDefaultMethod, orgSignInFacts, resolvePublicSignInConfig } from "./sign-in-config";
import { makeWindowLimiter } from "./sign-in-default";
import { PgRateLimiter, type RawSql } from "../common/pg-rate-limit";

/** Unknown e-mails burn one scrypt like known ones (pentest 2026-11: no user-enumeration timing). */
const DUMMY_SCRYPT = "scrypt$7cd38f7ab867b50df28b0c0fd63dd060$97ff8ac4f83d30b1bfdf68edd866d072bd2c128f745cd06fab3f5e84c1fc3d19";
async function passwordOk(pw: string, staff: { passwordHash: string | null } | null): Promise<boolean> {
  const ok = await verifyPassword(pw, staff?.passwordHash ?? DUMMY_SCRYPT);
  return Boolean(staff) && ok;
}

const configLimiter = makeWindowLimiter(300, 60_000);

class LoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
}

class OidcExchangeDto {
  @IsString() @MaxLength(2048) code!: string;
  @IsString() @MinLength(43) @MaxLength(128) codeVerifier!: string;
  @IsString() @MaxLength(512) redirectUri!: string;
  @IsString() @MaxLength(256) nonce!: string;
  /** Owner sign-up claim (from `onboarding/signup`): binds the new owner to this Passport identity. */
  @IsOptional() @IsString() @MaxLength(2048) claim?: string;
}

class HandoffLoginDto {
  @IsEmail() email!: string;
  @IsString() @MinLength(1) @MaxLength(256) password!: string;
}
class HandoffExchangeDto {
  @IsString() @MaxLength(128) code!: string;
}

/** Sign-in throttle: 10 attempts per key per minute, counted in Postgres so it holds across API instances. */
let pgLimiter: PgRateLimiter | undefined;
async function throttle(prisma: PrismaService, key: string, perMinute = Number(process.env.SIGNIN_RATE_PER_MINUTE) || 10) {
  pgLimiter ??= new PgRateLimiter(prisma as unknown as RawSql);
  const r = await pgLimiter.hit(`signin:${key}`, perMinute, 60_000);
  if (!r.ok) throw new DomainError("RATE_LIMITED", "Too many login attempts, try again in a minute", 429, { retryAfterSec: r.retryAfterSec });
}

/**
 * AUTH_MODE=both in production: a privileged role (owner, pharmacist, branch manager, chain ops) signs in with Kiorex Passport, where the MFA policy applies.
 * A password session would carry no MFA claim and every privileged route would answer MFA_REQUIRED anyway, so say so up front (after the password was verified: no oracle).
 */
export function passwordRoleRefusal(role: string): DomainError | null {
  return mfaEnforced() && (PRIVILEGED_ROLES as readonly string[]).includes(role)
    ? new DomainError("PASSPORT_REQUIRED_FOR_ROLE", "This role signs in with Kiorex Passport (two-step verification). Use Sign in with Kiorex Passport.", 403)
    : null;
}
/** Per client address, on top of the per e-mail limit: blunts password spraying across many addresses. */
const IP_SIGNIN_PER_MINUTE = () => Number(process.env.SIGNIN_RATE_PER_IP_PER_MINUTE) || 30;

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
    @Inject(PassportSessions) private readonly sessions: PassportSessions,
    @Inject(PrismaHandoffStore) private readonly handoffStore: PrismaHandoffStore,
  ) {}
  private handoffCodes() { return new HandoffCodes(this.handoffStore, "pharmacy"); }

  /** Login page configuration: is the password form offered, and is Kiorex Passport (OIDC + PKCE) available. Nothing secret. */
  @Get("config")
  @Public()
  async config(@Query("org") org: string | undefined, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const base = await this.passport.publicConfig();
    res.setHeader("Cache-Control", "no-store");
    // Pre-auth and public: rate limited per client; an unknown or missing org gets the deployment default in the same shape (no org enumeration).
    if (!configLimiter(req.ip ?? "anon")) throw new DomainError("RATE_LIMITED", "Too many requests, try again in a minute", 429);
    const facts = org ? await orgSignInFacts(this.prisma, org) : null;
    return { ...base, ...resolvePublicSignInConfig({ passportAvailable: base.passport !== null, org: facts, deployment: deploymentDefaultMethod() }) };
  }

  /** Web Passport sign-in: the SPA did authorize + PKCE; the API redeems the code server-side and issues the staff session. */
  @Post("oidc/exchange")
  @Public()
  @HttpCode(200)
  async exchange(@Body() dto: OidcExchangeDto) {
    await throttle(this.prisma, `oidc:${dto.codeVerifier.slice(0, 12)}`);
    return this.passport.exchange(dto);
  }

  /**
   * OIDC Back-Channel Logout receiver (registered as `backchannel_logout_uri` of the Passport client kiorly-pharmacy-web).
   * Public by design: the signed `logout_token` is the credential. 200 = processed (idempotent per sid); 400 = invalid or replayed.
   */
  @Post("oidc/backchannel-logout")
  @Public()
  @HttpCode(200)
  async backchannelLogout(@Body("logout_token") logoutToken: unknown, @Res({ passthrough: true }) res: Response) {
    res.setHeader("Cache-Control", "no-store");
    await this.sessions.backchannelLogout(logoutToken);
    return {};
  }

  /** AUTH_MODE=local only (dev/demo/E2E). In AUTH_MODE=oidc sign-in happens at Kiorex Passport and this route is 404-equivalent. */
  @Post("login")
  @Public()
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    if (!localLoginEnabled()) throw new DomainError("LOCAL_LOGIN_DISABLED", "Sign in with Kiorex Passport", 404);
    await throttle(this.prisma, `ip:${req.ip ?? "anon"}`, IP_SIGNIN_PER_MINUTE());
    await throttle(this.prisma, dto.email.toLowerCase());
    const staff = await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!(await passwordOk(dto.password, staff)) || !staff || !staff.active) throw new UnauthorizedException({ statusCode: 401, code: "BAD_CREDENTIALS", message: "Invalid email or password" });
    const refusal = passwordRoleRefusal(staff.role);
    if (refusal) throw refusal;
    await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
    await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id });
    return { accessToken: await this.tokens.issueLocal(staff.id) };
  }

  /**
   * Kiorly Home password sign-in, step 1 (ADR-038 handoff). Same checks, throttle and audit as `login`, but the answer is a single-use
   * 30-second code (never a token) plus where to send the browser. Only the Kiorly Home origin may call it (Origin header allow-list).
   */
  @Post("handoff/login")
  @Public()
  @HttpCode(200)
  async handoffLogin(@Body() dto: HandoffLoginDto, @Headers("origin") origin: string | undefined, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.setHeader("Cache-Control", "no-store");
    if (!isHomeOrigin(origin)) throw new DomainError("HANDOFF_ORIGIN_NOT_ALLOWED", "This sign-in start is not allowed from here", 403);
    if (!localLoginEnabled()) throw new DomainError("LOCAL_LOGIN_DISABLED", "Sign in with Kiorex Passport", 404);
    await throttle(this.prisma, `ip:${req.ip ?? "anon"}`, IP_SIGNIN_PER_MINUTE());
    await throttle(this.prisma, dto.email.toLowerCase());
    const staff = await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!(await passwordOk(dto.password, staff)) || !staff || !staff.active) throw new UnauthorizedException({ statusCode: 401, code: "BAD_CREDENTIALS", message: "Invalid email or password" });
    const refusal = passwordRoleRefusal(staff.role);
    if (refusal) throw refusal;
    const { code, expiresInSeconds } = await this.handoffCodes().issue({ subjectId: staff.id, origin: origin! });
    await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.handoff_issued", entityType: "StaffUser", entityId: staff.id, meta: { via: "kiorly-home" } });
    const web = webBaseUrl();
    return { status: "OK", code, expiresInSeconds, redirectUrl: web ? `${web}/login?handoff=${encodeURIComponent(code)}&from=kiorly-home` : null };
  }

  /** Kiorly Home password sign-in, step 2: the product web redeems the code once and receives the normal login result. Replays and expired codes: 401. */
  @Post("handoff/exchange")
  @Public()
  @HttpCode(200)
  async handoffExchange(@Body() dto: HandoffExchangeDto, @Res({ passthrough: true }) res: Response) {
    res.setHeader("Cache-Control", "no-store");
    let subjectId: string;
    try { ({ subjectId } = await this.handoffCodes().redeem({ code: dto.code })); }
    catch (e) { if (e instanceof HandoffError) throw new UnauthorizedException({ statusCode: 401, code: e.code, message: e.message }); throw e; }
    const staff = await this.prisma.staffUser.findUnique({ where: { id: subjectId } });
    if (!staff || !staff.active) throw new UnauthorizedException({ statusCode: 401, code: "HANDOFF_INVALID", message: "The sign-in link is invalid or expired. Sign in again." });
    const refusal = passwordRoleRefusal(staff.role);
    if (refusal) throw refusal;
    await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
    await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id, meta: { via: "kiorly-home-handoff" } });
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
