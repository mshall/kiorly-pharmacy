import { Module } from "@nestjs/common";
import { KiorexOrdersController, MarketplaceMachineController } from "./marketplace.controller";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceHmacGuard } from "./marketplace-hmac.guard";
import { CatalogueModule } from "../catalogue/catalogue.module";
import { DispensingModule } from "../dispensing/dispensing.module";
import { InventoryModule } from "../inventory/inventory.module";

@Module({ imports: [DispensingModule, InventoryModule, CatalogueModule], controllers: [KiorexOrdersController, MarketplaceMachineController], providers: [MarketplaceService, MarketplaceHmacGuard], exports: [MarketplaceService] })
export class MarketplaceModule {}
