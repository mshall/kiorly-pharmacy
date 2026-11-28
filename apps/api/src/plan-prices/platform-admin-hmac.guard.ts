import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { verifyKiorlyRequest, KIORLY_HEADERS } from "@kiorex/contracts";
import { timingSafeEqual } from "node:crypto";

/**
 * Kiorex PLATFORM -> product machine auth for the plan price routes (not tenant-bound, unlike the marketplace client). Same request scheme as the marketplace
 * clients (X-Kiorly-Client-Key / Timestamp / Nonce / Signature, `verifyKiorlyRequest`). The single credential pair comes from deployment configuration by
 * reference: KIOREX_PLANS_ADMIN_CLIENT_KEY and KIOREX_PLANS_ADMIN_CLIENT_SECRET (>= 24 chars). Unset or a placeholder: the routes answer 404 (they do not exist).
 * Nonces are single use inside the skew window.
 */
export function readPlansAdminCredential(env: NodeJS.ProcessEnv = process.env): { key: string; secret: string } | null {
  const key = env.KIOREX_PLANS_ADMIN_CLIENT_KEY?.trim(), secret = env.KIOREX_PLANS_ADMIN_CLIENT_SECRET?.trim();
  if (!key || !secret || key.length < 8 || secret.length < 24) return null;
  return { key, secret };
}
const safeEq = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

@Injectable()
export class PlatformAdminHmacGuard implements CanActivate {
  private static readonly nonces = new Map<string, number>();
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string>; method: string; originalUrl: string; rawBody?: Buffer }>();
    const deny = (reason: string, status = 401) => new HttpException({ statusCode: status, code: "HMAC_REJECTED", message: reason }, status);
    const cred = readPlansAdminCredential();
    if (!cred) throw new HttpException({ statusCode: 404, code: "NOT_FOUND", message: "Not found" }, 404);
    const key = req.headers[KIORLY_HEADERS.clientKey.toLowerCase()];
    if (!key || !safeEq(key, cred.key)) throw deny("unknown client key");
    const v = verifyKiorlyRequest({ headers: req.headers, method: req.method, path: req.originalUrl.split("?")[0]!, body: req.rawBody?.length ? req.rawBody : "", secret: cred.secret });
    if (!v.ok) throw deny(v.reason);
    const nonce = req.headers[KIORLY_HEADERS.nonce.toLowerCase()]!;
    const now = Date.now();
    for (const [n, t] of PlatformAdminHmacGuard.nonces) if (now - t > 10 * 60_000) PlatformAdminHmacGuard.nonces.delete(n);
    if (PlatformAdminHmacGuard.nonces.has(nonce)) throw deny("nonce replay");
    PlatformAdminHmacGuard.nonces.set(nonce, now);
    return true;
  }
}
