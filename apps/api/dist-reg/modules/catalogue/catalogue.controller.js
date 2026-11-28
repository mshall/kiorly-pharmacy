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
exports.CatalogueController = exports.DrugDto = void 0;
const common_1 = require("@nestjs/common");
const errors_1 = require("../../common/errors");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const catalogue_service_1 = require("./catalogue.service");
const price_service_1 = require("./price.service");
const pagination_1 = require("../../common/pagination");
const branch_scope_1 = require("../../common/branch-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
const label_template_1 = require("./label-template");
const ports_1 = require("../../kernel-adapter/ports");
const SCHEDULES = ["NONE", "SCHEDULE_1", "SCHEDULE_2", "SCHEDULE_3", "SCHEDULE_4"];
const bool = ({ value }) => (value === "true" || value === true ? true : value === "false" || value === false ? false : undefined);
class DrugDto {
    sourceKey;
    brandName;
    brandNameAr;
    activeIngredient;
    strength;
    dosageForm;
    packSize;
    gtin;
    manufacturer;
    price;
    rxOnly;
    controlledSchedule;
    coldChain;
    otc;
    vatRate;
    category;
    baseUnit;
}
exports.DrugDto = DrugDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "sourceKey", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], DrugDto.prototype, "brandName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "brandNameAr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], DrugDto.prototype, "activeIngredient", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "strength", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "dosageForm", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "packSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "gtin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "manufacturer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DrugDto.prototype, "rxOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(SCHEDULES),
    __metadata("design:type", Object)
], DrugDto.prototype, "controlledSchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DrugDto.prototype, "coldChain", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DrugDto.prototype, "otc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "vatRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugDto.prototype, "baseUnit", void 0);
class DrugPatchDto {
    brandName;
    brandNameAr;
    activeIngredient;
    strength;
    dosageForm;
    packSize;
    gtin;
    manufacturer;
    rxOnly;
    controlledSchedule;
    coldChain;
    otc;
    vatRate;
    category;
    baseUnit;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "brandName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "brandNameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "activeIngredient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "strength", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "dosageForm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "packSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "gtin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "manufacturer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DrugPatchDto.prototype, "rxOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(SCHEDULES),
    __metadata("design:type", Object)
], DrugPatchDto.prototype, "controlledSchedule", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DrugPatchDto.prototype, "coldChain", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DrugPatchDto.prototype, "otc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "vatRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DrugPatchDto.prototype, "baseUnit", void 0);
class ImportDto {
    drugs;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(5000),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => DrugDto),
    __metadata("design:type", Array)
], ImportDto.prototype, "drugs", void 0);
class PriceItemDto {
    drugId;
    price;
    branchId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceItemDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PriceItemDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PriceItemDto.prototype, "branchId", void 0);
