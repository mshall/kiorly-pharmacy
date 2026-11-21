import { Module } from "@nestjs/common";
import { PosModule } from "../modules/pos/pos.module";
import { DevProvidersController } from "./dev-providers.controller";
import { ProviderEventsService } from "./provider-events.service";
import { ProviderWebhooksController } from "./provider-webhooks.controller";

/** Provider callbacks (signed webhooks) + dev-only simulator. Messaging/PSP ports live in src/platform/adapters (PlatformModule). */
@Module({ imports: [PosModule], controllers: [ProviderWebhooksController, DevProvidersController], providers: [ProviderEventsService], exports: [ProviderEventsService] })
export class ProvidersModule {}
