import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InventoryService } from "../modules/inventory/inventory.service";
import { MarketplaceService } from "../modules/marketplace/marketplace.service";
import { FeatureFlagsService } from "../feature-flags/feature-flags.service";
import { AlertsService } from "../modules/admin/alerts.service";
import { PrismaService } from "../prisma/prisma.service";
import { SubscriptionService } from "../subscription/subscription.service";
export declare class JobsService implements OnModuleInit, OnModuleDestroy {
    private readonly inv;
    private readonly mkt;
    private readonly flags;
    private readonly alerts;
    private readonly prisma;
    private readonly subs;
    private readonly log;
    private timers;
    constructor(inv: InventoryService, mkt: MarketplaceService, flags: FeatureFlagsService, alerts: AlertsService, prisma: PrismaService, subs: SubscriptionService);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
export declare class JobsModule {
}
