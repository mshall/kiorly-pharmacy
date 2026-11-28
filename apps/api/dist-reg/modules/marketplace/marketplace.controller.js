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
exports.MarketplaceMachineController = exports.KiorexOrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const requires_flag_guard_1 = require("../../feature-flags/requires-flag.guard");
const marketplace_service_1 = require("./marketplace.service");
const commission_rate_service_1 = require("../growth/commission-rate.service");
const requires_integration_guard_1 = require("../../tenancy/requires-integration.guard");
const marketplace_hmac_guard_1 = require("./marketplace-hmac.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
class SettingDto {
    optedIn;
    deliveryRadiusKm;
    openingHours;
    prepMinutes;
    slaMinutes;
    latitude;
    longitude;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SettingDto.prototype, "optedIn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SettingDto.prototype, "deliveryRadiusKm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], SettingDto.prototype, "openingHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SettingDto.prototype, "prepMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SettingDto.prototype, "slaMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SettingDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SettingDto.prototype, "longitude", void 0);
class ClientDto {
    kiorexBaseUrl;
    webhookSecret;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClientDto.prototype, "kiorexBaseUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], ClientDto.prototype, "webhookSecret", void 0);
class AcceptLineDto {
    lineId;
    qtyAccepted;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AcceptLineDto.prototype, "lineId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AcceptLineDto.prototype, "qtyAccepted", void 0);
class AcceptDto {
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AcceptLineDto),
    __metadata("design:type", Array)
], AcceptDto.prototype, "lines", void 0);
class OutForDeliveryDto {
    estimatedMinutes;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], OutForDeliveryDto.prototype, "estimatedMinutes", void 0);
class RejectDto {
    reason;
    reasonCode;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RejectDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RejectDto.prototype, "reasonCode", void 0);
