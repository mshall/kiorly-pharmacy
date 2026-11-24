import { Body, Controller, Get, Header, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { DomainError } from "../../common/errors";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsDateString, IsIn, IsNumberString, IsOptional, IsString, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { CatalogueService } from "./catalogue.service";
import { PriceService } from "./price.service";
import { pageArgs } from "../../common/pagination";
import { resolveBranchId } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { renderShelfLabels } from "./label-template";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";

const SCHEDULES = ["NONE", "SCHEDULE_1", "SCHEDULE_2", "SCHEDULE_3", "SCHEDULE_4"] as const;
const bool = ({ value }: { value: unknown }) => (value === "true" || value === true ? true : value === "false" || value === false ? false : undefined);

export class DrugDto {
  @IsOptional() @IsString() sourceKey?: string;
  @IsString() @MinLength(1) brandName!: string;
  @IsOptional() @IsString() brandNameAr?: string;
  @IsString() @MinLength(1) activeIngredient!: string;
  @IsString() strength!: string;
  @IsString() dosageForm!: string;
  @IsString() packSize!: string;
  @IsOptional() @IsString() gtin?: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsOptional() @IsNumberString() price?: string;
  @IsOptional() @IsBoolean() rxOnly?: boolean;
  @IsOptional() @IsIn(SCHEDULES) controlledSchedule?: (typeof SCHEDULES)[number];
  @IsOptional() @IsBoolean() coldChain?: boolean;
  @IsOptional() @IsBoolean() otc?: boolean;
  @IsOptional() @IsNumberString() vatRate?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() baseUnit?: string;
}
class DrugPatchDto {
  @IsOptional() @IsString() brandName?: string;
  @IsOptional() @IsString() brandNameAr?: string;
  @IsOptional() @IsString() activeIngredient?: string;
  @IsOptional() @IsString() strength?: string;
  @IsOptional() @IsString() dosageForm?: string;
  @IsOptional() @IsString() packSize?: string;
  @IsOptional() @IsString() gtin?: string;
  @IsOptional() @IsString() manufacturer?: string;
  @IsOptional() @IsBoolean() rxOnly?: boolean;
  @IsOptional() @IsIn(SCHEDULES) controlledSchedule?: (typeof SCHEDULES)[number];
  @IsOptional() @IsBoolean() coldChain?: boolean;
  @IsOptional() @IsBoolean() otc?: boolean;
  @IsOptional() @IsNumberString() vatRate?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() baseUnit?: string;
}
class ImportDto {
  @IsArray() @ArrayMaxSize(5000) @ValidateNested({ each: true }) @Type(() => DrugDto) drugs!: DrugDto[];
}
class PriceItemDto {
  @IsString() drugId!: string;
  @IsNumberString() price!: string;
  @IsOptional() @IsString() branchId?: string;
}
class BulkPriceDto {
  @IsDateString() effectiveFrom!: string;
  @IsArray() @ArrayMaxSize(2000) @ValidateNested({ each: true }) @Type(() => PriceItemDto) items!: PriceItemDto[];
}
class SearchQuery {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @Transform(bool) @IsBoolean() rxOnly?: boolean;
  @IsOptional() @Transform(bool) @IsBoolean() controlled?: boolean;
  @IsOptional() @Transform(bool) @IsBoolean() coldChain?: boolean;
  @IsOptional() @Transform(bool) @IsBoolean() otc?: boolean;
  @IsOptional() page?: string;
  @IsOptional() pageSize?: string;
}

@ApiTags("catalogue")
@ApiBearerAuth()
@Controller("catalogue")
export class CatalogueController {
  constructor(
    @Inject(CatalogueService) private readonly svc: CatalogueService,
    @Inject(PriceService) private readonly prices: PriceService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
  ) {}

  @Get("drugs")
  @Perm("catalogue.read")
  async search(@CurrentUser() u: AuthUser, @Query() q: SearchQuery) {
    const { skip, take, page, pageSize } = pageArgs(q, 100);
    const r = await this.svc.search(u.orgId, { q: q.q, rxOnly: q.rxOnly, controlled: q.controlled, coldChain: q.coldChain, otc: q.otc, category: q.category, skip, take });
    return { ...r, page, pageSize };
  }

  @Get("price-book")
  @Perm("catalogue.read")
  async priceBook(@CurrentUser() u: AuthUser, @Query() q: { q?: string; category?: string; lowMargin?: string; branchId?: string; page?: string; pageSize?: string }) {
    const { skip, take, page, pageSize } = pageArgs(q, 200);
    return { ...(await this.svc.priceBook(u.orgId, await resolveBranchId(this.prisma, u, q.branchId), { q: q.q, category: q.category, lowMargin: q.lowMargin === "true", skip, take })), page, pageSize };
  }

  @Get("categories")
  @Perm("catalogue.read")
  async categories(@CurrentUser() u: AuthUser) { return (await this.prisma.drug.findMany({ where: { OR: [{ orgId: null }, { orgId: u.orgId }], category: { not: null } }, distinct: ["category"], select: { category: true }, orderBy: { category: "asc" } })).map((x) => x.category); }

  @Get("drugs/:id")
  @Perm("catalogue.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }

  @Post("drugs")
  @Perm("catalogue.write")
  create(@CurrentUser() u: AuthUser, @Body() dto: DrugDto) { return this.svc.create(u.orgId, u.userId, dto); }

  @Patch("drugs/:id")
  @Perm("catalogue.write")
  update(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() dto: DrugPatchDto) { return this.svc.update(u.orgId, u.userId, id, dto); }

  /** Tenant-scope bulk import (idempotent by sourceKey / gtin). The global Egyptian seed is loaded by `npm run seed`. */
  @Post("import")
  @Perm("catalogue.write")
  import(@CurrentUser() u: AuthUser, @Body() dto: ImportDto) { return this.svc.importDrugs(u.orgId, dto.drugs, u.userId); }

  @Get("drugs/:id/substitutes")
  @Perm("catalogue.read")
  async substitutes(@CurrentUser() u: AuthUser, @Param("id") id: string, @Query("branchId") branchId?: string) {
    return this.svc.substitutes(u.orgId, await resolveBranchId(this.prisma, u, branchId), id);
  }

  @Get("prices/:drugId")
  @Perm("catalogue.read")
  history(@CurrentUser() u: AuthUser, @Param("drugId") drugId: string) { return this.prices.history(u.orgId, drugId); }

  @Get("prices/:drugId/at")
  @Perm("catalogue.read")
  async priceAt(@CurrentUser() u: AuthUser, @Param("drugId") drugId: string, @Query("date") date?: string, @Query("branchId") branchId?: string) {
    const p = await this.prices.priceAt(u.orgId, branchId ?? u.branchId ?? null, drugId, date ? new Date(date) : new Date());
    return { drugId, at: date ?? new Date().toISOString(), price: p?.toFixed(2) ?? null };
  }

  @Post("prices/bulk")
  @Perm("price.write")
  bulk(@CurrentUser() u: AuthUser, @Body() dto: BulkPriceDto) { return this.prices.bulkUpdate(u.orgId, u.userId, new Date(dto.effectiveFrom), dto.items); }

  @Get("labels")
  @Perm("catalogue.read")
  async labels(@CurrentUser() u: AuthUser, @Query("drugIds") drugIds: string, @Query("branchId") branchId?: string) {
    const ids = (typeof drugIds === "string" ? drugIds : "").split(",").filter(Boolean).slice(0, 200);
    if (!ids.length) throw new DomainError("DRUG_IDS_REQUIRED", "drugIds (comma separated) is required", 400);
    return this.svc.labels(u.orgId, branchId ?? u.branchId ?? null, ids);
  }

  @Get("labels/print")
  @Header("Content-Type", "text/html; charset=utf-8")
  @Perm("catalogue.read")
  async print(@CurrentUser() u: AuthUser, @Query("drugIds") drugIds: string, @Query("lang") lang: "ar" | "en" = "ar", @Query("branchId") branchId?: string) {
    const ids = (typeof drugIds === "string" ? drugIds : "").split(",").filter(Boolean).slice(0, 200);
    if (!ids.length) throw new DomainError("DRUG_IDS_REQUIRED", "drugIds (comma separated) is required", 400);
    const items = await this.svc.labels(u.orgId, branchId ?? u.branchId ?? null, ids);
    return renderShelfLabels(items, lang === "en" ? "en" : "ar", this.packs.get(u.market).currency);
  }
}
