import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { ProviderError, providerRequest, type FetchLike } from "./http";
import { providerConfig, type ProviderConfig } from "./provider-env";
import { storageMapping as M } from "./mapping/storage.mapping";
import { safeKey } from "./storage-policy";

/** Port: private object store. Validation (type / size / magic bytes) happens BEFORE it, in storage-policy.ts via StorageAdapter. */
export interface ObjectStore {
  readonly mode: "mock" | "real";
  readonly name: string;
  put(key: string, bytes: Uint8Array, contentType: string): Promise<void>;
  /** null when the object does not exist. */
  get(key: string): Promise<Buffer | null>;
}

/** Local disk under STORAGE_DIR (default ./.data): the mock AND the dev store. Existing files written by the previous adapter keep working (same key sanitising and layout). */
export class LocalObjectStore implements ObjectStore {
  readonly mode = "mock" as const;
  readonly name = "local-disk";
  constructor(private readonly env: Record<string, string | undefined> = process.env) {}
  private path(key: string) { return join(resolve(this.env.STORAGE_DIR ?? join(process.cwd(), ".data")), safeKey(key)); }
  async put(key: string, bytes: Uint8Array, _contentType?: string) { const p = this.path(key); await mkdir(dirname(p), { recursive: true }); await writeFile(p, bytes); }
  async get(key: string) { try { return await readFile(this.path(key)); } catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return null; throw e; } }
}

export class HttpObjectStore implements ObjectStore {
  readonly mode = "real" as const;
  readonly name = "object-gateway";
  constructor(private readonly cfg: ProviderConfig, private readonly fetchImpl?: FetchLike) {}
  async put(key: string, bytes: Uint8Array, contentType: string) {
    await providerRequest(this.cfg, { method: "PUT", path: M.objectPath(safeKey(key)), rawBody: bytes, headers: M.putHeaders(contentType), idempotencyKey: createHash("sha256").update(bytes).digest("hex").slice(0, 32) }, M.authHeaders(this.cfg), this.fetchImpl);
  }
  async get(key: string) {
    try { return Buffer.from((await providerRequest(this.cfg, { method: "GET", path: M.objectPath(safeKey(key)), binary: true }, M.authHeaders(this.cfg), this.fetchImpl)).raw); }
    catch (e) { if (e instanceof ProviderError && e.httpStatus === 404) return null; throw e; }
  }
}

export function objectStore(env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): ObjectStore {
  const cfg = providerConfig("STORAGE", env);
  return cfg.mode === "real" ? new HttpObjectStore(cfg, fetchImpl) : new LocalObjectStore(env);
}
