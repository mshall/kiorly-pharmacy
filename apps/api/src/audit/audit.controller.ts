import { Controller, Get, Header, Inject, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { CurrentUser, Perm } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { pageArgs } from "../common/pagination";
import { toCsvText } from "../common/csv";

@ApiTags("audit")
@ApiBearerAuth()
@Controller("audit")
export class AuditController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  @Perm("audit.read")
  async list(@CurrentUser() u: AuthUser, @Query() q: { entityType?: string; entityId?: string; action?: string; actorId?: string; from?: string; to?: string; page?: string; pageSize?: string }) {
    const { skip, take, page, pageSize } = pageArgs(q);
    const where = { orgId: u.orgId, ...(q.entityType ? { entityType: q.entityType } : {}), ...(q.entityId ? { entityId: q.entityId } : {}), ...(q.action ? { action: { startsWith: q.action } } : {}), ...(q.actorId ? { actorId: q.actorId } : {}), ...(q.from || q.to ? { at: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } } : {}) };
    const [items, total] = await Promise.all([this.prisma.auditLog.findMany({ where, orderBy: { at: "desc" }, skip, take }), this.prisma.auditLog.count({ where })]);
    return { items, total, page, pageSize };
  }

  /** CSV of the audit trail (ids and field names only — never PHI) for the owner / an auditor. */
  @Get("export.csv")
  @Header("Content-Type", "text/csv; charset=utf-8")
  @Perm("audit.read")
  async csv(@CurrentUser() u: AuthUser, @Query() q: { entityType?: string; action?: string; from?: string; to?: string }) {
    const rows = await this.prisma.auditLog.findMany({ where: { orgId: u.orgId, ...(q.entityType ? { entityType: q.entityType } : {}), ...(q.action ? { action: { startsWith: q.action } } : {}), ...(q.from || q.to ? { at: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } } : {}) }, orderBy: { at: "desc" }, take: 20_000 });
    return toCsvText(["at", "actorId", "action", "entityType", "entityId", "meta"], rows.map((a) => [a.at.toISOString(), a.actorId, a.action, a.entityType, a.entityId, a.meta ? JSON.stringify(a.meta) : ""]));
  }
}
