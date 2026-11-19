import { Module } from "@nestjs/common";
import { SuppliersController } from "./suppliers.controller";
import { SuppliersService } from "./suppliers.service";
import { RecallService } from "./recall/recall.service";
import { InventoryModule } from "../inventory/inventory.module";
import { ForecastingModule } from "../forecasting/forecasting.module";

@Module({ imports: [InventoryModule, ForecastingModule], controllers: [SuppliersController], providers: [SuppliersService, RecallService], exports: [SuppliersService, RecallService] })
export class SuppliersModule {}
