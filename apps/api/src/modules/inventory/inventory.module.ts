import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { ReceivingService } from "./receiving.service";
import { CountsService } from "./counts.service";
import { TransfersService } from "./transfers.service";
import { StockLedger } from "./stock-ledger.service";

/** KX-06 Inventory bounded context (KPINV01-07). Safety path: `lot-guard/` (ADR-025, never flag-gated). */
@Module({
  controllers: [InventoryController],
  providers: [StockLedger, InventoryService, ReceivingService, CountsService, TransfersService],
  exports: [StockLedger, InventoryService],
})
export class InventoryModule {}
