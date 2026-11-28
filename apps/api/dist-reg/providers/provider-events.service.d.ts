import { PrismaService } from "../prisma/prisma.service";
import { PayLinksService } from "../modules/pos/paylinks.service";
import { ConsentService } from "../platform/adapters/consent.service";
import { type ProviderKind } from "./provider-env";
export declare class ProviderEventsService {
    private readonly prisma;
    private readonly payLinks;
    private readonly consents;
    private readonly log;
    constructor(prisma: PrismaService, payLinks: PayLinksService, consents: ConsentService);
    ingest(kind: ProviderKind, rawBody: string, signature: string | undefined, ctx?: {
        headers?: Record<string, unknown>;
        query?: Record<string, unknown>;
    }): Promise<{
        accepted: number;
        applied: number;
        duplicates: number;
        unmatched: number;
    }>;
    private apply;
    private applyMessage;
}
