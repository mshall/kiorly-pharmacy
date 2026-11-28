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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const prisma_service_1 = require("../../prisma/prisma.service");
const branch_scope_1 = require("../../common/branch-scope");
const pagination_1 = require("../../common/pagination");
const finance_service_1 = require("./finance.service");
class ExpenseDto {
    branchId;
    category;
    amount;
    vatAmount;
    method;
    description;
    supplierId;
    expenseDate;
    receiptRef;
    fromDrawer;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(finance_service_1.EXPENSE_CATEGORIES),
    __metadata("design:type", String)
], ExpenseDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "vatAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["CASH", "CARD", "BANK", "OTHER"]),
    __metadata("design:type", String)
], ExpenseDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "expenseDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ExpenseDto.prototype, "receiptRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ExpenseDto.prototype, "fromDrawer", void 0);
const range = (q) => { const to = q.to ? new Date(q.to) : new Date(); const from = q.from ? new Date(q.from) : new Date(to.getTime() - 29 * 86_400_000); return { from, to }; };
let FinanceController = class FinanceController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    overview(u, q) { return this.svc.overview({ orgId: u.orgId, ...(0, branch_scope_1.branchFilter)(u, q.branchId), ...range(q) }); }
    margin(u, q) { return this.svc.margin({ orgId: u.orgId, ...(0, branch_scope_1.branchFilter)(u, q.branchId), ...range(q) }, q.by === "category" ? "category" : "product"); }
    receivables(u) { return this.svc.receivables(u.orgId); }
    categories() { return finance_service_1.EXPENSE_CATEGORIES; }
    expenses(u, q) { const { skip, take } = (0, pagination_1.pageArgs)(q); return this.svc.listExpenses(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), category: q.category, from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, skip, take }); }
    async createExpense(u, d) { return this.svc.createExpense(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d); }
    voidExpense(u, id) { return this.svc.voidExpense(u, id); }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)("overview"),
    (0, decorators_1.Perm)("finance.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("margin"),
    (0, decorators_1.Perm)("finance.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "margin", null);
__decorate([
    (0, common_1.Get)("receivables"),
    (0, decorators_1.Perm)("finance.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "receivables", null);
__decorate([
    (0, common_1.Get)("expense-categories"),
    (0, decorators_1.Perm)("expense.read"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "categories", null);
__decorate([
    (0, common_1.Get)("expenses"),
    (0, decorators_1.Perm)("expense.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "expenses", null);
__decorate([
    (0, common_1.Post)("expenses"),
    (0, decorators_1.Perm)("expense.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ExpenseDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Post)("expenses/:id/void"),
    (0, decorators_1.Perm)("expense.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "voidExpense", null);
exports.FinanceController = FinanceController = __decorate([
    (0, swagger_1.ApiTags)("finance"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("finance"),
    __param(0, (0, common_1.Inject)(finance_service_1.FinanceService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [finance_service_1.FinanceService, prisma_service_1.PrismaService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map