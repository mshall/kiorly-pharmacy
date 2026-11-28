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
exports.PrismaHandoffStore = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PrismaHandoffStore = class PrismaHandoffStore {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async insert(e) { await this.prisma.handoffCode.create({ data: { codeHash: e.codeHash, product: e.product, edition: e.edition, origin: e.origin, subjectId: e.subjectId, expiresAt: e.expiresAt } }); }
    async consume(codeHash, now) {
        const n = await this.prisma.handoffCode.updateMany({ where: { codeHash, usedAt: null, expiresAt: { gt: now } }, data: { usedAt: now } });
        if (n.count !== 1)
            return null;
        const r = await this.prisma.handoffCode.findUnique({ where: { codeHash } });
        return r ? { codeHash: r.codeHash, product: r.product, edition: r.edition, origin: r.origin, subjectId: r.subjectId, expiresAt: r.expiresAt } : null;
    }
    async purge(before) { await this.prisma.handoffCode.deleteMany({ where: { expiresAt: { lt: before } } }); }
};
exports.PrismaHandoffStore = PrismaHandoffStore;
exports.PrismaHandoffStore = PrismaHandoffStore = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaHandoffStore);
//# sourceMappingURL=handoff.store.js.map