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
exports.PrescribersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
let PrescribersService = class PrescribersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(orgId, q) {
        const where = { orgId, active: true, ...(q.verified !== undefined ? { verified: q.verified } : {}), ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { nameAr: { contains: q.q } }, { licenceNo: { contains: q.q, mode: "insensitive" } }, { clinicName: { contains: q.q, mode: "insensitive" } }] } : {}) };
        const [items, total] = await Promise.all([this.prisma.prescriber.findMany({ where, orderBy: { name: "asc" }, skip: (q.page - 1) * q.pageSize, take: q.pageSize }), this.prisma.prescriber.count({ where })]);
        const counts = await this.prisma.prescription.groupBy({ by: ["prescriberId"], where: { orgId, prescriberId: { in: items.map((i) => i.id) } }, _count: true });
        const cm = new Map(counts.map((c) => [c.prescriberId, c._count]));
        return { total, page: q.page, pageSize: q.pageSize, items: items.map((i) => ({ ...i, prescriptions: cm.get(i.id) ?? 0 })) };
    }
    async get(orgId, id) {
        const p = await this.prisma.prescriber.findFirst({ where: { id, orgId } });
        if (!p)
            throw (0, errors_1.notFound)("Prescriber", id);
        return p;
    }
    async create(u, d) {
        try {
            const p = await this.prisma.prescriber.create({ data: { orgId: u.orgId, name: d.name.trim(), nameAr: d.nameAr, licenceNo: d.licenceNo.trim(), specialty: d.specialty, phone: d.phone, clinicName: d.clinicName, clinicAddress: d.clinicAddress, notes: d.notes } });
            await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "prescriber.create", entityType: "Prescriber", entityId: p.id } });
            return p;
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002")
                throw (0, errors_1.conflict)("PRESCRIBER_EXISTS", "A prescriber with this licence number already exists");
            throw e;
        }
    }
    async update(u, id, d) {
        await this.get(u.orgId, id);
        const p = await this.prisma.prescriber.update({ where: { id }, data: d });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "prescriber.update", entityType: "Prescriber", entityId: id, meta: { fields: Object.keys(d) } } });
        return p;
    }
    async verify(u, id, verified) {
        await this.get(u.orgId, id);
        const p = await this.prisma.prescriber.update({ where: { id }, data: { verified, verifiedBy: verified ? u.userId : null, verifiedAt: verified ? new Date() : null } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: verified ? "prescriber.verify" : "prescriber.unverify", entityType: "Prescriber", entityId: id } });
        return p;
    }
    async ensure(tx, orgId, d) {
        const ex = await tx.prescriber.findUnique({ where: { orgId_licenceNo: { orgId, licenceNo: d.licenceNo.trim() } } });
        return ex ?? tx.prescriber.create({ data: { orgId, name: d.name.trim(), licenceNo: d.licenceNo.trim(), specialty: d.specialty } });
    }
};
exports.PrescribersService = PrescribersService;
exports.PrescribersService = PrescribersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrescribersService);
//# sourceMappingURL=prescribers.service.js.map