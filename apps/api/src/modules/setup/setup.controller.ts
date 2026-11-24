import { Body, Controller, Get, Inject, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { CurrentUser } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { DomainError } from "../../common/errors";
import { SetupService } from "./setup.service";

class SkipDto {
  @IsIn(["skip", "complete"]) action!: "skip" | "complete";
  @IsOptional() @IsString() @MaxLength(64) entityId?: string;
}

/** Quick-setup checklist (computed from real data; every authenticated staff member can read it, role decides what they can do). */
@ApiTags("setup")
@ApiBearerAuth()
@Controller("setup")
export class SetupController {
  constructor(@Inject(SetupService) private readonly svc: SetupService) {}
  @Get() get(@CurrentUser() u: AuthUser) { return this.svc.get(u); }
  @Patch("steps/:key") step(@CurrentUser() u: AuthUser, @Param("key") key: string, @Body() b: SkipDto) {
    if (b.action === "complete") throw new DomainError("AUTO_STEP", "This step completes automatically when the work is done; it cannot be ticked by hand", 400);
    return this.svc.skip(u, key, b.entityId);
  }
  @Post("dismiss") dismiss(@CurrentUser() u: AuthUser) { return this.svc.dismiss(u); }
}
