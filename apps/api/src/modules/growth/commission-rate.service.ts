import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { effectiveCommissionRate, type CommissionRateHistoryRow, type EffectiveCommissionRate } from "@kiorex/contracts";
import { parseCounselStatus, parseDisclosure, rateParamsOf, rateViewProblems, type RateParams } from "./commission-rate-view";

/** The read-only rate card of one organisation (explicit so the contracts types stay nameable in declaration emit). */
export interface CommissionRateCard {
  known: boolean; product: string | null; state: "SET" | "NOT_SET"; effective: EffectiveCommissionRate; default: EffectiveCommissionRate; override: EffectiveCommissionRate | null; inheriting: boolean;
  upcoming: CommissionRateHistoryRow | null; history: CommissionRateHistoryRow[]; receivedAt: unknown;
  disclosure: { rateDisclosure: { en: string; ar: string }; termsSummary: { en: string; ar: string } } | null; counsel: { status: string } | null; params: RateParams;
}

/** Roles that may see the commission rate (money): owner, branch manager and chain operations. Cashiers, pharmacists and assistants do not. */
export const RATE_ROLES = new Set(["OWNER", "BRANCH_MANAGER", "CHAIN_OPS"]);

/**
 * COM-2: Kiorex reports the pharmacy's commission rate (default for pharmacies, the pharmacy's own rate, history) over the HMAC machine API; staff read it here, read only.
 * No rate is shipped: with nothing reported the answer is "rate not set" (no commission is charged). The effective rate is computed at read time from the history, so a future-dated change takes effect by itself.
 */
@Injectable()
export class CommissionRateService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async ingest(orgId: string, body: unknown) {
    const problems = rateViewProblems(body);
    if (problems.length) throw new BadRequestException({ code: "INVALID_RATE_VIEW", problems });
    const v = body as { orgRef: string; product: string; version: string; history: CommissionRateHistoryRow[]; mode?: string | null };
    // `orgRef` is Kiorex's own reference to this organisation (its partner registration id); the signed client key, not this field, addresses the organisation, so a view is only ever stored for the organisation that signed.
    const have = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId } });
    if (have && have.version >= BigInt(v.version)) return { applied: false };
    // COM-3 (additive, optional): the disclosure texts, the counsel STATUS only (never reviewer, document or conditions) and Kiorex's own reference (needed to read the settlement statement); anything else Kiorex adds is ignored
    const disclosure = parseDisclosure((body as Record<string, unknown>).disclosure); const counsel = parseCounselStatus((body as Record<string, unknown>).counsel);
    const data = { product: v.product, version: BigInt(v.version), view: { history: v.history, mode: v.mode ?? null, orgRef: v.orgRef.slice(0, 64), disclosure, counsel: counsel ? { status: counsel.status } : null } as never };
    if (have) await this.prisma.kiorexCommissionRateView.update({ where: { orgId }, data });
    else await this.prisma.kiorexCommissionRateView.create({ data: { orgId, ...data } });
    await this.prisma.auditLog.create({ data: { orgId, action: "kiorex.commission_rate.received", entityType: "KiorexCommissionRateView", entityId: orgId, meta: { version: v.version, rows: v.history.length } } as never });
    return { applied: true };
  }

  /** Kiorex's own reference to this organisation, as reported with the rate view (the statement is addressed with it). */
  async kiorexOrgRef(orgId: string): Promise<string | null> {
    const row = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId }, select: { view: true } });
    const ref = (row?.view as { orgRef?: unknown } | null)?.orgRef;
    return typeof ref === "string" && ref ? ref : null;
  }

  async rate(user: AuthUser, now = new Date()): Promise<CommissionRateCard> {
    if (!RATE_ROLES.has(user.role)) throw new ForbiddenException("The commission rate is visible to owners, branch managers and chain operations");
    return this.view(user.orgId, now);
  }

  /** The view of one organisation (also embedded in the growth statement). */
  async view(orgId: string, now = new Date()): Promise<CommissionRateCard> {
    const row = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId } });
    const stored = (row?.view ?? null) as { history?: CommissionRateHistoryRow[]; disclosure?: unknown; counsel?: unknown } | null;
    const disclosure = parseDisclosure(stored?.disclosure); const counsel = parseCounselStatus(stored?.counsel);
    const history = (stored?.history ?? []).slice().sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime() || b.version - a.version);
    const effective = effectiveCommissionRate(history, now);
    const defaultOnly = effectiveCommissionRate(history.filter((r) => r.scope === "DEFAULT"), now);
    const upcoming = history.filter((r) => new Date(r.effectiveFrom) > now).sort((a, b) => new Date(a.effectiveFrom).getTime() - new Date(b.effectiveFrom).getTime())[0] ?? null;
    return {
      known: !!row, product: row?.product ?? null, state: effective.state, effective, default: defaultOnly, override: effective.source === "OVERRIDE" ? effective : null, inheriting: effective.source !== "OVERRIDE", upcoming, history, receivedAt: row?.updatedAt ?? null,
      // COM-3: wording blocks only when Kiorex set wording (EN and/or AR); the counsel status chip only; the collection parameters of the rate in force
      disclosure: disclosure && disclosure.wordingSet ? { rateDisclosure: disclosure.rateDisclosure, termsSummary: disclosure.termsSummary } : null,
      counsel: counsel ? { status: counsel.status } : null, params: rateParamsOf(effective.spec),
    };
  }
}
