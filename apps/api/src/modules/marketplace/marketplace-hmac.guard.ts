import { CanActivate, ExecutionContext, HttpException, Inject, Injectable } from "@nestjs/common";
import { verifyKiorlyRequest, KIORLY_HEADERS } from "@kiorex/contracts";
import { PrismaService } from "../../prisma/prisma.service";
import { open } from "../../common/secret-box";

/**
 * Kiorex -> Kiorly Pharmacy machine auth (KX-09 §02 request scheme, via @kiorex/contracts verifyKiorlyRequest):
 * X-Kiorly-Client-Key / Timestamp (ms) / Nonce / Signature = HMAC over `ts \n nonce \n METHOD \n path \n sha256(body)`.
 * ADDRESSING (NH-PH-024 resolved, kiorex-contracts 1.4.0): the client key is bound to exactly ONE pharmacy tenant
 * (IntegrationClient.orgId), so the credentials address the organisation; there is no X-Kiorex-Org-Id header. The branch is
 * addressed by id in the path/body. Nonces are single-use within the skew window (replay protection).
 */
@Injectable()
export class MarketplaceHmacGuard implements CanActivate {
  private static readonly nonces = new Map<string, number>();
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<{ headers: Record<string, string>; method: string; originalUrl: string; rawBody?: Buffer; body?: unknown; tenant?: { id: string; marketCode: string }; flagContext?: { orgId: string; market: string } }>();
    const deny = (reason: string, status = 401) => new HttpException({ statusCode: status, code: "HMAC_REJECTED", message: reason }, status);
    const key = req.headers[KIORLY_HEADERS.clientKey.toLowerCase()];
    const client = key ? await this.prisma.integrationClient.findUnique({ where: { key } }) : null;
    if (!client || !client.active) throw deny("unknown client key");
    const v = verifyKiorlyRequest({ headers: req.headers, method: req.method, path: req.originalUrl.split("?")[0]!, body: req.rawBody?.length ? req.rawBody : "", secret: open(client.secretEnc) });
    if (!v.ok) throw deny(v.reason);
    const nonce = req.headers[KIORLY_HEADERS.nonce.toLowerCase()]!;
    const now = Date.now();
    for (const [n, t] of MarketplaceHmacGuard.nonces) if (now - t > 10 * 60_000) MarketplaceHmacGuard.nonces.delete(n);
    const nk = `${client.id}:${nonce}`;
    if (MarketplaceHmacGuard.nonces.has(nk)) throw deny("nonce replay");
    MarketplaceHmacGuard.nonces.set(nk, now);
    const tenant = await this.prisma.tenant.findUnique({ where: { id: client.orgId } });
    if (!tenant) throw deny("unknown organisation", 404);
    req.tenant = { id: tenant.id, marketCode: tenant.marketCode };
    req.flagContext = { orgId: tenant.id, market: tenant.marketCode };
    return true;
  }
}
