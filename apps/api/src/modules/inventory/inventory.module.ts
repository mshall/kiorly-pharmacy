import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventorySuiteController } from "./inventory-suite.controller";
import { InventoryService } from "./inventory.service";
import { ReceivingService } from "./receiving.service";
import { CountsService } from "./counts.service";
import { TransfersService } from "./transfers.service";
import { StockLedger } from "./stock-ledger.service";
import { LocationsService } from "./locations.service";
import { UomService } from "./uom.service";
import { InventoryAnalyticsService } from "./inventory-analytics.service";

/** KX-06 Inventory bounded context (KPINV01-07). Safety path: `lot-guard/` (ADR-025, never flag-gated). */
@Module({
  controllers: [InventoryController, InventorySuiteController],
  providers: [StockLedger, InventoryService, ReceivingService, CountsService, TransfersService, LocationsService, UomService, InventoryAnalyticsService],
  exports: [StockLedger, InventoryService, UomService, LocationsService, InventoryAnalyticsService],
})
export class InventoryModule {}
