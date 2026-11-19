import { Module } from "@nestjs/common";
import { PosController } from "./pos.controller";
import { PosService } from "./pos.service";
import { SalesService } from "./sales.service";
import { ShiftsService } from "./shifts.service";
import { CustomersService } from "./customers.service";
import { InventoryModule } from "../inventory/inventory.module";
import { CatalogueModule } from "../catalogue/catalogue.module";

@Module({ imports: [InventoryModule, CatalogueModule], controllers: [PosController], providers: [PosService, SalesService, ShiftsService, CustomersService], exports: [SalesService, PosService] })
export class PosModule {}
