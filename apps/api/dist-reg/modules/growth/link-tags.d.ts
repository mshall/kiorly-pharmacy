export declare const LINK_TAG_KEYS: readonly ["utm_source", "utm_medium", "utm_campaign", "utm_content", "campaign"];
export type LinkTagKey = (typeof LINK_TAG_KEYS)[number];
export type LinkTags = Partial<Record<LinkTagKey, string>>;
export declare function sanitizeLinkTags(input: unknown): {
    ok: true;
    tags: LinkTags | null;
} | {
    ok: false;
    key: string;
};
export declare function defaultTagsForChannel(channelKind: string): LinkTags;
export declare function effectiveTags(channelKind: string, stored: unknown): LinkTags;
