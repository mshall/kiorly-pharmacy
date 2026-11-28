import { PrismaService } from "../prisma/prisma.service";
type HealthReq = {
    headers?: Record<string, string | string[] | undefined>;
    socket?: {
        remoteAddress?: string;
    };
};
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    live(): {
        status: string;
        product: string;
    };
    providers(req: HealthReq): {
        providers: import("../providers/provider-env").ProviderStatus[];
    };
    ready(req: HealthReq): Promise<{
        status: string;
        database: string;
        providers?: undefined;
        leadSigning?: undefined;
    } | {
        status: string;
        database: string;
        providers: import("../providers/provider-env").ProviderStatus[];
        leadSigning: import("../providers/lead-signing-status").LeadSigningStatus;
    }>;
}
export {};
