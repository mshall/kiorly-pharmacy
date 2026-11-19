import { Inject, Injectable, Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InventoryModule } from "../modules/inventory/inventory.module";
import { InventoryService } from "../modules/inventory/inventory.service";
import { MarketplaceModule } from "../modules/marketplace/marketplace.module";
import { MarketplaceService } from "../modules/marketplace/marketplace.service";
import { FeatureFlagsService } from "../feature-flags/feature-flags.service";

/** Background sweeps: expiry status + 90/60/30 alerts, Kiorex order SLA expiry. Disabled in tests (JOBS_ENABLED=false). */
@Injectable()
export class JobsService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(JobsService.name);
  private timers: NodeJS.Timeout[] = [];
  constructor(@Inject(InventoryService) private readonly inv: InventoryService, @Inject(MarketplaceService) private readonly mkt: MarketplaceService, @Inject(FeatureFlagsService) private readonly flags: FeatureFlagsService) {}

  onModuleInit() {
    if (process.env.JOBS_ENABLED === "false" || process.env.NODE_ENV === "test") return;
    const every = (ms: number, fn: () => Promise<unknown>) => { const t = setInterval(() => void fn().catch((e) => this.log.warn(String(e))), ms); t.unref(); this.timers.push(t); };
    every(60 * 60_000, async () => { await this.inv.expirySweep(); await this.inv.runExpiryAlerts(); });
    every(60_000, async () => { if (this.flags.isEnabled("pharmacy.kiorex_orders")) await this.mkt.expireOverdue(); });
    void this.inv.expirySweep().catch(() => undefined);
  }
  onModuleDestroy() { for (const t of this.timers) clearInterval(t); }
}

@Module({ imports: [InventoryModule, MarketplaceModule], providers: [JobsService] })
export class JobsModule {}
