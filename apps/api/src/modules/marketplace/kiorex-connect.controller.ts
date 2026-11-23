import { Body, Controller, Get, HttpCode, Inject, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
import type { AuthUser } from "../../auth/auth-user";
import { CurrentUser, Perm } from "../../auth/decorators";
import { KiorexConnectService } from "./kiorex-connect.service";

class TermsDto { @IsString() version!: string; }
class PayoutDto { @IsString() @MaxLength(60) label!: string; }
class UploadDto { @IsString() @MaxLength(200) name!: string; @IsString() contentBase64!: string; }
class RequestDto { @IsOptional() @IsBoolean() rotate?: boolean; @IsOptional() @IsEmail() contactEmail?: string; }

/** "Connect to Kiorex" for a standalone pharmacy (ADR-040): checklist, terms, licence, payout label placeholder, request registration, rotate credentials. */
@ApiTags("kiorex-connect")
@ApiBearerAuth()
@Controller("kiorex-connect")
export class KiorexConnectController {
  constructor(@Inject(KiorexConnectService) private readonly svc: KiorexConnectService) {}
  @Get() @Perm("settings.read") get(@CurrentUser() u: AuthUser) { return this.svc.get(u.orgId); }
  @Put("terms") @Perm("settings.write") terms(@CurrentUser() u: AuthUser, @Body() d: TermsDto) { return this.svc.acceptTerms(u, d.version); }
  @Put("payout") @Perm("settings.write") payout(@CurrentUser() u: AuthUser, @Body() d: PayoutDto) { return this.svc.setPayout(u, d.label); }
  @Post("licence") @HttpCode(200) @Perm("settings.write") licence(@CurrentUser() u: AuthUser, @Body() d: UploadDto) { return this.svc.uploadLicence(u, d.name, d.contentBase64); }
  @Post("request") @HttpCode(200) @Perm("settings.write") request(@CurrentUser() u: AuthUser, @Body() d: RequestDto) { return this.svc.request(u, d); }
  @Post("refresh") @HttpCode(200) @Perm("settings.read") refresh(@CurrentUser() u: AuthUser) { return this.svc.get(u.orgId); }
}
