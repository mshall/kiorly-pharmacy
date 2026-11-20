import { Module } from "@nestjs/common";
import { CustomersController } from "./customers.controller";
import { CustomerRegistryService } from "./customer-registry.service";

@Module({ controllers: [CustomersController], providers: [CustomerRegistryService], exports: [CustomerRegistryService] })
export class CustomersModule {}
