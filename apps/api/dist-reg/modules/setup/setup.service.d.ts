import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { type PlanDto, type SetupSnapshot } from "./setup-plan";
export declare class SetupService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private stored;
    private save;
    snapshot(orgId: string): Promise<SetupSnapshot>;
    get(u: AuthUser): Promise<PlanDto>;
    skip(u: AuthUser, key: string, entityId?: string): Promise<PlanDto>;
    dismiss(u: AuthUser): Promise<PlanDto>;
}
