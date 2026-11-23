import { Body, Controller, Get, HttpCode, Inject, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsIn, IsInt, IsNumberString, IsObject, IsOptional, IsString, Max, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm, Public } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { RequiresFlag, RequiresFlagGuard } from "../../feature-flags/requires-flag.guard";
import { MarketplaceService } from "./marketplace.service";
import { RequiresIntegrationGuard } from "../../tenancy/requires-integration.guard";
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
class ClientDto { @IsOptional() @IsString() kiorexBaseUrl?: string; @IsOptional() @IsString() @MinLength(8) webhookSecret?: string; }
class AcceptLineDto { @IsString() lineId!: string; @IsInt() @Min(0) qtyAccepted!: number; }
class AcceptDto { @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => AcceptLineDto) lines?: AcceptLineDto[]; }
class OutForDeliveryDto { @IsOptional() @IsInt() @Min(1) @Max(1440) estimatedMinutes?: number; }
class RejectDto { @IsString() @MinLength(3) reason!: string; @IsOptional() @IsString() reasonCode?: string; }

/** Staff-facing order inbox (pharmacy.kiorex_orders: OFF => 403 FEATURE_DISABLED; data is never hidden or deleted). */
@ApiTags("kiorex-orders")
@ApiBearerAuth()
@UseGuards(RequiresFlagGuard, RequiresIntegrationGuard)
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

  @Get("integration/clients") @Perm("settings.write")
  clients(@CurrentUser() u: AuthUser) { return this.svc.listClients(u.orgId); }

  @Post("integration/clients") @Perm("settings.write")
  createClient(@CurrentUser() u: AuthUser, @Body() d: ClientDto) { return this.svc.createClient(u, d); }

  @Get(":id") @Perm("orders.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }

  @Post(":id/accept") @Perm("orders.respond", "dispense.create")
  accept(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: AcceptDto) { return this.svc.accept(u, id, d.lines); }

  @Post(":id/reject") @Perm("orders.respond")
  reject(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RejectDto) { return this.svc.reject(u, id, d.reason, d.reasonCode); }

  @Post(":id/ready") @Perm("orders.respond")
  ready(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.markReady(u, id); }

  @Post(":id/out-for-delivery") @Perm("orders.respond")
  outForDelivery(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: OutForDeliveryDto) { return this.svc.markOutForDelivery(u, id, d); }

  @Post("jobs/expire-overdue") @Perm("orders.respond")
  expire(@CurrentUser() u: AuthUser) { return this.svc.expireOverdue(u.orgId); }
}

class IngestLineDto { @IsString() sku!: string; @IsInt() @Min(1) quantity!: number; @IsNumberString() unitPrice!: string; }
class CustomerDto { @IsOptional() @IsString() name?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsString() address?: string; }
class PrescriptionDto {
  @IsOptional() @IsString() patientRef?: string;
  @IsOptional() @IsString() recordRef?: string;
  @IsOptional() @IsString() verificationToken?: string;
  @IsOptional() @IsString() prescriberName?: string;
  @IsOptional() @IsString() prescriberLicenceNo?: string;
  @IsOptional() @IsString() issuedAt?: string;
  @IsOptional() @IsString() scanRef?: string;
}
class DeliveryDto { @IsIn(["PICKUP", "DELIVERY"]) method!: "PICKUP" | "DELIVERY"; @IsOptional() @IsObject() address?: Record<string, unknown>; }
class PaymentDto { @IsOptional() @IsString() reference?: string; @IsOptional() @IsInt() totalMinor?: number; @IsOptional() @IsString() currency?: string; }
class IngestDto {
  @IsString() @MinLength(1) orderId!: string;
  @IsString() branchId!: string;
  @IsOptional() @IsString() patientRef?: string;
  @IsOptional() @ValidateNested() @Type(() => CustomerDto) customer?: CustomerDto;
  @IsOptional() @IsBoolean() prepaid?: boolean;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => IngestLineDto) lines!: IngestLineDto[];
  @IsOptional() @ValidateNested() @Type(() => DeliveryDto) delivery?: DeliveryDto;
  @IsOptional() @ValidateNested() @Type(() => PaymentDto) payment?: PaymentDto;
  @IsOptional() @ValidateNested() @Type(() => PrescriptionDto) prescription?: PrescriptionDto;
}
class QuoteItemDto { @IsString() sku!: string; @IsInt() @Min(1) @Max(50) qty!: number; }
class QuoteDeliveryDto { @IsOptional() @IsString() method?: string; }
class QuoteDto {
  @IsString() pharmacyId!: string;
  @IsArray() @ArrayMinSize(1) @ArrayMaxSize(50) @ValidateNested({ each: true }) @Type(() => QuoteItemDto) items!: QuoteItemDto[];
  @IsOptional() @ValidateNested() @Type(() => QuoteDeliveryDto) delivery?: QuoteDeliveryDto;
}
class RxValidateDto { @IsString() orderId!: string; @IsString() prescriptionRef!: string; @IsString() verificationToken!: string; @IsOptional() @IsString() patientRef?: string; }
class CancelDto { @IsOptional() @IsString() reason?: string; }

/** Kiorex -> pharmacy machine API at /marketplace/v1 (outside the /api/v1 prefix, like Kiorly's marketplace API). HMAC-authenticated; the client key addresses the tenant. Contract: kiorex-contracts openapi/kiorly-pharmacy.v1.openapi.json. */
@ApiTags("marketplace-v1")
@Public()
@UseGuards(MarketplaceHmacGuard, RequiresFlagGuard, RequiresIntegrationGuard)
@RequiresFlag("pharmacy.kiorex_orders")
@Controller("marketplace/v1")
export class MarketplaceMachineController {
  constructor(@Inject(MarketplaceService) private readonly svc: MarketplaceService) {}

  @Get("pharmacies")
  pharmacies(@Req() req: { tenant: { id: string } }) { return this.svc.pharmacies(req.tenant.id); }

  @Get("catalogue")
  catalogue(@Req() req: { tenant: { id: string } }, @Query() q: { q?: string; pharmacyId?: string }) { return this.svc.catalogue(req.tenant.id, { q: q.q, branchId: q.pharmacyId }); }

  @Post("catalogue/quote") @HttpCode(200)
  quote(@Req() req: { tenant: { id: string } }, @Body() d: QuoteDto) { return this.svc.quote(req.tenant.id, d); }

  @Get("availability")
  availability(@Req() req: { tenant: { id: string } }) { return this.svc.availability(req.tenant.id); }

  @Post("orders")
  async order(@Req() req: { tenant: { id: string } }, @Body() d: IngestDto) {
    const r = await this.svc.ingest(req.tenant.id, d);
    return { orderId: r.order.externalOrderId, status: r.order.status, slaDueAt: r.order.slaDueAt, replayed: r.replayed };
  }

  @Post("prescriptions/validate") @HttpCode(200)
  validateRx(@Req() req: { tenant: { id: string } }, @Body() d: RxValidateDto) { return this.svc.validatePrescription(req.tenant.id, d); }

  @Post("orders/:orderId/cancel")
  cancel(@Req() req: { tenant: { id: string } }, @Param("orderId") orderId: string, @Body() _d: CancelDto) { return this.svc.cancelByKiorex(req.tenant.id, orderId); }
}
