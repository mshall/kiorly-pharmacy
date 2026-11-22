import type { ProviderConfig } from "../provider-env";
import { bearer } from "./generic";

/**
 * Object storage: the ONLY file to adapt for a concrete store. Default = generic HTTP object gateway (same as Kiorly Lab):
 *   PUT {STORAGE_API_URL}/{key}   raw bytes, Content-Type = validated type, Authorization: Bearer STORAGE_API_KEY  ->  2xx
 *   GET {STORAGE_API_URL}/{key}   ->  the bytes (404 = not found)
 * The bucket/container behind the gateway stays PRIVATE: downloads are only ever handed out as short-lived HMAC-signed URLs of OUR API (GET /api/v1/files).
 * An S3-style vendor that needs SigV4 or presigned requests is adapted here (objectPath / authHeaders).
 */
export const storageMapping = {
  objectPath: (key: string) => `/${key.split("/").map(encodeURIComponent).join("/")}`,
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  putHeaders: (contentType: string) => ({ "content-type": contentType }),
};
