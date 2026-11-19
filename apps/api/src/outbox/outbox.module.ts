import { Global, Module } from "@nestjs/common";
import { OutboxService } from "./outbox.service";
import { OutboxDeliveryService } from "./outbox-delivery.service";

@Global()
@Module({ providers: [OutboxService, OutboxDeliveryService], exports: [OutboxService, OutboxDeliveryService] })
export class OutboxModule {}
