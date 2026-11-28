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
exports.ClinicalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../prisma/prisma.service");
const decorators_1 = require("../../auth/decorators");
const errors_1 = require("../../common/errors");
const pagination_1 = require("../../common/pagination");
const knowledge_1 = require("./knowledge");
const clinical_dataset_1 = require("./clinical-dataset");
const interaction_dataset_1 = require("../prescriptions/safety/interaction-dataset");
const KINDS = ["INTERACTION", "DOSE_RANGE", "PREGNANCY", "LACTATION", "RENAL", "HEPATIC"];
class RuleDto {
    kind;
    ingredient;
    ingredientB;
    severity;
    note;
    maxDailyMg;
    maxSingleMg;
    pediatricMaxMgPerKg;
    category;
}
__decorate([
    (0, class_validator_1.IsIn)(KINDS),
    __metadata("design:type", Object)
], RuleDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], RuleDto.prototype, "ingredient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RuleDto.prototype, "ingredientB", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["MINOR", "MODERATE", "MAJOR", "CONTRAINDICATED"]),
    __metadata("design:type", String)
], RuleDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RuleDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], RuleDto.prototype, "maxDailyMg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], RuleDto.prototype, "maxSingleMg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], RuleDto.prototype, "pediatricMaxMgPerKg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["A", "B", "C", "D", "X"]),
    __metadata("design:type", String)
], RuleDto.prototype, "category", void 0);
let ClinicalController = class ClinicalController {
    prisma;
    kb;
    local;
    constructor(prisma, kb, local) {
        this.prisma = prisma;
        this.kb = kb;
        this.local = local;
    }
    async list(u, q) {
        const rows = await this.prisma.clinicalRule.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: u.orgId }], ...(q.kind ? { kind: q.kind } : {}), ...(q.q ? { ingredient: { contains: q.q.toLowerCase() } } : {}) }, orderBy: [{ kind: "asc" }, { ingredient: "asc" }], take: 500 });
        const builtIn = [
            ...interaction_dataset_1.INTERACTION_RULES.map((r) => ({ kind: "INTERACTION", ingredient: r.a, ingredientB: r.b, severity: r.severity, note: r.note })),
            ...clinical_dataset_1.DOSE_RULES.map((r) => ({ kind: "DOSE_RANGE", ingredient: r.ingredient, maxDailyMg: r.maxDailyMg, maxSingleMg: r.maxSingleMg ?? null, pediatricMaxMgPerKg: r.pediatricMaxMgPerKg ?? null, note: `max ${r.maxDailyMg} mg/day` })),
            ...clinical_dataset_1.PREGNANCY_RULES.map((r) => ({ kind: "PREGNANCY", ingredient: r.ingredient, category: r.category, note: r.note })), ...clinical_dataset_1.LACTATION_RULES.map((r) => ({ kind: "LACTATION", ...r })), ...clinical_dataset_1.RENAL_RULES.map((r) => ({ kind: "RENAL", ...r })), ...clinical_dataset_1.HEPATIC_RULES.map((r) => ({ kind: "HEPATIC", ...r })),
        ].filter((r) => (!q.kind || r.kind === q.kind) && (!q.q || r.ingredient.includes(q.q.toLowerCase())));
        return { mode: this.kb.mode, counts: { builtIn: builtIn.length, database: rows.length }, rules: [...rows.map((r) => ({ id: r.id, scope: r.orgId ? "TENANT" : "GLOBAL", source: r.source, kind: r.kind, ingredient: r.ingredient, ingredientB: r.ingredientB, severity: r.severity, note: r.note, maxDailyMg: r.maxDailyMg?.toString() ?? null, maxSingleMg: r.maxSingleMg?.toString() ?? null, pediatricMaxMgPerKg: r.pediatricMaxMgPerKg?.toString() ?? null, category: r.category })), ...builtIn.slice(0, 400).map((r) => ({ id: null, scope: "BUILT_IN", source: "starter", ...r }))] };
    }
    async add(u, d) {
        const ing = d.ingredient.toLowerCase().trim(), b = d.ingredientB?.toLowerCase().trim();
        if (d.kind === "INTERACTION" && !b)
            throw new errors_1.DomainError("INGREDIENT_B_REQUIRED", "An interaction needs two ingredients", 400);
        if (d.kind === "DOSE_RANGE" && !d.maxDailyMg)
            throw new errors_1.DomainError("MAX_DAILY_REQUIRED", "A dose rule needs a maximum daily dose", 400);
        if (d.kind === "PREGNANCY" && !d.category)
            throw new errors_1.DomainError("CATEGORY_REQUIRED", "A pregnancy rule needs a category (A-X)", 400);
        const key = `${d.kind.toLowerCase()}:${[ing, b].filter(Boolean).sort().join("|")}:org:${u.orgId}`;
        if (await this.prisma.clinicalRule.findUnique({ where: { key } }))
            throw (0, errors_1.conflict)("RULE_EXISTS", "This tenant already has a rule for this entry; remove it first");
        const r = await this.prisma.clinicalRule.create({ data: { orgId: u.orgId, key, kind: d.kind, ingredient: ing, ingredientB: b, severity: d.severity ?? "MODERATE", note: d.note, maxDailyMg: d.maxDailyMg, maxSingleMg: d.maxSingleMg, pediatricMaxMgPerKg: d.pediatricMaxMgPerKg, category: d.category, source: "tenant", createdBy: u.userId } });
        this.local.invalidate(u.orgId);
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "clinical.rule_add", entityType: "ClinicalRule", entityId: r.id, meta: { kind: d.kind, ingredient: ing } } });
        return r;
    }
    async remove(u, id) {
        const r = await this.prisma.clinicalRule.findFirst({ where: { id, orgId: u.orgId } });
        if (!r)
            throw (0, errors_1.notFound)("Rule", id);
        await this.prisma.clinicalRule.delete({ where: { id } });
        this.local.invalidate(u.orgId);
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "clinical.rule_remove", entityType: "ClinicalRule", entityId: id } });
        return { ok: true };
    }
    async overrides(u, q) {
        const { skip, take } = (0, pagination_1.pageArgs)(q);
        const where = { dispensing: { orgId: u.orgId }, outcome: "OVERRIDDEN_BY_PHARMACIST", ...(q.from || q.to ? { checkedAt: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } } : {}) };
        const [rows, total] = await Promise.all([this.prisma.safetyCheckResult.findMany({ where, include: { dispensing: { select: { id: true, branchId: true, prescriptionId: true, patientId: true, createdAt: true } } }, orderBy: { checkedAt: "desc" }, skip, take }), this.prisma.safetyCheckResult.count({ where })]);
        const staff = await this.prisma.staffUser.findMany({ where: { id: { in: rows.map((r) => r.overriddenBy).filter((x) => !!x) } }, select: { id: true, displayName: true, pharmacistLicenceNo: true } });
        const sm = new Map(staff.map((s) => [s.id, s]));
        return { total, items: rows.map((r) => ({ id: r.id, kind: r.kind, detail: r.detail, reason: r.overrideReason, checkedAt: r.checkedAt, dispensingId: r.dispensingId, prescriptionId: r.dispensing.prescriptionId, pharmacist: r.overriddenBy ? sm.get(r.overriddenBy) ?? { id: r.overriddenBy } : null })) };
    }
};
exports.ClinicalController = ClinicalController;
__decorate([
    (0, common_1.Get)("kb"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("kb"),
    (0, decorators_1.Perm)("safety.kb.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RuleDto]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "add", null);
__decorate([
    (0, common_1.Delete)("kb/:id"),
    (0, decorators_1.Perm)("safety.kb.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)("overrides"),
    (0, decorators_1.Perm)("audit.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ClinicalController.prototype, "overrides", null);
exports.ClinicalController = ClinicalController = __decorate([
    (0, swagger_1.ApiTags)("clinical"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("clinical"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(knowledge_1.ClinicalKnowledge)),
    __param(2, (0, common_1.Inject)(knowledge_1.LocalClinicalKnowledge)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, knowledge_1.ClinicalKnowledge, knowledge_1.LocalClinicalKnowledge])
], ClinicalController);
//# sourceMappingURL=clinical.controller.js.map