class BulkPriceDto {
    effectiveFrom;
    items;
}
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BulkPriceDto.prototype, "effectiveFrom", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(2000),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PriceItemDto),
    __metadata("design:type", Array)
], BulkPriceDto.prototype, "items", void 0);
class SearchQuery {
    q;
    category;
    rxOnly;
    controlled;
    coldChain;
    otc;
    page;
    pageSize;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchQuery.prototype, "q", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchQuery.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(bool),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchQuery.prototype, "rxOnly", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(bool),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchQuery.prototype, "controlled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(bool),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchQuery.prototype, "coldChain", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(bool),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchQuery.prototype, "otc", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchQuery.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SearchQuery.prototype, "pageSize", void 0);
let CatalogueController = class CatalogueController {
    svc;
    prices;
    prisma;
    packs;
    constructor(svc, prices, prisma, packs) {
        this.svc = svc;
        this.prices = prices;
        this.prisma = prisma;
        this.packs = packs;
    }
    async search(u, q) {
        const { skip, take, page, pageSize } = (0, pagination_1.pageArgs)(q, 100);
        const r = await this.svc.search(u.orgId, { q: q.q, rxOnly: q.rxOnly, controlled: q.controlled, coldChain: q.coldChain, otc: q.otc, category: q.category, skip, take });
        return { ...r, page, pageSize };
    }
    async priceBook(u, q) {
        const { skip, take, page, pageSize } = (0, pagination_1.pageArgs)(q, 200);
        return { ...(await this.svc.priceBook(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, q.branchId), { q: q.q, category: q.category, lowMargin: q.lowMargin === "true", skip, take })), page, pageSize };
    }
    async categories(u) { return (await this.prisma.drug.findMany({ where: { OR: [{ orgId: null }, { orgId: u.orgId }], category: { not: null } }, distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } })).map((x) => x.category); }
    get(u, id) { return this.svc.get(u.orgId, id); }
    create(u, dto) { return this.svc.create(u.orgId, u.userId, dto); }
    update(u, id, dto) { return this.svc.update(u.orgId, u.userId, id, dto); }
    import(u, dto) { return this.svc.importDrugs(u.orgId, dto.drugs, u.userId); }
    async substitutes(u, id, branchId) {
        return this.svc.substitutes(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId), id);
    }
    history(u, drugId) { return this.prices.history(u.orgId, drugId); }
    async priceAt(u, drugId, date, branchId) {
        const p = await this.prices.priceAt(u.orgId, branchId ?? u.branchId ?? null, drugId, date ? new Date(date) : new Date());
        return { drugId, at: date ?? new Date().toISOString(), price: p?.toFixed(2) ?? null };
    }
    bulk(u, dto) { return this.prices.bulkUpdate(u.orgId, u.userId, new Date(dto.effectiveFrom), dto.items); }
    async labels(u, drugIds, branchId) {
        const ids = (typeof drugIds === "string" ? drugIds : "").split(",").filter(Boolean).slice(0, 200);
        if (!ids.length)
            throw new errors_1.DomainError("DRUG_IDS_REQUIRED", "drugIds (comma separated) is required", 400);
        return this.svc.labels(u.orgId, branchId ?? u.branchId ?? null, ids);
    }
    async print(u, drugIds, lang = "ar", branchId) {
        const ids = (typeof drugIds === "string" ? drugIds : "").split(",").filter(Boolean).slice(0, 200);
        if (!ids.length)
            throw new errors_1.DomainError("DRUG_IDS_REQUIRED", "drugIds (comma separated) is required", 400);
        const items = await this.svc.labels(u.orgId, branchId ?? u.branchId ?? null, ids);
        return (0, label_template_1.renderShelfLabels)(items, lang === "en" ? "en" : "ar", this.packs.get(u.market).currency);
    }
};
exports.CatalogueController = CatalogueController;
__decorate([
    (0, common_1.Get)("drugs"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SearchQuery]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("price-book"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "priceBook", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "categories", null);
__decorate([
    (0, common_1.Get)("drugs/:id"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "get", null);
__decorate([
    (0, common_1.Post)("drugs"),
    (0, decorators_1.Perm)("catalogue.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, DrugDto]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)("drugs/:id"),
    (0, decorators_1.Perm)("catalogue.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, DrugPatchDto]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "update", null);
__decorate([
    (0, common_1.Post)("import"),
    (0, decorators_1.Perm)("catalogue.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ImportDto]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "import", null);
__decorate([
    (0, common_1.Get)("drugs/:id/substitutes"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "substitutes", null);
__decorate([
    (0, common_1.Get)("prices/:drugId"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("drugId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "history", null);
__decorate([
    (0, common_1.Get)("prices/:drugId/at"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("drugId")),
    __param(2, (0, common_1.Query)("date")),
    __param(3, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "priceAt", null);
__decorate([
    (0, common_1.Post)("prices/bulk"),
    (0, decorators_1.Perm)("price.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BulkPriceDto]),
    __metadata("design:returntype", void 0)
], CatalogueController.prototype, "bulk", null);
__decorate([
    (0, common_1.Get)("labels"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("drugIds")),
    __param(2, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "labels", null);
__decorate([
    (0, common_1.Get)("labels/print"),
    (0, common_1.Header)("Content-Type", "text/html; charset=utf-8"),
    (0, decorators_1.Perm)("catalogue.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("drugIds")),
    __param(2, (0, common_1.Query)("lang")),
    __param(3, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], CatalogueController.prototype, "print", null);
exports.CatalogueController = CatalogueController = __decorate([
    (0, swagger_1.ApiTags)("catalogue"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("catalogue"),
    __param(0, (0, common_1.Inject)(catalogue_service_1.CatalogueService)),
    __param(1, (0, common_1.Inject)(price_service_1.PriceService)),
    __param(2, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(3, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __metadata("design:paramtypes", [catalogue_service_1.CatalogueService,
        price_service_1.PriceService,
        prisma_service_1.PrismaService, Object])
], CatalogueController);
//# sourceMappingURL=catalogue.controller.js.map