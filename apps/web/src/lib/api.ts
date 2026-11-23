const BASE = "/api/v1";
const TOKEN_KEY = "kiorly.token";

export const getToken = (): string | null => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t: string | null): void => {
  try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch { /* storage unavailable */ }
};

/** Uniform API error: { statusCode, code, message, details? } (see Docs/openapi.json). */
export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown, public body?: Record<string, unknown>) { super(message); }
  get isNetwork() { return this.status === 0; }
  get featureDisabled() { return this.code === "FEATURE_DISABLED"; }
  get entitlementRequired() { return this.code === "ENTITLEMENT_REQUIRED"; }
}

export async function api<T = unknown>(path: string, init: { method?: string; body?: unknown; query?: Record<string, string | number | boolean | undefined | null>; raw?: boolean } = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`, window.location.origin);
  for (const [k, v] of Object.entries(init.query ?? {})) if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  let res: Response;
  try {
    res = await fetch(url, { method: init.method ?? (init.body !== undefined ? "POST" : "GET"), headers, body: init.body !== undefined ? JSON.stringify(init.body) : undefined });
  } catch {
    throw new ApiError(0, "NETWORK", "Network unavailable");
  }
  if (init.raw) {
    if (!res.ok) throw new ApiError(res.status, "HTTP", res.statusText);
    return res as unknown as T;
  }
  const text = await res.text();
  const data = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  if (!res.ok) {
    if (res.status === 401 && token) { setToken(null); window.dispatchEvent(new CustomEvent("kiorly:unauthorized", { detail: { code: String(data.code ?? "") } })); }
    throw new ApiError(res.status, String(data.code ?? "ERROR"), String(data.message ?? res.statusText), data.details, data);
  }
  return data as T;
}

/** Authenticated download / print of binary or HTML responses (receipts, CSV/PDF reports, labels). */
export async function fetchBlob(path: string, query?: Record<string, string | undefined>): Promise<Blob> {
  const res = await api<Response>(path, { raw: true, query });
  return res.blob();
}

export const newKey = (): string => (crypto.randomUUID ? crypto.randomUUID() : `k-${Date.now()}-${Math.random().toString(36).slice(2)}`);
