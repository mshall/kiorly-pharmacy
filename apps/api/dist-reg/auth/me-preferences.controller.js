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
exports.MePreferencesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const errors_1 = require("../common/errors");
const prisma_service_1 = require("../prisma/prisma.service");
const decorators_1 = require("./decorators");
const dismissed_cards_1 = require("./dismissed-cards");
let MePreferencesController = class MePreferencesController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(u) {
        const r = await this.prisma.staffUser.findFirst({ where: { id: u.userId, orgId: u.orgId }, select: { dismissedCards: true } });
        return { keys: (0, dismissed_cards_1.sanitizeDismissed)(r?.dismissedCards) };
    }
    async put(u, b) {
        if (!(0, dismissed_cards_1.isValidDismissedBody)(b))
            throw new errors_1.DomainError("INVALID_REQUEST", "keys must be a list of up to 50 short card keys", 400);
        const keys = (0, dismissed_cards_1.sanitizeDismissed)(b.keys);
        const r = await this.prisma.staffUser.updateMany({ where: { id: u.userId, orgId: u.orgId }, data: { dismissedCards: keys } });
        if (!r.count)
            throw new errors_1.DomainError("NOT_FOUND", "User not found", 404);
        return { keys };
    }
};
exports.MePreferencesController = MePreferencesController;
__decorate([
    (0, common_1.Get)("dismissed-cards"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MePreferencesController.prototype, "get", null);
__decorate([
    (0, common_1.Put)("dismissed-cards"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MePreferencesController.prototype, "put", null);
exports.MePreferencesController = MePreferencesController = __decorate([
    (0, swagger_1.ApiTags)("me"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("me/preferences"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MePreferencesController);
//# sourceMappingURL=me-preferences.controller.js.map