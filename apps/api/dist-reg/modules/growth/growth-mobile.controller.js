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
exports.GrowthMobileController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const errors_1 = require("../../common/errors");
const decorators_1 = require("../../auth/decorators");
const requires_flag_guard_1 = require("../../feature-flags/requires-flag.guard");
const growth_mobile_service_1 = require("./growth-mobile.service");
const provider_links_service_1 = require("./provider-links.service");
let GrowthMobileController = class GrowthMobileController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    overview(u) { return this.svc.overview(u); }
    links(u) { return this.svc.linksOnly(u); }
    commissionRate(u) { return this.svc.commissionRate(u); }
    commissionStatement(u, period) { return this.svc.commissionStatement(u, period); }
    async qr(u, res, linkId, format) {
        if (!linkId)
            throw (0, errors_1.badRequest)("GROWTH_LINK_INVALID", "linkId is required");
        if (format === "json")
            return this.svc.qrJson(u, linkId);
        const svg = await this.svc.qr(u, linkId);
        res.type("image/svg+xml; charset=utf-8");
        return svg;
    }
    create(u, b) { return this.svc.create(u, b ?? {}); }
    update(u, id, b) { return this.svc.update(u, id, b ?? {}); }
};
exports.GrowthMobileController = GrowthMobileController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Growth tab payload: links with 30-day counts, performance, recommendations, profile link" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GrowthMobileController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)("links"),
    (0, swagger_1.ApiOperation)({ summary: "My provider links with last-30-day counts" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GrowthMobileController.prototype, "links", null);
__decorate([
    (0, common_1.Get)("commission-rate"),
    (0, swagger_1.ApiOperation)({ summary: "COM-2: the Kiorex commission rate, read only (owner, branch manager, chain operations)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GrowthMobileController.prototype, "commissionRate", null);
__decorate([
    (0, common_1.Get)("commission-statement"),
    (0, swagger_1.ApiOperation)({ summary: "COM-3: settlement statement of one period YYYY-MM, read only (owner, branch manager, chain operations)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], GrowthMobileController.prototype, "commissionStatement", null);
__decorate([
    (0, common_1.Get)("qr"),
    (0, swagger_1.ApiOperation)({ summary: "QR (SVG) of a link" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Query)("linkId")),
    __param(3, (0, common_1.Query)("format")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], GrowthMobileController.prototype, "qr", null);
__decorate([
    (0, requires_flag_guard_1.RequiresFlag)(provider_links_service_1.GROWTH_FLAG),
    (0, common_1.Post)("links"),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOperation)({ summary: "Create a link (plan link limits apply)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GrowthMobileController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)("links/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Pause or resume a link (revoke is web only)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], GrowthMobileController.prototype, "update", null);
exports.GrowthMobileController = GrowthMobileController = __decorate([
    (0, swagger_1.ApiTags)("mobile"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard),
    (0, common_1.Controller)("mobile/growth"),
    __param(0, (0, common_1.Inject)(growth_mobile_service_1.GrowthMobileService)),
    __metadata("design:paramtypes", [growth_mobile_service_1.GrowthMobileService])
], GrowthMobileController);
//# sourceMappingURL=growth-mobile.controller.js.map