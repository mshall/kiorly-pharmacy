import { Injectable } from "@nestjs/common";
import { ProviderError, type FetchLike } from "../../providers/http";
import { objectStore } from "../../providers/storage-provider";
import { ALLOWED_TYPES, parseDataUrl, safeKey, signDownload, sniffType, validateUpload, verifyDownload, type DownloadCheck } from "../../providers/storage-policy";
import { DomainError } from "../../common/errors";

/**
 * Object storage port (Rx scans, attachments, exports). STORAGE_MODE=mock|real (default mock = local disk under STORAGE_DIR); real = generic HTTP PUT/GET
 * {STORAGE_API_URL}/{key} with STORAGE_API_KEY (src/providers/mapping/storage.mapping.ts). Every upload is validated (allowed content type, STORAGE_MAX_BYTES (5 MB),
 * magic bytes must match). Objects are never public: callers hand out `signedUrl()` (HMAC, expiring, default 300 s) served by GET /api/v1/files.
 */
@Injectable()
export class StorageAdapter {
  /** Test seam for the real HTTP store. */
  static fetchImpl?: FetchLike;
  private store() { return objectStore(process.env, StorageAdapter.fetchImpl); }

  /** Stores validated bytes under `key` (+ extension of the type). Returns the final key to persist. */
  async put(key: string, bytes: Uint8Array, contentType: string): Promise<{ key: string; bytes: number; contentType: string }> {
    const base = safeKey(key);
    let type: string;
    try { type = validateUpload(bytes, contentType); } catch (e) { throw this.asDomain(e); }
    const finalKey = /\.[a-z0-9]{2,5}$/.test(base) ? base : `${base}.${ALLOWED_TYPES[type]}`;
    try { await this.store().put(finalKey, bytes, type); } catch (e) { throw this.asDomain(e); }
    return { key: finalKey, bytes: bytes.length, contentType: type };
  }

  async putDataUrl(key: string, dataUrl: string): Promise<{ key: string; bytes: number; contentType: string }> {
    try { const p = parseDataUrl(dataUrl); return this.put(key, p.bytes, p.contentType); } catch (e) { throw this.asDomain(e); }
  }

  /** Bytes + sniffed content type (works for legacy keys without extension), or null when missing. */
  async get(key: string): Promise<{ bytes: Buffer; contentType: string } | null> {
    let b: Buffer | null;
    try { b = await this.store().get(key); } catch (e) { throw this.asDomain(e); }
    if (!b) return null;
    const ext = /\.(csv|json)$/.exec(key)?.[1];
    return { bytes: b, contentType: sniffType(b) ?? (ext === "csv" ? "text/csv" : ext === "json" ? "application/json" : "application/octet-stream") };
  }

  /** Short-lived signed path (relative to the API host, `/api/v1/files?...`). Authorise the caller for `key` BEFORE calling this. */
  signedUrl(key: string, ttlSec?: number) { try { return signDownload(key, ttlSec); } catch (e) { throw this.asDomain(e); } }
  verify(key: string | undefined, exp: string | undefined, sig: string | undefined): DownloadCheck { return verifyDownload(key, exp, sig); }

  private asDomain(e: unknown): Error {
    if (e instanceof DomainError) return e;
    if (e instanceof ProviderError) return new DomainError("STORAGE_UNAVAILABLE", `Object storage failed (${e.code})`, 503, { code: e.code });
    if (e && typeof e === "object" && (e as { name?: string }).name === "StorageValidationError") {
      const v = e as { code: string; message: string };
      return new DomainError(v.code === "FILE_TOO_LARGE" ? "FILE_TOO_LARGE" : "INVALID_FILE", v.message, v.code === "FILE_TOO_LARGE" ? 413 : 400, { reason: v.code });
    }
    return e as Error;
  }
}
