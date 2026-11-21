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
 * KIND is one of SMS, EMAIL, WHATSAPP, PAYMENT (and PUSH / STORAGE where the repo has those adapters).
 * Legacy switches still work as the default: MESSAGING_MODE -> SMS/EMAIL/WHATSAPP, PSP_MODE -> PAYMENT.
 * The only per-vendor code lives in `mapping/<kind>.mapping.ts`.
 */
export type ProviderKind = "SMS" | "EMAIL" | "WHATSAPP" | "PAYMENT" | "PUSH" | "STORAGE";
export type ProviderMode = "mock" | "real";
export const PROVIDER_KINDS: ProviderKind[] = ["SMS", "EMAIL", "WHATSAPP", "PAYMENT", "PUSH", "STORAGE"];
/** Kinds whose provider calls us back (HMAC-signed webhooks). */
export const WEBHOOK_KINDS: ProviderKind[] = ["SMS", "EMAIL", "WHATSAPP", "PAYMENT"];

type Env = Record<string, string | undefined>;

const LEGACY_MODE: Record<ProviderKind, string[]> = {
  SMS: ["MESSAGING_MODE"],
  EMAIL: ["MESSAGING_MODE"],
  WHATSAPP: ["MESSAGING_MODE"],
  PAYMENT: ["PSP_MODE"],
  PUSH: ["MOBILE_PUSH_MODE", "PUSH_MODE"],
  STORAGE: [],
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
    apiUrl: clean(env[`${kind}_API_URL`])?.replace(/\/+$/, ""),
    apiKey: clean(env[`${kind}_API_KEY`]) ?? clean(env[`${kind}_API_TOKEN`]),
    webhookSecret: clean(env[`${kind}_WEBHOOK_SECRET`]),
    senderId: SENDER_VAR[kind] ? clean(env[SENDER_VAR[kind]!]) : undefined,
    timeoutMs: int(env[`${kind}_TIMEOUT_MS`], 8000),
    maxRetries: int(env[`${kind}_MAX_RETRIES`], 2),
    backoffMs: int(env[`${kind}_BACKOFF_MS`], 300),
  };
}

/** Secret to verify a webhook of this kind. Mock mode outside production falls back to the (public) simulator secret. */
export function webhookSecretFor(kind: ProviderKind, env: Env = process.env): string | undefined {
  const c = providerConfig(kind, env);
  if (c.webhookSecret) return c.webhookSecret;
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
    need(`${kind}_API_URL`, c.apiUrl);
    if (c.apiUrl) {
      try {
        const u = new URL(c.apiUrl);
        if (!/^https?:$/.test(u.protocol)) problems.push(`${kind}_API_URL must be http(s)`);
        else if (env.NODE_ENV === "production" && u.protocol !== "https:") problems.push(`${kind}_API_URL must be https in production`);
      } catch { problems.push(`${kind}_API_URL is not a valid URL`); }
    }
    if (kind !== "PUSH") need(`${kind}_API_KEY`, c.apiKey);
    if (WEBHOOK_KINDS.includes(kind)) need(`${kind}_WEBHOOK_SECRET`, c.webhookSecret);
    if (SENDER_VAR[kind]) need(SENDER_VAR[kind]!, c.senderId);
  }
  return problems;
}

/** Fail-fast startup check (called from main.ts before the app listens). Throws ProviderConfigError. */
export function assertProviderConfig(env: Env = process.env, kinds?: ProviderKind[]): void {
  const problems = validateProviderConfig(env, kinds);
  if (problems.length) throw new ProviderConfigError(problems);
}

/** Dev-only tools (mock message view, webhook simulator, demo runner). Always off in production; PROVIDER_DEV_TOOLS=false turns them off elsewhere. */
export function devToolsEnabled(env: Env = process.env): boolean {
  return env.NODE_ENV !== "production" && env.PROVIDER_DEV_TOOLS !== "false";
}
