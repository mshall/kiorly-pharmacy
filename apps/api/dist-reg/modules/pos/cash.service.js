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
exports.CashService = exports.CASH_OUT_CATEGORIES = exports.CASH_IN_CATEGORIES = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
exports.CASH_IN_CATEGORIES = ["FLOAT_TOP_UP", "OWNER_DEPOSIT", "OTHER_IN"];
exports.CASH_OUT_CATEGORIES = ["PETTY_CASH", "BANK_DEPOSIT", "SUPPLIER_PAYMENT", "EXPENSE", "OWNER_WITHDRAWAL", "OTHER_OUT"];
let CashService = class CashService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async record(u, branchId, d, db = this.prisma) {
        if ((0, money_1.D)(d.amount).lte(0))
            throw new errors_1.DomainError("INVALID_AMOUNT", "Amount must be positive", 400);
        if (!(d.kind === "IN" ? exports.CASH_IN_CATEGORIES : exports.CASH_OUT_CATEGORIES).includes(d.category))
            throw new errors_1.DomainError("INVALID_CATEGORY", `Category ${d.category} is not valid for cash ${d.kind}`, 400);
        const shift = await db.shift.findFirst({ where: { orgId: u.orgId, branchId, status: "OPEN" } });
        if (!shift)
            throw new errors_1.DomainError("SHIFT_REQUIRED", "Open a shift before moving cash in or out of the drawer", 409);
        const m = await db.cashMovement.create({ data: { orgId: u.orgId, branchId, shiftId: shift.id, kind: d.kind, category: d.category, amount: d.amount, reason: d.reason, refType: d.refType, refId: d.refId, createdBy: u.userId } });
        await db.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: `cash.${d.kind.toLowerCase()}`, entityType: "CashMovement", entityId: m.id, meta: { amount: (0, money_1.money)(d.amount), category: d.category } } });
        return m;
    }
    async list(orgId, q) {
        const rows = await this.prisma.cashMovement.findMany({ where: { orgId, ...(q.shiftId ? { shiftId: q.shiftId } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, orderBy: { createdAt: "desc" }, take: 200 });
        return rows.map((r) => ({ ...r, amount: (0, money_1.money)(r.amount) }));
    }
    async totals(orgId, shiftId) {
        const rows = await this.prisma.cashMovement.groupBy({ by: ["kind"], where: { orgId, shiftId }, _sum: { amount: true } });
        const g = (k) => (0, money_1.D)(rows.find((r) => r.kind === k)?._sum.amount ?? 0);
        return { cashIn: g("IN"), cashOut: g("OUT") };
    }
    async mustShift(orgId, shiftId) { const s = await this.prisma.shift.findFirst({ where: { id: shiftId, orgId } }); if (!s)
        throw (0, errors_1.notFound)("Shift", shiftId); return s; }
};
exports.CashService = CashService;
exports.CashService = CashService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CashService);
//# sourceMappingURL=cash.service.js.map