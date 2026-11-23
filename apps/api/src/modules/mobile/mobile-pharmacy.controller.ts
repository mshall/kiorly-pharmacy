import { Body, Controller, Get, HttpCode, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { PermissionsService } from "../../auth/permissions.service";
import { badRequest } from "../../common/errors";
import { MobilePharmacyService } from "./mobile-pharmacy.service";

class CountersignDto { @IsString() @MinLength(1) discrepancyId!: string; @IsOptional() @IsString() @MaxLength(500) note?: string; }

/** Kiorly pharmacy read models (only what the existing REST API lacks). Everything else the app calls is listed in Docs/MOBILE.md. */
@ApiTags("mobile")
@ApiBearerAuth()
@Controller("mobile/pharmacy")
export class MobilePharmacyController {
  constructor(@Inject(MobilePharmacyService) private readonly svc: MobilePharmacyService, @Inject(PermissionsService) private readonly perms: PermissionsService) {}

  @Get("barcode/:code") @Perm("catalogue.read", "inventory.read")
  barcode(@CurrentUser() u: AuthUser, @Param("code") code: string, @Query("branchId") branchId?: string) { return this.svc.barcode(u, decodeURIComponent(code), branchId); }

  @Get("expiry-lowstock") @Perm("inventory.read")
  expiry(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.expiryLowStock(u, branchId); }

  @Get("shift-summary") @Perm("pos.sell")
  shift(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.shiftSummary(u, branchId); }

  @Get("controlled/pending-witness") @Perm("controlled.read")
  pending(@CurrentUser() u: AuthUser) { return this.svc.pendingWitness(u); }

  @Post("controlled/countersign") @HttpCode(200) @Perm("controlled.manage")
  countersign(@CurrentUser() u: AuthUser, @Body() d: CountersignDto) { return this.svc.countersign(u, d.discrepancyId, d.note); }

  @Get("search")
  async search(@CurrentUser() u: AuthUser, @Query("q") q?: string) {
    if (!q || q.trim().length < 2) throw badRequest("QUERY_TOO_SHORT", "q must be at least 2 characters");
    const p = await this.perms.forRole(u.orgId, u.role);
    return this.svc.search(u, q, { catalogue: p.has("catalogue.read"), customers: p.has("customer.read"), rx: p.has("rx.read") });
  }
}
