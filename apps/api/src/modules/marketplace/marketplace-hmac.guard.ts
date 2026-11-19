import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { verifyKiorlyRequest, KIORLY_HEADERS } from "@kiorex/contracts";
import { PrismaService } from "../../prisma/prisma.service";

/**
 * Kiorex -> Kiorly Pharmacy machine auth (KX-09 §02 request scheme, via @kiorex/contracts verifyKiorlyRequest):
 * X-Kiorly-Client-Key / Timestamp (ms) / Nonce / Signature = HMAC over `ts \n nonce \n METHOD \n path \n sha256(body)`.
 * Tenant is resolved from X-Kiorex-Org-Id (Tenant.externalOrgId). Nonces are single-use within the skew window (replay protection).
 * NEEDS_HUMAN: the contract does not define how Kiorex addresses a pharmacy tenant; X-Kiorex-Org-Id is our assumption.
 */
@Injectable()
export class MarketplaceHmacGuard implements CanActivate {
  private static readonly nonces = new Map<string, number>();
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string>; method: string; originalUrl: string; rawBody?: Buffer; body?: unknown; tenant?: { id: string; marketCode: string }; flagContext?: { orgId: string; market: string } }>();
    const deny = (reason: string, status = 401) => new HttpException({ statusCode: status, code: "HMAC_REJECTED", message: reason }, status);
    const key = req.headers[KIORLY_HEADERS.clientKey.toLowerCase()];
    const secret = process.env.KIOREX_CLIENT_SECRET ?? "kx_dev_secret_change_me";
    const expectedKey = process.env.KIOREX_CLIENT_KEY ?? "kx_dev_client";
    if (!key || key !== expectedKey) throw deny("unknown client key");
    const v = verifyKiorlyRequest({ headers: req.headers, method: req.method, path: req.originalUrl.split("?")[0]!, body: req.rawBody?.length ? req.rawBody : "", secret });
    if (!v.ok) throw deny(v.reason);
    const nonce = req.headers[KIORLY_HEADERS.nonce.toLowerCase()]!;
    const now = Date.now();
    for (const [n, t] of MarketplaceHmacGuard.nonces) if (now - t > 10 * 60_000) MarketplaceHmacGuard.nonces.delete(n);
    if (MarketplaceHmacGuard.nonces.has(nonce)) throw deny("nonce replay");
    MarketplaceHmacGuard.nonces.set(nonce, now);
    const ext = req.headers["x-kiorex-org-id"];
    if (!ext) throw deny("X-Kiorex-Org-Id required", 400);
    const tenant = await this.prisma.tenant.findUnique({ where: { externalOrgId: ext } });
    if (!tenant) throw deny("unknown organisation", 404);
    req.tenant = { id: tenant.id, marketCode: tenant.marketCode };
    req.flagContext = { orgId: tenant.id, market: tenant.marketCode };
    return true;
  }
}
