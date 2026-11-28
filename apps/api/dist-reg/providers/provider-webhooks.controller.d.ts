import { ProviderEventsService } from "./provider-events.service";
export declare class ProviderWebhooksController {
    private readonly events;
    constructor(events: ProviderEventsService);
    receive(kindParam: string, req: {
        rawBody?: Buffer;
        headers?: Record<string, unknown>;
    }, signature?: string, query?: Record<string, unknown>): Promise<{
        accepted: number;
        applied: number;
        duplicates: number;
        unmatched: number;
    }>;
    handshake(kindParam: string, query: Record<string, unknown>): string;
}
