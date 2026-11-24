import { Body, Controller, Get, HttpCode, Inject, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";
import type { AuthUser } from "../../auth/auth-user";
import { CurrentUser, Perm } from "../../auth/decorators";
import { KiorexFrontDoorService } from "./kiorex-front-door.service";

class TalkDto {
  @IsString() @MaxLength(120) contactName!: string; @IsOptional() @IsString() @MaxLength(80) contactRole?: string; @IsOptional() @IsString() @MaxLength(24) phone?: string; @IsOptional() @IsString() @MaxLength(160) email?: string;
  @IsOptional() @IsString() @MaxLength(12) preferredTime?: string; @IsOptional() @IsString() @MaxLength(500) note?: string; @IsBoolean() consent!: boolean;
}

class PauseDto { @IsOptional() @IsString() @MaxLength(200) reason?: string }

/** State-aware front door of the Connect to Kiorex nav item (ADR-040). Owner / admin only (settings.write, like the wizard). */
@ApiTags("kiorex-connect")
@ApiBearerAuth()
@Controller("kiorex-connect/front-door")
export class KiorexFrontDoorController {
  constructor(@Inject(KiorexFrontDoorService) private readonly svc: KiorexFrontDoorService) {}
  @Get() @Perm("settings.write") get(@CurrentUser() u: AuthUser) { return this.svc.get(u.orgId); }
  @Post("interest") @HttpCode(200) @Perm("settings.write") interest(@CurrentUser() u: AuthUser) { return this.svc.interest(u.orgId); }
  @Post("start") @HttpCode(200) @Perm("settings.write") start(@CurrentUser() u: AuthUser) { return this.svc.start(u); }
  @Post("listing/pause") @HttpCode(200) @Perm("settings.write") pause(@CurrentUser() u: AuthUser, @Body() d: PauseDto) { return this.svc.pauseListing(u, d?.reason); }
  @Post("listing/resume") @HttpCode(200) @Perm("settings.write") resume(@CurrentUser() u: AuthUser) { return this.svc.resumeListing(u); }
  @Post("talk") @HttpCode(200) @Perm("settings.write") talk(@CurrentUser() u: AuthUser, @Body() d: TalkDto) { return this.svc.talk(u, d); }
}
