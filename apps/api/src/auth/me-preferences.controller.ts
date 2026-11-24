import { Body, Controller, Get, HttpCode, Inject, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { DomainError } from "../common/errors";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "./auth-user";
import { CurrentUser } from "./decorators";
import { isValidDismissedBody, sanitizeDismissed } from "./dismissed-cards";

/** Per-user preferences. Dismissed home cards live on the staff row so they follow the person across browsers and devices. */
@ApiTags("me")
@ApiBearerAuth()
@Controller("me/preferences")
export class MePreferencesController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  @Get("dismissed-cards")
  async get(@CurrentUser() u: AuthUser) {
    const r = await this.prisma.staffUser.findFirst({ where: { id: u.userId, orgId: u.orgId }, select: { dismissedCards: true } });
    return { keys: sanitizeDismissed(r?.dismissedCards) };
  }
  @Put("dismissed-cards") @HttpCode(200)
  async put(@CurrentUser() u: AuthUser, @Body() b: unknown) {
    if (!isValidDismissedBody(b)) throw new DomainError("INVALID_REQUEST", "keys must be a list of up to 50 short card keys", 400);
    const keys = sanitizeDismissed(b.keys);
    const r = await this.prisma.staffUser.updateMany({ where: { id: u.userId, orgId: u.orgId }, data: { dismissedCards: keys } });
    if (!r.count) throw new DomainError("NOT_FOUND", "User not found", 404);
    return { keys };
  }
}
