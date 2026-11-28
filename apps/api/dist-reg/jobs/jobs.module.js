"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var JobsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const inventory_module_1 = require("../modules/inventory/inventory.module");
const inventory_service_1 = require("../modules/inventory/inventory.service");
const marketplace_module_1 = require("../modules/marketplace/marketplace.module");
const marketplace_service_1 = require("../modules/marketplace/marketplace.service");
const feature_flags_service_1 = require("../feature-flags/feature-flags.service");
const admin_module_1 = require("../modules/admin/admin.module");
const alerts_service_1 = require("../modules/admin/alerts.service");
const prisma_service_1 = require("../prisma/prisma.service");
const subscription_module_1 = require("../subscription/subscription.module");
const subscription_service_1 = require("../subscription/subscription.service");
let JobsService = JobsService_1 = class JobsService {
    inv;
    mkt;
    flags;
    alerts;
    prisma;
    subs;
    log = new common_1.Logger(JobsService_1.name);
    timers = [];
    constructor(inv, mkt, flags, alerts, prisma, subs) {
        this.inv = inv;
        this.mkt = mkt;
        this.flags = flags;
        this.alerts = alerts;
        this.prisma = prisma;
        this.subs = subs;
    }
    onModuleInit() {
        if (process.env.JOBS_ENABLED === "false" || process.env.NODE_ENV === "test")
            return;
        const every = (ms, fn) => { const t = setInterval(() => void fn().catch((e) => this.log.warn(String(e))), ms); t.unref(); this.timers.push(t); };
        every(60 * 60_000, async () => { await this.inv.expirySweep(); await this.inv.runExpiryAlerts(); });
        every(60_000, async () => { if (this.flags.isEnabled("pharmacy.kiorex_orders"))
            await this.mkt.expireOverdue(); });
        every(15 * 60_000, async () => { for (const t of await this.prisma.tenant.findMany({ select: { id: true } }))
            await this.alerts.scan(t.id); });
        every(6 * 60 * 60_000, async () => { await this.subs.runDaily(); });
        void this.inv.expirySweep().catch(() => undefined);
    }
    onModuleDestroy() { for (const t of this.timers)
        clearInterval(t); }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = JobsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(inventory_service_1.InventoryService)),
    __param(1, (0, common_1.Inject)(marketplace_service_1.MarketplaceService)),
    __param(2, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __param(3, (0, common_1.Inject)(alerts_service_1.AlertsService)),
    __param(4, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(5, (0, common_1.Inject)(subscription_service_1.SubscriptionService)),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService, marketplace_service_1.MarketplaceService, feature_flags_service_1.FeatureFlagsService, alerts_service_1.AlertsService, prisma_service_1.PrismaService, subscription_service_1.SubscriptionService])
], JobsService);
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({ imports: [inventory_module_1.InventoryModule, marketplace_module_1.MarketplaceModule, admin_module_1.AdminModule, subscription_module_1.SubscriptionModule], providers: [JobsService] })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map