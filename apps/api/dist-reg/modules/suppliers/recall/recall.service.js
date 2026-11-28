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
exports.RecallService = void 0;
const dates_1 = require("../../../common/dates");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const errors_1 = require("../../../common/errors");
const notifications_service_1 = require("../../../platform/adapters/notifications.service");
let RecallService = class RecallService {
    prisma;
    notify;
    constructor(prisma, notify) {
        this.prisma = prisma;
        this.notify = notify;
    }
    async enter(user, input) {
        const drug = await this.prisma.drug.findFirst({ where: { id: input.drugId, OR: [{ orgId: null }, { orgId: user.orgId }] } });
        if (!drug)
            throw (0, errors_1.notFound)("Drug", input.drugId);
        const lotNumbers = [...new Set(input.lotNumbers.map((s) => s.trim()).filter(Boolean))];
        if (!lotNumbers.length)
            throw new errors_1.DomainError("LOTS_REQUIRED", "At least one lot number is required", 400);
        const started = Date.now();
        const notice = await this.prisma.$transaction(async (tx) => {
            const n = await tx.recallNotice.create({ data: { orgId: user.orgId, drugId: input.drugId, lotNumbers, reason: input.reason, source: input.source, enteredBy: user.userId } });
            const lots = await tx.stockLot.findMany({ where: { orgId: user.orgId, drugId: input.drugId, lotNumber: { in: lotNumbers }, status: { not: "RECALLED" } } });
            for (const l of lots) {
                await tx.stockLot.update({ where: { id: l.id }, data: { status: "RECALLED", statusBeforeBlock: l.status === "QUARANTINE" ? l.statusBeforeBlock ?? "AVAILABLE" : l.status, blockedReason: `Recall: ${input.reason}`, blockedAt: new Date(), recallNoticeId: n.id } });
                await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "lot.recall_block", entityType: "StockLot", entityId: l.id, meta: { noticeId: n.id, branchId: l.branchId, qtyOnHand: l.qtyOnHand } } });
            }
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "recall.enter", entityType: "RecallNotice", entityId: n.id, meta: { lotsBlocked: lots.length } } });
            return tx.recallNotice.update({ where: { id: n.id }, data: { affectedLots: lots.length } });
        });
        const tenant = await this.prisma.tenant.findUnique({ where: { id: user.orgId } });
        const s = (tenant?.settings ?? {});
        if (s.ownerPhone)
            await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: s.ownerPhone, template: "recall.notice", locale: s.defaultLocale ?? "ar", vars: { drug: drug.brandName, lots: lotNumbers.join(", "), reason: input.reason }, refType: "RecallNotice", refId: notice.id });
        return { ...notice, blockedWithinMs: Date.now() - started };
    }
    list(orgId) { return this.prisma.recallNotice.findMany({ where: { orgId }, orderBy: { enteredAt: "desc" }, take: 100 }); }
    async lift(user, id) {
        const n = await this.prisma.recallNotice.findFirst({ where: { id, orgId: user.orgId } });
        if (!n)
            throw (0, errors_1.notFound)("Recall notice", id);
        if (n.status === "LIFTED")
            throw new errors_1.DomainError("ALREADY_LIFTED", "Recall already lifted", 409);
        await this.prisma.$transaction(async (tx) => {
            await tx.recallNotice.update({ where: { id }, data: { status: "LIFTED", liftedBy: user.userId, liftedAt: new Date() } });
            const lots = await tx.stockLot.findMany({ where: { orgId: user.orgId, recallNoticeId: id, status: "RECALLED" } });
            const today = (0, dates_1.marketToday)();
            for (const l of lots) {
                const other = await tx.recallNotice.findFirst({ where: { orgId: user.orgId, status: "ACTIVE", drugId: l.drugId, lotNumbers: { has: l.lotNumber }, id: { not: id } } });
                if (other) {
                    await tx.stockLot.update({ where: { id: l.id }, data: { recallNoticeId: other.id } });
                    continue;
                }
                const restored = l.expiryDate < today ? "EXPIRED" : l.statusBeforeBlock ?? "AVAILABLE";
                await tx.stockLot.update({ where: { id: l.id }, data: { status: restored, statusBeforeBlock: null, blockedReason: restored === "EXPIRED" ? "Expired" : null, blockedAt: null, recallNoticeId: null } });
            }
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "recall.lift", entityType: "RecallNotice", entityId: id, meta: { lots: lots.length } } });
        });
        return this.prisma.recallNotice.findUniqueOrThrow({ where: { id } });
    }
};
exports.RecallService = RecallService;
exports.RecallService = RecallService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, notifications_service_1.NotificationsService])
], RecallService);
//# sourceMappingURL=recall.service.js.map