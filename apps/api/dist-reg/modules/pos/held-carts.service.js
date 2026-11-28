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
exports.HeldCartsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
let HeldCartsService = class HeldCartsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async hold(u, branchId, d) {
        const lines = d.payload.lines;
        if (!Array.isArray(lines) || !lines.length)
            throw new errors_1.DomainError("EMPTY_CART", "Nothing to hold", 400);
        const n = await this.prisma.heldCart.count({ where: { orgId: u.orgId, branchId, status: "HELD" } });
        if (n >= 30)
            throw new errors_1.DomainError("TOO_MANY_HELD", "Too many held carts; resume or discard some", 409);
        const h = await this.prisma.heldCart.create({ data: { orgId: u.orgId, branchId, userId: u.userId, label: d.label?.trim() || `#${n + 1}`, patientId: d.patientId, payload: d.payload } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "cart.hold", entityType: "HeldCart", entityId: h.id, meta: { lines: lines.length } } });
        return h;
    }
    list(orgId, branchId) { return this.prisma.heldCart.findMany({ where: { orgId, branchId, status: "HELD" }, orderBy: { createdAt: "desc" } }); }
    async resume(u, id) {
        const h = await this.prisma.heldCart.findFirst({ where: { id, orgId: u.orgId } });
        if (!h)
            throw (0, errors_1.notFound)("Held cart", id);
        if (u.branchId && h.branchId !== u.branchId)
            throw new errors_1.DomainError("BRANCH_FORBIDDEN", "This cart belongs to another branch", 403);
        const r = await this.prisma.heldCart.updateMany({ where: { id, status: "HELD" }, data: { status: "RESUMED", resolvedAt: new Date() } });
        if (!r.count)
            throw new errors_1.DomainError("NOT_HELD", "This cart was already resumed or discarded", 409);
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "cart.resume", entityType: "HeldCart", entityId: id } });
        return h;
    }
    async discard(u, id) {
        const r = await this.prisma.heldCart.updateMany({ where: { id, orgId: u.orgId, status: "HELD" }, data: { status: "DISCARDED", resolvedAt: new Date() } });
        if (!r.count)
            throw (0, errors_1.notFound)("Held cart", id);
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "cart.discard", entityType: "HeldCart", entityId: id } });
        return { ok: true };
    }
};
exports.HeldCartsService = HeldCartsService;
exports.HeldCartsService = HeldCartsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HeldCartsService);
//# sourceMappingURL=held-carts.service.js.map