import { Module } from "@nestjs/common";
import { AdminController, NotificationsCentreController } from "./admin.controller";
import { RolesService } from "./roles.service";
import { ImportService } from "./import.service";
import { ExportService } from "./export.service";
import { AlertsService } from "./alerts.service";
import { CatalogueModule } from "../catalogue/catalogue.module";
import { InventoryModule } from "../inventory/inventory.module";
import { CustomersModule } from "../customers/customers.module";
import { SuppliersModule } from "../suppliers/suppliers.module";

@Module({ imports: [CatalogueModule, InventoryModule, CustomersModule, SuppliersModule], controllers: [AdminController, NotificationsCentreController], providers: [RolesService, ImportService, ExportService, AlertsService], exports: [AlertsService] })
export class AdminModule {}
