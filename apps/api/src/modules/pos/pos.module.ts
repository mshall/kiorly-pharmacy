import { Module } from "@nestjs/common";
import { PosController } from "./pos.controller";
import { PosService } from "./pos.service";
import { SalesService } from "./sales.service";
import { ShiftsService } from "./shifts.service";
import { CustomersService } from "./customers.service";
import { PromotionsService } from "./promotions.service";
import { HeldCartsService } from "./held-carts.service";
import { CashService } from "./cash.service";
import { InventoryModule } from "../inventory/inventory.module";
import { CatalogueModule } from "../catalogue/catalogue.module";

@Module({ imports: [InventoryModule, CatalogueModule], controllers: [PosController], providers: [PosService, SalesService, ShiftsService, CustomersService, PromotionsService, HeldCartsService, CashService], exports: [SalesService, PosService, CashService] })
export class PosModule {}
