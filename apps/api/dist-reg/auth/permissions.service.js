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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const permissions_1 = require("./permissions");
let PermissionsService = class PermissionsService {
    prisma;
    cache = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overrides(orgId) {
        const hit = this.cache.get(orgId);
        if (hit && Date.now() - hit.at < 15_000)
            return hit.rows;
        const rows = await this.prisma.rolePermissionOverride.findMany({ where: { orgId }, select: { role: true, permission: true, granted: true } });
        this.cache.set(orgId, { at: Date.now(), rows });
        return rows;
    }
    invalidate(orgId) { this.cache.delete(orgId); }
    async forRole(orgId, role) { return (0, permissions_1.effectivePermissions)(role, await this.overrides(orgId)); }
    async has(orgId, role, p) { return (await this.forRole(orgId, role)).has(p); }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map