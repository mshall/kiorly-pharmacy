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
exports.LinkRegistryLookupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../auth/decorators");
const marketplace_hmac_guard_1 = require("../marketplace/marketplace-hmac.guard");
const provider_links_service_1 = require("./provider-links.service");
let LinkRegistryLookupController = class LinkRegistryLookupController {
    links;
    constructor(links) {
        this.links = links;
    }
    async one(req, code) {
        const rec = await this.links.lookupRecord(req.tenant.id, code);
        if (!rec)
            throw new common_1.NotFoundException({ code: "REFERRAL_LINK_NOT_FOUND", message: "No link with this code exists" });
        return rec;
    }
    feed(req, updatedSince, limit, cursor) {
        const since = updatedSince ? new Date(updatedSince) : undefined;
        return this.links.listRecords(req.tenant.id, { updatedSince: since && !Number.isNaN(since.getTime()) ? since : undefined, limit: limit ? Number(limit) : undefined, cursor });
    }
};
exports.LinkRegistryLookupController = LinkRegistryLookupController;
__decorate([
    (0, common_1.Get)(":code"),
    (0, swagger_1.ApiOperation)({ summary: "Signed lookup of one referral link (link registry): code, organisation, product, status" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LinkRegistryLookupController.prototype, "one", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Reconciliation feed: links created or changed since a timestamp, oldest first, cursor paged" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("updatedSince")),
    __param(2, (0, common_1.Query)("limit")),
    __param(3, (0, common_1.Query)("cursor")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], LinkRegistryLookupController.prototype, "feed", null);
exports.LinkRegistryLookupController = LinkRegistryLookupController = __decorate([
    (0, swagger_1.ApiTags)("kiorex-links"),
    (0, decorators_1.Public)(),
    (0, common_1.UseGuards)(marketplace_hmac_guard_1.MarketplaceHmacGuard),
    (0, common_1.Controller)("marketplace/v1/referral-links"),
    __param(0, (0, common_1.Inject)(provider_links_service_1.ProviderLinksService)),
    __metadata("design:paramtypes", [provider_links_service_1.ProviderLinksService])
], LinkRegistryLookupController);
//# sourceMappingURL=link-registry.lookup.controller.js.map