let KiorexOrdersController = class KiorexOrdersController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    inbox(u, q) { return this.svc.inbox(u.orgId, { branchId: u.branchId ?? q.branchId, status: q.status }); }
    settings(u) { return this.svc.listSettings(u.orgId); }
    put(u, branchId, d) { return this.svc.putSetting(u, branchId, d); }
    clients(u) { return this.svc.listClients(u.orgId); }
    createClient(u, d) { return this.svc.createClient(u, d); }
    get(u, id) { return this.svc.get(u.orgId, id); }
    accept(u, id, d) { return this.svc.accept(u, id, d.lines); }
    reject(u, id, d) { return this.svc.reject(u, id, d.reason, d.reasonCode); }
    ready(u, id) { return this.svc.markReady(u, id); }
    outForDelivery(u, id, d) { return this.svc.markOutForDelivery(u, id, d); }
    expire(u) { return this.svc.expireOverdue(u.orgId); }
};
exports.KiorexOrdersController = KiorexOrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("orders.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "inbox", null);
__decorate([
    (0, common_1.Get)("settings"),
    (0, decorators_1.Perm)("orders.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "settings", null);
__decorate([
    (0, common_1.Put)("settings/:branchId"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("branchId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SettingDto]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "put", null);
__decorate([
    (0, common_1.Get)("integration/clients"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "clients", null);
__decorate([
    (0, common_1.Post)("integration/clients"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ClientDto]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "createClient", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, decorators_1.Perm)("orders.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(":id/accept"),
    (0, decorators_1.Perm)("orders.respond", "dispense.create"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AcceptDto]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "accept", null);
__decorate([
    (0, common_1.Post)(":id/reject"),
    (0, decorators_1.Perm)("orders.respond"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RejectDto]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(":id/ready"),
    (0, decorators_1.Perm)("orders.respond"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "ready", null);
__decorate([
    (0, common_1.Post)(":id/out-for-delivery"),
    (0, decorators_1.Perm)("orders.respond"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, OutForDeliveryDto]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "outForDelivery", null);
__decorate([
    (0, common_1.Post)("jobs/expire-overdue"),
    (0, decorators_1.Perm)("orders.respond"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexOrdersController.prototype, "expire", null);
exports.KiorexOrdersController = KiorexOrdersController = __decorate([
    (0, swagger_1.ApiTags)("kiorex-orders"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard, requires_integration_guard_1.RequiresIntegrationGuard),
    (0, requires_flag_guard_1.RequiresFlag)("pharmacy.kiorex_orders"),
    (0, common_1.Controller)("kiorex-orders"),
    __param(0, (0, common_1.Inject)(marketplace_service_1.MarketplaceService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService, prisma_service_1.PrismaService])
], KiorexOrdersController);
class IngestLineDto {
    sku;
    quantity;
    unitPrice;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngestLineDto.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], IngestLineDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], IngestLineDto.prototype, "unitPrice", void 0);
class CustomerDto {
    name;
    phone;
    address;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "address", void 0);
class PrescriptionDto {
    patientRef;
    recordRef;
    verificationToken;
    prescriberName;
    prescriberLicenceNo;
    issuedAt;
    scanRef;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "patientRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "recordRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "verificationToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "prescriberName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "prescriberLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "issuedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriptionDto.prototype, "scanRef", void 0);
class DeliveryDto {
    method;
    address;
}
__decorate([
    (0, class_validator_1.IsIn)(["PICKUP", "DELIVERY"]),
    __metadata("design:type", String)
], DeliveryDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], DeliveryDto.prototype, "address", void 0);
class PaymentDto {
    reference;
    totalMinor;
    currency;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "reference", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PaymentDto.prototype, "totalMinor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentDto.prototype, "currency", void 0);
class IngestDto {
    orderId;
    branchId;
    patientRef;
    customer;
    prepaid;
    lines;
    delivery;
    payment;
    prescription;
    acquisition;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], IngestDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngestDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], IngestDto.prototype, "patientRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CustomerDto),
    __metadata("design:type", CustomerDto)
], IngestDto.prototype, "customer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], IngestDto.prototype, "prepaid", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => IngestLineDto),
    __metadata("design:type", Array)
], IngestDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DeliveryDto),
    __metadata("design:type", DeliveryDto)
], IngestDto.prototype, "delivery", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PaymentDto),
    __metadata("design:type", PaymentDto)
], IngestDto.prototype, "payment", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PrescriptionDto),
    __metadata("design:type", PrescriptionDto)
], IngestDto.prototype, "prescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], IngestDto.prototype, "acquisition", void 0);
class QuoteItemDto {
    sku;
    qty;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuoteItemDto.prototype, "sku", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], QuoteItemDto.prototype, "qty", void 0);
class QuoteDeliveryDto {
    method;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuoteDeliveryDto.prototype, "method", void 0);
class QuoteDto {
    pharmacyId;
    items;
    delivery;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuoteDto.prototype, "pharmacyId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(50),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteItemDto),
    __metadata("design:type", Array)
], QuoteDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => QuoteDeliveryDto),
    __metadata("design:type", QuoteDeliveryDto)
], QuoteDto.prototype, "delivery", void 0);
class RxValidateDto {
    orderId;
    prescriptionRef;
    verificationToken;
    patientRef;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxValidateDto.prototype, "orderId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxValidateDto.prototype, "prescriptionRef", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxValidateDto.prototype, "verificationToken", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxValidateDto.prototype, "patientRef", void 0);
class CancelDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CancelDto.prototype, "reason", void 0);
let MarketplaceMachineController = class MarketplaceMachineController {
    svc;
    rates;
    constructor(svc, rates) {
        this.svc = svc;
        this.rates = rates;
    }
    commissionRate(req, d) { return this.rates.ingest(req.tenant.id, d); }
    pharmacies(req) { return this.svc.pharmacies(req.tenant.id); }
    catalogue(req, q) { return this.svc.catalogue(req.tenant.id, { q: q.q, branchId: q.pharmacyId }); }
    quote(req, d) { return this.svc.quote(req.tenant.id, d); }
    availability(req) { return this.svc.availability(req.tenant.id); }
    async order(req, d) {
        const r = await this.svc.ingest(req.tenant.id, d);
        return { orderId: r.order.externalOrderId, status: r.order.status, slaDueAt: r.order.slaDueAt, replayed: r.replayed };
    }
    validateRx(req, d) { return this.svc.validatePrescription(req.tenant.id, d); }
    cancel(req, orderId, _d) { return this.svc.cancelByKiorex(req.tenant.id, orderId); }
};
exports.MarketplaceMachineController = MarketplaceMachineController;
__decorate([
    (0, common_1.Post)("commission-rates"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "commissionRate", null);
__decorate([
    (0, common_1.Get)("pharmacies"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "pharmacies", null);
__decorate([
    (0, common_1.Get)("catalogue"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "catalogue", null);
__decorate([
    (0, common_1.Post)("catalogue/quote"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, QuoteDto]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "quote", null);
__decorate([
    (0, common_1.Get)("availability"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "availability", null);
__decorate([
    (0, common_1.Post)("orders"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, IngestDto]),
    __metadata("design:returntype", Promise)
], MarketplaceMachineController.prototype, "order", null);
__decorate([
    (0, common_1.Post)("prescriptions/validate"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RxValidateDto]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "validateRx", null);
__decorate([
    (0, common_1.Post)("orders/:orderId/cancel"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("orderId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CancelDto]),
    __metadata("design:returntype", void 0)
], MarketplaceMachineController.prototype, "cancel", null);
exports.MarketplaceMachineController = MarketplaceMachineController = __decorate([
    (0, swagger_1.ApiTags)("marketplace-v1"),
    (0, decorators_1.Public)(),
    (0, common_1.UseGuards)(marketplace_hmac_guard_1.MarketplaceHmacGuard, requires_flag_guard_1.RequiresFlagGuard, requires_integration_guard_1.RequiresIntegrationGuard),
    (0, requires_flag_guard_1.RequiresFlag)("pharmacy.kiorex_orders"),
    (0, common_1.Controller)("marketplace/v1"),
    __param(0, (0, common_1.Inject)(marketplace_service_1.MarketplaceService)),
    __param(1, (0, common_1.Inject)(commission_rate_service_1.CommissionRateService)),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService, commission_rate_service_1.CommissionRateService])
], MarketplaceMachineController);
//# sourceMappingURL=marketplace.controller.js.map