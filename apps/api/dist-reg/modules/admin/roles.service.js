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
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const permissions_1 = require("../../auth/permissions");
const permissions_service_1 = require("../../auth/permissions.service");
let RolesService = class RolesService {
    prisma;
    perms;
    constructor(prisma, perms) {
        this.prisma = prisma;
        this.perms = perms;
    }
    async matrix(orgId) {
        const overrides = await this.prisma.rolePermissionOverride.findMany({ where: { orgId } });
        const om = new Map(overrides.map((o) => [`${o.role}:${o.permission}`, o.granted]));
        const roles = Object.values(client_1.StaffRole);
        const matrix = {};
        for (const r of roles) {
            matrix[r] = {};
            for (const p of permissions_1.PERMISSIONS) {
                const def = permissions_1.ROLE_PERMISSIONS[r].has(p), locked = r === "OWNER" || permissions_1.LOCKED_PERMISSIONS.includes(p);
                const o = om.get(`${r}:${p}`);
                matrix[r][p] = { default: def, granted: locked || o === undefined ? def : o, overridden: !locked && o !== undefined && o !== def, locked };
            }
        }
        return { roles, permissions: permissions_1.PERMISSIONS, locked: permissions_1.LOCKED_PERMISSIONS, matrix };
    }
    async set(u, role, permission, granted) {
        if (role === "OWNER")
            throw new errors_1.DomainError("OWNER_LOCKED", "The owner role always has every permission", 409);
        if (!permissions_1.PERMISSIONS.includes(permission))
            throw new errors_1.DomainError("UNKNOWN_PERMISSION", `Unknown permission ${permission}`, 400);
        if (permissions_1.LOCKED_PERMISSIONS.includes(permission))
            throw new errors_1.DomainError("PERMISSION_LOCKED", `${permission} is a safety-critical permission and cannot be changed`, 409);
        const def = permissions_1.ROLE_PERMISSIONS[role].has(permission);
        await this.prisma.$transaction(async (tx) => {
            if (granted === def)
                await tx.rolePermissionOverride.deleteMany({ where: { orgId: u.orgId, role, permission } });
            else
                await tx.rolePermissionOverride.upsert({ where: { orgId_role_permission: { orgId: u.orgId, role, permission } }, create: { orgId: u.orgId, role, permission, granted, updatedBy: u.userId }, update: { granted, updatedBy: u.userId } });
            await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "roles.permission", entityType: "StaffRole", entityId: role, meta: { permission, granted } } });
        });
        this.perms.invalidate(u.orgId);
        return { role, permission, granted };
    }
    async reset(u, role) {
        if (role === "OWNER")
            throw new errors_1.DomainError("OWNER_LOCKED", "The owner role has no overrides", 409);
        const r = await this.prisma.rolePermissionOverride.deleteMany({ where: { orgId: u.orgId, role } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "roles.reset", entityType: "StaffRole", entityId: role, meta: { removed: r.count } } });
        this.perms.invalidate(u.orgId);
        return { role, removed: r.count };
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, permissions_service_1.PermissionsService])
], RolesService);
//# sourceMappingURL=roles.service.js.map