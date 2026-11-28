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
exports.TenantModeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantModeService = class TenantModeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async settings(orgId) {
        const t = await this.prisma.tenant.findUnique({ where: { id: orgId }, select: { settings: true } });
        return (t?.settings ?? {});
    }
    async mode(orgId) {
        const s = await this.settings(orgId);
        if (s.mode === "STANDALONE" || s.mode === "INTEGRATED")
            return s.mode;
        const clients = await this.prisma.integrationClient.count({ where: { orgId, active: true } });
        return clients > 0 ? "INTEGRATED" : "STANDALONE";
    }
    async isStandalone(orgId) { return (await this.mode(orgId)) === "STANDALONE"; }
};
exports.TenantModeService = TenantModeService;
exports.TenantModeService = TenantModeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantModeService);
//# sourceMappingURL=tenant-mode.service.js.map