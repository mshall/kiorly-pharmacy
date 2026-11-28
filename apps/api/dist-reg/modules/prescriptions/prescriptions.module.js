"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsModule = void 0;
const common_1 = require("@nestjs/common");
const prescriptions_controller_1 = require("./prescriptions.controller");
const prescriptions_service_1 = require("./prescriptions.service");
const prescribers_service_1 = require("./prescribers.service");
const refills_service_1 = require("./refills.service");
const transfers_service_1 = require("./transfers.service");
const catalogue_module_1 = require("../catalogue/catalogue.module");
let PrescriptionsModule = class PrescriptionsModule {
};
exports.PrescriptionsModule = PrescriptionsModule;
exports.PrescriptionsModule = PrescriptionsModule = __decorate([
    (0, common_1.Module)({ imports: [catalogue_module_1.CatalogueModule], controllers: [prescriptions_controller_1.PrescriptionsController, prescriptions_controller_1.PrescribersController], providers: [prescriptions_service_1.PrescriptionsService, prescribers_service_1.PrescribersService, refills_service_1.RefillsService, transfers_service_1.RxTransfersService], exports: [prescriptions_service_1.PrescriptionsService, prescribers_service_1.PrescribersService, refills_service_1.RefillsService] })
], PrescriptionsModule);
//# sourceMappingURL=prescriptions.module.js.map