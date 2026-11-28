"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlledModule = void 0;
const common_1 = require("@nestjs/common");
const controlled_controller_1 = require("./controlled.controller");
const controlled_service_1 = require("./controlled.service");
const inventory_module_1 = require("../inventory/inventory.module");
let ControlledModule = class ControlledModule {
};
exports.ControlledModule = ControlledModule;
exports.ControlledModule = ControlledModule = __decorate([
    (0, common_1.Module)({ imports: [inventory_module_1.InventoryModule], controllers: [controlled_controller_1.ControlledController], providers: [controlled_service_1.ControlledService], exports: [controlled_service_1.ControlledService] })
], ControlledModule);
//# sourceMappingURL=controlled.module.js.map