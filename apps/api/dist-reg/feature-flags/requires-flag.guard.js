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
exports.RequiresFlagGuard = exports.RequiresFlag = exports.REQUIRES_FLAG = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const feature_flags_service_1 = require("./feature-flags.service");
exports.REQUIRES_FLAG = "kx:requires-flag";
const RequiresFlag = (key) => (0, common_1.SetMetadata)(exports.REQUIRES_FLAG, key);
exports.RequiresFlag = RequiresFlag;
let RequiresFlagGuard = class RequiresFlagGuard {
    reflector;
    flags;
    constructor(reflector, flags) {
        this.reflector = reflector;
        this.flags = flags;
    }
    canActivate(ctx) {
        const key = this.reflector.getAllAndOverride(exports.REQUIRES_FLAG, [ctx.getHandler(), ctx.getClass()]);
        if (!key)
            return true;
        const req = ctx.switchToHttp().getRequest();
        const c = req.user ? { orgId: req.user.orgId, market: req.user.market } : req.flagContext ?? {};
        const d = this.flags.evaluate(key, c);
        if (d.enabled)
            return true;
        throw new common_1.ForbiddenException({ statusCode: 403, code: "FEATURE_DISABLED", key: d.key, scope: d.scope ?? "global", message: "This capability is temporarily unavailable." });
    }
};
exports.RequiresFlagGuard = RequiresFlagGuard;
exports.RequiresFlagGuard = RequiresFlagGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __param(1, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __metadata("design:paramtypes", [core_1.Reflector,
        feature_flags_service_1.FeatureFlagsService])
], RequiresFlagGuard);
//# sourceMappingURL=requires-flag.guard.js.map