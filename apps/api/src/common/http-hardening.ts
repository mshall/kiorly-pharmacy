import type { INestApplication } from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";

/**
 * Process-wide HTTP hardening (pentest 2026-11, _docs/security/PENTEST_2026-11_REPORT.md): security headers, no X-Powered-By, trust-proxy hops,
 * OpenAPI UI off in production unless SWAGGER_ENABLED=true, constant-time secret comparison. Pure functions over env so they are unit-testable.
 */
type Env = Record<string, string | undefined>;

export function swaggerEnabled(env: Env = process.env): boolean {
  const v = env.SWAGGER_ENABLED?.trim().toLowerCase();
  if (v === "true") return true;
  if (v === "false") return false;
  return env.NODE_ENV !== "production";
}

/** Number of reverse proxies in front of the API (CloudFront + App Runner = 2). 0 (default): req.ip is the socket peer and X-Forwarded-For is never trusted. */
export function trustedProxyHops(env: Env = process.env): number {
  const n = Number(env.TRUSTED_PROXY_HOPS);
  return Number.isInteger(n) && n >= 0 && n <= 5 ? n : 0;
}

export function securityHeaderMap(env: Env = process.env): Record<string, string> {
  const h: Record<string, string> = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Content-Security-Policy": "frame-ancestors 'none'",
  };
  if (env.NODE_ENV === "production") h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  return h;
}

export function securityHeaders(env: Env = process.env) {
  return (req: { path?: string; url?: string }, res: { setHeader(k: string, v: string): void; removeHeader?(k: string): void }, next: () => void) => {
    const docs = (req.path ?? req.url ?? "").startsWith("/docs"); // the docs UI needs its own scripts
    for (const [k, v] of Object.entries(securityHeaderMap(env))) if (!docs || (k !== "Content-Security-Policy" && k !== "X-Frame-Options")) res.setHeader(k, v);
    res.removeHeader?.("X-Powered-By");
    next();
  };
}

export function applyHttpHardening(app: INestApplication, env: Env = process.env) {
  const http = app.getHttpAdapter().getInstance() as { disable?: (k: string) => void; set?: (k: string, v: unknown) => void; use?: (f: unknown) => void };
  http.disable?.("x-powered-by");
  http.set?.("trust proxy", trustedProxyHops(env));
  http.use?.(securityHeaders(env));
}

/** Constant-time string equality for shared secrets. */
export function secretsEqual(a: string | undefined, b: string | undefined): boolean {
  if (!a || !b) return false;
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
