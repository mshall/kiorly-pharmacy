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
exports.PosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const approval_service_1 = require("../../auth/approval.service");
const pos_service_1 = require("./pos.service");
const sales_service_1 = require("./sales.service");
const shifts_service_1 = require("./shifts.service");
const customers_service_1 = require("./customers.service");
const promotions_service_1 = require("./promotions.service");
const held_carts_service_1 = require("./held-carts.service");
const cash_service_1 = require("./cash.service");
const paylinks_service_1 = require("./paylinks.service");
const uom_service_1 = require("../inventory/uom.service");
const branch_scope_1 = require("../../common/branch-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_1 = require("../../common/pagination");
const METHODS = ["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT", "LOYALTY_POINTS"];
class CartLineDto {
    drugId;
    quantity;
    lotId;
    discount;
    uom;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CartLineDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CartLineDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CartLineDto.prototype, "lotId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CartLineDto.prototype, "discount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CartLineDto.prototype, "uom", void 0);
class PaymentDto {
    method;
    amount;
    walletRef;
}
__decorate([
    (0, class_validator_1.IsIn)(METHODS),
    __metadata("design:type", Object)
], PaymentDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "walletRef", void 0);
class CheckoutDto {
    branchId;
    idempotencyKey;
    shiftId;
    lines;
    payments;
    customerAccountId;
    patientId;
    couponCodes;
    approval;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CheckoutDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CartLineDto),
    __metadata("design:type", Array)
], CheckoutDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentDto),
    __metadata("design:type", Array)
], CheckoutDto.prototype, "payments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "customerAccountId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CheckoutDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(5),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CheckoutDto.prototype, "couponCodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], CheckoutDto.prototype, "approval", void 0);
class QuoteDto {
    branchId;
    couponCodes;
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuoteDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(5),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], QuoteDto.prototype, "couponCodes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CartLineDto),
    __metadata("design:type", Array)
], QuoteDto.prototype, "lines", void 0);
class SyncSaleDto {
    idempotencyKey;
    clientCreatedAt;
    lines;
    payments;
    customerAccountId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SyncSaleDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SyncSaleDto.prototype, "clientCreatedAt", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CartLineDto),
    __metadata("design:type", Array)
], SyncSaleDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentDto),
    __metadata("design:type", Array)
], SyncSaleDto.prototype, "payments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncSaleDto.prototype, "customerAccountId", void 0);
class SyncDto {
    branchId;
    sales;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SyncDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(500),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SyncSaleDto),
    __metadata("design:type", Array)
], SyncDto.prototype, "sales", void 0);
class ResolveDto {
    action;
    approval;
}
__decorate([
    (0, class_validator_1.IsIn)(["FORCE", "DISCARD"]),
    __metadata("design:type", String)
], ResolveDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], ResolveDto.prototype, "approval", void 0);
class ReturnLineDto {
    saleLineId;
    quantity;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReturnLineDto.prototype, "saleLineId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReturnLineDto.prototype, "quantity", void 0);
class ReturnDto {
    lines;
    reason;
    refundMethod;
    approval;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReturnLineDto),
    __metadata("design:type", Array)
], ReturnDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ReturnDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsIn)(METHODS.filter((m) => m !== "LOYALTY_POINTS")),
    __metadata("design:type", Object)
], ReturnDto.prototype, "refundMethod", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], ReturnDto.prototype, "approval", void 0);
class ExchangeDto {
    returnLines;
    reason;
    refundMethod;
    newLines;
    payments;
    idempotencyKey;
    couponCodes;
    approval;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReturnLineDto),
    __metadata("design:type", Array)
], ExchangeDto.prototype, "returnLines", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ExchangeDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsIn)(METHODS.filter((m) => m !== "LOYALTY_POINTS")),
    __metadata("design:type", Object)
], ExchangeDto.prototype, "refundMethod", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CartLineDto),
    __metadata("design:type", Array)
], ExchangeDto.prototype, "newLines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentDto),
    __metadata("design:type", Array)
], ExchangeDto.prototype, "payments", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ExchangeDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ExchangeDto.prototype, "couponCodes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], ExchangeDto.prototype, "approval", void 0);
class HoldDto {
    branchId;
    label;
    patientId;
    payload;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HoldDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HoldDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], HoldDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], HoldDto.prototype, "payload", void 0);
