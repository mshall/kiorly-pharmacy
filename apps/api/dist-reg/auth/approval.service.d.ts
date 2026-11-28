import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "./auth-user";
import type { Permission } from "./permissions";
import { PermissionsService } from "./permissions.service";
export declare class ApprovalDto {
    email: string;
    password: string;
}
export declare class ApprovalService {
    private readonly prisma;
    private readonly perms;
    constructor(prisma: PrismaService, perms: PermissionsService);
    approver(actor: AuthUser, perm: Permission, approval?: ApprovalDto | null): Promise<string>;
    witness(actor: AuthUser, w?: ApprovalDto | null): Promise<{
        id: string;
        name: string;
    }>;
}
