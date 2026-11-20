import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { ExtraReports } from "./reports-extra";
import { FinanceModule } from "../finance/finance.module";
import { PurchasingModule } from "../purchasing/purchasing.module";
import { InventoryModule } from "../inventory/inventory.module";
import { PrescriptionsModule } from "../prescriptions/prescriptions.module";

@Module({ imports: [FinanceModule, PurchasingModule, InventoryModule, PrescriptionsModule], controllers: [ReportsController], providers: [ReportsService, ExtraReports], exports: [ReportsService] })
export class ReportsModule {}