class CashDto {
    branchId;
    kind;
    category;
    amount;
    reason;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CashDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["IN", "OUT"]),
    __metadata("design:type", String)
], CashDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CashDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CashDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CashDto.prototype, "reason", void 0);
class PromoDto {
    name;
    nameAr;
    kind;
    couponCode;
    drugIds;
    params;
    startsAt;
    endsAt;
    minSubtotal;
    maxUses;
    priority;
    stackable;
    branchId;
    active;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], PromoDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsIn)(promotions_service_1.PROMO_KINDS),
    __metadata("design:type", Object)
], PromoDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoDto.prototype, "couponCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PromoDto.prototype, "drugIds", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PromoDto.prototype, "params", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PromoDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PromoDto.prototype, "endsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PromoDto.prototype, "minSubtotal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PromoDto.prototype, "maxUses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PromoDto.prototype, "stackable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PromoDto.prototype, "active", void 0);
class PromoPatchDto {
    name;
    nameAr;
    kind;
    params;
    drugIds;
    endsAt;
    minSubtotal;
    maxUses;
    priority;
    stackable;
    active;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoPatchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PromoPatchDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(promotions_service_1.PROMO_KINDS),
    __metadata("design:type", Object)
], PromoPatchDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], PromoPatchDto.prototype, "params", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PromoPatchDto.prototype, "drugIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PromoPatchDto.prototype, "endsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PromoPatchDto.prototype, "minSubtotal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoPatchDto.prototype, "maxUses", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PromoPatchDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PromoPatchDto.prototype, "stackable", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PromoPatchDto.prototype, "active", void 0);
class VoidDto {
    reason;
    approval;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], VoidDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], VoidDto.prototype, "approval", void 0);
class OpenShiftDto {
    branchId;
    openingFloat;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OpenShiftDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], OpenShiftDto.prototype, "openingFloat", void 0);
class CloseShiftDto {
    countedCash;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CloseShiftDto.prototype, "countedCash", void 0);
class CustomerDto {
    displayName;
    phone;
    creditLimit;
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
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "creditLimit", void 0);
class LimitDto {
    creditLimit;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], LimitDto.prototype, "creditLimit", void 0);
class SendViaDto {
    channel;
    to;
}
__decorate([
    (0, class_validator_1.IsIn)(["SMS", "EMAIL", "WHATSAPP"]),
    __metadata("design:type", String)
], SendViaDto.prototype, "channel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], SendViaDto.prototype, "to", void 0);
class PayLinkDto {
    amount;
    expiresInHours;
    sendVia;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PayLinkDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PayLinkDto.prototype, "expiresInHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SendViaDto),
    __metadata("design:type", SendViaDto)
], PayLinkDto.prototype, "sendVia", void 0);
class PayLinkRefundDto {
    amount;
    reason;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PayLinkRefundDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayLinkRefundDto.prototype, "reason", void 0);
class ReceiptSendDto {
    channel;
    to;
}
__decorate([
    (0, class_validator_1.IsIn)(["SMS", "EMAIL", "WHATSAPP"]),
    __metadata("design:type", String)
], ReceiptSendDto.prototype, "channel", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], ReceiptSendDto.prototype, "to", void 0);
class CustPayDto {
    amount;
    branchId;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], CustPayDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustPayDto.prototype, "branchId", void 0);
