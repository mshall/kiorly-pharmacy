import { Inject, Injectable } from "@nestjs/common";
import type { StaffRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { effectivePermissions, type Permission } from "./permissions";

type Overrides = Array<{ role: StaffRole; permission: string; granted: boolean }>;

/** Effective permissions = built-in role defaults + per-tenant overrides (Settings > Roles). Cached briefly; `invalidate` on every matrix change. */
@Injectable()
export class PermissionsService {
  private readonly cache = new Map<string, { at: number; rows: Overrides }>();
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  private async overrides(orgId: string): Promise<Overrides> {
    const hit = this.cache.get(orgId);
    if (hit && Date.now() - hit.at < 15_000) return hit.rows;
    const rows = await this.prisma.rolePermissionOverride.findMany({ where: { orgId }, select: { role: true, permission: true, granted: true } });
    this.cache.set(orgId, { at: Date.now(), rows });
    return rows;
  }
  invalidate(orgId: string) { this.cache.delete(orgId); }
  async forRole(orgId: string, role: StaffRole): Promise<Set<Permission>> { return effectivePermissions(role, await this.overrides(orgId)); }
  async has(orgId: string, role: StaffRole, p: Permission): Promise<boolean> { return (await this.forRole(orgId, role)).has(p); }
}
