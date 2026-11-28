import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
export interface MobileAlert {
    id: string;
    kind: string;
    severity: "CRITICAL" | "HIGH" | "MEDIUM";
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    subject: {
        type: string;
        id: string;
        label: string;
    } | null;
    raisedAt: Date;
    ackedAt: Date | null;
    ackedBy: string | null;
}
export declare class MobileAlertsService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    private derive;
    list(u: AuthUser, status?: "open" | "all"): Promise<{
        items: MobileAlert[];
    }>;
    ack(u: AuthUser, id: string, note?: string): Promise<MobileAlert>;
}
