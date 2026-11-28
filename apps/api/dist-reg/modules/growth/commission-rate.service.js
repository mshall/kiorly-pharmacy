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
exports.CommissionRateService = exports.RATE_ROLES = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const contracts_1 = require("@kiorex/contracts");
const commission_rate_view_1 = require("./commission-rate-view");
exports.RATE_ROLES = new Set(["OWNER", "BRANCH_MANAGER", "CHAIN_OPS"]);
let CommissionRateService = class CommissionRateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ingest(orgId, body) {
        const problems = (0, commission_rate_view_1.rateViewProblems)(body);
        if (problems.length)
            throw new common_1.BadRequestException({ code: "INVALID_RATE_VIEW", problems });
        const v = body;
        const have = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId } });
        if (have && have.version >= BigInt(v.version))
            return { applied: false };
        const disclosure = (0, commission_rate_view_1.parseDisclosure)(body.disclosure);
        const counsel = (0, commission_rate_view_1.parseCounselStatus)(body.counsel);
        const data = { product: v.product, version: BigInt(v.version), view: { history: v.history, mode: v.mode ?? null, orgRef: v.orgRef.slice(0, 64), disclosure, counsel: counsel ? { status: counsel.status } : null } };
        if (have)
            await this.prisma.kiorexCommissionRateView.update({ where: { orgId }, data });
        else
            await this.prisma.kiorexCommissionRateView.create({ data: { orgId, ...data } });
        await this.prisma.auditLog.create({ data: { orgId, action: "kiorex.commission_rate.received", entityType: "KiorexCommissionRateView", entityId: orgId, meta: { version: v.version, rows: v.history.length } } });
        return { applied: true };
    }
    async kiorexOrgRef(orgId) {
        const row = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId }, select: { view: true } });
        const ref = row?.view?.orgRef;
        return typeof ref === "string" && ref ? ref : null;
    }
    async rate(user, now = new Date()) {
        if (!exports.RATE_ROLES.has(user.role))
            throw new common_1.ForbiddenException("The commission rate is visible to owners, branch managers and chain operations");
        return this.view(user.orgId, now);
    }
    async view(orgId, now = new Date()) {
        const row = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId } });
        const stored = (row?.view ?? null);
        const disclosure = (0, commission_rate_view_1.parseDisclosure)(stored?.disclosure);
        const counsel = (0, commission_rate_view_1.parseCounselStatus)(stored?.counsel);
        const history = (stored?.history ?? []).slice().sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime() || b.version - a.version);
        const effective = (0, contracts_1.effectiveCommissionRate)(history, now);
        const defaultOnly = (0, contracts_1.effectiveCommissionRate)(history.filter((r) => r.scope === "DEFAULT"), now);
        const upcoming = history.filter((r) => new Date(r.effectiveFrom) > now).sort((a, b) => new Date(a.effectiveFrom).getTime() - new Date(b.effectiveFrom).getTime())[0] ?? null;
        return {
            known: !!row, product: row?.product ?? null, state: effective.state, effective, default: defaultOnly, override: effective.source === "OVERRIDE" ? effective : null, inheriting: effective.source !== "OVERRIDE", upcoming, history, receivedAt: row?.updatedAt ?? null,
            disclosure: disclosure && disclosure.wordingSet ? { rateDisclosure: disclosure.rateDisclosure, termsSummary: disclosure.termsSummary } : null,
            counsel: counsel ? { status: counsel.status } : null, params: (0, commission_rate_view_1.rateParamsOf)(effective.spec),
        };
    }
};
exports.CommissionRateService = CommissionRateService;
exports.CommissionRateService = CommissionRateService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommissionRateService);
//# sourceMappingURL=commission-rate.service.js.map