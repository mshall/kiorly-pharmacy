import { PrismaService } from "../prisma/prisma.service";
import { PrescriptionsService } from "../modules/prescriptions/prescriptions.service";
import { TenantModeService } from "../tenancy/tenant-mode.service";
export declare class KiorexWebhookController {
    private readonly prisma;
    private readonly rx;
    private readonly mode;
    constructor(prisma: PrismaService, rx: PrescriptionsService, mode: TenantModeService);
    receive(req: {
        rawBody?: Buffer;
        body: Record<string, unknown>;
        flagContext?: {
            orgId?: string;
            market?: string;
        };
    }, h: Record<string, string>): Promise<{
        accepted: boolean;
        ignored: boolean;
        type: string;
        duplicate?: undefined;
    } | {
        accepted: boolean;
        duplicate: boolean;
        ignored?: undefined;
        type?: undefined;
    } | {
        status: "created" | "duplicate";
        prescriptionId: string;
        accepted: boolean;
        ignored?: undefined;
        type?: undefined;
        duplicate?: undefined;
    }>;
}
export declare class WebhooksModule {
}
