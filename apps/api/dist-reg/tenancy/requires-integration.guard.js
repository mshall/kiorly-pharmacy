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
exports.RequiresIntegrationGuard = void 0;
const common_1 = require("@nestjs/common");
const tenant_mode_service_1 = require("./tenant-mode.service");
let RequiresIntegrationGuard = class RequiresIntegrationGuard {
    mode;
    constructor(mode) {
        this.mode = mode;
    }
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const orgId = req.user?.orgId ?? req.tenant?.id;
        if (!orgId)
            return true;
        if (await this.mode.isStandalone(orgId)) {
            throw new common_1.ForbiddenException({ statusCode: 403, code: "STANDALONE_MODE", message: "This pharmacy runs in standalone mode; Kiorex integration is switched off in Settings." });
        }
        return true;
    }
};
exports.RequiresIntegrationGuard = RequiresIntegrationGuard;
exports.RequiresIntegrationGuard = RequiresIntegrationGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __metadata("design:paramtypes", [tenant_mode_service_1.TenantModeService])
], RequiresIntegrationGuard);
//# sourceMappingURL=requires-integration.guard.js.map