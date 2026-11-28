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
exports.PublicLinkController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../auth/decorators");
const errors_1 = require("../../common/errors");
const pg_rate_limit_1 = require("../../common/pg-rate-limit");
const prisma_service_1 = require("../../prisma/prisma.service");
const link_counters_1 = require("./link-counters");
const link_code_1 = require("./link-code");
const link_urls_1 = require("./link-urls");
const provider_links_service_1 = require("./provider-links.service");
let PublicLinkController = class PublicLinkController {
    links;
    prisma;
    limiter;
    constructor(links, prisma) {
        this.links = links;
        this.prisma = prisma;
    }
    async throttle(code) {
        this.limiter ??= new pg_rate_limit_1.PgRateLimiter(this.prisma);
        const r = await this.limiter.hit(`plink:${code}`, Number(process.env.PUBLIC_LINK_RATE_PER_MINUTE) || 300, 60_000);
        if (!r.ok)
            throw new errors_1.DomainError("RATE_LIMITED", "Too many requests, try again shortly", 429, { retryAfterSec: r.retryAfterSec });
    }
    async resolve(rawCode, accept, req, res) {
        const code = (0, link_code_1.normalizeLinkCode)(rawCode);
        if (!code)
            throw new common_1.NotFoundException("Link not found");
        await this.throttle(code);
        const link = await this.links.findByCode(code);
        if (!link)
            throw new common_1.NotFoundException("Link not found");
        const touch = await this.links.touch(code, { bot: (0, link_counters_1.isLikelyBot)(req.headers) });
        const url = (0, link_urls_1.kiorexLandingUrl)({ product: "PHARMACY", lt: touch?.lt ?? null, channelKind: touch?.link.channelKind, tags: touch?.link.tags });
        const safe = (0, link_urls_1.assertAllowedRedirect)(url);
        if (accept?.includes("application/json"))
            return res.status(common_1.HttpStatus.OK).json({ target: safe, status: link.status });
        return res.redirect(common_1.HttpStatus.FOUND, safe);
    }
};
exports.PublicLinkController = PublicLinkController;
__decorate([
    (0, common_1.Get)("q/:code"),
    (0, common_1.Header)("Cache-Control", "no-store"),
    (0, common_1.Header)("Referrer-Policy", "no-referrer"),
    (0, swagger_1.ApiOperation)({ summary: "QR short link: 302 to the Kiorex pharmacy page with the signed touch (JSON `{target,status}` when Accept: application/json)" }),
    __param(0, (0, common_1.Param)("code")),
    __param(1, (0, common_1.Headers)("accept")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PublicLinkController.prototype, "resolve", null);
exports.PublicLinkController = PublicLinkController = __decorate([
    (0, swagger_1.ApiTags)("public"),
    (0, decorators_1.Public)(),
    (0, common_1.Controller)("public/links"),
    __param(0, (0, common_1.Inject)(provider_links_service_1.ProviderLinksService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [provider_links_service_1.ProviderLinksService, prisma_service_1.PrismaService])
], PublicLinkController);
//# sourceMappingURL=public-link.controller.js.map