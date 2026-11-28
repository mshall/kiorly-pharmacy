"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispensingModule = void 0;
const common_1 = require("@nestjs/common");
const dispensing_controller_1 = require("./dispensing.controller");
const dispensing_service_1 = require("./dispensing.service");
const inventory_module_1 = require("../inventory/inventory.module");
const catalogue_module_1 = require("../catalogue/catalogue.module");
const pos_module_1 = require("../pos/pos.module");
const clinical_module_1 = require("../clinical/clinical.module");
let DispensingModule = class DispensingModule {
};
exports.DispensingModule = DispensingModule;
exports.DispensingModule = DispensingModule = __decorate([
    (0, common_1.Module)({ imports: [inventory_module_1.InventoryModule, catalogue_module_1.CatalogueModule, pos_module_1.PosModule, clinical_module_1.ClinicalModule], controllers: [dispensing_controller_1.DispensingController], providers: [dispensing_service_1.DispensingService], exports: [dispensing_service_1.DispensingService] })
], DispensingModule);
//# sourceMappingURL=dispensing.module.js.map