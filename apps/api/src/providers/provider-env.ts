/**
 * Provider configuration: ONE env contract shared by Kiorly Clinic, Pharmacy and Lab.
 *
 *   <KIND>_MODE=mock|real       (default mock)
 *   <KIND>_API_URL              base URL of the provider (or of the thin gateway in front of it)
 *   <KIND>_API_KEY              bearer credential (never logged)
 *   <KIND>_WEBHOOK_SECRET       HMAC secret used to verify the provider's callbacks (delivery receipts / payment status)
 *   SMS_SENDER_ID, EMAIL_FROM, WHATSAPP_SENDER_ID   sender identities
 *   <KIND>_TIMEOUT_MS / _MAX_RETRIES / _BACKOFF_MS  optional tuning
 *
 * KIND is one of SMS, EMAIL, WHATSAPP, PAYMENT, PUSH, STORAGE, CONSENT, AI. Extras: AI_MODEL (required for AI real), AI_MAX_INPUT_TOKENS / AI_MAX_OUTPUT_TOKENS / AI_DAILY_TOKEN_BUDGET,
 *   STORAGE_DIR (mock local root), STORAGE_SIGNING_SECRET (download-URL HMAC; defaults to a key derived from STORAGE_API_KEY), STORAGE_MAX_BYTES, STORAGE_URL_TTL_SEC.
 * Legacy switches still work as the default: MESSAGING_MODE -> SMS/EMAIL/WHATSAPP, PSP_MODE -> PAYMENT.
 * The only per-vendor code lives in `mapping/<kind>.mapping.ts`.
 */
import { derivedWebhookSecret, vendorApiUrl, vendorOf, vendorProblems } from "./vendor-kit";
import { pushProblems } from "./vendors/push";

export type ProviderKind = "SMS" | "EMAIL" | "WHATSAPP" | "PAYMENT" | "PUSH" | "STORAGE" | "CONSENT" | "AI";
export type ProviderMode = "mock" | "real";
export const PROVIDER_KINDS: ProviderKind[] = ["SMS", "EMAIL", "WHATSAPP", "PAYMENT", "PUSH", "STORAGE", "CONSENT", "AI"];
/** Kinds whose provider calls us back (HMAC-signed webhooks). */
export const WEBHOOK_KINDS: ProviderKind[] = ["SMS", "EMAIL", "WHATSAPP", "PAYMENT", "CONSENT"];
/** Kinds that need no HMAC secret in real mode (outbound only). */

type Env = Record<string, string | undefined>;

const LEGACY_MODE: Record<ProviderKind, string[]> = {
  SMS: ["MESSAGING_MODE"],
  EMAIL: ["MESSAGING_MODE"],
  WHATSAPP: ["MESSAGING_MODE"],
  PAYMENT: ["PSP_MODE"],
  PUSH: ["MOBILE_PUSH_MODE", "PUSH_MODE"],
  STORAGE: [],
  CONSENT: [],
  AI: [],
};
const SENDER_VAR: Partial<Record<ProviderKind, string>> = { SMS: "SMS_SENDER_ID", EMAIL: "EMAIL_FROM", WHATSAPP: "WHATSAPP_SENDER_ID" };
/** Secret used ONLY for the dev webhook simulator in mock mode outside production. Not a credential. */
export const MOCK_WEBHOOK_SECRET = "mock-webhook-secret-not-a-credential";

export interface ProviderConfig {
  kind: ProviderKind;
  mode: ProviderMode;
  apiUrl?: string;
  apiKey?: string;
  webhookSecret?: string;
  senderId?: string;
  /** AI only. */
  model?: string;
  timeoutMs: number;
  maxRetries: number;
  backoffMs: number;
}

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);
const int = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) && Number(v) >= 0 ? Math.floor(Number(v)) : d);

export function providerMode(kind: ProviderKind, env: Env = process.env): ProviderMode {
  for (const name of [`${kind}_MODE`, ...LEGACY_MODE[kind]]) {
    const v = clean(env[name]);
    if (v) return v === "real" ? "real" : "mock";
  }
  return "mock";
}

