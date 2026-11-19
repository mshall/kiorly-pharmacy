import { Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { CurrentUser, Perm } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { pageArgs } from "../common/pagination";

@ApiTags("audit")
@ApiBearerAuth()
@Controller("audit")
export class AuditController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  @Perm("audit.read")
  async list(@CurrentUser() u: AuthUser, @Query() q: { entityType?: string; entityId?: string; action?: string; page?: string; pageSize?: string }) {
    const { skip, take, page, pageSize } = pageArgs(q);
    const where = { orgId: u.orgId, ...(q.entityType ? { entityType: q.entityType } : {}), ...(q.entityId ? { entityId: q.entityId } : {}), ...(q.action ? { action: { startsWith: q.action } } : {}) };
    const [items, total] = await Promise.all([this.prisma.auditLog.findMany({ where, orderBy: { at: "desc" }, skip, take }), this.prisma.auditLog.count({ where })]);
    return { items, total, page, pageSize };
  }
}
