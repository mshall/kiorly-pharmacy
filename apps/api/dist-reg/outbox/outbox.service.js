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
exports.OutboxService = void 0;
const common_1 = require("@nestjs/common");
const ids_1 = require("../common/ids");
const contracts_1 = require("@kiorex/contracts");
const prisma_service_1 = require("../prisma/prisma.service");
const errors_1 = require("../common/errors");
let OutboxService = class OutboxService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async enqueue(input, db = this.prisma) {
        const existing = await db.outboxEvent.findUnique({ where: { orgId_dedupeKey: { orgId: input.orgId, dedupeKey: input.dedupeKey } } });
        if (existing)
            return { id: existing.id, created: false };
        const id = (0, ids_1.createId)();
        const aggregateType = input.aggregateType ?? "PharmacyOrder";
        const envelope = {
            eventId: id, type: input.type, aggregateType, aggregateId: input.aggregateId,
            target: "KIOREX", occurredAt: new Date().toISOString(), data: input.data,
        };
        const v = (0, contracts_1.validateEvent)(input.type, envelope);
        if (!v.valid)
            throw new errors_1.DomainError("EVENT_CONTRACT_VIOLATION", `Outbound ${input.type} does not match @kiorex/contracts`, 500, v.errors);
        await db.outboxEvent.create({
            data: { id, orgId: input.orgId, type: input.type, aggregateType, aggregateId: input.aggregateId, payload: envelope, dedupeKey: input.dedupeKey, target: "KIOREX" },
        });
        return { id, created: true };
    }
};
exports.OutboxService = OutboxService;
exports.OutboxService = OutboxService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboxService);
//# sourceMappingURL=outbox.service.js.map