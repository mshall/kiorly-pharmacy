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
exports.NotificationsCentreController = exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("../../generated/prisma/client");
const decorators_1 = require("../../auth/decorators");
const errors_1 = require("../../common/errors");
const pagination_1 = require("../../common/pagination");
const prisma_service_1 = require("../../prisma/prisma.service");
const roles_service_1 = require("./roles.service");
const import_service_1 = require("./import.service");
const export_service_1 = require("./export.service");
const alerts_service_1 = require("./alerts.service");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
class RolePermDto {
    permission;
    granted;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RolePermDto.prototype, "permission", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RolePermDto.prototype, "granted", void 0);
class ImportDto {
    csv;
    dryRun;
    branchId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(4_000_000),
    __metadata("design:type", String)
], ImportDto.prototype, "csv", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ImportDto.prototype, "dryRun", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportDto.prototype, "branchId", void 0);
const kind = (k) => { if (!import_service_1.IMPORT_KINDS.includes(k))
    throw new errors_1.DomainError("UNKNOWN_IMPORT", `Unknown import ${k}`, 404, { available: import_service_1.IMPORT_KINDS }); return k; };
let AdminController = class AdminController {
    roles;
    imports;
    exports;
    modes;
    prisma;
    constructor(roles, imports, exports, modes, prisma) {
        this.roles = roles;
        this.imports = imports;
        this.exports = exports;
        this.modes = modes;
        this.prisma = prisma;
    }
    matrix(u) { return this.roles.matrix(u.orgId); }
    setPerm(u, role, d) { return this.roles.set(u, this.role(role), d.permission, d.granted); }
    reset(u, role) { return this.roles.reset(u, this.role(role)); }
    role(r) { if (!Object.values(client_1.StaffRole).includes(r))
        throw new errors_1.DomainError("UNKNOWN_ROLE", `Unknown role ${r}`, 404); return r; }
    async mode(u) {
        const mode = await this.modes.mode(u.orgId);
        const clients = await this.prisma.integrationClient.count({ where: { orgId: u.orgId, active: true } });
        return { mode, integrationClients: clients, external: { kiorex: mode === "INTEGRATED", clinicalKb: "local", messaging: process.env.MESSAGING_MODE === "real" ? "real" : "mock", payments: process.env.PSP_MODE === "real" ? "real" : "mock" }, standaloneNote: "In standalone mode no Kiorly or Kiorex service is contacted; every module works on this pharmacy's own data." };
    }
    template(k, res) { const kd = kind(k); res.setHeader("Content-Disposition", `attachment; filename="${kd}-template.csv"`); return (0, import_service_1.importTemplate)(kd); }
    import(u, k, d) { return this.imports.run(u, kind(k), d.csv, { dryRun: d.dryRun ?? true, branchId: d.branchId }); }
    async bundle(u, res) { res.setHeader("Content-Disposition", `attachment; filename="kiorly-backup-${new Date().toISOString().slice(0, 10)}.json"`); return this.exports.bundle(u); }
    entities() { return { entities: export_service_1.EXPORT_ENTITIES }; }
    async csv(u, entity, res) { res.setHeader("Content-Disposition", `attachment; filename="${entity}.csv"`); return this.exports.csv(u, entity); }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)("roles"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "matrix", null);
__decorate([
    (0, common_1.Put)("roles/:role/permissions"),
    (0, decorators_1.Perm)("roles.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("role")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RolePermDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "setPerm", null);
__decorate([
    (0, common_1.Post)("roles/:role/reset"),
    (0, decorators_1.Perm)("roles.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("role")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "reset", null);
__decorate([
    (0, common_1.Get)("mode"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "mode", null);
__decorate([
    (0, common_1.Get)("import/:kind/template"),
    (0, common_1.Header)("Content-Type", "text/csv; charset=utf-8"),
    (0, decorators_1.Perm)("data.import"),
    __param(0, (0, common_1.Param)("kind")),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "template", null);
__decorate([
    (0, common_1.Post)("import/:kind"),
    (0, decorators_1.Perm)("data.import"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("kind")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ImportDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "import", null);
__decorate([
    (0, common_1.Get)("export"),
    (0, decorators_1.Perm)("data.export"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bundle", null);
__decorate([
    (0, common_1.Get)("export/entities"),
    (0, decorators_1.Perm)("data.export"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "entities", null);
__decorate([
    (0, common_1.Get)("export/:entity"),
    (0, common_1.Header)("Content-Type", "text/csv; charset=utf-8"),
    (0, decorators_1.Perm)("data.export"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("entity")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "csv", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)("admin"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("admin"),
    __param(0, (0, common_1.Inject)(roles_service_1.RolesService)),
    __param(1, (0, common_1.Inject)(import_service_1.ImportService)),
    __param(2, (0, common_1.Inject)(export_service_1.ExportService)),
    __param(3, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __param(4, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [roles_service_1.RolesService, import_service_1.ImportService, export_service_1.ExportService,
        tenant_mode_service_1.TenantModeService, prisma_service_1.PrismaService])
], AdminController);
let NotificationsCentreController = class NotificationsCentreController {
    alerts;
    constructor(alerts) {
        this.alerts = alerts;
    }
    feed(u, q) { return this.alerts.feed(u, { unread: q.unread === "true", includeResolved: q.resolved === "true", take: (0, pagination_1.pageArgs)(q, 200).take }); }
    unread(u) { return this.alerts.unreadCount(u); }
    scan(u) { return this.alerts.scan(u.orgId); }
    readAll(u) { return this.alerts.markAllRead(u); }
    read(u, id) { return this.alerts.markRead(u, id); }
};
exports.NotificationsCentreController = NotificationsCentreController;
__decorate([
    (0, common_1.Get)("feed"),
    (0, decorators_1.Perm)("notifications.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NotificationsCentreController.prototype, "feed", null);
__decorate([
    (0, common_1.Get)("unread-count"),
    (0, decorators_1.Perm)("notifications.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsCentreController.prototype, "unread", null);
__decorate([
    (0, common_1.Post)("scan"),
    (0, decorators_1.Perm)("notifications.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsCentreController.prototype, "scan", null);
__decorate([
    (0, common_1.Post)("read-all"),
    (0, decorators_1.Perm)("notifications.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsCentreController.prototype, "readAll", null);
__decorate([
    (0, common_1.Post)(":id/read"),
    (0, decorators_1.Perm)("notifications.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], NotificationsCentreController.prototype, "read", null);
exports.NotificationsCentreController = NotificationsCentreController = __decorate([
    (0, swagger_1.ApiTags)("notifications"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("notifications"),
    __param(0, (0, common_1.Inject)(alerts_service_1.AlertsService)),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], NotificationsCentreController);
//# sourceMappingURL=admin.controller.js.map