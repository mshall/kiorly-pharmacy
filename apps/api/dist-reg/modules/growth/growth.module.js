"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_hmac_guard_1 = require("../marketplace/marketplace-hmac.guard");
const commission_rate_service_1 = require("./commission-rate.service");
const commission_statement_service_1 = require("./commission-statement.service");
const growth_insights_service_1 = require("./growth-insights.service");
const growth_mobile_controller_1 = require("./growth-mobile.controller");
const growth_mobile_service_1 = require("./growth-mobile.service");
const link_registry_lookup_controller_1 = require("./link-registry.lookup.controller");
const provider_links_controller_1 = require("./provider-links.controller");
const provider_links_service_1 = require("./provider-links.service");
const public_link_controller_1 = require("./public-link.controller");
let GrowthModule = class GrowthModule {
};
exports.GrowthModule = GrowthModule;
exports.GrowthModule = GrowthModule = __decorate([
    (0, common_1.Module)({
        controllers: [provider_links_controller_1.ProviderLinksController, growth_mobile_controller_1.GrowthMobileController, public_link_controller_1.PublicLinkController, link_registry_lookup_controller_1.LinkRegistryLookupController],
        providers: [provider_links_service_1.ProviderLinksService, growth_insights_service_1.GrowthInsightsService, commission_rate_service_1.CommissionRateService, commission_statement_service_1.CommissionStatementService, growth_mobile_service_1.GrowthMobileService, marketplace_hmac_guard_1.MarketplaceHmacGuard],
        exports: [provider_links_service_1.ProviderLinksService, commission_rate_service_1.CommissionRateService],
    })
], GrowthModule);
//# sourceMappingURL=growth.module.js.map