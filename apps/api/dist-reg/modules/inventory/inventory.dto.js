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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferDto = exports.TransferLineDto = exports.CountRecordDto = exports.CountLineDto = exports.CountStartDto = exports.PolicyDto = exports.TempDto = exports.ReturnSupplierDto = exports.AdjustDto = exports.WitnessDto = exports.ReasonDto = exports.ScanDto = exports.ReceiptDto = exports.ReceiptLineDto = exports.ADJUST_REASONS = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const approval_service_1 = require("../../auth/approval.service");
exports.ADJUST_REASONS = ["DAMAGE", "THEFT", "LOSS", "FOUND", "COUNT_CORRECTION", "SAMPLE", "OTHER"];
class ReceiptLineDto {
    drugId;
    scan;
    lotNumber;
    expiryDate;
    quantity;
    unitCost;
    temperatureC;
    uom;
    locationId;
}
exports.ReceiptLineDto = ReceiptLineDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "scan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "lotNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "expiryDate", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReceiptLineDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "unitCost", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ReceiptLineDto.prototype, "temperatureC", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "uom", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptLineDto.prototype, "locationId", void 0);
class ReceiptDto {
    branchId;
    supplierId;
    purchaseOrderId;
    invoiceNo;
    invoiceTotal;
    idempotencyKey;
    lines;
}
exports.ReceiptDto = ReceiptDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptDto.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptDto.prototype, "invoiceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ReceiptDto.prototype, "invoiceTotal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(200),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReceiptLineDto),
    __metadata("design:type", Array)
], ReceiptDto.prototype, "lines", void 0);
class ScanDto {
    code;
}
exports.ScanDto = ScanDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ScanDto.prototype, "code", void 0);
class ReasonDto {
    reason;
    witness;
}
exports.ReasonDto = ReasonDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ReasonDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], ReasonDto.prototype, "witness", void 0);
class WitnessDto {
    witness;
}
exports.WitnessDto = WitnessDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], WitnessDto.prototype, "witness", void 0);
class AdjustDto {
    lotId;
    quantity;
    reason;
    reasonCode;
    approval;
    witness;
}
exports.AdjustDto = AdjustDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdjustDto.prototype, "lotId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AdjustDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], AdjustDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(exports.ADJUST_REASONS),
    __metadata("design:type", String)
], AdjustDto.prototype, "reasonCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], AdjustDto.prototype, "approval", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], AdjustDto.prototype, "witness", void 0);
class ReturnSupplierDto {
    lotId;
    quantity;
    reason;
    creditAmount;
    witness;
}
exports.ReturnSupplierDto = ReturnSupplierDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReturnSupplierDto.prototype, "lotId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReturnSupplierDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ReturnSupplierDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ReturnSupplierDto.prototype, "creditAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], ReturnSupplierDto.prototype, "witness", void 0);
class TempDto {
    temperatureC;
}
exports.TempDto = TempDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TempDto.prototype, "temperatureC", void 0);
class PolicyDto {
    drugId;
    minQty;
    maxQty;
    leadTimeDays;
    supplierId;
}
exports.PolicyDto = PolicyDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PolicyDto.prototype, "minQty", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PolicyDto.prototype, "maxQty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PolicyDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PolicyDto.prototype, "supplierId", void 0);
class CountStartDto {
    branchId;
    type;
    drugIds;
}
exports.CountStartDto = CountStartDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CountStartDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["CYCLE", "FULL"]),
    __metadata("design:type", String)
], CountStartDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CountStartDto.prototype, "drugIds", void 0);
class CountLineDto {
    lotId;
    qtyCounted;
}
exports.CountLineDto = CountLineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CountLineDto.prototype, "lotId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CountLineDto.prototype, "qtyCounted", void 0);
class CountRecordDto {
    lines;
}
exports.CountRecordDto = CountRecordDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CountLineDto),
    __metadata("design:type", Array)
], CountRecordDto.prototype, "lines", void 0);
class TransferLineDto {
    lotId;
    quantity;
}
exports.TransferLineDto = TransferLineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferLineDto.prototype, "lotId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TransferLineDto.prototype, "quantity", void 0);
class TransferDto {
    fromBranchId;
    toBranchId;
    lines;
}
exports.TransferDto = TransferDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferDto.prototype, "fromBranchId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferDto.prototype, "toBranchId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TransferLineDto),
    __metadata("design:type", Array)
], TransferDto.prototype, "lines", void 0);
//# sourceMappingURL=inventory.dto.js.map