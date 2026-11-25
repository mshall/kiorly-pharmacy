import { Module } from "@nestjs/common";
import { BILLING_CHARGE, billingChargeFromEnv } from "./billing.port";
import { SubscriptionController } from "./subscription.controller";
import { SubscriptionService } from "./subscription.service";

@Module({
  controllers: [SubscriptionController],
  providers: [{ provide: BILLING_CHARGE, useFactory: () => billingChargeFromEnv() }, SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
