"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicalModule = void 0;
const common_1 = require("@nestjs/common");
const clinical_controller_1 = require("./clinical.controller");
const knowledge_1 = require("./knowledge");
let ClinicalModule = class ClinicalModule {
};
exports.ClinicalModule = ClinicalModule;
exports.ClinicalModule = ClinicalModule = __decorate([
    (0, common_1.Module)({ controllers: [clinical_controller_1.ClinicalController], providers: [knowledge_1.LocalClinicalKnowledge, { provide: knowledge_1.ClinicalKnowledge, useExisting: knowledge_1.LocalClinicalKnowledge }], exports: [knowledge_1.ClinicalKnowledge, knowledge_1.LocalClinicalKnowledge] })
], ClinicalModule);
//# sourceMappingURL=clinical.module.js.map