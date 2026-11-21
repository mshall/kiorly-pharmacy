import { ProviderError, providerRequest, type FetchLike } from "./http";
import { providerConfig } from "./provider-env";

export interface PushMessage { to: string; title: string; body: string; data?: Record<string, unknown> }

/**
 * Push hand-off (Expo-compatible gateway). PUSH_MODE|MOBILE_PUSH_MODE=mock|real, PUSH_API_URL (e.g. https://exp.host/--/api/v2/push/send, posted to as-is),
 * PUSH_API_KEY optional (Expo access token). Returns the number of messages the provider accepted. Throws ProviderError on transport/auth failure.
 */
export async function sendPush(msgs: PushMessage[], env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): Promise<{ accepted: number }> {
  const cfg = providerConfig("PUSH", env);
  if (cfg.mode !== "real") return { accepted: msgs.length };
  if (!cfg.apiUrl) throw new ProviderError("NOT_CONFIGURED", "PUSH_API_URL is not set");
  if (!msgs.length) return { accepted: 0 };
  const res = await providerRequest(cfg, { path: "", body: msgs }, cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {}, fetchImpl);
  const tickets: any[] = Array.isArray(res.json?.data) ? res.json.data : [];
  return { accepted: tickets.length ? tickets.filter((t) => t?.status !== "error").length : msgs.length };
}
