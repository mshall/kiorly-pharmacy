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
exports.ProviderLinksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../auth/decorators");
const requires_flag_guard_1 = require("../../feature-flags/requires-flag.guard");
const commission_rate_service_1 = require("./commission-rate.service");
const commission_statement_service_1 = require("./commission-statement.service");
const growth_insights_service_1 = require("./growth-insights.service");
const provider_links_service_1 = require("./provider-links.service");
let ProviderLinksController = class ProviderLinksController {
    links;
    insights;
    rates;
    statements;
    constructor(links, insights, rates, statements) {
        this.links = links;
        this.insights = insights;
        this.rates = rates;
        this.statements = statements;
    }
    access(u) { return this.links.access(u); }
    list(u, status) { return this.links.list(u, { status }); }
    create(u, b) { return this.links.create(u, b ?? {}); }
    update(u, id, b) { return this.links.update(u, id, b ?? {}); }
    async qrSvg(u, id, res) {
        const svg = await this.links.qrSvgFor(u, id);
        res.type("image/svg+xml; charset=utf-8").setHeader("Cache-Control", "private, max-age=300");
        return svg;
    }
    async qrPng(u, id, res, width) {
        const png = await this.links.qrPngFor(u, id, width ? Number(width) : undefined);
        res.type("image/png").setHeader("Cache-Control", "private, max-age=300");
        return new common_1.StreamableFile(png);
    }
    async poster(u, id, res, lang, size, kind, print) {
        const html = await this.links.posterHtml(u, id, { lang, size, kind, print: print === "1" });
        res.type("text/html; charset=utf-8").setHeader("Cache-Control", "no-store");
        return html;
    }
    summary(u, days) { return this.links.summary(u, { days: days ? Number(days) : undefined }); }
    commissionRate(u) { return this.rates.rate(u); }
    commissionStatement(u, period) { return this.statements.statement(u, period); }
    async commissionStatementCsv(u, period, res) {
        const r = await this.statements.exportCsv(u, period);
        res.setHeader("content-type", "text/csv; charset=utf-8");
        res.setHeader("content-disposition", `attachment; filename="${r.filename}"`);
        return new common_1.StreamableFile(Buffer.from(r.body, "utf8"));
    }
    async commissionStatementPrint(u, period, res, lang, print) {
        const html = await this.statements.printHtml(u, period, { lang, print: print === "1" });
        res.type("text/html; charset=utf-8").setHeader("Cache-Control", "no-store");
        return html;
    }
    performance(u, days) { return this.insights.performance(u, { days: days ? Number(days) : undefined }); }
    recommendations(u) { return this.insights.recommendations(u); }
};
exports.ProviderLinksController = ProviderLinksController;
__decorate([
    (0, common_1.Get)("access"),
    (0, swagger_1.ApiOperation)({ summary: "What the signed-in user can do in Growth, plan limits, whether the pharmacy is connected to Kiorex" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "access", null);
__decorate([
    (0, common_1.Get)("links"),
    (0, swagger_1.ApiOperation)({ summary: "Provider links with last-30-day counters (counts only)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "list", null);
__decorate([
    (0, requires_flag_guard_1.RequiresFlag)(provider_links_service_1.GROWTH_FLAG),
    (0, common_1.Post)("links"),
    (0, swagger_1.ApiOperation)({ summary: "Create a link (ORG, BRANCH or DESK scope); 8-character code, audited, registry event to Kiorex" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)("links/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Rename, retag, pause, resume or revoke a link (revoke is permanent and immediately stops attribution at Kiorex)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "update", null);
__decorate([
    (0, requires_flag_guard_1.RequiresFlag)(provider_links_service_1.GROWTH_FLAG),
    (0, common_1.Get)("links/:id/qr.svg"),
    (0, swagger_1.ApiOperation)({ summary: "QR code (SVG, error correction M, 4-module quiet zone) for the short link" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProviderLinksController.prototype, "qrSvg", null);
__decorate([
    (0, requires_flag_guard_1.RequiresFlag)(provider_links_service_1.GROWTH_FLAG),
    (0, common_1.Get)("links/:id/qr.png"),
    (0, swagger_1.ApiOperation)({ summary: "QR code (PNG)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __param(3, (0, common_1.Query)("width")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String]),
    __metadata("design:returntype", Promise)
], ProviderLinksController.prototype, "qrPng", null);
__decorate([
    (0, requires_flag_guard_1.RequiresFlag)(provider_links_service_1.GROWTH_FLAG),
    (0, common_1.Get)("links/:id/poster"),
    (0, swagger_1.ApiOperation)({ summary: "Printable HTML poster or counter card (A4 or A5, Arabic or English; print or Save as PDF)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __param(3, (0, common_1.Query)("lang")),
    __param(4, (0, common_1.Query)("size")),
    __param(5, (0, common_1.Query)("kind")),
    __param(6, (0, common_1.Query)("print")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProviderLinksController.prototype, "poster", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, swagger_1.ApiOperation)({ summary: "Visits, orders and completed through your links (counts only)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)("commission-rate"),
    (0, swagger_1.ApiOperation)({ summary: "COM-2: the pharmacy's effective Kiorex commission rate, the default, any own rate and the history (read only; set by Kiorex; owner, branch manager, chain operations)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "commissionRate", null);
__decorate([
    (0, common_1.Get)("commission-statement"),
    (0, swagger_1.ApiOperation)({ summary: "COM-3: settlement statement of one period (YYYY-MM): the same figures Kiorex finance sees (read only; owner, branch manager, chain operations)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("period")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "commissionStatement", null);
__decorate([
    (0, common_1.Get)("commission-statement/:period/export.csv"),
    (0, swagger_1.ApiOperation)({ summary: "COM-3: settlement statement CSV of one period (audited)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("period")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ProviderLinksController.prototype, "commissionStatementCsv", null);
__decorate([
    (0, common_1.Get)("commission-statement/:period/print"),
    (0, swagger_1.ApiOperation)({ summary: "COM-3: printable settlement statement of one period (HTML; print or Save as PDF; audited)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("period")),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __param(3, (0, common_1.Query)("lang")),
    __param(4, (0, common_1.Query)("print")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, String, String]),
    __metadata("design:returntype", Promise)
], ProviderLinksController.prototype, "commissionStatementPrint", null);
__decorate([
    (0, common_1.Get)("performance"),
    (0, swagger_1.ApiOperation)({ summary: "Orders originated through your links versus the Kiorex marketplace (counts only, no money)" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "performance", null);
__decorate([
    (0, common_1.Get)("recommendations"),
    (0, swagger_1.ApiOperation)({ summary: "Recommendations from a closed catalogue of five rules" }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProviderLinksController.prototype, "recommendations", null);
exports.ProviderLinksController = ProviderLinksController = __decorate([
    (0, swagger_1.ApiTags)("growth"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard),
    (0, common_1.Controller)("growth"),
    __param(0, (0, common_1.Inject)(provider_links_service_1.ProviderLinksService)),
    __param(1, (0, common_1.Inject)(growth_insights_service_1.GrowthInsightsService)),
    __param(2, (0, common_1.Inject)(commission_rate_service_1.CommissionRateService)),
    __param(3, (0, common_1.Inject)(commission_statement_service_1.CommissionStatementService)),
    __metadata("design:paramtypes", [provider_links_service_1.ProviderLinksService, growth_insights_service_1.GrowthInsightsService, commission_rate_service_1.CommissionRateService, commission_statement_service_1.CommissionStatementService])
], ProviderLinksController);
//# sourceMappingURL=provider-links.controller.js.map