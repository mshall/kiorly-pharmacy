import { ForbiddenException, Inject, Injectable, Logger, BadRequestException, ServiceUnavailableException } from "@nestjs/common";
import { signKiorlyRequest } from "@kiorex/contracts";
import type { AuthUser } from "../../auth/auth-user";
import { open } from "../../common/secret-box";
import { kiorexMode } from "../../outbox/outbox-delivery.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CommissionRateService, RATE_ROLES } from "./commission-rate.service";
import { normalizeStatement, periodRange, type StatementView } from "./commission-statement";

/**
 * COM-3: the settlement statement of one period, the same figures Kiorex finance sees for this organisation (read only). Kiorex pays providers by bank transfer only and never holds or pays cash; fees are netted at order release.
 * Roles are the ones that already see the commission rate (owner, branch manager, chain operations). With `KIOREX_MODE=real` the statement is fetched from the Kiorex statement API with the partner request HMAC
 * (client key and secret of the organisation's integration client; the organisation is named in `X-Kiorly-Org-Ref`); in mock mode nothing is invented: the answer is 503 `STATEMENT_NOT_CONNECTED`.
 */
@Injectable()
export class CommissionStatementService {
  private readonly log = new Logger(CommissionStatementService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(CommissionRateService) private readonly rates: CommissionRateService) {}

  private need(user: AuthUser) { if (!RATE_ROLES.has(user.role)) throw new ForbiddenException("The commission statement is visible to owners, branch managers and chain operations"); }

  private async target(orgId: string): Promise<{ base: string; secret: string; clientKey: string } | null> {
    const c = await this.prisma.integrationClient.findFirst({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } });
    const secret = c?.webhookSecretEnc ? open(c.webhookSecretEnc) : process.env.KIOREX_WEBHOOK_SECRET;
    const base = (c?.kiorexBaseUrl ?? process.env.KIOREX_API_BASE_URL ?? (process.env.KIOREX_WEBHOOK_URL ? new URL(process.env.KIOREX_WEBHOOK_URL).origin : ""))?.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
    if (!c?.key || !secret || !base) return null;
    return { base, secret, clientKey: c.key };
  }

  private async fetchKiorex(orgId: string, tail: string, r: { from: Date; to: Date }, accept: string): Promise<Response> {
    if (kiorexMode() !== "real") throw new ServiceUnavailableException({ code: "STATEMENT_NOT_CONNECTED", message: "The Kiorex statement is not connected in this environment" });
    const ref = await this.rates.kiorexOrgRef(orgId); const t = await this.target(orgId);
    if (!ref || !t) throw new ServiceUnavailableException({ code: "STATEMENT_NOT_CONNECTED", message: "The Kiorex statement is not connected yet" });
    const url = new URL(`${t.base}/api/v1/admin/commissions/settlement-statement/${encodeURIComponent(ref)}${tail}`);
    url.searchParams.set("from", r.from.toISOString()); url.searchParams.set("to", r.to.toISOString());
    // the signature covers the full path without the query, exactly as the partner endpoints of Kiorex verify it
    const signed = signKiorlyRequest({ clientKey: t.clientKey, clientSecret: t.secret, method: "GET", path: url.pathname, body: "" });
    try {
      const res = await fetch(url, { headers: { ...signed.headers, "x-kiorly-org-ref": ref, accept }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: `Kiorex answered ${res.status}` });
      return res;
    } catch (e) {
      if (e instanceof ServiceUnavailableException) throw e;
      this.log.warn(`statement fetch failed: ${e instanceof Error ? e.message : String(e)}`);
      throw new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "The Kiorex statement could not be reached" });
    }
  }

  async statement(user: AuthUser, period?: string): Promise<StatementView & { period: StatementView["period"] & { key: string } }> {
    this.need(user);
    const r = periodRange(period); if (!r) throw new BadRequestException("period must be YYYY-MM");
    const ref = (await this.rates.kiorexOrgRef(user.orgId)) ?? user.orgId;
    const body = await (await this.fetchKiorex(user.orgId, "", r, "application/json")).json().catch(() => null);
    const v = normalizeStatement(body, { orgRef: ref, from: r.from, to: r.to });
    if (!v) throw new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "Kiorex sent an unreadable statement" });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.viewed", entityType: "KiorexCommissionStatement", entityId: r.key, meta: { by: user.userId } } as never }).catch(() => undefined);
    return { ...v, orgRef: ref, period: { ...v.period, key: r.key } };
  }

  async exportCsv(user: AuthUser, period: string) {
    this.need(user);
    const r = periodRange(period); if (!r) throw new BadRequestException("period must be YYYY-MM");
    const res = await this.fetchKiorex(user.orgId, "/export", r, "text/csv");
    const body = await res.text();
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.exported", entityType: "KiorexCommissionStatement", entityId: r.key, meta: { by: user.userId, rows: Math.max(0, body.split(/\r?\n/).filter(Boolean).length - 1) } } as never }).catch(() => undefined);
    return { filename: `settlement-${r.key}.csv`, body: body.startsWith("﻿") ? body : `﻿${body}` };
  }
}
