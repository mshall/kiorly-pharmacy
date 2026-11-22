import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength, IsDateString } from "class-validator";
import { CurrentUser, Perm } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { badRequest } from "../common/errors";
import { PrismaService } from "../prisma/prisma.service";
import { CONSENT_PURPOSES, type ConsentPurpose } from "../providers/provider-types";
import { ConsentService } from "./adapters/consent.service";

class GrantDto {
  @IsString() @MinLength(2) @MaxLength(120) subjectRef!: string;
  @IsIn(CONSENT_PURPOSES) purpose!: ConsentPurpose;
  @IsOptional() @IsString() patientId?: string;
  @IsOptional() @IsDateString() expiresAt?: string;
}
class RevokeDto { @IsOptional() @IsString() @MaxLength(200) reason?: string; }

/** Consent capture / query / revoke (CONSENT_MODE=mock|real). Local rows are enforced; the registry is mirrored and calls back on revoke. */
@ApiTags("consents")
@ApiBearerAuth()
@Controller("consents")
export class ConsentController {
  constructor(@Inject(ConsentService) private readonly svc: ConsentService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get() @Perm("customer.read")
  list(@CurrentUser() u: AuthUser, @Query() q: { subjectRef?: string; patientId?: string; purpose?: string; status?: string; limit?: string }) { return this.svc.list(u.orgId, { ...q, limit: q.limit ? Number(q.limit) : undefined }); }

  /** Is there a valid consent for subject + purpose right now (local record, plus the registry's own view in real mode)? */
  @Get("status") @Perm("customer.read")
  status(@CurrentUser() u: AuthUser, @Query("subjectRef") subjectRef: string, @Query("purpose") purpose: string) {
    if (!subjectRef || !ConsentService.isPurpose(purpose)) throw badRequest("BAD_QUERY", `subjectRef and purpose (${CONSENT_PURPOSES.join("|")}) are required`);
    return this.svc.status(u.orgId, subjectRef, purpose);
  }

  @Post() @Perm("customer.write")
  async grant(@CurrentUser() u: AuthUser, @Body() d: GrantDto) {
    if (d.patientId && !(await this.prisma.patientRef.findFirst({ where: { id: d.patientId, orgId: u.orgId }, select: { id: true } }))) throw badRequest("UNKNOWN_PATIENT", "Customer not found");
    return this.svc.grant(u.orgId, { subjectRef: d.subjectRef, patientId: d.patientId, purpose: d.purpose, source: "API", expiresAt: d.expiresAt ? new Date(d.expiresAt) : undefined, actorId: u.userId });
  }

  @Post(":id/revoke") @Perm("customer.write")
  revoke(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RevokeDto) { return this.svc.revoke(u.orgId, id, d.reason, u.userId); }
}
