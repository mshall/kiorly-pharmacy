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
exports.UomService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
let UomService = class UomService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(orgId, drugId) { return this.prisma.uomConversion.findMany({ where: { orgId, drugId, active: true }, orderBy: { factor: "asc" } }); }
    async create(u, drugId, d) {
        if (!Number.isInteger(d.factor) || d.factor < 2)
            throw new errors_1.DomainError("INVALID_FACTOR", "A conversion factor must be a whole number of at least 2 base units", 400);
        if (!(await this.prisma.drug.findFirst({ where: { id: drugId, OR: [{ orgId: null }, { orgId: u.orgId }] } })))
            throw (0, errors_1.notFound)("Drug", drugId);
        try {
            const r = await this.prisma.uomConversion.create({ data: { orgId: u.orgId, drugId, name: d.name.trim().toLowerCase(), factor: d.factor, barcode: d.barcode } });
            await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "uom.create", entityType: "UomConversion", entityId: r.id, meta: { factor: d.factor } } });
            return r;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002")
                throw (0, errors_1.conflict)("UOM_EXISTS", "This unit already exists for the drug");
            throw e;
        }
    }
    async remove(u, id) {
        const r = await this.prisma.uomConversion.updateMany({ where: { id, orgId: u.orgId }, data: { active: false } });
        if (!r.count)
            throw (0, errors_1.notFound)("Unit", id);
        return { ok: true };
    }
    async factor(orgId, drugId, uom) {
        if (!uom)
            return 1;
        const r = await this.prisma.uomConversion.findFirst({ where: { orgId, drugId, name: uom.trim().toLowerCase(), active: true } });
        if (!r)
            throw new errors_1.DomainError("UNKNOWN_UOM", `Unit "${uom}" is not defined for this drug`, 400, { drugId, uom });
        return r.factor;
    }
};
exports.UomService = UomService;
exports.UomService = UomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UomService);
//# sourceMappingURL=uom.service.js.map