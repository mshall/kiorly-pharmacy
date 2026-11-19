import { Global, Module } from "@nestjs/common";
import { pspProvider } from "./adapters/psp.adapter";
import { consentProvider } from "./adapters/consent.adapter";
import { aiProvider } from "./adapters/ai.adapter";
import { NotificationsService } from "./adapters/notifications.service";
import { StorageAdapter } from "./adapters/storage.adapter";

/** Third-party adapters (all MODE=mock|real, default mock). No `@aws-sdk/*` outside src/platform/adapters. */
@Global()
@Module({ providers: [pspProvider, consentProvider, aiProvider, NotificationsService, StorageAdapter], exports: [pspProvider, consentProvider, aiProvider, NotificationsService, StorageAdapter] })
export class PlatformModule {}
