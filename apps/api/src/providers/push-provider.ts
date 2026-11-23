import { ProviderError, providerRequest, type FetchLike } from "./http";
import { providerConfig } from "./provider-env";
import { PushSender, pushConfigFromEnv, pushProblems } from "./vendors/push";

export interface PushMessage { to: string; title: string; body: string; data?: Record<string, unknown>; channelId?: string }

/** Adapts this repo's FetchLike (status + arrayBuffer) to the Response subset PushSender needs. */
const asResponseFetch = (f: FetchLike) => async (url: string, init: RequestInit = {}): Promise<Response> => {
  const r = await f(url, { method: init.method ?? "POST", headers: (init.headers ?? {}) as Record<string, string>, body: init.body as never, signal: init.signal as AbortSignal });
  const text = Buffer.from(await r.arrayBuffer()).toString("utf8");
  return { status: r.status, ok: r.status >= 200 && r.status < 300, text: async () => text } as unknown as Response;
};

/**
 * Push hand-off. PUSH_MODE|MOBILE_PUSH_MODE=mock|real.
 *   real, no PUSH_API_URL : native FCM HTTP v1 (PUSH_FCM_SERVICE_ACCOUNT_JSON) and the Expo push service (PUSH_EXPO_ENABLED / PUSH_EXPO_ACCESS_TOKEN), routed by token shape.
 *   real, PUSH_API_URL    : a custom Expo-compatible gateway (posted to as-is, PUSH_API_KEY optional).
 * Returns how many the provider accepted and the tokens it declared dead (uninstalled / expired) so the caller can revoke them.
 */
export async function sendPush(msgs: PushMessage[], env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): Promise<{ accepted: number; invalid: string[] }> {
  const cfg = providerConfig("PUSH", env);
  if (cfg.mode !== "real") return { accepted: msgs.length, invalid: [] };
  if (!msgs.length) return { accepted: 0, invalid: [] };
  if (cfg.apiUrl) { // custom gateway
    const res = await providerRequest(cfg, { path: "", body: msgs }, cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {}, fetchImpl);
    const tickets: any[] = Array.isArray(res.json?.data) ? res.json.data : [];
    return { accepted: tickets.length ? tickets.filter((t) => t?.status !== "error").length : msgs.length, invalid: [] };
  }
  if (pushProblems(env).length) throw new ProviderError("NOT_CONFIGURED", "push credentials are not set (PUSH_FCM_SERVICE_ACCOUNT_JSON and/or PUSH_EXPO_ENABLED, or PUSH_API_URL)");
  const sender = new PushSender(pushConfigFromEnv(env), fetchImpl ? asResponseFetch(fetchImpl) : fetch);
  let accepted = 0; const invalid: string[] = []; let lastError: string | undefined;
  for (const m of msgs) {
    const r = await sender.send({ token: m.to, title: m.title, body: m.body, data: m.data, channelId: m.channelId });
    if (r.ok) accepted++; else { lastError = r.error; if (r.invalidToken) invalid.push(m.to); }
  }
  if (!accepted && invalid.length < msgs.length) throw new ProviderError("REJECTED", `push provider rejected every message (${lastError ?? "unknown"})`);
  return { accepted, invalid };
}