export function providerConfig(kind: ProviderKind, env: Env = process.env): ProviderConfig {
  return {
    kind,
    mode: providerMode(kind, env),
    apiUrl: vendorApiUrl(kind, env),
    apiKey: clean(env[`${kind}_API_KEY`]) ?? clean(env[`${kind}_API_TOKEN`]),
    webhookSecret: clean(env[`${kind}_WEBHOOK_SECRET`]),
    senderId: SENDER_VAR[kind] ? clean(env[SENDER_VAR[kind]!]) : undefined,
    model: kind === "AI" ? clean(env.AI_MODEL) : undefined,
    timeoutMs: int(env[`${kind}_TIMEOUT_MS`], 8000),
    maxRetries: int(env[`${kind}_MAX_RETRIES`], 2),
    backoffMs: int(env[`${kind}_BACKOFF_MS`], 300),
  };
}

/** Secret to verify a webhook of this kind. Mock mode outside production falls back to the (public) simulator secret. */
export function webhookSecretFor(kind: ProviderKind, env: Env = process.env): string | undefined {
  const c = providerConfig(kind, env);
  if (c.webhookSecret) return c.webhookSecret;
  if (c.mode === "real") { const d = derivedWebhookSecret(kind, env); if (d) return d; }
  return c.mode === "mock" && env.NODE_ENV !== "production" ? MOCK_WEBHOOK_SECRET : undefined;
}

export class ProviderConfigError extends Error {
  constructor(public readonly problems: string[]) {
    super(`Provider configuration invalid (MODE=real needs credentials):\n - ${problems.join("\n - ")}`);
    this.name = "ProviderConfigError";
  }
}

/** Names only, never values. Empty array = OK. */
export function validateProviderConfig(env: Env = process.env, kinds: ProviderKind[] = PROVIDER_KINDS): string[] {
  const problems: string[] = [];
  for (const kind of kinds) {
    const c = providerConfig(kind, env);
    if (c.mode !== "real") continue;
    const need = (name: string, v: string | undefined) => { if (!v) problems.push(`${kind}_MODE=real but ${name} is not set`); };
    if (kind === "PUSH" && !c.apiUrl) { problems.push(...pushProblems(env).map((p) => p.replace("PUSH_MODE=real needs", "PUSH_MODE=real (or MOBILE_PUSH_MODE) needs"))); continue; } // FCM v1 / Expo from PUSH_* credentials; PUSH_API_URL only for a custom gateway
    need(`${kind}_API_URL`, c.apiUrl); // native vendors have a default base (Meta / Twilio / Paymob / Fawry); SES needs its regional URL
    if (c.apiUrl) {
      try {
        const u = new URL(c.apiUrl);
        if (!/^https?:$/.test(u.protocol)) problems.push(`${kind}_API_URL must be http(s)`);
        else if (env.NODE_ENV === "production" && u.protocol !== "https:") problems.push(`${kind}_API_URL must be https in production`);
      } catch { problems.push(`${kind}_API_URL is not a valid URL`); }
    }
    if (kind !== "PUSH") need(`${kind}_API_KEY`, c.apiKey);
    if (kind === "AI") need("AI_MODEL", c.model);
    if (WEBHOOK_KINDS.includes(kind) && !derivedWebhookSecret(kind, env)) need(`${kind}_WEBHOOK_SECRET`, c.webhookSecret);
    if (SENDER_VAR[kind]) need(SENDER_VAR[kind]!, c.senderId);
    problems.push(...vendorProblems(kind, env));
  }
  return problems;
}

/** Fail-fast startup check (called from main.ts before the app listens). Throws ProviderConfigError. */
export function assertProviderConfig(env: Env = process.env, kinds?: ProviderKind[]): void {
  const problems = validateProviderConfig(env, kinds);
  if (problems.length) throw new ProviderConfigError(problems);
}

export interface ProviderStatus { provider: string; mode: ProviderMode; vendor: string; ready: boolean }
/** Active mode of every provider for /health: mode, vendor in use and whether the required variables for that mode are present. Never a secret or value. */
export function providerStatus(env: Env = process.env, kinds: ProviderKind[] = PROVIDER_KINDS): ProviderStatus[] {
  return kinds.map((kind) => {
    const c = providerConfig(kind, env);
    const vendor = c.mode === "real" ? (vendorOf(kind, env) ?? (kind === "PUSH" && !c.apiUrl ? "fcm+expo" : "gateway")) : "mock";
    return { provider: kind.toLowerCase(), mode: c.mode, vendor, ready: c.mode === "mock" || validateProviderConfig(env, [kind]).length === 0 };
  });
}

/** Dev-only tools (mock message view, webhook simulator, demo runner). Always off in production; PROVIDER_DEV_TOOLS=false turns them off elsewhere. */
export function devToolsEnabled(env: Env = process.env): boolean {
  return env.NODE_ENV !== "production" && env.PROVIDER_DEV_TOOLS !== "false";
}
