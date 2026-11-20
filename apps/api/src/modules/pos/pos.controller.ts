import { Body, Controller, Get, Header, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsIn, IsInt, IsNumberString, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { ApprovalDto } from "../../auth/approval.service";
import { PosService } from "./pos.service";
import { SalesService } from "./sales.service";
import { ShiftsService } from "./shifts.service";
import { CustomersService } from "./customers.service";
import { resolveBranchId, branchFilter } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { pageArgs } from "../../common/pagination";

const METHODS = ["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT", "LOYALTY_POINTS"] as const;
class CartLineDto {
  @IsString() drugId!: string;
  @IsInt() @Min(1) quantity!: number;
  @IsOptional() @IsString() lotId?: string;
  @IsOptional() @IsNumberString() discount?: string;
}
class PaymentDto {
  @IsIn(METHODS) method!: (typeof METHODS)[number];
  @IsNumberString() amount!: string;
  @IsOptional() @IsString() walletRef?: string;
}
class CheckoutDto {
  @IsOptional() @IsString() branchId?: string;
  @IsString() @MinLength(8) idempotencyKey!: string;
  @IsOptional() @IsString() shiftId?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CartLineDto) lines!: CartLineDto[];
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PaymentDto) payments!: PaymentDto[];
  @IsOptional() @IsString() customerAccountId?: string;
  @IsOptional() @IsString() patientId?: string;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) approval?: ApprovalDto;
}
class QuoteDto {
  @IsOptional() @IsString() branchId?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CartLineDto) lines!: CartLineDto[];
}
class SyncSaleDto {
  @IsString() @MinLength(8) idempotencyKey!: string;
  @IsDateString() clientCreatedAt!: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => CartLineDto) lines!: CartLineDto[];
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => PaymentDto) payments!: PaymentDto[];
  @IsOptional() @IsString() customerAccountId?: string;
}
class SyncDto {
  @IsOptional() @IsString() branchId?: string;
  @IsArray() @ArrayMaxSize(500) @ValidateNested({ each: true }) @Type(() => SyncSaleDto) sales!: SyncSaleDto[];
}
class ResolveDto {
  @IsIn(["FORCE", "DISCARD"]) action!: "FORCE" | "DISCARD";
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) approval?: ApprovalDto;
}
class ReturnLineDto { @IsString() saleLineId!: string; @IsInt() @Min(1) quantity!: number; }
class ReturnDto {
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ReturnLineDto) lines!: ReturnLineDto[];
  @IsString() @MinLength(3) reason!: string;
  @IsIn(METHODS.filter((m) => m !== "LOYALTY_POINTS")) refundMethod!: Exclude<(typeof METHODS)[number], "LOYALTY_POINTS">;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) approval?: ApprovalDto;
}
class VoidDto { @IsString() @MinLength(3) reason!: string; @IsOptional() @ValidateNested() @Type(() => ApprovalDto) approval?: ApprovalDto; }
class OpenShiftDto { @IsOptional() @IsString() branchId?: string; @IsNumberString() openingFloat!: string; }
class CloseShiftDto { @IsNumberString() countedCash!: string; }
class CustomerDto { @IsString() @MinLength(2) displayName!: string; @IsOptional() @IsString() phone?: string; @IsNumberString() creditLimit!: string; }
class LimitDto { @IsNumberString() creditLimit!: string; }
class CustPayDto { @IsNumberString() amount!: string; @IsOptional() @IsString() branchId?: string; }

