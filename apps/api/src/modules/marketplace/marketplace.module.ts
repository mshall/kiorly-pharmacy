import { Module } from "@nestjs/common";
import { KiorexOrdersController, MarketplaceMachineController } from "./marketplace.controller";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceHmacGuard } from "./marketplace-hmac.guard";
import { KiorexConnectController } from "./kiorex-connect.controller";
import { KiorexConnectService } from "./kiorex-connect.service";
import { CatalogueModule } from "../catalogue/catalogue.module";
import { DispensingModule } from "../dispensing/dispensing.module";
import { InventoryModule } from "../inventory/inventory.module";

@Module({ imports: [DispensingModule, InventoryModule, CatalogueModule], controllers: [KiorexOrdersController, MarketplaceMachineController, KiorexConnectController], providers: [MarketplaceService, MarketplaceHmacGuard, KiorexConnectService], exports: [MarketplaceService] })
export class MarketplaceModule {}
