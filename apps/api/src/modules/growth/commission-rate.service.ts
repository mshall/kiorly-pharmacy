import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { effectiveRateAt, rateViewProblems, type RateHistoryRow } from "./commission-rate-view";

/** Roles that may see the commission rate (money): owner, branch manager and chain operations. Cashiers, pharmacists and assistants do not. */
const RATE_ROLES = new Set(["OWNER", "BRANCH_MANAGER", "CHAIN_OPS"]);

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
    const v = body as { orgRef: string; product: string; version: string; history: RateHistoryRow[]; mode?: string | null };
    // `orgRef` is Kiorex's own reference to this organisation (its partner registration id); the signed client key, not this field, addresses the organisation, so a view is only ever stored for the organisation that signed.
    const have = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId } });
    if (have && have.version >= BigInt(v.version)) return { applied: false };
    const data = { product: v.product, version: BigInt(v.version), view: { history: v.history, mode: v.mode ?? null } as never };
    if (have) await this.prisma.kiorexCommissionRateView.update({ where: { orgId }, data });
    else await this.prisma.kiorexCommissionRateView.create({ data: { orgId, ...data } });
    await this.prisma.auditLog.create({ data: { orgId, action: "kiorex.commission_rate.received", entityType: "KiorexCommissionRateView", entityId: orgId, meta: { version: v.version, rows: v.history.length } } as never });
    return { applied: true };
  }

  async rate(user: AuthUser, now = new Date()) {
    if (!RATE_ROLES.has(user.role)) throw new ForbiddenException("The commission rate is visible to owners, branch managers and chain operations");
    return this.view(user.orgId, now);
  }

  /** The view of one organisation (also embedded in the growth statement). */
  async view(orgId: string, now = new Date()) {
    const row = await this.prisma.kiorexCommissionRateView.findUnique({ where: { orgId } });
    const history = ((row?.view as { history?: RateHistoryRow[] } | null)?.history ?? []).slice().sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime() || b.version - a.version);
    const effective = effectiveRateAt(history, now);
    const defaultOnly = effectiveRateAt(history.filter((r) => r.scope === "DEFAULT"), now);
    const upcoming = history.filter((r) => new Date(r.effectiveFrom) > now).sort((a, b) => new Date(a.effectiveFrom).getTime() - new Date(b.effectiveFrom).getTime())[0] ?? null;
    return { known: !!row, product: row?.product ?? null, state: effective.state, effective, default: defaultOnly, override: effective.source === "OVERRIDE" ? effective : null, inheriting: effective.source !== "OVERRIDE", upcoming, history, receivedAt: row?.updatedAt ?? null };
  }
}
