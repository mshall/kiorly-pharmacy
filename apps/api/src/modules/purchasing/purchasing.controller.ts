import { Body, Controller, Get, Header, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsIn, IsInt, IsNumberString, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { RequiresEntitlement, RequiresEntitlementGuard } from "../../kernel-adapter/requires-entitlement.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { branchFilter, resolveBranchId } from "../../common/branch-scope";
import { PurchasingService } from "./purchasing.service";
import { RfqService } from "./rfq.service";

class RfqLineDto { @IsString() drugId!: string; @IsInt() @Min(1) qty!: number; }
class RfqDto { @IsOptional() @IsString() branchId?: string; @IsOptional() @IsString() notes?: string; @IsOptional() @IsDateString() dueAt?: string; @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => RfqLineDto) lines!: RfqLineDto[]; @IsArray() @ArrayMinSize(1) @IsString({ each: true }) supplierIds!: string[]; }
class RfqFromSuggDto { @IsOptional() @IsString() branchId?: string; @IsArray() @ArrayMinSize(1) @IsString({ each: true }) supplierIds!: string[]; @IsOptional() @IsDateString() dueAt?: string; }
class QuoteLineDto { @IsString() rfqLineId!: string; @IsNumberString() unitPrice!: string; }
class QuoteDto { @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => QuoteLineDto) lines!: QuoteLineDto[]; @IsOptional() @IsInt() @Min(0) leadTimeDays?: number; @IsOptional() @IsDateString() validUntil?: string; @IsOptional() @IsString() notes?: string; }
class AwardDto { @IsIn(["CHEAPEST_PER_LINE", "SUPPLIER"]) mode!: "CHEAPEST_PER_LINE" | "SUPPLIER"; @IsOptional() @IsString() supplierId?: string; }
class PoLineDto { @IsString() drugId!: string; @IsInt() @Min(1) qtyOrdered!: number; @IsNumberString() unitCost!: string; }
class PoPatchDto { @IsOptional() @IsString() notes?: string; @IsOptional() @IsDateString() expectedAt?: string; @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PoLineDto) lines?: PoLineDto[]; }
class CloseDto { @IsString() @MinLength(3) reason!: string; }

/** Purchasing suite: RFQ, AP aging, supplier statements, cost price variance, supplier returns, PO edit / short-close / print. */
@ApiTags("purchasing")
@ApiBearerAuth()
@Controller("purchasing")
export class PurchasingController {
  constructor(@Inject(PurchasingService) private readonly svc: PurchasingService, @Inject(RfqService) private readonly rfq: RfqService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("aging") @Perm("supplier.read")
  aging(@CurrentUser() u: AuthUser, @Query("asOf") asOf?: string) { return this.svc.aging(u.orgId, asOf ? new Date(asOf) : undefined); }
  @Get("suppliers/:id/statement") @Perm("supplier.read")
  statement(@CurrentUser() u: AuthUser, @Param("id") id: string, @Query() q: { from?: string; to?: string }) { return this.svc.statement(u.orgId, id, { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined }); }
  @Get("cost-variance") @Perm("supplier.read")
  costVariance(@CurrentUser() u: AuthUser, @Query() q: { from?: string; to?: string; minPct?: string; branchId?: string }) { return this.svc.costVariance(u.orgId, { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, minPct: Number(q.minPct ?? 5) || 0, ...branchFilter(u, q.branchId) }); }
  @Get("supplier-returns") @Perm("supplier.read")
  returns(@CurrentUser() u: AuthUser, @Query() q: { supplierId?: string; branchId?: string }) { return this.svc.supplierReturns(u.orgId, { supplierId: q.supplierId, ...branchFilter(u, q.branchId) }); }

  @Patch("purchase-orders/:id") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  poPatch(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: PoPatchDto) { return this.svc.updatePo(u, id, d); }
  @Post("purchase-orders/:id/close") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  poClose(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CloseDto) { return this.svc.closePo(u, id, d.reason); }
  @Get("purchase-orders/:id/print.html") @Header("Content-Type", "text/html; charset=utf-8") @Perm("supplier.read")
  poPrint(@CurrentUser() u: AuthUser, @Param("id") id: string, @Query("lang") lang?: string) { return this.svc.poHtml(u.orgId, id, lang === "en" ? "en" : "ar"); }

  @Get("rfqs") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("supplier.read")
  rfqList(@CurrentUser() u: AuthUser, @Query() q: { status?: string; branchId?: string }) { return this.rfq.list(u.orgId, { status: q.status, ...branchFilter(u, q.branchId) }); }
  @Post("rfqs") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  async rfqCreate(@CurrentUser() u: AuthUser, @Body() d: RfqDto) { return this.rfq.create(u, await resolveBranchId(this.prisma, u, d.branchId), d); }
  @Post("rfqs/from-suggestions") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  async rfqFromSug(@CurrentUser() u: AuthUser, @Body() d: RfqFromSuggDto) { return this.rfq.fromSuggestions(u, await resolveBranchId(this.prisma, u, d.branchId), d.supplierIds, d.dueAt); }
  @Get("rfqs/:id") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("supplier.read")
  rfqGet(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.rfq.get(u.orgId, id); }
  @Post("rfqs/:id/send") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  rfqSend(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.rfq.send(u, id); }
  @Post("rfqs/:id/quotes/:supplierId") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  rfqQuote(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("supplierId") sid: string, @Body() d: QuoteDto) { return this.rfq.recordQuote(u, id, sid, d); }
  @Post("rfqs/:id/quotes/:supplierId/decline") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  rfqDecline(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("supplierId") sid: string) { return this.rfq.decline(u, id, sid); }
  @Post("rfqs/:id/award") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  rfqAward(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: AwardDto) { return this.rfq.award(u, id, d); }
  @Post("rfqs/:id/cancel") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  rfqCancel(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.rfq.cancel(u, id); }
}
