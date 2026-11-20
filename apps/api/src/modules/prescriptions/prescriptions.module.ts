import { Module } from "@nestjs/common";
import { PrescriptionsController, PrescribersController } from "./prescriptions.controller";
import { PrescriptionsService } from "./prescriptions.service";
import { PrescribersService } from "./prescribers.service";
import { RefillsService } from "./refills.service";
import { RxTransfersService } from "./transfers.service";
import { CatalogueModule } from "../catalogue/catalogue.module";

@Module({ imports: [CatalogueModule], controllers: [PrescriptionsController, PrescribersController], providers: [PrescriptionsService, PrescribersService, RefillsService, RxTransfersService], exports: [PrescriptionsService, PrescribersService, RefillsService] })
export class PrescriptionsModule {}
