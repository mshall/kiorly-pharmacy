import { Body, Controller, Delete, Get, Header, Inject, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { ApprovalDto, ApprovalService } from "../../auth/approval.service";
import { PrismaService } from "../../prisma/prisma.service";
import { branchFilter, resolveBranchId } from "../../common/branch-scope";
import { pageArgs } from "../../common/pagination";
import { notFound } from "../../common/errors";
import { LocationsService, LOCATION_KINDS } from "./locations.service";
import { UomService } from "./uom.service";
import { InventoryAnalyticsService } from "./inventory-analytics.service";
import { InventoryService } from "./inventory.service";
import { ADJUST_REASONS } from "./inventory.dto";

class LocationDto { @IsOptional() @IsString() branchId?: string; @IsString() @MinLength(1) code!: string; @IsOptional() @IsString() label?: string; @IsOptional() @IsIn(LOCATION_KINDS) kind?: string; }
class LocationPatchDto { @IsOptional() @IsString() label?: string; @IsOptional() @IsIn(LOCATION_KINDS) kind?: string; @IsOptional() @IsBoolean() active?: boolean; }
class AssignDto { @IsArray() @ArrayMinSize(1) @ArrayMaxSize(200) @IsString({ each: true }) lotIds!: string[]; }
class UomDto { @IsString() @MinLength(2) name!: string; @IsInt() @Min(2) @Max(10000) factor!: number; @IsOptional() @IsString() barcode?: string; }
class AutoDto { @IsOptional() @IsString() branchId?: string; @IsOptional() @IsInt() @Min(14) @Max(365) days?: number; @IsOptional() @IsInt() @Min(0) @Max(30) safetyDays?: number; @IsOptional() @IsInt() @Min(1) @Max(60) reviewDays?: number; @IsOptional() @IsBoolean() overwrite?: boolean; }
class DamageDto {
  @IsInt() @Min(1) quantity!: number; @IsString() @MinLength(3) reason!: string; @IsOptional() @IsIn(ADJUST_REASONS) reasonCode?: string;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) witness?: ApprovalDto; @IsOptional() @ValidateNested() @Type(() => ApprovalDto) approval?: ApprovalDto;
}

/** Inventory suite: shelf locations, units of measure, movers / dead stock, auto reorder policies, cold-chain overview, movement journal, damage write-off, lot labels. */
@ApiTags("inventory")
@ApiBearerAuth()
@Controller("inventory")
export class InventorySuiteController {
  constructor(
    @Inject(LocationsService) private readonly locations: LocationsService, @Inject(UomService) private readonly uoms: UomService, @Inject(InventoryAnalyticsService) private readonly analytics: InventoryAnalyticsService,
    @Inject(InventoryService) private readonly inv: InventoryService, @Inject(ApprovalService) private readonly approvals: ApprovalService, @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get("locations") @Perm("inventory.read")
  async locList(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.locations.list(u.orgId, await resolveBranchId(this.prisma, u, branchId)); }
  @Post("locations") @Perm("inventory.adjust")
  async locCreate(@CurrentUser() u: AuthUser, @Body() d: LocationDto) { return this.locations.create(u, await resolveBranchId(this.prisma, u, d.branchId), d); }
  @Patch("locations/:id") @Perm("inventory.adjust")
  locUpdate(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: LocationPatchDto) { return this.locations.update(u, id, d); }
  @Get("locations/:id/contents") @Perm("inventory.read")
  locContents(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.locations.contents(u.orgId, id); }
  @Post("locations/:id/assign") @Perm("inventory.adjust")
  locAssign(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: AssignDto) { return this.locations.assign(u, id, d.lotIds); }

  @Get("uoms/:drugId") @Perm("inventory.read")
  uomList(@CurrentUser() u: AuthUser, @Param("drugId") drugId: string) { return this.uoms.list(u.orgId, drugId); }
  @Post("uoms/:drugId") @Perm("catalogue.write")
  uomCreate(@CurrentUser() u: AuthUser, @Param("drugId") drugId: string, @Body() d: UomDto) { return this.uoms.create(u, drugId, d); }
  @Delete("uoms/item/:id") @Perm("catalogue.write")
  uomRemove(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.uoms.remove(u, id); }

  @Get("analytics/movers") @Perm("inventory.read")
  async movers(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; days?: string }) { return this.analytics.movers(u.orgId, await resolveBranchId(this.prisma, u, q.branchId), Math.min(Math.max(Number(q.days ?? 90) || 90, 7), 365)); }
  @Post("analytics/auto-reorder") @Perm("inventory.adjust")
  async autoReorder(@CurrentUser() u: AuthUser, @Body() d: AutoDto) { return this.analytics.autoReorder(u, await resolveBranchId(this.prisma, u, d.branchId), { days: d.days ?? 90, safetyDays: d.safetyDays ?? 3, reviewDays: d.reviewDays ?? 14, overwrite: !!d.overwrite }); }

  @Get("cold-chain/lots") @Perm("inventory.read")
  async cold(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.analytics.coldChain(u.orgId, await resolveBranchId(this.prisma, u, branchId)); }

  @Get("movements") @Perm("inventory.read")
  movements(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; type?: string; reasonCode?: string; from?: string; to?: string; q?: string; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q, 200);
    return this.analytics.movements(u.orgId, { ...branchFilter(u, q.branchId), type: q.type, reasonCode: q.reasonCode, from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, q: q.q, skip, take });
  }

  @Get("lots/labels.html") @Header("Content-Type", "text/html; charset=utf-8") @Perm("inventory.read")
  lotLabels(@CurrentUser() u: AuthUser, @Query("ids") ids: string, @Query("lang") lang?: string) { return this.analytics.lotLabelsHtml(u.orgId, (ids ?? "").split(",").filter(Boolean).slice(0, 100), lang === "en" ? "en" : "ar"); }

  /** Damage / breakage write-off of part of a lot (an ADJUSTMENT with reason code DAMAGE; controlled lots need a witness; going below zero needs manager approval). */
  @Post("lots/:id/damage") @Perm("inventory.adjust")
  async damage(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: DamageDto) {
    const lot = await this.prisma.stockLot.findFirst({ where: { id, orgId: u.orgId } });
    if (!lot) throw notFound("Lot", id);
    const approver = lot.qtyOnHand - d.quantity < 0 ? await this.approvals.approver(u, "inventory.negative_stock", d.approval) : undefined;
    return this.inv.adjust(u, id, -d.quantity, d.reason, approver, d.witness ? await this.approvals.witness(u, d.witness) : undefined, d.reasonCode ?? "DAMAGE");
  }
}
