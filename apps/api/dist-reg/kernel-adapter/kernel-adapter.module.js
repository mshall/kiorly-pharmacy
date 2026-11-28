"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KernelAdapterModule = void 0;
const common_1 = require("@nestjs/common");
const ports_1 = require("./ports");
const local_kernel_1 = require("./local/local-kernel");
const requires_entitlement_guard_1 = require("./requires-entitlement.guard");
let KernelAdapterModule = class KernelAdapterModule {
};
exports.KernelAdapterModule = KernelAdapterModule;
exports.KernelAdapterModule = KernelAdapterModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            { provide: ports_1.KERNEL.plans, useClass: local_kernel_1.LocalPlans },
            { provide: ports_1.KERNEL.entitlements, useClass: local_kernel_1.LocalEntitlements },
            { provide: ports_1.KERNEL.subscriptions, useClass: local_kernel_1.LocalSubscriptions },
            { provide: ports_1.KERNEL.wallet, useClass: local_kernel_1.LocalCreditWallet },
            { provide: ports_1.KERNEL.settlement, useClass: local_kernel_1.LocalSettlement },
            { provide: ports_1.KERNEL.marketPacks, useClass: local_kernel_1.LocalMarketPacks },
            requires_entitlement_guard_1.RequiresEntitlementGuard,
        ],
        exports: [ports_1.KERNEL.plans, ports_1.KERNEL.entitlements, ports_1.KERNEL.subscriptions, ports_1.KERNEL.wallet, ports_1.KERNEL.settlement, ports_1.KERNEL.marketPacks, requires_entitlement_guard_1.RequiresEntitlementGuard],
    })
], KernelAdapterModule);
//# sourceMappingURL=kernel-adapter.module.js.map