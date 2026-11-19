import { Body, Controller, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsInt, IsNumberString, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { SuppliersService } from "./suppliers.service";
import { RecallService } from "./recall/recall.service";
import { RequiresEntitlement, RequiresEntitlementGuard } from "../../kernel-adapter/requires-entitlement.guard";
import { PrismaService } from "../../prisma/prisma.service";
import { resolveBranchId } from "../../common/branch-scope";

class SupplierDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() paymentTerms?: string;
  @IsOptional() @IsNumberString() creditLimit?: string;
  @IsOptional() @IsInt() @Min(0) leadTimeDays?: number;
}
class SupplierPatchDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() paymentTerms?: string;
  @IsOptional() @IsNumberString() creditLimit?: string;
  @IsOptional() @IsInt() @Min(0) leadTimeDays?: number;
  @IsOptional() active?: boolean;
}
class PayDto { @IsNumberString() amount!: string; @IsOptional() @IsString() note?: string; @IsOptional() @IsString() idempotencyKey?: string; }
class PoLineDto { @IsString() drugId!: string; @IsInt() @Min(1) qtyOrdered!: number; @IsNumberString() unitCost!: string; }
class PoDto {
  @IsOptional() @IsString() branchId?: string;
  @IsString() supplierId!: string;
  @IsOptional() @IsString() notes?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PoLineDto) lines!: PoLineDto[];
}
class SendDto { @IsIn(["WHATSAPP", "EMAIL"]) via!: "WHATSAPP" | "EMAIL"; }
class SuggestionItemDto { @IsString() drugId!: string; @IsInt() @Min(1) qty!: number; @IsOptional() @IsString() supplierId?: string; }
class FromSuggestionsDto {
  @IsOptional() @IsString() branchId?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => SuggestionItemDto) items!: SuggestionItemDto[];
}
class RecallDto {
  @IsString() drugId!: string;
  @IsArray() @ArrayMinSize(1) @IsString({ each: true }) lotNumbers!: string[];
  @IsString() @MinLength(3) reason!: string;
  @IsOptional() @IsString() source?: string;
}

@ApiTags("suppliers")
@ApiBearerAuth()
@Controller()
export class SuppliersController {
  constructor(@Inject(SuppliersService) private readonly svc: SuppliersService, @Inject(RecallService) private readonly recalls: RecallService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("suppliers") @Perm("supplier.read") list(@CurrentUser() u: AuthUser) { return this.svc.list(u.orgId); }
  @Post("suppliers") @Perm("supplier.write") create(@CurrentUser() u: AuthUser, @Body() d: SupplierDto) { return this.svc.create(u.orgId, d); }
  @Get("suppliers/:id") @Perm("supplier.read") get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }
  @Patch("suppliers/:id") @Perm("supplier.write") update(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: SupplierPatchDto) { return this.svc.update(u.orgId, id, d as Record<string, unknown>); }
  @Get("suppliers/:id/ledger") @Perm("supplier.read") ledger(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.ledger(u.orgId, id); }
  @Post("suppliers/:id/payments") @Perm("supplier.write") pay(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: PayDto) { return this.svc.pay(u, id, d.amount, d.note, d.idempotencyKey); }

  // Purchasing is a Pro+ capability (402 on Lite). Recall + receiving stay available in every edition (safety).
  @Get("purchase-orders") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("supplier.read")
  async pos(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.listPos(u.orgId, u.branchId ?? branchId); }
  @Post("purchase-orders") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  async createPo(@CurrentUser() u: AuthUser, @Body() d: PoDto) { return this.svc.createPo(u, { ...d, branchId: await resolveBranchId(this.prisma, u, d.branchId) }); }
  @Get("purchase-orders/:id") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("supplier.read")
  getPo(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.getPo(u.orgId, id); }
  @Post("purchase-orders/:id/send") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  send(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: SendDto) { return this.svc.sendPo(u, id, d.via); }
  @Post("purchase-orders/:id/cancel") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  cancel(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.cancelPo(u, id); }

  @Get("reorder/suggestions") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("supplier.read")
  async suggestions(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.suggestions(u, await resolveBranchId(this.prisma, u, branchId)); }
  @Post("reorder/create-pos") @UseGuards(RequiresEntitlementGuard) @RequiresEntitlement("purchasing") @Perm("po.write")
  async fromSuggestions(@CurrentUser() u: AuthUser, @Body() d: FromSuggestionsDto) { return this.svc.createPosFromSuggestions(u, await resolveBranchId(this.prisma, u, d.branchId), d.items); }

  // KPSUP03 recalls — every edition, never flag-gated.
  @Get("recalls") @Perm("inventory.read") recallList(@CurrentUser() u: AuthUser) { return this.recalls.list(u.orgId); }
  @Post("recalls") @Perm("recall.manage") recallEnter(@CurrentUser() u: AuthUser, @Body() d: RecallDto) { return this.recalls.enter(u, d); }
  @Post("recalls/:id/lift") @Perm("recall.manage") recallLift(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.recalls.lift(u, id); }
}
