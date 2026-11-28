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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(user, d) {
        if ((0, money_1.D)(d.creditLimit).isNeg())
            throw new errors_1.DomainError("INVALID_LIMIT", "Credit limit must be >= 0", 400);
        return this.prisma.$transaction(async (tx) => {
            const p = await tx.patientRef.create({ data: { orgId: user.orgId, displayName: d.displayName, phone: d.phone } });
            const a = await tx.customerAccount.create({ data: { orgId: user.orgId, patientId: p.id, creditLimit: d.creditLimit } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "customer.create", entityType: "CustomerAccount", entityId: a.id } });
            return { ...a, displayName: p.displayName, phone: p.phone };
        });
    }
    async list(orgId, q) {
        const rows = await this.prisma.customerAccount.findMany({ where: { orgId, ...(q ? { patient: { OR: [{ displayName: { contains: q, mode: "insensitive" } }, { phone: { contains: q } }] } } : {}) }, include: { patient: { select: { displayName: true, phone: true } } }, orderBy: { createdAt: "desc" }, take: 100 });
        return rows.map((a) => ({ id: a.id, displayName: a.patient.displayName, phone: a.patient.phone, creditLimit: (0, money_1.money)(a.creditLimit), balance: (0, money_1.money)(a.balance), available: (0, money_1.money)(a.creditLimit.minus(a.balance)) }));
    }
    async get(orgId, id) {
        const a = await this.prisma.customerAccount.findFirst({ where: { id, orgId }, include: { patient: { select: { displayName: true, phone: true } }, entries: { orderBy: { createdAt: "desc" }, take: 100 } } });
        if (!a)
            throw (0, errors_1.notFound)("Customer account", id);
        return a;
    }
    async setLimit(user, id, creditLimit) {
        await this.get(user.orgId, id);
        const r = await this.prisma.customerAccount.update({ where: { id }, data: { creditLimit } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "customer.limit", entityType: "CustomerAccount", entityId: id, meta: { creditLimit: (0, money_1.money)(creditLimit) } } });
        return r;
    }
    async pay(user, id, amount, branchId) {
        if ((0, money_1.D)(amount).lte(0))
            throw new errors_1.DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
        return this.prisma.$transaction(async (tx) => {
            const [a] = await tx.$queryRaw `SELECT balance FROM "CustomerAccount" WHERE id = ${id} AND "orgId" = ${user.orgId} FOR UPDATE`;
            if (!a)
                throw (0, errors_1.notFound)("Customer account", id);
            if ((0, money_1.D)(amount).gt(a.balance))
                throw new errors_1.DomainError("OVERPAYMENT", "Payment exceeds the outstanding balance", 409, { balance: (0, money_1.money)(a.balance) });
            await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: id, kind: "PAYMENT", amount: (0, money_1.D)(amount).neg(), note: `cash:${branchId}`, createdBy: user.userId } });
            const r = await tx.customerAccount.update({ where: { id }, data: { balance: { decrement: amount } } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "customer.payment", entityType: "CustomerAccount", entityId: id, meta: { amount: (0, money_1.money)(amount) } } });
            return r;
        });
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map