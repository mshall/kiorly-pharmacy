import { Module } from "@nestjs/common";
import { DispensingController } from "./dispensing.controller";
import { DispensingService } from "./dispensing.service";
import { InventoryModule } from "../inventory/inventory.module";
import { CatalogueModule } from "../catalogue/catalogue.module";
import { PosModule } from "../pos/pos.module";

/** SAFETY PATH (ADR-025): pharmacist sign-off, Rx safety checks, controlled-substance log. No feature-flag references allowed here. */
@Module({ imports: [InventoryModule, CatalogueModule, PosModule], controllers: [DispensingController], providers: [DispensingService], exports: [DispensingService] })
export class DispensingModule {}
