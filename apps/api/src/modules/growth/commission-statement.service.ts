import { ForbiddenException, Inject, Injectable, Logger, BadRequestException, ServiceUnavailableException } from "@nestjs/common";
import { signKiorlyRequest } from "@kiorex/contracts";
import { QUERY_SIGNATURE_HEADER, signStatementQuery, statementSigningSecret } from "./commission-statement-signing";
import type { AuthUser } from "../../auth/auth-user";
import { open } from "../../common/secret-box";
import { kiorexMode } from "../../outbox/outbox-delivery.service";
import { PrismaService } from "../../prisma/prisma.service";
import { CommissionRateService, RATE_ROLES } from "./commission-rate.service";
import { normalizeStatement, periodRange, type StatementView } from "./commission-statement";
import { renderStatementHtml } from "./statement-html";

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
    const url = new URL(`${t.base}/api/v1/partner/commissions/settlement-statement${tail}`);
    url.searchParams.set("from", r.from.toISOString()); url.searchParams.set("to", r.to.toISOString());
    // the signature covers the full path without the query, exactly as the partner endpoints of Kiorex verify it
    const secret = statementSigningSecret(t.secret); // per-organisation secret when configured, else the registered one
    const signed = signKiorlyRequest({ clientKey: t.clientKey, clientSecret: secret, method: "GET", path: url.pathname, body: "" });
    // the query string is signed separately with the request's own timestamp and nonce (X-Kiorly-Query-Signature)
    const querySignature = signStatementQuery(secret, { timestamp: signed.timestamp, nonce: signed.nonce, method: "GET", path: url.pathname, query: url.searchParams });
    try {
      const res = await fetch(url, { headers: { ...signed.headers, [QUERY_SIGNATURE_HEADER]: querySignature, "x-kiorly-org-ref": ref, accept }, signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: `Kiorex answered ${res.status}` });
      return res;
    } catch (e) {
      if (e instanceof ServiceUnavailableException) throw e;
      this.log.warn(`statement fetch failed: ${e instanceof Error ? e.message : String(e)}`);
      throw new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "The Kiorex statement could not be reached" });
    }
  }

  /**
   * Marketplace fees netted at order release, from this pharmacy's own settlement ledger (`SettlementEntry`, one row per fulfilled Kiorex order, written by the local kernel).
   * Used only when Kiorex sent no fees figure; null when the ledger has no row in the period (nothing is estimated or invented).
   */
  private async ledgerFeesMinor(orgId: string, r: { from: Date; to: Date }): Promise<number | null> {
    const a = await this.prisma.settlementEntry.aggregate({ where: { orgId, createdAt: { gte: r.from, lt: r.to } }, _sum: { feeAmount: true }, _count: true });
    return a._count > 0 ? Math.round(Number(a._sum.feeAmount?.toString() ?? "0") * 100) : null;
  }

  async statement(user: AuthUser, period?: string): Promise<StatementView & { period: StatementView["period"] & { key: string }; feesSource: "KIOREX" | "PRODUCT_LEDGER" | null }> {
    this.need(user);
    const r = periodRange(period); if (!r) throw new BadRequestException("period must be YYYY-MM");
    const ref = (await this.rates.kiorexOrgRef(user.orgId)) ?? user.orgId;
    const body = await (await this.fetchKiorex(user.orgId, "", r, "application/json")).json().catch(() => null);
    const v = normalizeStatement(body, { orgRef: ref, from: r.from, to: r.to });
    if (!v) throw new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "Kiorex sent an unreadable statement" });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.viewed", entityType: "KiorexCommissionStatement", entityId: r.key, meta: { by: user.userId } } as never }).catch(() => undefined);
    let feesSource: "KIOREX" | "PRODUCT_LEDGER" | null = v.deductions.feesMinor === null ? null : "KIOREX";
    if (v.deductions.feesMinor === null) { const f = await this.ledgerFeesMinor(user.orgId, r); if (f !== null) { v.deductions.feesMinor = f; feesSource = "PRODUCT_LEDGER"; } }
    return { ...v, orgRef: ref, period: { ...v.period, key: r.key }, feesSource };
  }

  /** Printable statement (HTML with print CSS; the browser prints it or saves it as PDF), audited like the CSV export. */
  async printHtml(user: AuthUser, period: string, o: { lang?: string; print?: boolean } = {}): Promise<string> {
    const s = await this.statement(user, period);
    const tenant = await this.prisma.tenant.findUnique({ where: { id: user.orgId }, select: { name: true } });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.printed", entityType: "KiorexCommissionStatement", entityId: s.period.key, meta: { by: user.userId } } as never }).catch(() => undefined);
    return renderStatementHtml({ product: "PHARMACY", lang: o.lang === "en" ? "en" : "ar", periodKey: s.period.key, organisation: tenant?.name ?? s.orgRef, statement: s, autoPrint: o.print });
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
