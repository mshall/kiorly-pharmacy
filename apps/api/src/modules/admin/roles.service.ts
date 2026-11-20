import { Inject, Injectable } from "@nestjs/common";
import { StaffRole } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { LOCKED_PERMISSIONS, PERMISSIONS, ROLE_PERMISSIONS, type Permission } from "../../auth/permissions";
import { PermissionsService } from "../../auth/permissions.service";

/** Roles x permissions matrix: built-in defaults + this tenant's overrides. OWNER and safety-critical permissions are locked. */
@Injectable()
export class RolesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(PermissionsService) private readonly perms: PermissionsService) {}

  async matrix(orgId: string) {
    const overrides = await this.prisma.rolePermissionOverride.findMany({ where: { orgId } });
    const om = new Map(overrides.map((o) => [`${o.role}:${o.permission}`, o.granted]));
    const roles = Object.values(StaffRole);
    const matrix: Record<string, Record<string, { granted: boolean; default: boolean; overridden: boolean; locked: boolean }>> = {};
    for (const r of roles) {
      matrix[r] = {};
      for (const p of PERMISSIONS) {
        const def = ROLE_PERMISSIONS[r].has(p), locked = r === "OWNER" || (LOCKED_PERMISSIONS as readonly string[]).includes(p);
        const o = om.get(`${r}:${p}`);
        matrix[r]![p] = { default: def, granted: locked || o === undefined ? def : o, overridden: !locked && o !== undefined && o !== def, locked };
      }
    }
    return { roles, permissions: PERMISSIONS, locked: LOCKED_PERMISSIONS, matrix };
  }

  async set(u: AuthUser, role: StaffRole, permission: string, granted: boolean) {
    if (role === "OWNER") throw new DomainError("OWNER_LOCKED", "The owner role always has every permission", 409);
    if (!(PERMISSIONS as readonly string[]).includes(permission)) throw new DomainError("UNKNOWN_PERMISSION", `Unknown permission ${permission}`, 400);
    if ((LOCKED_PERMISSIONS as readonly string[]).includes(permission)) throw new DomainError("PERMISSION_LOCKED", `${permission} is a safety-critical permission and cannot be changed`, 409);
    const def = ROLE_PERMISSIONS[role].has(permission as Permission);
    await this.prisma.$transaction(async (tx) => {
      if (granted === def) await tx.rolePermissionOverride.deleteMany({ where: { orgId: u.orgId, role, permission } });
      else await tx.rolePermissionOverride.upsert({ where: { orgId_role_permission: { orgId: u.orgId, role, permission } }, create: { orgId: u.orgId, role, permission, granted, updatedBy: u.userId }, update: { granted, updatedBy: u.userId } });
      await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "roles.permission", entityType: "StaffRole", entityId: role, meta: { permission, granted } } });
    });
    this.perms.invalidate(u.orgId);
    return { role, permission, granted };
  }

  async reset(u: AuthUser, role: StaffRole) {
    if (role === "OWNER") throw new DomainError("OWNER_LOCKED", "The owner role has no overrides", 409);
    const r = await this.prisma.rolePermissionOverride.deleteMany({ where: { orgId: u.orgId, role } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "roles.reset", entityType: "StaffRole", entityId: role, meta: { removed: r.count } } });
    this.perms.invalidate(u.orgId);
    return { role, removed: r.count };
  }
}
