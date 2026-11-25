import { Body, Controller, Get, Inject, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Matches, Max, Min } from "class-validator";
import { CurrentUser, Perm } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { SubscriptionService } from "./subscription.service";

class AutoRenewDto { @IsBoolean() enabled!: boolean; @IsOptional() @IsBoolean() confirmDowngrade?: boolean; }
class ReactivateDto { @IsOptional() @IsIn(["PRO", "CHAIN", "ENTERPRISE"]) edition?: "PRO" | "CHAIN" | "ENTERPRISE"; @IsOptional() @IsIn(["MONTHLY", "ANNUAL"]) interval?: "MONTHLY" | "ANNUAL"; }
/** A provider token reference and the last four digits. A full card number is never accepted (hosted PSP session; mock until go-live). */
class PaymentMethodDto {
  @IsString() @Matches(/^[A-Za-z0-9_\-]{6,80}$/) tokenRef!: string;
  @IsOptional() @IsString() brand?: string;
  @Matches(/^\d{4}$/) last4!: string;
  @IsOptional() @IsInt() @Min(1) @Max(12) expMonth?: number;
  @IsOptional() @IsInt() @Min(2024) @Max(2100) expYear?: number;
}

@ApiTags("subscription")
@ApiBearerAuth()
@Controller("subscription")
export class SubscriptionController {
  constructor(@Inject(SubscriptionService) private readonly svc: SubscriptionService) {}

  @Get() @Perm("settings.read") state(@CurrentUser() u: AuthUser) { return this.svc.state(u); }
  @Get("plans") @Perm("settings.read") plans(@CurrentUser() u: AuthUser) { return this.svc.compare(u); }
  @Get("downgrade-impact") @Perm("settings.read") impact(@CurrentUser() u: AuthUser, @Query("edition") e?: string) { return this.svc.impact(u.orgId, e === "PRO" || e === "CHAIN" ? e : undefined); }
  @Get("invoices") @Perm("settings.read") invoices(@CurrentUser() u: AuthUser) { return this.svc.listInvoices(u.orgId); }
  @Get("notices") @Perm("settings.read") notices(@CurrentUser() u: AuthUser) { return this.svc.listNotices(u.orgId); }
  @Post("auto-renew") @Perm("settings.write") autoRenew(@CurrentUser() u: AuthUser, @Body() b: AutoRenewDto) { return this.svc.setAutoRenew(u, b); }
  @Post("reactivate") @Perm("settings.write") reactivate(@CurrentUser() u: AuthUser, @Body() b: ReactivateDto) { return this.svc.reactivate(u, b); }
  @Put("payment-method") @Perm("settings.write") paymentMethod(@CurrentUser() u: AuthUser, @Body() b: PaymentMethodDto) { return this.svc.setPaymentMethod(u, b); }
}
