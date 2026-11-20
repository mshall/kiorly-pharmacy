import { Inject, Injectable } from "@nestjs/common";
import { IsEmail, IsString } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "./auth-user";
import type { Permission } from "./permissions";
import { PermissionsService } from "./permissions.service";
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
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(PermissionsService) private readonly perms: PermissionsService) {}

  async approver(actor: AuthUser, perm: Permission, approval?: ApprovalDto | null): Promise<string> {
    if (!approval) {
      if (await this.perms.has(actor.orgId, actor.role, perm)) return actor.userId;
      throw new DomainError("APPROVAL_REQUIRED", `Manager approval required (${perm})`, 403, { permission: perm });
    }
    const staff = await this.prisma.staffUser.findFirst({ where: { orgId: actor.orgId, email: approval.email.toLowerCase(), active: true } });
    if (!staff || !(await verifyPassword(approval.password, staff.passwordHash)) || !(await this.perms.has(actor.orgId, staff.role, perm))) {
      throw new DomainError("APPROVAL_DENIED", "Approver credentials invalid or lacking permission", 403, { permission: perm });
    }
    return staff.id;
  }

  /**
   * Witness for controlled-substance stock events (adjustment, destruction, count variance, transfer): a SECOND, different active staff member of the
   * same tenant authenticates. Returns the witness staff id + display name (recorded in the controlled register).
   */
  async witness(actor: AuthUser, w?: ApprovalDto | null): Promise<{ id: string; name: string }> {
    if (!w) throw new DomainError("WITNESS_REQUIRED", "A witness (second staff member) must countersign controlled-substance stock changes", 409);
    const staff = await this.prisma.staffUser.findFirst({ where: { orgId: actor.orgId, email: w.email.toLowerCase(), active: true } });
    if (!staff || !(await verifyPassword(w.password, staff.passwordHash))) throw new DomainError("WITNESS_DENIED", "Witness credentials invalid", 403);
    if (staff.id === actor.userId) throw new DomainError("WITNESS_SAME_PERSON", "The witness must be a different person", 409);
    return { id: staff.id, name: staff.displayName };
  }
}
