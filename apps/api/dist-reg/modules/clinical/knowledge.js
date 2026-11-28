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
exports.LocalClinicalKnowledge = exports.ClinicalKnowledge = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const interaction_dataset_1 = require("../prescriptions/safety/interaction-dataset");
const clinical_dataset_1 = require("./clinical-dataset");
class ClinicalKnowledge {
}
exports.ClinicalKnowledge = ClinicalKnowledge;
const key = (a) => a.toLowerCase().trim();
let LocalClinicalKnowledge = class LocalClinicalKnowledge extends ClinicalKnowledge {
    prisma;
    mode = "local";
    cache = new Map();
    constructor(prisma) {
        super();
        this.prisma = prisma;
    }
    invalidate(orgId) { if (orgId)
        this.cache.delete(orgId);
    else
        this.cache.clear(); }
    async snapshot(orgId) {
        const hit = this.cache.get(orgId);
        if (hit && Date.now() - hit.at < 30_000)
            return hit.snap;
        const rows = await this.prisma.clinicalRule.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId }] }, orderBy: [{ orgId: { sort: "asc", nulls: "first" } }, { createdAt: "asc" }] });
        const snap = { interactions: [...interaction_dataset_1.INTERACTION_RULES], dose: new Map(), pregnancy: new Map(), lactation: new Map(), renal: new Map(), hepatic: new Map() };
        for (const r of clinical_dataset_1.DOSE_RULES)
            snap.dose.set(r.ingredient, r);
        for (const r of clinical_dataset_1.PREGNANCY_RULES)
            snap.pregnancy.set(r.ingredient, r);
        for (const [m, src] of [[snap.lactation, clinical_dataset_1.LACTATION_RULES], [snap.renal, clinical_dataset_1.RENAL_RULES], [snap.hepatic, clinical_dataset_1.HEPATIC_RULES]])
            for (const r of src)
                m.set(r.ingredient, r);
        for (const r of rows) {
            const ing = key(r.ingredient);
            if (r.kind === "INTERACTION" && r.ingredientB) {
                const b = key(r.ingredientB);
                snap.interactions = snap.interactions.filter((x) => !((x.a === ing && x.b === b) || (x.a === b && x.b === ing)));
                snap.interactions.push({ a: ing, b, severity: r.severity, note: r.note });
            }
            else if (r.kind === "DOSE_RANGE" && r.maxDailyMg)
                snap.dose.set(ing, { ingredient: ing, maxDailyMg: Number(r.maxDailyMg), maxSingleMg: r.maxSingleMg ? Number(r.maxSingleMg) : undefined, pediatricMaxMgPerKg: r.pediatricMaxMgPerKg ? Number(r.pediatricMaxMgPerKg) : undefined, note: r.note });
            else if (r.kind === "PREGNANCY" && r.category)
                snap.pregnancy.set(ing, { ingredient: ing, category: r.category, note: r.note });
            else if (r.kind === "LACTATION")
                snap.lactation.set(ing, { ingredient: ing, severity: r.severity, note: r.note });
            else if (r.kind === "RENAL")
                snap.renal.set(ing, { ingredient: ing, severity: r.severity, note: r.note });
            else if (r.kind === "HEPATIC")
                snap.hepatic.set(ing, { ingredient: ing, severity: r.severity, note: r.note });
        }
        this.cache.set(orgId, { at: Date.now(), snap });
        return snap;
    }
};
exports.LocalClinicalKnowledge = LocalClinicalKnowledge;
exports.LocalClinicalKnowledge = LocalClinicalKnowledge = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LocalClinicalKnowledge);
//# sourceMappingURL=knowledge.js.map