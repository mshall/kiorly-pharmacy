"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../prisma/prisma.service");
const decorators_1 = require("../../auth/decorators");
const permissions_service_1 = require("../../auth/permissions.service");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
const feature_flags_service_1 = require("../../feature-flags/feature-flags.service");
const errors_1 = require("../../common/errors");
const mobile_entitlement_service_1 = require("./mobile-entitlement.service");
const mobile_devices_service_1 = require("./mobile-devices.service");
const mobile_alerts_service_1 = require("./mobile-alerts.service");
const mobile_upgrade_service_1 = require("./mobile-upgrade.service");
const push_service_1 = require("./push.service");
const mobile_plan_1 = require("./mobile-plan");
const growth_access_1 = require("../growth/growth-access");
class RegisterDeviceDto {
    deviceId;
    platform;
    name;
    appVersion;
    pushToken;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "deviceId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["ios", "android", "web"]),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "appVersion", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], RegisterDeviceDto.prototype, "pushToken", void 0);
class PushTokenDto {
    token;
    provider;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], PushTokenDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["expo", "mock"]),
    __metadata("design:type", String)
], PushTokenDto.prototype, "provider", void 0);
class UpgradeRequestDto {
    featureKey;
    note;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], UpgradeRequestDto.prototype, "featureKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpgradeRequestDto.prototype, "note", void 0);
class AckDto {
    note;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AckDto.prototype, "note", void 0);
