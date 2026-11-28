import { ProviderLinksService } from "./provider-links.service";
export declare class LinkRegistryLookupController {
    private readonly links;
    constructor(links: ProviderLinksService);
    one(req: {
        tenant: {
            id: string;
        };
    }, code: string): Promise<import("./link-registry").ReferralLinkRecord>;
    feed(req: {
        tenant: {
            id: string;
        };
    }, updatedSince?: string, limit?: string, cursor?: string): Promise<{
        items: import("./link-registry").ReferralLinkRecord[];
        nextCursor: string | null;
    }>;
}
