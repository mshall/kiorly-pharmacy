import { Module } from "@nestjs/common";
import { PlanPricesController } from "./plan-prices.controller";
import { PlanPricesService } from "./plan-prices.service";
import { PlatformAdminHmacGuard } from "./platform-admin-hmac.guard";

@Module({ controllers: [PlanPricesController], providers: [PlanPricesService, PlatformAdminHmacGuard] })
export class PlanPricesModule {}
