import { Module } from "@nestjs/common";
import { FeatureFlagsModule } from "./feature-flags/feature-flags.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { CatalogueModule } from "./modules/catalogue/catalogue.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { PrescriptionsModule } from "./modules/prescriptions/prescriptions.module";
import { DispensingModule } from "./modules/dispensing/dispensing.module";
import { PosModule } from "./modules/pos/pos.module";
import { SuppliersModule } from "./modules/suppliers/suppliers.module";
import { MarketplaceModule } from "./modules/marketplace/marketplace.module";

@Module({
  imports: [
    PrismaModule,
    FeatureFlagsModule,
    HealthModule,
    CatalogueModule,
    InventoryModule,
    PrescriptionsModule,
    DispensingModule,
    PosModule,
    SuppliersModule,
    MarketplaceModule,
  ],
})
export class AppModule {}
