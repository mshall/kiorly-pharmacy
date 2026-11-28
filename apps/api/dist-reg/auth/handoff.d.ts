export declare const HANDOFF_TTL_MS = 30000;
export declare const HANDOFF_PRODUCT: "pharmacy";
export type HandoffProduct = "clinic" | "pharmacy" | "lab";
export interface HandoffEntry {
    codeHash: string;
    product: HandoffProduct;
    edition: string | null;
    origin: string;
    subjectId: string;
    expiresAt: Date;
}
export interface HandoffStore {
    insert(entry: HandoffEntry): Promise<void>;
    consume(codeHash: string, now: Date): Promise<HandoffEntry | null>;
    purge(before: Date): Promise<void>;
}
export declare class HandoffError extends Error {
    readonly code = "HANDOFF_INVALID";
    constructor();
}
export declare const hashHandoffCode: (code: string) => string;
export declare const newHandoffCode: () => string;
export declare function homeOrigins(env?: Record<string, string | undefined>): string[];
export declare const isHomeOrigin: (origin: string | undefined | null, env?: Record<string, string | undefined>) => boolean;
export declare function webBaseUrl(env?: Record<string, string | undefined>, localDefault?: string): string | null;
export declare class HandoffCodes {
    private readonly store;
    private readonly product;
    private readonly opts;
    constructor(store: HandoffStore, product: HandoffProduct, opts?: {
        now?: () => Date;
        ttlMs?: number;
    });
    private now;
    issue(input: {
        subjectId: string;
        origin: string;
        edition?: string | null;
    }): Promise<{
        code: string;
        expiresInSeconds: number;
    }>;
    redeem(input: {
        code: unknown;
        edition?: string | null;
        expectOrigin?: string;
    }): Promise<{
        subjectId: string;
        origin: string;
        edition: string | null;
    }>;
}
export declare class MemoryHandoffStore implements HandoffStore {
    readonly rows: Map<string, HandoffEntry & {
        usedAt: Date | null;
    }>;
    insert(e: HandoffEntry): Promise<void>;
    consume(codeHash: string, now: Date): Promise<(HandoffEntry & {
        usedAt: Date | null;
    }) | null>;
    purge(before: Date): Promise<void>;
}