@ApiTags("pos")
@ApiBearerAuth()
@Controller("pos")
export class PosController {
  constructor(
    @Inject(PosService) private readonly pos: PosService,
    @Inject(SalesService) private readonly sales: SalesService,
    @Inject(ShiftsService) private readonly shifts: ShiftsService,
    @Inject(CustomersService) private readonly customers: CustomersService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Get("lookup") @Perm("pos.sell")
  async lookup(@CurrentUser() u: AuthUser, @Query("code") code: string, @Query("branchId") branchId?: string) { return this.pos.lookup(u, await resolveBranchId(this.prisma, u, branchId), code); }

  @Post("cart/quote") @Perm("pos.sell")
  async quote(@CurrentUser() u: AuthUser, @Body() d: QuoteDto) { return this.pos.quote(u, await resolveBranchId(this.prisma, u, d.branchId), d.lines); }

  @Get("offline-bundle") @Perm("pos.sell")
  async bundle(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.pos.offlineBundle(u, await resolveBranchId(this.prisma, u, branchId)); }

  @Post("sales") @Perm("pos.sell")
  async checkout(@CurrentUser() u: AuthUser, @Body() d: CheckoutDto) { return this.sales.checkout(u, { ...d, branchId: await resolveBranchId(this.prisma, u, d.branchId) }); }

  @Get("sales") @Perm("pos.sell")
  list(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; shiftId?: string; page?: string; pageSize?: string }) { const { skip, take } = pageArgs(q); return this.pos.listSales(u.orgId, { ...branchFilter(u, q.branchId), shiftId: q.shiftId, skip, take }); }

  @Get("sales/:id") @Perm("pos.sell")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.pos.getSale(u.orgId, id); }

  @Get("sales/:id/receipt") @Perm("pos.sell")
  receipt(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.pos.receipt(u.orgId, id); }

  @Get("sales/:id/receipt.html") @Header("Content-Type", "text/html; charset=utf-8") @Perm("pos.sell")
  receiptHtml(@CurrentUser() u: AuthUser, @Param("id") id: string, @Query("lang") lang?: string) { return this.pos.receiptHtml(u.orgId, id, lang === "en" ? "en" : "ar"); }

  @Post("sales/:id/returns") @Perm("pos.sell")
  ret(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ReturnDto) { return this.pos.returnItems(u, id, d); }

  @Post("sales/:id/void") @Perm("pos.sell")
  void(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: VoidDto) { return this.pos.voidSale(u, id, d.reason, d.approval); }

  @Post("sync") @Perm("pos.sell")
  async sync(@CurrentUser() u: AuthUser, @Body() d: SyncDto) { return { results: await this.pos.sync(u, await resolveBranchId(this.prisma, u, d.branchId), d.sales) }; }

  @Get("sync/conflicts") @Perm("pos.refund_approve")
  conflicts(@CurrentUser() u: AuthUser) { return this.pos.conflicts(u.orgId); }

  @Post("sync/conflicts/:id/resolve") @Perm("pos.refund_approve")
  resolve(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ResolveDto) { return this.pos.resolveConflict(u, id, d.action, d.approval); }

  // shifts
  @Post("shifts/open") @Perm("pos.shift")
  async open(@CurrentUser() u: AuthUser, @Body() d: OpenShiftDto) { return this.shifts.open(u, await resolveBranchId(this.prisma, u, d.branchId), d.openingFloat); }
  @Get("shifts/current") @Perm("pos.sell")
  async current(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return (await this.shifts.current(u.orgId, await resolveBranchId(this.prisma, u, branchId))) ?? null; }
  @Get("shifts") @Perm("pos.shift")
  shiftList(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.shifts.list(u.orgId, branchFilter(u, branchId).branchId); }
  @Get("shifts/:id/z-report") @Perm("pos.shift")
  z(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.shifts.zReport(u.orgId, id); }
  @Post("shifts/:id/close") @Perm("pos.shift")
  close(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CloseShiftDto) { return this.shifts.close(u, id, d.countedCash); }

  // customers (credit)
  @Get("customers") @Perm("customer.credit")
  custList(@CurrentUser() u: AuthUser, @Query("q") q?: string) { return this.customers.list(u.orgId, q); }
  @Post("customers") @Perm("customer.credit")
  custCreate(@CurrentUser() u: AuthUser, @Body() d: CustomerDto) { return this.customers.create(u, d); }
  @Get("customers/:id") @Perm("customer.credit")
  custGet(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.customers.get(u.orgId, id); }
  @Post("customers/:id/limit") @Perm("pos.refund_approve")
  custLimit(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: LimitDto) { return this.customers.setLimit(u, id, d.creditLimit); }
  @Post("customers/:id/payments") @Perm("customer.credit")
  async custPay(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CustPayDto) { return this.customers.pay(u, id, d.amount, await resolveBranchId(this.prisma, u, d.branchId)); }
}
