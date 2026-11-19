import type { StaffRole } from "@prisma/client";
import type { Permission } from "./permissions";

export interface AuthUser {
  userId: string;
  orgId: string;
  role: StaffRole;
  displayName: string;
  /** Home branch (null = all branches: OWNER / CHAIN_OPS / unassigned). */
  branchId: string | null;
  market: string;
  edition: string;
  pharmacistLicenceNo: string | null;
  mfa: boolean;
}

export const hasPerm = (u: AuthUser, p: Permission, roleHas: (r: StaffRole, p: Permission) => boolean) => roleHas(u.role, p);
