import { Module } from "@nestjs/common";
import { ControlledController } from "./controlled.controller";
import { ControlledService } from "./controlled.service";
import { InventoryModule } from "../inventory/inventory.module";

@Module({ imports: [InventoryModule], controllers: [ControlledController], providers: [ControlledService], exports: [ControlledService] })
export class ControlledModule {}
