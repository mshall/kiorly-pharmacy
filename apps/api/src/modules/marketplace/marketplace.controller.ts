import { Body, Controller, Get, Inject, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsInt, IsNumberString, IsObject, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm, Public } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { RequiresFlag, RequiresFlagGuard } from "../../feature-flags/requires-flag.guard";
import { MarketplaceService } from "./marketplace.service";
import { MarketplaceHmacGuard } from "./marketplace-hmac.guard";
import { resolveBranchId } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";

class SettingDto {
  @IsBoolean() optedIn!: boolean;
  @IsOptional() @IsNumberString() deliveryRadiusKm?: string;
  @IsOptional() @IsObject() openingHours?: Record<string, string[]>;
  @IsOptional() @IsInt() @Min(0) prepMinutes?: number;
  @IsOptional() @IsInt() @Min(1) slaMinutes?: number;
  @IsOptional() @IsNumberString() latitude?: string;
  @IsOptional() @IsNumberString() longitude?: string;
}
class AcceptLineDto { @IsString() lineId!: string; @IsInt() @Min(0) qtyAccepted!: number; }
class AcceptDto { @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AcceptLineDto) lines?: AcceptLineDto[]; }
class RejectDto { @IsString() @MinLength(3) reason!: string; @IsOptional() @IsString() reasonCode?: string; }

/** Staff-facing order inbox (pharmacy.kiorex_orders: OFF => 403 FEATURE_DISABLED; data is never hidden or deleted). */
@ApiTags("kiorex-orders")
@ApiBearerAuth()
@UseGuards(RequiresFlagGuard)
@RequiresFlag("pharmacy.kiorex_orders")
@Controller("kiorex-orders")
export class KiorexOrdersController {
  constructor(@Inject(MarketplaceService) private readonly svc: MarketplaceService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get() @Perm("orders.read")
  inbox(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; status?: string }) { return this.svc.inbox(u.orgId, { branchId: u.branchId ?? q.branchId, status: q.status }); }

  @Get("settings") @Perm("orders.read")
  settings(@CurrentUser() u: AuthUser) { return this.svc.listSettings(u.orgId); }

  @Put("settings/:branchId") @Perm("settings.write")
  put(@CurrentUser() u: AuthUser, @Param("branchId") branchId: string, @Body() d: SettingDto) { return this.svc.putSetting(u, branchId, d); }

  @Get(":id") @Perm("orders.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }

  @Post(":id/accept") @Perm("orders.respond", "dispense.create")
  accept(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: AcceptDto) { return this.svc.accept(u, id, d.lines); }

  @Post(":id/reject") @Perm("orders.respond")
  reject(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RejectDto) { return this.svc.reject(u, id, d.reason, d.reasonCode); }

  @Post(":id/ready") @Perm("orders.respond")
  ready(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.markReady(u, id); }

  @Post("jobs/expire-overdue") @Perm("orders.respond")
  expire(@CurrentUser() u: AuthUser) { return this.svc.expireOverdue(u.orgId); }
}

class IngestLineDto { @IsString() sku!: string; @IsInt() @Min(1) quantity!: number; @IsNumberString() unitPrice!: string; }
class CustomerDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsString() address?: string; }
class PrescriptionDto {
  @IsOptional() @IsString() patientRef?: string;
  @IsOptional() @IsString() prescriberName?: string;
  @IsOptional() @IsString() prescriberLicenceNo?: string;
  @IsOptional() @IsString() issuedAt?: string;
  @IsOptional() @IsString() scanRef?: string;
}
class IngestDto {
  @IsString() @MinLength(1) orderId!: string;
  @IsString() branchId!: string;
  @IsOptional() @ValidateNested() @Type(() => CustomerDto) customer?: CustomerDto;
  @IsOptional() @IsBoolean() prepaid?: boolean;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => IngestLineDto) lines!: IngestLineDto[];
  @IsOptional() @ValidateNested() @Type(() => PrescriptionDto) prescription?: PrescriptionDto;
}

/** Kiorex -> pharmacy machine API at /marketplace/v1 (outside the /api/v1 prefix, like Kiorly's marketplace API). HMAC-authenticated. */
@ApiTags("marketplace-v1")
@Public()
@UseGuards(MarketplaceHmacGuard, RequiresFlagGuard)
@RequiresFlag("pharmacy.kiorex_orders")
@Controller("marketplace/v1")
export class MarketplaceMachineController {
  constructor(@Inject(MarketplaceService) private readonly svc: MarketplaceService) {}

  @Get("availability")
  availability(@Req() req: { tenant: { id: string } }) { return this.svc.availability(req.tenant.id); }

  @Post("orders")
  async order(@Req() req: { tenant: { id: string } }, @Body() d: IngestDto) {
    const r = await this.svc.ingest(req.tenant.id, d);
    return { orderId: r.order.externalOrderId, status: r.order.status, slaDueAt: r.order.slaDueAt, replayed: r.replayed };
  }

  @Post("orders/:orderId/cancel")
  cancel(@Req() req: { tenant: { id: string } }, @Param("orderId") orderId: string) { return this.svc.cancelByKiorex(req.tenant.id, orderId); }
}
