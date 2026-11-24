import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { PermissionsService } from "../../auth/permissions.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { forbidden } from "../../common/errors";
import { MobileEntitlementService } from "./mobile-entitlement.service";
import { MobileDevicesService } from "./mobile-devices.service";
import { MobileAlertsService } from "./mobile-alerts.service";
import { MobileUpgradeService } from "./mobile-upgrade.service";
import { PushService, renderPush } from "./push.service";
import { modulesFor } from "./mobile-plan";
import { growthLevel } from "../growth/growth-access";

class RegisterDeviceDto {
  @IsString() @MinLength(8) @MaxLength(80) deviceId!: string;
  @IsIn(["ios", "android", "web"]) platform!: string;
  @IsString() @MinLength(1) @MaxLength(80) name!: string;
  @IsOptional() @IsString() @MaxLength(32) appVersion?: string;
  @IsOptional() @IsString() @MaxLength(300) pushToken?: string;
}
class PushTokenDto { @IsString() @MinLength(3) @MaxLength(300) token!: string; @IsIn(["expo", "mock"]) provider!: "expo" | "mock"; }
class UpgradeRequestDto { @IsOptional() @IsString() @MaxLength(80) featureKey?: string; @IsOptional() @IsString() @MaxLength(500) note?: string; }
class AckDto { @IsOptional() @IsString() @MaxLength(500) note?: string; }

const hdr = (req: { headers: Record<string, string | string[] | undefined> }, n: string) => { const v = req.headers[n]; return Array.isArray(v) ? v[0] : v; };
const ALERT_ACK_ROLES = ["OWNER", "BRANCH_MANAGER", "PHARMACIST", "CHAIN_OPS"];

