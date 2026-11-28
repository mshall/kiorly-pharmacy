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
exports.AuditService = void 0;
exports.scrub = scrub;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const PHI_KEYS = /(name|phone|nationalid|address|email|allerg)/i;
let AuditService = class AuditService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async record(entry, db = this.prisma) {
        await db.auditLog.create({
            data: {
                orgId: entry.orgId, actorId: entry.actorId ?? null, action: entry.action, entityType: entry.entityType, entityId: entry.entityId,
                meta: scrub(entry.meta),
            },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
function scrub(meta) {
    if (meta == null || typeof meta !== "object")
        return meta ?? undefined;
    if (Array.isArray(meta))
        return meta.map(scrub);
    return Object.fromEntries(Object.entries(meta).filter(([k]) => !PHI_KEYS.test(k)).map(([k, v]) => [k, scrub(v)]));
}
//# sourceMappingURL=audit.service.js.map