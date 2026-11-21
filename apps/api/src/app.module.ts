import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ApprovalModule } from "./auth/approval.module";
import { AuditModule } from "./audit/audit.module";
import { OutboxModule } from "./outbox/outbox.module";
import { KernelAdapterModule } from "./kernel-adapter/kernel-adapter.module";
import { PlatformModule } from "./platform/platform.module";
import { HooksModule } from "./common/hooks.module";
import { FeatureFlagsModule } from "./feature-flags/feature-flags.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TenancyModule } from "./tenancy/tenancy.module";
import { CatalogueModule } from "./modules/catalogue/catalogue.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { PrescriptionsModule } from "./modules/prescriptions/prescriptions.module";
import { DispensingModule } from "./modules/dispensing/dispensing.module";
import { PosModule } from "./modules/pos/pos.module";
import { SuppliersModule } from "./modules/suppliers/suppliers.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";
import { ForecastingModule } from "./modules/forecasting/forecasting.module";
import { ClaimsModule } from "./modules/claims/claims.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { WebhooksModule } from "./webhooks/kiorex-webhook.controller";
import { JobsModule } from "./jobs/jobs.module";
import { CustomersModule } from "./modules/customers/customers.module";
import { ClinicalModule } from "./modules/clinical/clinical.module";
import { ControlledModule } from "./modules/controlled/controlled.module";
import { PurchasingModule } from "./modules/purchasing/purchasing.module";
import { FinanceModule } from "./modules/finance/finance.module";
import { AdminModule } from "./modules/admin/admin.module";
import { MobileModule } from "./modules/mobile/mobile.module";
import { ProvidersModule } from "./providers/providers.module";

@Module({
  imports: [
    PrismaModule, HooksModule, AuditModule, OutboxModule, KernelAdapterModule, PlatformModule, FeatureFlagsModule, AuthModule, MobileModule, ApprovalModule, HealthModule, TenancyModule,
    CatalogueModule, InventoryModule, PrescriptionsModule, DispensingModule, PosModule, SuppliersModule, MarketplaceModule, ForecastingModule, ClaimsModule, ReportsModule, DashboardModule, WebhooksModule, JobsModule, CustomersModule, ClinicalModule, ControlledModule, PurchasingModule, FinanceModule, AdminModule, ProvidersModule,
  ],
})
export class AppModule {}
