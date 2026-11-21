import type { ProviderConfig } from "./provider-env";

export type ProviderErrorCode = "TIMEOUT" | "NETWORK" | "AUTH" | "RATE_LIMITED" | "REJECTED" | "PROVIDER_5XX" | "BAD_RESPONSE" | "NOT_CONFIGURED" | "UNSUPPORTED";

/** Normalised provider failure. `message` never contains credentials or request bodies (they may hold PHI). */
export class ProviderError extends Error {
  constructor(public readonly code: ProviderErrorCode, message: string, public readonly httpStatus?: number, public readonly retryable = false) {
    super(message);
    this.name = "ProviderError";
  }
}

export interface ProviderRequest {
  method?: "POST" | "GET" | "PUT";
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  /** Sent as `Idempotency-Key` and reused verbatim on every retry. */
  idempotencyKey?: string;
  /** Raw body (storage uploads); `body` is JSON-encoded otherwise. */
  rawBody?: Uint8Array;
  /** Response is not JSON (object download). */
  binary?: boolean;
}
export interface ProviderResponse { status: number; json: any; raw: Uint8Array }

export type FetchLike = (url: string, init: { method: string; headers: Record<string, string>; body?: any; signal: AbortSignal }) => Promise<{ status: number; headers: { get(n: string): string | null }; arrayBuffer(): Promise<ArrayBuffer> }>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function mapStatus(status: number): ProviderError | null {
  if (status >= 200 && status < 300) return null;
  if (status === 401 || status === 403) return new ProviderError("AUTH", `provider rejected our credentials (${status})`, status);
  if (status === 408) return new ProviderError("TIMEOUT", "provider timed out (408)", status, true);
  if (status === 429) return new ProviderError("RATE_LIMITED", "provider rate limit (429)", status, true);
  if (status >= 500) return new ProviderError("PROVIDER_5XX", `provider error (${status})`, status, true);
  return new ProviderError("REJECTED", `provider rejected the request (${status})`, status);
}

/**
 * Authenticated JSON call with timeout, bounded retries (network / timeout / 408 / 429 / 5xx) and exponential backoff with jitter.
 * Honours Retry-After (capped at 10 s). Throws ProviderError.
 */
export async function providerRequest(cfg: ProviderConfig, req: ProviderRequest, authHeaders: Record<string, string>, fetchImpl: FetchLike = fetch as unknown as FetchLike): Promise<ProviderResponse> {
  if (!cfg.apiUrl) throw new ProviderError("NOT_CONFIGURED", `${cfg.kind}_API_URL is not set`);
  const url = `${cfg.apiUrl}${req.path.startsWith("/") || req.path === "" ? req.path : `/${req.path}`}`;
  const headers: Record<string, string> = { accept: "application/json", ...(req.rawBody ? {} : { "content-type": "application/json" }), ...authHeaders, ...req.headers };
  if (req.idempotencyKey) headers["idempotency-key"] = req.idempotencyKey;
  const body = req.rawBody ?? (req.body === undefined ? undefined : JSON.stringify(req.body));
  let last: ProviderError = new ProviderError("NETWORK", "no attempt made", undefined, true);
  for (let attempt = 0; attempt <= cfg.maxRetries; attempt++) {
    let retryAfterMs = 0;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), cfg.timeoutMs);
    try {
      const res = await fetchImpl(url, { method: req.method ?? "POST", headers, body, signal: ac.signal });
      const raw = new Uint8Array(await res.arrayBuffer());
      const err = mapStatus(res.status);
      if (err) {
        const ra = Number(res.headers.get("retry-after"));
        if (Number.isFinite(ra) && ra > 0) retryAfterMs = Math.min(ra * 1000, 10_000);
        last = err;
      } else {
        let json: any = null;
        if (!req.rawBody && !req.binary && raw.length && /json/.test(res.headers.get("content-type") ?? "json")) {
          try { json = JSON.parse(Buffer.from(raw).toString("utf8")); } catch { throw new ProviderError("BAD_RESPONSE", "provider returned a non-JSON body", res.status); }
        }
        return { status: res.status, json, raw };
      }
    } catch (e) {
      if (e instanceof ProviderError && !e.retryable) throw e;
      if (e instanceof ProviderError) last = e;
      else last = (e as Error)?.name === "AbortError" ? new ProviderError("TIMEOUT", `provider did not answer within ${cfg.timeoutMs} ms`, undefined, true) : new ProviderError("NETWORK", "provider unreachable", undefined, true);
    } finally {
      clearTimeout(timer);
    }
    if (!last.retryable || attempt === cfg.maxRetries) throw last;
    await sleep(retryAfterMs || cfg.backoffMs * 2 ** attempt * (0.75 + Math.random() * 0.5));
  }
  throw last;
}
