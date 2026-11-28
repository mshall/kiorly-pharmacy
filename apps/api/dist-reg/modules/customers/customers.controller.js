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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const customer_registry_service_1 = require("./customer-registry.service");
const pagination_1 = require("../../common/pagination");
class CustomerDto {
    displayName;
    phone;
    email;
    gender;
    dateOfBirth;
    address;
    allergies;
    chronicConditions;
    medicalNotes;
    pregnant;
    lactating;
    renalImpairment;
    hepaticImpairment;
    weightKg;
    nationalId;
    consentDataProcessing;
    consentMarketing;
    force;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CustomerDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["F", "M"]),
    __metadata("design:type", String)
], CustomerDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CustomerDto.prototype, "allergies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CustomerDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "medicalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "pregnant", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "lactating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "renalImpairment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "hepaticImpairment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "weightKg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "nationalId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "consentDataProcessing", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "consentMarketing", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerDto.prototype, "force", void 0);
class CustomerPatchDto {
    displayName;
    phone;
    email;
    gender;
    dateOfBirth;
    address;
    allergies;
    chronicConditions;
    medicalNotes;
    pregnant;
    lactating;
    renalImpairment;
    hepaticImpairment;
    weightKg;
    nationalId;
    active;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["F", "M"]),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "dateOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CustomerPatchDto.prototype, "allergies", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CustomerPatchDto.prototype, "chronicConditions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "medicalNotes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerPatchDto.prototype, "pregnant", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerPatchDto.prototype, "lactating", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerPatchDto.prototype, "renalImpairment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerPatchDto.prototype, "hepaticImpairment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "weightKg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerPatchDto.prototype, "nationalId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CustomerPatchDto.prototype, "active", void 0);
class NoteDto {
    body;
    kind;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], NoteDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["NOTE", "COUNSELLING", "COMPLAINT"]),
    __metadata("design:type", String)
], NoteDto.prototype, "kind", void 0);
class FamilyDto {
    relatedPatientId;
    relation;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FamilyDto.prototype, "relatedPatientId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], FamilyDto.prototype, "relation", void 0);
class ConsentDto {
    dataProcessing;
    marketing;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConsentDto.prototype, "dataProcessing", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ConsentDto.prototype, "marketing", void 0);
class CreditDto {
    creditLimit;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CreditDto.prototype, "creditLimit", void 0);
class PointsDto {
    points;
    note;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PointsDto.prototype, "points", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], PointsDto.prototype, "note", void 0);
class MergeDto {
    sourceId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MergeDto.prototype, "sourceId", void 0);
let CustomersController = class CustomersController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(u, q) {
        const { page, pageSize } = (0, pagination_1.pageArgs)(q);
        return this.svc.search(u.orgId, { q: q.q, page, pageSize, includeInactive: q.inactive === "true", withCredit: q.credit === "true", withAllergies: q.allergies === "true" });
    }
    create(u, d) { const { force, ...rest } = d; return this.svc.create(u, rest, { force }); }
    duplicates(u) { return this.svc.duplicates(u.orgId); }
    get(u, id) { return this.svc.profile(u.orgId, id); }
    patch(u, id, d) { return this.svc.update(u, id, d); }
    history(u, id) { return this.svc.history(u.orgId, id); }
    notes(u, id) { return this.svc.notes(u.orgId, id); }
    addNote(u, id, d) { return this.svc.addNote(u, id, d); }
    family(u, id) { return this.svc.family(u.orgId, id); }
    addFamily(u, id, d) { return this.svc.addFamily(u, id, d); }
    removeFamily(u, id, linkId) { return this.svc.removeFamily(u, id, linkId); }
    consent(u, id, d) { return this.svc.setConsent(u, id, d); }
    credit(u, id, d) { return this.svc.openCreditAccount(u, id, d.creditLimit); }
    loyalty(u, id) { return this.svc.loyalty(u.orgId, id); }
    adjust(u, id, d) { return this.svc.adjustLoyalty(u, id, d); }
    merge(u, id, d) { return this.svc.merge(u, id, d.sourceId); }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CustomerDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("duplicates"),
    (0, decorators_1.Perm)("customer.merge"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "duplicates", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CustomerPatchDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "patch", null);
__decorate([
    (0, common_1.Get)(":id/history"),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "history", null);
__decorate([
    (0, common_1.Get)(":id/notes"),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "notes", null);
__decorate([
    (0, common_1.Post)(":id/notes"),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, NoteDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "addNote", null);
__decorate([
    (0, common_1.Get)(":id/family"),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "family", null);
__decorate([
    (0, common_1.Post)(":id/family"),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, FamilyDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "addFamily", null);
__decorate([
    (0, common_1.Delete)(":id/family/:linkId"),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("linkId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "removeFamily", null);
__decorate([
    (0, common_1.Put)(":id/consent"),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ConsentDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "consent", null);
__decorate([
    (0, common_1.Post)(":id/credit-account"),
    (0, decorators_1.Perm)("customer.credit", "pos.refund_approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreditDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "credit", null);
__decorate([
    (0, common_1.Get)(":id/loyalty"),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "loyalty", null);
__decorate([
    (0, common_1.Post)(":id/loyalty/adjust"),
    (0, decorators_1.Perm)("loyalty.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PointsDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "adjust", null);
__decorate([
    (0, common_1.Post)(":id/merge"),
    (0, decorators_1.Perm)("customer.merge"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, MergeDto]),
    __metadata("design:returntype", void 0)
], CustomersController.prototype, "merge", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)("customers"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("customers"),
    __param(0, (0, common_1.Inject)(customer_registry_service_1.CustomerRegistryService)),
    __metadata("design:paramtypes", [customer_registry_service_1.CustomerRegistryService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map