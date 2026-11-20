import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { MobileController } from "./mobile.controller";
import { MobilePharmacyController } from "./mobile-pharmacy.controller";
import { MobilePharmacyService } from "./mobile-pharmacy.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";
import { MobileDevicesService } from "./mobile-devices.service";
import { MobileAlertsService } from "./mobile-alerts.service";
import { MobileClientGuard } from "./mobile-client.guard";
import { PushService } from "./push.service";
import { CatalogueModule } from "../catalogue/catalogue.module";
import { InventoryModule } from "../inventory/inventory.module";
import { PosModule } from "../pos/pos.module";

/** Kiorly Work (mobile staff app) backend. Import AFTER AuthModule so its global guard runs after authentication. */
@Global()
@Module({
  imports: [CatalogueModule, InventoryModule, PosModule],
  controllers: [MobileController, MobilePharmacyController],
  providers: [MobileEntitlementService, MobileDevicesService, MobileAlertsService, MobilePharmacyService, PushService, { provide: APP_GUARD, useClass: MobileClientGuard }],
  exports: [PushService, MobileEntitlementService],
})
export class MobileModule {}
