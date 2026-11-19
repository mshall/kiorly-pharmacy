import { Module } from "@nestjs/common";
import { CatalogueController } from "./catalogue.controller";
import { CatalogueService } from "./catalogue.service";
import { PriceService } from "./price.service";

@Module({ controllers: [CatalogueController], providers: [CatalogueService, PriceService], exports: [CatalogueService, PriceService] })
export class CatalogueModule {}
