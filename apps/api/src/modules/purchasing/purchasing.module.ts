import { Module } from "@nestjs/common";
import { PurchasingController } from "./purchasing.controller";
import { PurchasingService } from "./purchasing.service";
import { RfqService } from "./rfq.service";
import { SuppliersModule } from "../suppliers/suppliers.module";

@Module({ imports: [SuppliersModule], controllers: [PurchasingController], providers: [PurchasingService, RfqService], exports: [PurchasingService] })
export class PurchasingModule {}
