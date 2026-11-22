import { Global, Module } from "@nestjs/common";
import { pspProvider } from "./adapters/psp.adapter";
import { consentProvider } from "./adapters/consent.adapter";
import { aiProvider } from "./adapters/ai.adapter";
import { NotificationsService } from "./adapters/notifications.service";
import { StorageAdapter } from "./adapters/storage.adapter";
import { AiGateway } from "./adapters/ai.gateway";
import { ConsentService } from "./adapters/consent.service";
import { ConsentController } from "./consent.controller";
import { FilesController } from "./files.controller";

/** Third-party adapters (all MODE=mock|real, default mock). No `@aws-sdk/*` outside src/platform/adapters. */
@Global()
@Module({
  controllers: [ConsentController, FilesController],
  providers: [pspProvider, consentProvider, AiGateway, aiProvider, ConsentService, NotificationsService, StorageAdapter],
  exports: [pspProvider, consentProvider, AiGateway, aiProvider, ConsentService, NotificationsService, StorageAdapter],
})
export class PlatformModule {}
