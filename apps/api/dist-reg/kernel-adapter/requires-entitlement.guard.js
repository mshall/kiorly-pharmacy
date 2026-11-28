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
exports.RequiresEntitlementGuard = exports.RequiresEntitlement = exports.REQUIRES_ENTITLEMENT = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const ports_1 = require("./ports");
exports.REQUIRES_ENTITLEMENT = "kx:entitlement";
const RequiresEntitlement = (cap) => (0, common_1.SetMetadata)(exports.REQUIRES_ENTITLEMENT, cap);
exports.RequiresEntitlement = RequiresEntitlement;
let RequiresEntitlementGuard = class RequiresEntitlementGuard {
    reflector;
    ent;
    constructor(reflector, ent) {
        this.reflector = reflector;
        this.ent = ent;
    }
    async canActivate(ctx) {
        const cap = this.reflector.getAllAndOverride(exports.REQUIRES_ENTITLEMENT, [ctx.getHandler(), ctx.getClass()]);
        if (!cap)
            return true;
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;
        const m = (req.method ?? "GET").toUpperCase();
        if (!user)
            return false;
        if (await this.ent.isEntitled(user.orgId, cap, { readOnlyRequest: m === "GET" || m === "HEAD" }))
            return true;
        throw new common_1.HttpException({ statusCode: 402, code: "ENTITLEMENT_REQUIRED", capability: cap, edition: user.edition, message: `Your plan does not include ${cap}` }, 402);
    }
};
exports.RequiresEntitlementGuard = RequiresEntitlementGuard;
exports.RequiresEntitlementGuard = RequiresEntitlementGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __param(1, (0, common_1.Inject)(ports_1.KERNEL.entitlements)),
    __metadata("design:paramtypes", [core_1.Reflector, Object])
], RequiresEntitlementGuard);
//# sourceMappingURL=requires-entitlement.guard.js.map