import { type FetchLike } from "./http";
import { type ProviderConfig } from "./provider-env";
export interface ObjectStore {
    readonly mode: "mock" | "real";
    readonly name: string;
    put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
    get(key: string): Promise<Buffer | null>;
}
export declare class LocalObjectStore implements ObjectStore {
    private readonly env;
    readonly mode: "mock";
    readonly name = "local-disk";
    constructor(env?: Record<string, string | undefined>);
    private path;
    put(key: string, bytes: Uint8Array, _contentType?: string): Promise<void>;
    get(key: string): Promise<NonSharedBuffer | null>;
}
export declare class HttpObjectStore implements ObjectStore {
    private readonly cfg;
    private readonly fetchImpl?;
    readonly mode: "real";
    readonly name = "object-gateway";
    constructor(cfg: ProviderConfig, fetchImpl?: FetchLike | undefined);
    put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
    get(key: string): Promise<Buffer<ArrayBuffer> | null>;
}
export declare function objectStore(env?: Record<string, string | undefined>, fetchImpl?: FetchLike): ObjectStore;
