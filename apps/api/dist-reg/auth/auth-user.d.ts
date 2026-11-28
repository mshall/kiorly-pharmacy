import type { StaffRole } from "../generated/prisma/client";
import type { Permission } from "./permissions";
export interface AuthUser {
    userId: string;
    orgId: string;
    role: StaffRole;
    displayName: string;
    branchId: string | null;
    market: string;
    edition: string;
    pharmacistLicenceNo: string | null;
    mfa: boolean;
}
export declare const hasPerm: (u: AuthUser, p: Permission, roleHas: (r: StaffRole, p: Permission) => boolean) => boolean;
