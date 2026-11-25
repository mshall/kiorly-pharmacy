import { Module } from "@nestjs/common";
import { KiorexOrdersController, MarketplaceMachineController } from "./marketplace.controller";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceHmacGuard } from "./marketplace-hmac.guard";
import { KiorexConnectController } from "./kiorex-connect.controller";
import { KiorexConnectService } from "./kiorex-connect.service";
import { KiorexFrontDoorController } from "./kiorex-front-door.controller";
import { KiorexFrontDoorService } from "./kiorex-front-door.service";
import { CatalogueModule } from "../catalogue/catalogue.module";
import { DispensingModule } from "../dispensing/dispensing.module";
import { InventoryModule } from "../inventory/inventory.module";
import { GrowthModule } from "../growth/growth.module";

@Module({ imports: [DispensingModule, InventoryModule, CatalogueModule, GrowthModule], controllers: [KiorexOrdersController, MarketplaceMachineController, KiorexConnectController, KiorexFrontDoorController], providers: [MarketplaceService, MarketplaceHmacGuard, KiorexConnectService, KiorexFrontDoorService], exports: [MarketplaceService] })
export class MarketplaceModule {}
