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
exports.MobileClientGuard = exports.isEntitlementExempt = void 0;
const common_1 = require("@nestjs/common");
const permissions_service_1 = require("../../auth/permissions.service");
const errors_1 = require("../../common/errors");
const mobile_devices_service_1 = require("./mobile-devices.service");
const mobile_entitlement_service_1 = require("./mobile-entitlement.service");
const mobile_gate_1 = require("./mobile-gate");
Object.defineProperty(exports, "isEntitlementExempt", { enumerable: true, get: function () { return mobile_gate_1.isEntitlementExempt; } });
let MobileClientGuard = class MobileClientGuard {
    devices;
    ent;
    perms;
    constructor(devices, ent, perms) {
        this.devices = devices;
        this.ent = ent;
        this.perms = perms;
    }
    async canActivate(ctx) {
        if (ctx.getType() !== "http")
            return true;
        const req = ctx.switchToHttp().getRequest();
        if (!req.user)
            return true;
        const h = (n) => { const v = req.headers[n]; return Array.isArray(v) ? v[0] : v; };
        await this.devices.verify(req.user, h("x-kiorly-device"), h("x-kiorly-device-token"));
        if ((0, mobile_gate_1.isMobilePlanGated)(req)) {
            await this.ent.assertEnabled(req.user.orgId);
            const need = req.deferredPerms;
            if (need?.length) {
                const have = await this.perms.forRole(req.user.orgId, req.user.role);
                const missing = need.filter((p) => !have.has(p));
                if (missing.length)
                    throw new errors_1.DomainError("PERMISSION_DENIED", `Missing permission: ${missing.join(", ")}`, 403, { missing });
            }
        }
        return true;
    }
};
exports.MobileClientGuard = MobileClientGuard;
exports.MobileClientGuard = MobileClientGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(mobile_devices_service_1.MobileDevicesService)),
    __param(1, (0, common_1.Inject)(mobile_entitlement_service_1.MobileEntitlementService)),
    __param(2, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __metadata("design:paramtypes", [mobile_devices_service_1.MobileDevicesService,
        mobile_entitlement_service_1.MobileEntitlementService,
        permissions_service_1.PermissionsService])
], MobileClientGuard);
//# sourceMappingURL=mobile-client.guard.js.map