let PosController = class PosController {
    pos;
    sales;
    shifts;
    customers;
    promos;
    held;
    cash;
    payLinks;
    uoms;
    prisma;
    constructor(pos, sales, shifts, customers, promos, held, cash, payLinks, uoms, prisma) {
        this.pos = pos;
        this.sales = sales;
        this.shifts = shifts;
        this.customers = customers;
        this.promos = promos;
        this.held = held;
        this.cash = cash;
        this.payLinks = payLinks;
        this.uoms = uoms;
        this.prisma = prisma;
    }
    async expand(u, lines) {
        return Promise.all(lines.map(async (l) => { const f = await this.uoms.factor(u.orgId, l.drugId, l.uom); return { drugId: l.drugId, lotId: l.lotId, discount: l.discount, quantity: l.quantity * f }; }));
    }
    async lookup(u, code, branchId) { return this.pos.lookup(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId), code); }
    async quote(u, d) { return this.pos.quote(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), await this.expand(u, d.lines), d.couponCodes); }
    async bundle(u, branchId) { return this.pos.offlineBundle(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    async checkout(u, d) { return this.sales.checkout(u, { ...d, lines: await this.expand(u, d.lines), branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId) }); }
    list(u, q) { const { skip, take } = (0, pagination_1.pageArgs)(q); return this.pos.listSales(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), shiftId: q.shiftId, skip, take }); }
    get(u, id) { return this.pos.getSale(u.orgId, id); }
    receipt(u, id) { return this.pos.receipt(u.orgId, id); }
    receiptHtml(u, id, lang, format) { return this.pos.receiptHtml(u.orgId, id, lang === "en" ? "en" : "ar", format === "a4" ? "a4" : format === "thermal" ? "thermal" : undefined); }
    ret(u, id, d) { return this.pos.returnItems(u, id, d); }
    exchange(u, id, d) { return this.pos.exchange(u, id, d); }
    void(u, id, d) { return this.pos.voidSale(u, id, d.reason, d.approval); }
    async sync(u, d) { return { results: await this.pos.sync(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d.sales) }; }
    conflicts(u) { return this.pos.conflicts(u.orgId); }
    resolve(u, id, d) { return this.pos.resolveConflict(u, id, d.action, d.approval); }
    async open(u, d) { return this.shifts.open(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d.openingFloat); }
    async current(u, branchId) { return (await this.shifts.current(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId))) ?? null; }
    shiftList(u, branchId) { return this.shifts.list(u.orgId, (0, branch_scope_1.branchFilter)(u, branchId).branchId); }
    x(u, id) { return this.shifts.zReport(u.orgId, id); }
    z(u, id) { return this.shifts.zReport(u.orgId, id); }
    close(u, id, d) { return this.shifts.close(u, id, d.countedCash); }
    custList(u, q) { return this.customers.list(u.orgId, q); }
    custCreate(u, d) { return this.customers.create(u, d); }
    custGet(u, id) { return this.customers.get(u.orgId, id); }
    custLimit(u, id, d) { return this.customers.setLimit(u, id, d.creditLimit); }
    payLink(u, id, d, key) { return this.payLinks.create(u, id, d, key); }
    payLinksFor(u, id) { return this.payLinks.list(u.orgId, id); }
    refundPayLink(u, id, d) { return this.payLinks.refund(u, id, d); }
    sendReceipt(u, id, d) { return this.payLinks.sendReceipt(u, id, d); }
    async custPay(u, id, d) { return this.customers.pay(u, id, d.amount, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId)); }
    async hold(u, d) { return this.held.hold(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), { label: d.label, patientId: d.patientId, payload: d.payload }); }
    async heldList(u, branchId) { return this.held.list(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    resume(u, id) { return this.held.resume(u, id); }
    discard(u, id) { return this.held.discard(u, id); }
    async cashMove(u, d) { return this.cash.record(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d); }
    cashList(u, q) { return this.cash.list(u.orgId, { shiftId: q.shiftId, ...(0, branch_scope_1.branchFilter)(u, q.branchId) }); }
    promoList(u, q) { return this.promos.list(u.orgId, { active: q.active === undefined ? undefined : q.active === "true", q: q.q }); }
    promoCreate(u, d) { return this.promos.create(u, d); }
    promoUpdate(u, id, d) { return this.promos.update(u, id, d); }
};
exports.PosController = PosController;
__decorate([
    (0, common_1.Get)("lookup"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("code")),
    __param(2, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "lookup", null);
__decorate([
    (0, common_1.Post)("cart/quote"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, QuoteDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "quote", null);
__decorate([
    (0, common_1.Get)("offline-bundle"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "bundle", null);
__decorate([
    (0, common_1.Post)("sales"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CheckoutDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)("sales"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("sales/:id"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "get", null);
__decorate([
    (0, common_1.Get)("sales/:id/receipt"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "receipt", null);
__decorate([
    (0, common_1.Get)("sales/:id/receipt.html"),
    (0, common_1.Header)("Content-Type", "text/html; charset=utf-8"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("lang")),
    __param(3, (0, common_1.Query)("format")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "receiptHtml", null);
__decorate([
    (0, common_1.Post)("sales/:id/returns"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReturnDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "ret", null);
__decorate([
    (0, common_1.Post)("sales/:id/exchange"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ExchangeDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "exchange", null);
__decorate([
    (0, common_1.Post)("sales/:id/void"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, VoidDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "void", null);
__decorate([
    (0, common_1.Post)("sync"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SyncDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "sync", null);
__decorate([
    (0, common_1.Get)("sync/conflicts"),
    (0, decorators_1.Perm)("pos.refund_approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "conflicts", null);
__decorate([
    (0, common_1.Post)("sync/conflicts/:id/resolve"),
    (0, decorators_1.Perm)("pos.refund_approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ResolveDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "resolve", null);
__decorate([
    (0, common_1.Post)("shifts/open"),
    (0, decorators_1.Perm)("pos.shift"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, OpenShiftDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "open", null);
__decorate([
    (0, common_1.Get)("shifts/current"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "current", null);
__decorate([
    (0, common_1.Get)("shifts"),
    (0, decorators_1.Perm)("pos.shift"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "shiftList", null);
__decorate([
    (0, common_1.Get)("shifts/:id/x-report"),
    (0, decorators_1.Perm)("pos.shift"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "x", null);
__decorate([
    (0, common_1.Get)("shifts/:id/z-report"),
    (0, decorators_1.Perm)("pos.shift"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "z", null);
__decorate([
    (0, common_1.Post)("shifts/:id/close"),
    (0, decorators_1.Perm)("pos.shift"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CloseShiftDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "close", null);
__decorate([
    (0, common_1.Get)("customers"),
    (0, decorators_1.Perm)("customer.credit"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "custList", null);
__decorate([
    (0, common_1.Post)("customers"),
    (0, decorators_1.Perm)("customer.credit"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CustomerDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "custCreate", null);
__decorate([
    (0, common_1.Get)("customers/:id"),
    (0, decorators_1.Perm)("customer.credit"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "custGet", null);
__decorate([
    (0, common_1.Post)("customers/:id/limit"),
    (0, decorators_1.Perm)("pos.refund_approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, LimitDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "custLimit", null);
__decorate([
    (0, common_1.Post)("customers/:id/pay-link"),
    (0, decorators_1.Perm)("customer.credit"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Headers)("idempotency-key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PayLinkDto, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "payLink", null);
__decorate([
    (0, common_1.Get)("customers/:id/pay-links"),
    (0, decorators_1.Perm)("customer.credit"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "payLinksFor", null);
__decorate([
    (0, common_1.Post)("pay-links/:id/refund"),
    (0, decorators_1.Perm)("pos.refund_approve"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PayLinkRefundDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "refundPayLink", null);
__decorate([
    (0, common_1.Post)("sales/:id/receipt/send"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ReceiptSendDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "sendReceipt", null);
__decorate([
    (0, common_1.Post)("customers/:id/payments"),
    (0, decorators_1.Perm)("customer.credit"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CustPayDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "custPay", null);
__decorate([
    (0, common_1.Post)("held"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, HoldDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "hold", null);
__decorate([
    (0, common_1.Get)("held"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "heldList", null);
__decorate([
    (0, common_1.Post)("held/:id/resume"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "resume", null);
__decorate([
    (0, common_1.Delete)("held/:id"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "discard", null);
__decorate([
    (0, common_1.Post)("cash-movements"),
    (0, decorators_1.Perm)("pos.cash_drawer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CashDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "cashMove", null);
__decorate([
    (0, common_1.Get)("cash-movements"),
    (0, decorators_1.Perm)("pos.cash_drawer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "cashList", null);
__decorate([
    (0, common_1.Get)("promotions"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "promoList", null);
__decorate([
    (0, common_1.Post)("promotions"),
    (0, decorators_1.Perm)("promo.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PromoDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "promoCreate", null);
__decorate([
    (0, common_1.Patch)("promotions/:id"),
    (0, decorators_1.Perm)("promo.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PromoPatchDto]),
    __metadata("design:returntype", void 0)
], PosController.prototype, "promoUpdate", null);
exports.PosController = PosController = __decorate([
    (0, swagger_1.ApiTags)("pos"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("pos"),
    __param(0, (0, common_1.Inject)(pos_service_1.PosService)),
    __param(1, (0, common_1.Inject)(sales_service_1.SalesService)),
    __param(2, (0, common_1.Inject)(shifts_service_1.ShiftsService)),
    __param(3, (0, common_1.Inject)(customers_service_1.CustomersService)),
    __param(4, (0, common_1.Inject)(promotions_service_1.PromotionsService)),
    __param(5, (0, common_1.Inject)(held_carts_service_1.HeldCartsService)),
    __param(6, (0, common_1.Inject)(cash_service_1.CashService)),
    __param(7, (0, common_1.Inject)(paylinks_service_1.PayLinksService)),
    __param(8, (0, common_1.Inject)(uom_service_1.UomService)),
    __param(9, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [pos_service_1.PosService,
        sales_service_1.SalesService,
        shifts_service_1.ShiftsService,
        customers_service_1.CustomersService,
        promotions_service_1.PromotionsService,
        held_carts_service_1.HeldCartsService,
        cash_service_1.CashService,
        paylinks_service_1.PayLinksService,
        uom_service_1.UomService,
        prisma_service_1.PrismaService])
], PosController);
//# sourceMappingURL=pos.controller.js.map