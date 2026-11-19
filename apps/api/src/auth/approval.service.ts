import { Inject, Injectable } from "@nestjs/common";
import { IsEmail, IsString } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "./auth-user";
import { roleHas, type Permission } from "./permissions";
import { verifyPassword } from "./password";
import { DomainError } from "../common/errors";

export class ApprovalDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

/**
 * Manager approval at the till (negative stock, returns/voids, count variances): either the acting user already holds the permission
 * (self-approval) or a second staff member of the SAME tenant with that permission supplies credentials. Returns the approver's id,
 * which is recorded on the movement/return and audited.
 */
@Injectable()
export class ApprovalService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async approver(actor: AuthUser, perm: Permission, approval?: ApprovalDto | null): Promise<string> {
    if (!approval) {
      if (roleHas(actor.role, perm)) return actor.userId;
      throw new DomainError("APPROVAL_REQUIRED", `Manager approval required (${perm})`, 403, { permission: perm });
    }
    const staff = await this.prisma.staffUser.findFirst({ where: { orgId: actor.orgId, email: approval.email.toLowerCase(), active: true } });
    if (!staff || !(await verifyPassword(approval.password, staff.passwordHash)) || !roleHas(staff.role, perm)) {
      throw new DomainError("APPROVAL_DENIED", "Approver credentials invalid or lacking permission", 403, { permission: perm });
    }
    return staff.id;
  }
}
