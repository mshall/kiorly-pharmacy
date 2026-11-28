import { type FetchLike } from "../../providers/http";
import { type DownloadCheck } from "../../providers/storage-policy";
export declare class StorageAdapter {
    static fetchImpl?: FetchLike;
    private store;
    put(key: string, bytes: Uint8Array, contentType: string): Promise<{
        key: string;
        bytes: number;
        contentType: string;
    }>;
    putDataUrl(key: string, dataUrl: string): Promise<{
        key: string;
        bytes: number;
        contentType: string;
    }>;
    get(key: string): Promise<{
        bytes: Buffer;
        contentType: string;
    } | null>;
    signedUrl(key: string, ttlSec?: number): {
        path: string;
        expiresAt: Date;
    };
    verify(key: string | undefined, exp: string | undefined, sig: string | undefined): DownloadCheck;
    private asDomain;
}
