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
exports.AuditController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
const decorators_1 = require("../auth/decorators");
const pagination_1 = require("../common/pagination");
const csv_1 = require("../common/csv");
let AuditController = class AuditController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(u, q) {
        const { skip, take, page, pageSize } = (0, pagination_1.pageArgs)(q);
        const where = { orgId: u.orgId, ...(q.entityType ? { entityType: q.entityType } : {}), ...(q.entityId ? { entityId: q.entityId } : {}), ...(q.action ? { action: { startsWith: q.action } } : {}), ...(q.actorId ? { actorId: q.actorId } : {}), ...(q.from || q.to ? { at: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } } : {}) };
        const [items, total] = await Promise.all([this.prisma.auditLog.findMany({ where, orderBy: { at: "desc" }, skip, take }), this.prisma.auditLog.count({ where })]);
        return { items, total, page, pageSize };
    }
    async csv(u, q) {
        const rows = await this.prisma.auditLog.findMany({ where: { orgId: u.orgId, ...(q.entityType ? { entityType: q.entityType } : {}), ...(q.action ? { action: { startsWith: q.action } } : {}), ...(q.from || q.to ? { at: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } } : {}) }, orderBy: { at: "desc" }, take: 20_000 });
        return (0, csv_1.toCsvText)(["at", "actorId", "action", "entityType", "entityId", "meta"], rows.map((a) => [a.at.toISOString(), a.actorId, a.action, a.entityType, a.entityId, a.meta ? JSON.stringify(a.meta) : ""]));
    }
};
exports.AuditController = AuditController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("audit.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("export.csv"),
    (0, common_1.Header)("Content-Type", "text/csv; charset=utf-8"),
    (0, decorators_1.Perm)("audit.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "csv", null);
exports.AuditController = AuditController = __decorate([
    (0, swagger_1.ApiTags)("audit"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("audit"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditController);
//# sourceMappingURL=audit.controller.js.map