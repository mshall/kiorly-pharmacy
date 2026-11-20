import { Body, Controller, Get, Header, Inject, Param, Post, Put, Query, Res } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import type { Response } from "express";
import { StaffRole } from "../../generated/prisma/client";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { DomainError } from "../../common/errors";
import { pageArgs } from "../../common/pagination";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesService } from "./roles.service";
import { IMPORT_KINDS, ImportService, importTemplate, type ImportKind } from "./import.service";
import { EXPORT_ENTITIES, ExportService } from "./export.service";
import { AlertsService } from "./alerts.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";

class RolePermDto { @IsString() permission!: string; @IsBoolean() granted!: boolean; }
class ImportDto { @IsString() @MinLength(5) @MaxLength(4_000_000) csv!: string; @IsOptional() @IsBoolean() dryRun?: boolean; @IsOptional() @IsString() branchId?: string; }
const kind = (k: string): ImportKind => { if (!(IMPORT_KINDS as readonly string[]).includes(k)) throw new DomainError("UNKNOWN_IMPORT", `Unknown import ${k}`, 404, { available: IMPORT_KINDS }); return k as ImportKind; };

/** Administration: roles matrix, CSV import, backup / export, audit CSV, operating mode summary. */
@ApiTags("admin")
@ApiBearerAuth()
@Controller("admin")
export class AdminController {
  constructor(
    @Inject(RolesService) private readonly roles: RolesService, @Inject(ImportService) private readonly imports: ImportService, @Inject(ExportService) private readonly exports: ExportService,
    @Inject(TenantModeService) private readonly modes: TenantModeService, @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get("roles") @Perm("settings.read")
  matrix(@CurrentUser() u: AuthUser) { return this.roles.matrix(u.orgId); }
  @Put("roles/:role/permissions") @Perm("roles.manage")
  setPerm(@CurrentUser() u: AuthUser, @Param("role") role: string, @Body() d: RolePermDto) { return this.roles.set(u, this.role(role), d.permission, d.granted); }
  @Post("roles/:role/reset") @Perm("roles.manage")
  reset(@CurrentUser() u: AuthUser, @Param("role") role: string) { return this.roles.reset(u, this.role(role)); }
  private role(r: string): StaffRole { if (!(Object.values(StaffRole) as string[]).includes(r)) throw new DomainError("UNKNOWN_ROLE", `Unknown role ${r}`, 404); return r as StaffRole; }

  @Get("mode") @Perm("settings.read")
  async mode(@CurrentUser() u: AuthUser) {
    const mode = await this.modes.mode(u.orgId);
    const clients = await this.prisma.integrationClient.count({ where: { orgId: u.orgId, active: true } });
    return { mode, integrationClients: clients, external: { kiorex: mode === "INTEGRATED", clinicalKb: "local", messaging: process.env.MESSAGING_MODE === "real" ? "real" : "mock", payments: process.env.PSP_MODE === "real" ? "real" : "mock" }, standaloneNote: "In standalone mode no Kiorly or Kiorex service is contacted; every module works on this pharmacy's own data." };
  }

  @Get("import/:kind/template") @Header("Content-Type", "text/csv; charset=utf-8") @Perm("data.import")
  template(@Param("kind") k: string, @Res({ passthrough: true }) res: Response) { const kd = kind(k); res.setHeader("Content-Disposition", `attachment; filename="${kd}-template.csv"`); return importTemplate(kd); }
  @Post("import/:kind") @Perm("data.import")
  import(@CurrentUser() u: AuthUser, @Param("kind") k: string, @Body() d: ImportDto) { return this.imports.run(u, kind(k), d.csv, { dryRun: d.dryRun ?? true, branchId: d.branchId }); }

  @Get("export") @Perm("data.export")
  async bundle(@CurrentUser() u: AuthUser, @Res({ passthrough: true }) res: Response) { res.setHeader("Content-Disposition", `attachment; filename="kiorly-backup-${new Date().toISOString().slice(0, 10)}.json"`); return this.exports.bundle(u); }
  @Get("export/entities") @Perm("data.export")
  entities() { return { entities: EXPORT_ENTITIES }; }
  @Get("export/:entity") @Header("Content-Type", "text/csv; charset=utf-8") @Perm("data.export")
  async csv(@CurrentUser() u: AuthUser, @Param("entity") entity: string, @Res({ passthrough: true }) res: Response) { res.setHeader("Content-Disposition", `attachment; filename="${entity}.csv"`); return this.exports.csv(u, entity); }
}

@ApiTags("notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsCentreController {
  constructor(@Inject(AlertsService) private readonly alerts: AlertsService) {}
  @Get("feed") @Perm("notifications.read")
  feed(@CurrentUser() u: AuthUser, @Query() q: { unread?: string; resolved?: string; pageSize?: string }) { return this.alerts.feed(u, { unread: q.unread === "true", includeResolved: q.resolved === "true", take: pageArgs(q, 200).take }); }
  @Get("unread-count") @Perm("notifications.read")
  unread(@CurrentUser() u: AuthUser) { return this.alerts.unreadCount(u); }
  @Post("scan") @Perm("notifications.read")
  scan(@CurrentUser() u: AuthUser) { return this.alerts.scan(u.orgId); }
  @Post("read-all") @Perm("notifications.read")
  readAll(@CurrentUser() u: AuthUser) { return this.alerts.markAllRead(u); }
  @Post(":id/read") @Perm("notifications.read")
  read(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.alerts.markRead(u, id); }
}
