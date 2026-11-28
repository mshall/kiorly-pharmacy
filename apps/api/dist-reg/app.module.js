"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
const approval_module_1 = require("./auth/approval.module");
const audit_module_1 = require("./audit/audit.module");
const outbox_module_1 = require("./outbox/outbox.module");
const kernel_adapter_module_1 = require("./kernel-adapter/kernel-adapter.module");
const platform_module_1 = require("./platform/platform.module");
const hooks_module_1 = require("./common/hooks.module");
const feature_flags_module_1 = require("./feature-flags/feature-flags.module");
const health_module_1 = require("./health/health.module");
const prisma_module_1 = require("./prisma/prisma.module");
const tenancy_module_1 = require("./tenancy/tenancy.module");
const catalogue_module_1 = require("./modules/catalogue/catalogue.module");
const inventory_module_1 = require("./modules/inventory/inventory.module");
const prescriptions_module_1 = require("./modules/prescriptions/prescriptions.module");
const dispensing_module_1 = require("./modules/dispensing/dispensing.module");
const pos_module_1 = require("./modules/pos/pos.module");
const suppliers_module_1 = require("./modules/suppliers/suppliers.module");
const marketplace_module_1 = require("./modules/marketplace/marketplace.module");
const forecasting_module_1 = require("./modules/forecasting/forecasting.module");
const claims_module_1 = require("./modules/claims/claims.module");
const reports_module_1 = require("./modules/reports/reports.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const kiorex_webhook_controller_1 = require("./webhooks/kiorex-webhook.controller");
const jobs_module_1 = require("./jobs/jobs.module");
const customers_module_1 = require("./modules/customers/customers.module");
const clinical_module_1 = require("./modules/clinical/clinical.module");
const controlled_module_1 = require("./modules/controlled/controlled.module");
const purchasing_module_1 = require("./modules/purchasing/purchasing.module");
const finance_module_1 = require("./modules/finance/finance.module");
const admin_module_1 = require("./modules/admin/admin.module");
const mobile_module_1 = require("./modules/mobile/mobile.module");
const providers_module_1 = require("./providers/providers.module");
const setup_module_1 = require("./modules/setup/setup.module");
const growth_module_1 = require("./modules/growth/growth.module");
const subscription_module_1 = require("./subscription/subscription.module");
const plan_prices_module_1 = require("./plan-prices/plan-prices.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule, hooks_module_1.HooksModule, audit_module_1.AuditModule, outbox_module_1.OutboxModule, kernel_adapter_module_1.KernelAdapterModule, platform_module_1.PlatformModule, feature_flags_module_1.FeatureFlagsModule, auth_module_1.AuthModule, mobile_module_1.MobileModule, approval_module_1.ApprovalModule, health_module_1.HealthModule, tenancy_module_1.TenancyModule,
            catalogue_module_1.CatalogueModule, inventory_module_1.InventoryModule, prescriptions_module_1.PrescriptionsModule, dispensing_module_1.DispensingModule, pos_module_1.PosModule, suppliers_module_1.SuppliersModule, marketplace_module_1.MarketplaceModule, forecasting_module_1.ForecastingModule, claims_module_1.ClaimsModule, reports_module_1.ReportsModule, dashboard_module_1.DashboardModule, kiorex_webhook_controller_1.WebhooksModule, jobs_module_1.JobsModule, customers_module_1.CustomersModule, clinical_module_1.ClinicalModule, controlled_module_1.ControlledModule, purchasing_module_1.PurchasingModule, finance_module_1.FinanceModule, admin_module_1.AdminModule, providers_module_1.ProvidersModule, setup_module_1.SetupModule, growth_module_1.GrowthModule, subscription_module_1.SubscriptionModule, plan_prices_module_1.PlanPricesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map