/** Kiorly (mobile staff app) API: bootstrap, devices, inbox/push, safety alerts. See Docs/MOBILE.md. */
@ApiTags("mobile")
@ApiBearerAuth()
@Controller("mobile")
export class MobileController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PermissionsService) private readonly perms: PermissionsService,
    @Inject(TenantModeService) private readonly modes: TenantModeService,
    @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService,
    @Inject(MobileEntitlementService) private readonly ent: MobileEntitlementService,
    @Inject(MobileDevicesService) private readonly devices: MobileDevicesService,
    @Inject(MobileAlertsService) private readonly alerts: MobileAlertsService,
    @Inject(PushService) private readonly push: PushService,
    @Inject(MobileUpgradeService) private readonly upgrade: MobileUpgradeService,
  ) {}

  @Get("bootstrap")
  async bootstrap(@CurrentUser() u: AuthUser, @Req() req: { headers: Record<string, string | string[] | undefined> }) {
    const [e, tenant, staff, mode, perms, device] = await Promise.all([
      this.ent.evaluate(u.orgId), this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } }),
      this.prisma.staffUser.findUniqueOrThrow({ where: { id: u.userId } }), this.modes.mode(u.orgId), this.perms.forRole(u.orgId, u.role), this.devices.peek(u, hdr(req, "x-kiorly-device")),
    ]);
    const settings = (tenant.settings ?? {}) as { defaultLocale?: string };
    const kiorexOrders = mode === "INTEGRATED" && this.flags.isEnabled("pharmacy.kiorex_orders", { orgId: u.orgId, market: u.market });
    const { plan, rawPlan, ...entitlement } = e;
    const roleModules = modulesFor(perms, kiorexOrders, growthLevel(u.role));
    return {
      apiVersion: 1, product: "pharmacy" as const, serverTime: new Date().toISOString(),
      user: { id: u.userId, name: u.displayName, email: staff.email, role: u.role, roles: [u.role], locale: settings.defaultLocale ?? "ar", branchId: u.branchId, isPharmacist: !!u.pharmacistLicenceNo },
      org: { id: tenant.id, name: tenant.name, slug: tenant.externalOrgId, plan, rawPlan, mode },
      entitlement: { key: entitlement.key, enabled: entitlement.enabled, requiredPlan: entitlement.requiredPlan, reason: entitlement.reason },
      safetyAlertsOnly: !e.enabled,
      modules: e.enabled ? roleModules : [],
      /** Basic orgs only: what this role would get on PRO (locked tiles), my latest upgrade request, open requests for the owner. */
      upgrade: e.enabled ? null : await this.upgrade.bootstrapBlock(u, roleModules.filter((m) => m.enabled).map((m) => m.key)),
      device,
    };
  }

  /** Exempt from FEATURE_DISABLED (a Basic org must be able to ask). Idempotent: a repeat for the same feature within 24h returns the original. */
  @Post("upgrade-request") @HttpCode(200)
  upgradeRequest(@CurrentUser() u: AuthUser, @Body() d: UpgradeRequestDto) { return this.upgrade.request(u, d); }

  // ------------------------------------------------------------------ devices
  @Post("devices")
  async register(@CurrentUser() u: AuthUser, @Body() d: RegisterDeviceDto) {
    await this.requireEntitlement(u);
    return this.devices.register(u, d);
  }
  @Get("devices") list(@CurrentUser() u: AuthUser) { return this.devices.list(u); }
  @Delete("devices/:id") revoke(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.devices.revoke(u, id); }
  @Put("devices/:id/push-token") pushToken(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: PushTokenDto) { return this.devices.setPushToken(u, id, d.token, d.provider); }

  // -------------------------------------------------------------------- inbox
  @Get("inbox")
  async inbox(@CurrentUser() u: AuthUser, @Query() q: { limit?: string; cursor?: string }) {
    const take = Math.min(Math.max(Number(q.limit ?? 30) || 30, 1), 100);
    const rows = await this.prisma.pushMessage.findMany({ where: { userId: u.userId, orgId: u.orgId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: take + 1, ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}) });
    const page = rows.slice(0, take);
    const unread = await this.prisma.pushMessage.count({ where: { userId: u.userId, orgId: u.orgId, readAt: null } });
    return { items: page.map((m) => ({ id: m.id, kind: m.kind, title: m.title, titleAr: m.titleAr, body: m.body, bodyAr: m.bodyAr, data: m.data, createdAt: m.createdAt, readAt: m.readAt })), nextCursor: rows.length > take ? page[page.length - 1]!.id : null, unread };
  }
  @Post("inbox/read-all") @HttpCode(200)
  async readAll(@CurrentUser() u: AuthUser) { const r = await this.prisma.pushMessage.updateMany({ where: { userId: u.userId, orgId: u.orgId, readAt: null }, data: { readAt: new Date() } }); return { updated: r.count }; }
  @Post("inbox/:id/read") @HttpCode(200)
  async read(@CurrentUser() u: AuthUser, @Param("id") id: string) {
    const r = await this.prisma.pushMessage.updateMany({ where: { id, userId: u.userId, orgId: u.orgId, readAt: null }, data: { readAt: new Date() } });
    return { id, updated: r.count };
  }
  @Post("push/test") @HttpCode(200)
  async test(@CurrentUser() u: AuthUser) {
    await this.requireEntitlement(u);
    return this.push.send({ orgId: u.orgId, ...renderPush("push.test"), userIds: [u.userId], data: { template: "push.test" } });
  }

  // ------------------------------------------------------------ safety alerts (never gated)
  @Get("alerts")
  alertList(@CurrentUser() u: AuthUser, @Query("status") status?: string) { return this.alerts.list(u, status === "all" ? "all" : "open"); }
  @Post("alerts/:id/ack") @HttpCode(200)
  ack(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: AckDto) {
    if (!ALERT_ACK_ROLES.includes(u.role)) throw forbidden("PERMISSION_DENIED", "Only pharmacists and managers can acknowledge safety alerts");
    return this.alerts.ack(u, id, d.note);
  }

  private requireEntitlement(u: AuthUser) { return this.ent.assertEnabled(u.orgId); }
}
