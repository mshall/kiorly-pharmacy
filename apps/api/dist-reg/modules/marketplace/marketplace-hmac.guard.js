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
var MarketplaceHmacGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceHmacGuard = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@kiorex/contracts");
const prisma_service_1 = require("../../prisma/prisma.service");
const secret_box_1 = require("../../common/secret-box");
let MarketplaceHmacGuard = class MarketplaceHmacGuard {
    static { MarketplaceHmacGuard_1 = this; }
    prisma;
    static nonces = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const deny = (reason, status = 401) => new common_1.HttpException({ statusCode: status, code: "HMAC_REJECTED", message: reason }, status);
        const key = req.headers[contracts_1.KIORLY_HEADERS.clientKey.toLowerCase()];
        const client = key ? await this.prisma.integrationClient.findUnique({ where: { key } }) : null;
        if (!client || !client.active)
            throw deny("unknown client key");
        const v = (0, contracts_1.verifyKiorlyRequest)({ headers: req.headers, method: req.method, path: req.originalUrl.split("?")[0], body: req.rawBody?.length ? req.rawBody : "", secret: (0, secret_box_1.open)(client.secretEnc) });
        if (!v.ok)
            throw deny(v.reason);
        const nonce = req.headers[contracts_1.KIORLY_HEADERS.nonce.toLowerCase()];
        const now = Date.now();
        for (const [n, t] of MarketplaceHmacGuard_1.nonces)
            if (now - t > 10 * 60_000)
                MarketplaceHmacGuard_1.nonces.delete(n);
        const nk = `${client.id}:${nonce}`;
        if (MarketplaceHmacGuard_1.nonces.has(nk))
            throw deny("nonce replay");
        MarketplaceHmacGuard_1.nonces.set(nk, now);
        const tenant = await this.prisma.tenant.findUnique({ where: { id: client.orgId } });
        if (!tenant)
            throw deny("unknown organisation", 404);
        req.tenant = { id: tenant.id, marketCode: tenant.marketCode };
        req.flagContext = { orgId: tenant.id, market: tenant.marketCode };
        return true;
    }
};
exports.MarketplaceHmacGuard = MarketplaceHmacGuard;
exports.MarketplaceHmacGuard = MarketplaceHmacGuard = MarketplaceHmacGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceHmacGuard);
//# sourceMappingURL=marketplace-hmac.guard.js.map