const hdr = (req, n) => { const v = req.headers[n]; return Array.isArray(v) ? v[0] : v; };
const ALERT_ACK_ROLES = ["OWNER", "BRANCH_MANAGER", "PHARMACIST", "CHAIN_OPS"];
let MobileController = class MobileController {
    prisma;
    perms;
    modes;
    flags;
    ent;
    devices;
    alerts;
    push;
    upgrade;
    constructor(prisma, perms, modes, flags, ent, devices, alerts, push, upgrade) {
        this.prisma = prisma;
        this.perms = perms;
        this.modes = modes;
        this.flags = flags;
        this.ent = ent;
        this.devices = devices;
        this.alerts = alerts;
        this.push = push;
        this.upgrade = upgrade;
    }
    async bootstrap(u, req) {
        const [e, tenant, staff, mode, perms, device] = await Promise.all([
            this.ent.evaluate(u.orgId), this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } }),
            this.prisma.staffUser.findUniqueOrThrow({ where: { id: u.userId } }), this.modes.mode(u.orgId), this.perms.forRole(u.orgId, u.role), this.devices.peek(u, hdr(req, "x-kiorly-device")),
        ]);
        const settings = (tenant.settings ?? {});
        const kiorexOrders = mode === "INTEGRATED" && this.flags.isEnabled("pharmacy.kiorex_orders", { orgId: u.orgId, market: u.market });
        const { plan, rawPlan, ...entitlement } = e;
        const roleModules = (0, mobile_plan_1.modulesFor)(perms, kiorexOrders, (0, growth_access_1.growthLevel)(u.role));
        return {
            apiVersion: 1, product: "pharmacy", serverTime: new Date().toISOString(),
            user: { id: u.userId, name: u.displayName, email: staff.email, role: u.role, roles: [u.role], locale: settings.defaultLocale ?? "ar", branchId: u.branchId, isPharmacist: !!u.pharmacistLicenceNo },
            org: { id: tenant.id, name: tenant.name, slug: tenant.externalOrgId, plan, rawPlan, mode },
            entitlement: { key: entitlement.key, enabled: entitlement.enabled, requiredPlan: entitlement.requiredPlan, reason: entitlement.reason },
            safetyAlertsOnly: !e.enabled,
            modules: e.enabled ? roleModules : [],
            upgrade: e.enabled ? null : await this.upgrade.bootstrapBlock(u, roleModules.filter((m) => m.enabled).map((m) => m.key)),
            device,
        };
    }
    upgradeRequest(u, d) { return this.upgrade.request(u, d); }
    async register(u, d) {
        await this.requireEntitlement(u);
        return this.devices.register(u, d);
    }
    list(u) { return this.devices.list(u); }
    revoke(u, id) { return this.devices.revoke(u, id); }
    pushToken(u, id, d) { return this.devices.setPushToken(u, id, d.token, d.provider); }
    async inbox(u, q) {
        const take = Math.min(Math.max(Number(q.limit ?? 30) || 30, 1), 100);
        const rows = await this.prisma.pushMessage.findMany({ where: { userId: u.userId, orgId: u.orgId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: take + 1, ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}) });
        const page = rows.slice(0, take);
        const unread = await this.prisma.pushMessage.count({ where: { userId: u.userId, orgId: u.orgId, readAt: null } });
        return { items: page.map((m) => ({ id: m.id, kind: m.kind, title: m.title, titleAr: m.titleAr, body: m.body, bodyAr: m.bodyAr, data: m.data, createdAt: m.createdAt, readAt: m.readAt })), nextCursor: rows.length > take ? page[page.length - 1].id : null, unread };
    }
    async readAll(u) { const r = await this.prisma.pushMessage.updateMany({ where: { userId: u.userId, orgId: u.orgId, readAt: null }, data: { readAt: new Date() } }); return { updated: r.count }; }
    async read(u, id) {
        const r = await this.prisma.pushMessage.updateMany({ where: { id, userId: u.userId, orgId: u.orgId, readAt: null }, data: { readAt: new Date() } });
        return { id, updated: r.count };
    }
    async test(u) {
        await this.requireEntitlement(u);
        return this.push.send({ orgId: u.orgId, ...(0, push_service_1.renderPush)("push.test"), userIds: [u.userId], data: { template: "push.test" } });
    }
    alertList(u, status) { return this.alerts.list(u, status === "all" ? "all" : "open"); }
    ack(u, id, d) {
        if (!ALERT_ACK_ROLES.includes(u.role))
            throw (0, errors_1.forbidden)("PERMISSION_DENIED", "Only pharmacists and managers can acknowledge safety alerts");
        return this.alerts.ack(u, id, d.note);
    }
    requireEntitlement(u) { return this.ent.assertEnabled(u.orgId); }
};
exports.MobileController = MobileController;
__decorate([
    (0, common_1.Get)("bootstrap"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "bootstrap", null);
__decorate([
    (0, common_1.Post)("upgrade-request"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpgradeRequestDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "upgradeRequest", null);
__decorate([
    (0, common_1.Post)("devices"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RegisterDeviceDto]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "register", null);
__decorate([
    (0, common_1.Get)("devices"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)("devices/:id"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "revoke", null);
__decorate([
    (0, common_1.Put)("devices/:id/push-token"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PushTokenDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "pushToken", null);
__decorate([
    (0, common_1.Get)("inbox"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "inbox", null);
__decorate([
    (0, common_1.Post)("inbox/read-all"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "readAll", null);
__decorate([
    (0, common_1.Post)("inbox/:id/read"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "read", null);
__decorate([
    (0, common_1.Post)("push/test"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MobileController.prototype, "test", null);
__decorate([
    (0, common_1.Get)("alerts"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "alertList", null);
__decorate([
    (0, common_1.Post)("alerts/:id/ack"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AckDto]),
    __metadata("design:returntype", void 0)
], MobileController.prototype, "ack", null);
exports.MobileController = MobileController = __decorate([
    (0, swagger_1.ApiTags)("mobile"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("mobile"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __param(2, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __param(3, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __param(4, (0, common_1.Inject)(mobile_entitlement_service_1.MobileEntitlementService)),
    __param(5, (0, common_1.Inject)(mobile_devices_service_1.MobileDevicesService)),
    __param(6, (0, common_1.Inject)(mobile_alerts_service_1.MobileAlertsService)),
    __param(7, (0, common_1.Inject)(push_service_1.PushService)),
    __param(8, (0, common_1.Inject)(mobile_upgrade_service_1.MobileUpgradeService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        permissions_service_1.PermissionsService,
        tenant_mode_service_1.TenantModeService,
        feature_flags_service_1.FeatureFlagsService,
        mobile_entitlement_service_1.MobileEntitlementService,
        mobile_devices_service_1.MobileDevicesService,
        mobile_alerts_service_1.MobileAlertsService,
        push_service_1.PushService,
        mobile_upgrade_service_1.MobileUpgradeService])
], MobileController);
//# sourceMappingURL=mobile.controller.js.map