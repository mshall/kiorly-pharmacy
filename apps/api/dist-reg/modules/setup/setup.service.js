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
exports.SetupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
const errors_1 = require("../../common/errors");
const setup_plan_1 = require("./setup-plan");
const permissions_1 = require("../../auth/permissions");
let SetupService = class SetupService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async stored(orgId) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { settings: true } });
        const settings = (t.settings ?? {});
        return { settings, setup: (settings.setup ?? {}) };
    }
    async save(orgId, settings, setup) {
        await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: { ...settings, setup } } });
    }
    async snapshot(orgId) {
        const [tenant, branches, lotsBy, salesBy, drugCount, licensed, otherStaff] = await Promise.all([
            this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { settings: true } }),
            this.prisma.branch.findMany({ where: { orgId, active: true }, orderBy: { createdAt: "asc" }, select: { id: true, name: true, licenceNo: true, address: true } }),
            this.prisma.stockLot.groupBy({ by: ["branchId"], where: { orgId }, _count: { _all: true } }),
            this.prisma.sale.groupBy({ by: ["branchId"], where: { orgId, status: "COMPLETED" }, _count: { _all: true } }),
            this.prisma.priceBookEntry.count({ where: { orgId } }),
            this.prisma.staffUser.count({ where: { orgId, active: true, role: { in: ["OWNER", "PHARMACIST"] }, pharmacistLicenceNo: { not: null } } }),
            this.prisma.staffUser.count({ where: { orgId, active: true, role: { not: "OWNER" } } }),
        ]);
        const settings = (tenant.settings ?? {});
        const lots = new Map(lotsBy.map((x) => [x.branchId, x._count._all]));
        const sales = new Map(salesBy.map((x) => [x.branchId, x._count._all]));
        return {
            branches: branches.map((b) => ({ ...b, stockLots: lots.get(b.id) ?? 0, sales: sales.get(b.id) ?? 0 })),
            pharmacistLicensed: licensed > 0,
            pricedDrugs: drugCount,
            otherStaff,
            receiptConfigured: Boolean(settings.receipt?.header?.trim() || settings.receipt?.footer?.trim() || settings.receiptFooter?.trim()),
            connectStatus: settings.kiorexConnect?.status ?? null,
        };
    }
    async get(u) {
        const [snap, { setup }] = await Promise.all([this.snapshot(u.orgId), this.stored(u.orgId)]);
        const plan = (0, setup_plan_1.buildPlan)(snap, setup.skipped ?? {}, { role: u.role }, setup.dismissedAt ?? null);
        if (setup.dismissedAt && !plan.allDone) {
            const s = await this.stored(u.orgId);
            await this.save(u.orgId, s.settings, { ...s.setup, dismissedAt: null });
        }
        return plan;
    }
    async skip(u, key, entityId) {
        const def = setup_plan_1.SETUP_DEFS.find((d) => d.key === key);
        if (!def)
            throw (0, errors_1.notFound)("Setup step", key);
        if (def.required)
            throw new errors_1.DomainError("STEP_REQUIRED", "Required steps cannot be skipped", 400);
        if (!permissions_1.ROLE_PERMISSIONS[u.role].has(def.perm))
            throw new errors_1.DomainError("FORBIDDEN", `Your role cannot change this step; ask the owner (${(0, setup_plan_1.rolesWith)(def.perm).join(", ")})`, 403);
        if (def.scope === "branch") {
            if (!entityId)
                throw new errors_1.DomainError("ENTITY_REQUIRED", "entityId (branch) is required", 400);
            if (!(await this.prisma.branch.findFirst({ where: { id: entityId, orgId: u.orgId }, select: { id: true } })))
                throw (0, errors_1.notFound)("Branch", entityId);
        }
        const s = await this.stored(u.orgId);
        const skipped = { ...(s.setup.skipped ?? {}), [(0, setup_plan_1.skipKey)(key, def.scope === "branch" ? entityId : null)]: "skipped" };
        await this.save(u.orgId, s.settings, { ...s.setup, skipped });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "setup.step_skipped", entityType: "Tenant", entityId: u.orgId });
        return this.get(u);
    }
    async dismiss(u) {
        const cur = await this.get(u);
        if (!cur.allDone)
            throw new errors_1.DomainError("NOT_DONE", "The checklist can be dismissed once every step is done or skipped", 400);
        const s = await this.stored(u.orgId);
        await this.save(u.orgId, s.settings, { ...s.setup, dismissedAt: new Date().toISOString() });
        return this.get(u);
    }
};
exports.SetupService = SetupService;
exports.SetupService = SetupService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], SetupService);
//# sourceMappingURL=setup.service.js.map