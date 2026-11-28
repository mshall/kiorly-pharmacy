import type { StaffRole } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { type Permission } from "./permissions";
export declare class PermissionsService {
    private readonly prisma;
    private readonly cache;
    constructor(prisma: PrismaService);
    private overrides;
    invalidate(orgId: string): void;
    forRole(orgId: string, role: StaffRole): Promise<Set<Permission>>;
    has(orgId: string, role: StaffRole, p: Permission): Promise<boolean>;
}
