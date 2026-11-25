import { Inject, Injectable, Logger } from "@nestjs/common";
import { Prisma, type Edition } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { DomainError, forbidden } from "../common/errors";
import { KERNEL, type PlansPort } from "../kernel-adapter/ports";
import type { AuthUser } from "../auth/auth-user";
import { BILLING_CHARGE, type BillingChargePort } from "./billing.port";
import {
  computeDowngradeImpact, decidePeriodEnd, effectiveAutoRenew, isFree, liteGraceActive, loadPolicy, nextOutsideQuietHours, reminderOffsetsDue,
  type PlanShape, type SubscriptionPolicy,
} from "./subscription-policy";

const DAY = 86_400_000;
const addPeriod = (d: Date, interval: string) => { const e = new Date(d); if (interval === "ANNUAL") e.setUTCFullYear(e.getUTCFullYear() + 1); else e.setUTCMonth(e.getUTCMonth() + 1); return e; };
const EDITION_ORDER: Edition[] = ["LITE", "PRO", "CHAIN", "ENTERPRISE"];

export type NoticeKind = "renewal_reminder" | "renewal_off_reminder" | "payment_method_missing" | "payment_failed" | "downgrade_warning" | "downgraded_to_lite" | "auto_renew_on" | "auto_renew_off" | "reactivated";

@Injectable()
export class SubscriptionService {
  private readonly log = new Logger(SubscriptionService.name);
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(KERNEL.plans) private readonly plans: PlansPort,
    @Inject(BILLING_CHARGE) private readonly billing: BillingChargePort,
  ) {}

  policy(): SubscriptionPolicy { return loadPolicy(); }
  private shape(e: Edition): PlanShape { const p = this.plans.getPlan(e); return { edition: p.edition, maxUsers: p.maxUsers, maxBranches: p.maxBranches, capabilities: [...p.capabilities, ...p.addOns.map((a) => `${a} (add-on)`)] }; }
  private assertManager(u: AuthUser) { if (u.role !== "OWNER") throw forbidden("OWNER_ONLY", "Only the pharmacy owner can change the subscription"); }

  /** Lazily creates the subscription row for a tenant that predates SUB-01 (period starts now, auto-renew per the platform default). */
  async ensure(orgId: string) {
    const existing = await this.prisma.orgSubscription.findUnique({ where: { orgId } });
    if (existing) return existing;
    const now = new Date();
    try {
      return await this.prisma.orgSubscription.create({ data: { orgId, autoRenew: this.policy().autoRenewDefault, currentPeriodStart: now, currentPeriodEnd: addPeriod(now, "MONTHLY") } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return this.prisma.orgSubscription.findUniqueOrThrow({ where: { orgId } });
      throw e;
    }
  }

  private async event(db: Prisma.TransactionClient | PrismaService, orgId: string, type: string, from: object | null, to: object, actorId: string | null) {
    await db.subscriptionEvent.create({ data: { orgId, type, fromJson: (from ?? undefined) as Prisma.InputJsonValue | undefined, toJson: to as Prisma.InputJsonValue, actorId } });
    await this.audit.record({ orgId, actorId, action: `subscription.${type}`, entityType: "OrgSubscription", entityId: orgId, meta: { type } as Prisma.InputJsonValue }, db as never);
  }

  async notify(orgId: string, kind: NoticeKind, payload: Record<string, unknown>, dedupeKey: string, notBefore = new Date()) {
    try { await this.prisma.subscriptionNotice.create({ data: { orgId, kind, payload: payload as Prisma.InputJsonValue, dedupeKey, notBefore } }); }
    catch (e) { if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e; }
  }

  async usage(orgId: string) {
    const [users, branches] = await Promise.all([this.prisma.staffUser.count({ where: { orgId, active: true } }), this.prisma.branch.count({ where: { orgId } })]);
    return { users, branches };
  }

  async impact(orgId: string, to?: Edition) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    const policy = this.policy();
    return computeDowngradeImpact(this.shape(t.edition), this.shape(to ?? "LITE"), await this.usage(orgId), policy.liteReadOnlyGraceDays);
  }

  async priceFor(edition: Edition, marketCode: string, interval: string) {
    const now = new Date();
    return this.prisma.planPrice.findFirst({ where: { edition, marketCode, interval, validFrom: { lte: now }, OR: [{ validTo: null }, { validTo: { gt: now } }] }, orderBy: { validFrom: "desc" } });
  }

  async state(u: AuthUser) {
    const sub = await this.ensure(u.orgId);
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const policy = this.policy();
    const onFree = isFree(t.edition);
    const eff = effectiveAutoRenew(sub);
    const now = new Date();
    return {
      isOwner: u.role === "OWNER", edition: t.edition, status: sub.status, onFreePlan: onFree, autoRenew: onFree ? false : eff, autoRenewForced: sub.autoRenewForced as "ON" | "OFF" | null,
      canChangeAutoRenew: !onFree && !sub.autoRenewForced && (policy.orgMayDisableAutoRenew || !eff) && u.role === "OWNER",
      willDowngradeAtPeriodEnd: !onFree && !eff, currentPeriodEnd: sub.currentPeriodEnd.toISOString(),
      renewsOn: !onFree && eff ? sub.currentPeriodEnd.toISOString() : null, endsOn: !onFree && !eff ? sub.currentPeriodEnd.toISOString() : null,
      paymentMethod: sub.paymentLast4 ? { brand: sub.paymentBrand, last4: sub.paymentLast4, expMonth: sub.paymentExpMonth, expYear: sub.paymentExpYear } : null,
      downgradedToLiteAt: sub.downgradedToLiteAt?.toISOString() ?? null, downgradeReason: sub.downgradeReason,
      liteReadOnlyGraceUntil: liteGraceActive(sub, now) ? sub.liteReadOnlyGraceUntil!.toISOString() : null,
      previousEdition: sub.previousEdition, canReactivate: onFree && sub.previousEdition != null,
      downgradeImpact: onFree ? null : await this.impact(u.orgId),
      policy: { downgradeAfterDays: policy.downgradeAfterDays, renewalReminderDaysBefore: policy.renewalReminderDaysBefore, liteReadOnlyGraceDays: policy.liteReadOnlyGraceDays, retryDays: policy.retryDays },
    };
  }

  /** Plan comparison. Every value comes from the kernel plan definitions and PlanPrice; a missing price is `price: null` (NEEDS_HUMAN), never invented. */
  async compare(u: AuthUser) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const usage = await this.usage(u.orgId);
    const cur = EDITION_ORDER.indexOf(t.edition);
    const policy = this.policy();
    const defs = this.plans.listPlans().sort((a, b) => EDITION_ORDER.indexOf(a.edition) - EDITION_ORDER.indexOf(b.edition));
    const out = [];
    for (const p of defs) {
      const price = await this.priceFor(p.edition, t.marketCode, "MONTHLY");
      const annual = await this.priceFor(p.edition, t.marketCode, "ANNUAL");
      const idx = EDITION_ORDER.indexOf(p.edition);
      const relation = idx === cur ? "CURRENT" : idx > cur ? "UPGRADE" : "DOWNGRADE";
      out.push({
        edition: p.edition, relation, maxUsers: p.maxUsers, maxBranches: p.maxBranches, capabilities: [...p.capabilities], addOns: [...p.addOns],
        prices: [price, annual].filter(Boolean).map((x) => ({ interval: x!.interval, amount: x!.amount.toFixed(2), currency: x!.currency })),
        priceNeedsHuman: p.edition !== "LITE" && !price,
        downgradeImpact: relation === "DOWNGRADE" ? computeDowngradeImpact(this.shape(t.edition), this.shape(p.edition), usage, policy.liteReadOnlyGraceDays) : null,
      });
    }
    return { currentEdition: t.edition, usage, taxLine: policy.taxRatePercent > 0 ? { ratePercent: policy.taxRatePercent } : null, plans: out };
  }

  async setAutoRenew(u: AuthUser, body: { enabled: boolean; confirmDowngrade?: boolean }) {
    this.assertManager(u);
    const sub = await this.ensure(u.orgId);
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const policy = this.policy();
    if (isFree(t.edition)) throw new DomainError("AUTO_RENEW_NOT_APPLICABLE", "The free plan has nothing to renew", 400);
    if (sub.autoRenewForced) throw forbidden("AUTO_RENEW_FORCED", `Auto-renew is set to ${sub.autoRenewForced} by the platform`);
    if (!body.enabled) {
      if (!policy.orgMayDisableAutoRenew) throw forbidden("AUTO_RENEW_CANNOT_DISABLE", "Auto-renew cannot be switched off in this market");
      if (body.confirmDowngrade !== true) throw new DomainError("AUTO_RENEW_CONFIRMATION_REQUIRED", "Confirm that the plan moves to Lite at the end of the period", 400, { impact: await this.impact(u.orgId), endsOn: sub.currentPeriodEnd.toISOString() });
    }
    if (sub.autoRenew !== body.enabled) {
      await this.prisma.$transaction(async (tx) => {
        await tx.orgSubscription.update({ where: { orgId: u.orgId }, data: { autoRenew: body.enabled, autoRenewChangedAt: new Date(), autoRenewChangedBy: u.userId } });
        await this.event(tx, u.orgId, body.enabled ? "auto_renew_on" : "auto_renew_off", { autoRenew: sub.autoRenew }, { autoRenew: body.enabled, effectiveAt: sub.currentPeriodEnd.toISOString() }, u.userId);
      });
      await this.notify(u.orgId, body.enabled ? "auto_renew_on" : "auto_renew_off", { edition: t.edition, endsOn: sub.currentPeriodEnd.toISOString() }, `auto_renew:${Date.now()}`);
    }
    return this.state(u);
  }

  /** Mock card capture: the web sends only a provider token reference + last4 (never a PAN). Real hosted-session flow is a go-live task. */
  async setPaymentMethod(u: AuthUser, body: { tokenRef: string; brand?: string; last4: string; expMonth?: number; expYear?: number }) {
    this.assertManager(u);
    if (/^\d{12,19}$/.test(body.tokenRef.replace(/[\s-]/g, ""))) throw new DomainError("PAN_NOT_ACCEPTED", "Card numbers are never accepted: send the provider token reference", 400);
    await this.ensure(u.orgId);
    await this.prisma.orgSubscription.update({ where: { orgId: u.orgId }, data: { paymentTokenRef: body.tokenRef, paymentBrand: body.brand ?? null, paymentLast4: body.last4, paymentExpMonth: body.expMonth ?? null, paymentExpYear: body.expYear ?? null } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "subscription.payment_method_set", entityType: "OrgSubscription", entityId: u.orgId });
    return this.state(u);
  }

  async forceAutoRenew(orgId: string, force: "ON" | "OFF" | null, reason: string, actorId: string) {
    if (!reason?.trim()) throw new DomainError("REASON_REQUIRED", "reason is required", 400);
    const sub = await this.ensure(orgId);
    await this.prisma.$transaction(async (tx) => {
      await tx.orgSubscription.update({ where: { orgId }, data: { autoRenewForced: force, ...(force ? { autoRenew: force === "ON" } : {}), autoRenewChangedAt: new Date(), autoRenewChangedBy: actorId } });
      await this.event(tx, orgId, "auto_renew_forced", { autoRenew: sub.autoRenew, forced: sub.autoRenewForced }, { forced: force, reason: reason.trim() }, actorId);
    });
    return { orgId, autoRenewForced: force };
  }

  /** Idempotent and concurrency-safe: the conditional update only matches while the tenant is still on its paid edition. */
  async downgradeToLite(orgId: string, reason: "auto_renew_off" | "payment_failed" | "platform_forced", actorId: string | null, now = new Date()): Promise<boolean> {
    const sub = await this.ensure(orgId);
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    if (isFree(t.edition)) return false;
    const policy = this.policy();
    const moved = await this.prisma.$transaction(async (tx) => {
      const r = await tx.tenant.updateMany({ where: { id: orgId, edition: t.edition }, data: { edition: "LITE" } });
      if (r.count === 0) return false;
      const elapsed = sub.currentPeriodEnd <= now;
      await tx.orgSubscription.update({
        where: { orgId },
        data: {
          previousEdition: t.edition, status: "ACTIVE", autoRenew: true, downgradedToLiteAt: now, downgradeReason: reason,
          liteReadOnlyGraceUntil: new Date(now.getTime() + policy.liteReadOnlyGraceDays * DAY), failedAttempts: 0, firstFailedAt: null, nextRetryAt: null,
          ...(elapsed ? { currentPeriodStart: sub.currentPeriodEnd, currentPeriodEnd: addPeriod(sub.currentPeriodEnd, "MONTHLY") } : {}),
        },
      });
      await this.event(tx, orgId, "downgraded_to_lite", { edition: t.edition }, { edition: "LITE", reason, readOnlyGraceDays: policy.liteReadOnlyGraceDays }, actorId);
      return true;
    });
    if (moved) await this.notify(orgId, "downgraded_to_lite", { fromEdition: t.edition, reason, readOnlyGraceDays: policy.liteReadOnlyGraceDays }, `downgraded:${now.getTime()}`);
    return moved;
  }

  async reactivate(u: AuthUser, body: { edition?: Edition; interval?: "MONTHLY" | "ANNUAL" } = {}) {
    this.assertManager(u);
    const sub = await this.ensure(u.orgId);
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    if (!isFree(t.edition)) throw new DomainError("ALREADY_PAID", "The organisation is already on a paid plan", 400);
    const edition = body.edition ?? sub.previousEdition;
    if (!edition || isFree(edition)) throw new DomainError("PLAN_REQUIRED", "Choose a paid plan to upgrade to", 400);
    const interval = body.interval ?? "MONTHLY";
    const price = await this.priceFor(edition, t.marketCode, interval);
    if (!price) throw new DomainError("NO_ACTIVE_PRICE", "No active price for this plan in your market (price to be confirmed)", 400);
    const policy = this.policy();
    const now = new Date();
    const ok = await this.prisma.$transaction(async (tx) => {
      const r = await tx.tenant.updateMany({ where: { id: u.orgId, edition: "LITE" }, data: { edition } });
      if (r.count === 0) return false;
      await tx.orgSubscription.update({ where: { orgId: u.orgId }, data: { interval, status: "ACTIVE", autoRenew: policy.autoRenewDefault, autoRenewChangedAt: now, autoRenewChangedBy: u.userId, downgradedToLiteAt: null, downgradeReason: null, liteReadOnlyGraceUntil: null, previousEdition: null, currentPeriodStart: now, currentPeriodEnd: addPeriod(now, interval), failedAttempts: 0, firstFailedAt: null, nextRetryAt: null } });
      await this.event(tx, u.orgId, "reactivated", { edition: "LITE" }, { edition, interval, autoRenew: policy.autoRenewDefault }, u.userId);
      return true;
    });
    if (ok) await this.notify(u.orgId, "reactivated", { edition }, `reactivated:${now.getTime()}`);
    return { reactivated: ok, needsPaymentMethod: !sub.paymentTokenRef, state: await this.state(u) };
  }

  async listInvoices(orgId: string) {
    const rows = await this.prisma.subscriptionInvoice.findMany({ where: { orgId }, orderBy: { issuedAt: "desc" }, take: 24 });
    return rows.map((r) => ({ id: r.id, number: r.number, periodKey: r.periodKey, status: r.status, currency: r.currency, subtotal: r.subtotal.toFixed(2), tax: r.tax.toFixed(2), total: r.total.toFixed(2), issuedAt: r.issuedAt.toISOString(), paidAt: r.paidAt?.toISOString() ?? null }));
  }
  async listNotices(orgId: string) {
    return (await this.prisma.subscriptionNotice.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 50 })).map((n) => ({ id: n.id, kind: n.kind, notBefore: n.notBefore.toISOString(), payload: n.payload }));
  }

  // ------------------------------------------------------------------ daily pass

  async runDaily(now = new Date()) {
    const policy = this.policy();
    const out = { downgraded: 0, renewed: 0, failed: 0, retried: 0, reminders: 0 };
    const subs = await this.prisma.orgSubscription.findMany({ take: 1000 });
    for (const sub of subs) {
      try {
        const t = await this.prisma.tenant.findUnique({ where: { id: sub.orgId } });
        if (!t || isFree(t.edition)) continue;
        const eff = effectiveAutoRenew(sub);
        if (sub.status === "PAST_DUE") { await this.dunning(sub, t.edition, t.marketCode, policy, now, out); continue; }
        const d = decidePeriodEnd({ edition: t.edition, autoRenew: eff, currentPeriodEnd: sub.currentPeriodEnd, now });
        if (d === "DOWNGRADE_AUTO_RENEW_OFF") { if (await this.downgradeToLite(sub.orgId, "auto_renew_off", null, now)) out.downgraded += 1; }
        else if (d === "RENEW") await this.renew(sub, t.edition, t.marketCode, policy, now, out);
        else out.reminders += await this.reminders(sub, t.edition, eff, policy, now);
      } catch (e) { this.log.warn(`subscription ${sub.orgId}: ${e instanceof Error ? e.message : String(e)}`); }
    }
    return out;
  }

  private async reminders(sub: { orgId: string; currentPeriodEnd: Date; paymentTokenRef: string | null }, edition: Edition, eff: boolean, policy: SubscriptionPolicy, now: Date) {
    const marker = sub.currentPeriodEnd.toISOString();
    const sent = (await this.prisma.subscriptionNotice.findMany({ where: { orgId: sub.orgId, dedupeKey: { startsWith: `reminder:${marker}:` } }, select: { dedupeKey: true } })).map((n) => Number(n.dedupeKey.split(":").pop()));
    const due = reminderOffsetsDue({ currentPeriodEnd: sub.currentPeriodEnd, now, offsets: policy.renewalReminderDaysBefore, alreadySent: sent });
    if (!due.length) return 0;
    const kind: NoticeKind = !eff ? "renewal_off_reminder" : sub.paymentTokenRef ? "renewal_reminder" : "payment_method_missing";
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: sub.orgId } });
    const price = await this.priceFor(edition, t.marketCode, "MONTHLY");
    await this.notify(sub.orgId, kind, { edition, renewsOn: marker, daysBefore: due[0], amount: price?.amount.toFixed(2) ?? null, currency: price?.currency ?? null }, `reminder:${marker}:${due[0]}`, nextOutsideQuietHours(now, policy.reminderQuietHours));
    return 1;
  }

  private async renew(sub: { orgId: string; interval: string; currentPeriodEnd: Date; paymentTokenRef: string | null }, edition: Edition, market: string, policy: SubscriptionPolicy, now: Date, out: { renewed: number; failed: number }) {
    const periodKey = sub.currentPeriodEnd.toISOString().slice(0, 10);
    const price = await this.priceFor(edition, market, sub.interval);
    const nextStart = sub.currentPeriodEnd, nextEnd = addPeriod(nextStart, sub.interval);
    const roll = () => this.prisma.orgSubscription.updateMany({ where: { orgId: sub.orgId, currentPeriodEnd: sub.currentPeriodEnd }, data: { currentPeriodStart: nextStart, currentPeriodEnd: nextEnd } });
    if (!price) { // no catalog price yet (NEEDS_HUMAN): nothing can be charged, the period rolls and the gap is recorded
      if ((await roll()).count) await this.event(this.prisma, sub.orgId, "renewed_without_charge", null, { reason: "no_price", periodKey }, null);
      out.renewed += 1; return;
    }
    const subtotal = new Prisma.Decimal(price.amount);
    const tax = subtotal.mul(policy.taxRatePercent).div(100).toDecimalPlaces(2);
    let inv;
    try {
      inv = await this.prisma.subscriptionInvoice.create({ data: { orgId: sub.orgId, number: `SUB-${sub.orgId.slice(-6).toUpperCase()}-${periodKey.replace(/-/g, "")}`, periodKey, periodStart: nextStart, periodEnd: nextEnd, edition, currency: price.currency, subtotal, tax, total: subtotal.add(tax) } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return; // a concurrent run already owns this period's invoice
      throw e;
    }
    const res = sub.paymentTokenRef ? await this.billing.charge({ orgId: sub.orgId, tokenRef: sub.paymentTokenRef, amount: inv.total.toFixed(2), currency: inv.currency, invoiceId: inv.id, idempotencyKey: `renew:${sub.orgId}:${periodKey}` }) : { status: "failed" as const, providerRef: "" };
    if (res.status === "succeeded") {
      await this.prisma.$transaction(async (tx) => {
        await tx.subscriptionInvoice.update({ where: { id: inv.id }, data: { status: "PAID", paidAt: now, providerRef: res.providerRef, attempts: 1 } });
        if ((await tx.orgSubscription.updateMany({ where: { orgId: sub.orgId, currentPeriodEnd: sub.currentPeriodEnd }, data: { currentPeriodStart: nextStart, currentPeriodEnd: nextEnd, failedAttempts: 0, firstFailedAt: null, nextRetryAt: null, status: "ACTIVE" } })).count) await this.event(tx, sub.orgId, "renewed", null, { periodKey, invoice: inv.number }, null);
      });
      out.renewed += 1;
    } else {
      const first = policy.retryDays[0];
      await this.prisma.orgSubscription.update({ where: { orgId: sub.orgId }, data: { status: "PAST_DUE", failedAttempts: 1, firstFailedAt: now, nextRetryAt: first != null ? new Date(now.getTime() + first * DAY) : null } });
      await this.prisma.subscriptionInvoice.update({ where: { id: inv.id }, data: { attempts: 1 } });
      await this.event(this.prisma, sub.orgId, "renewal_failed", null, { periodKey, attempt: 1 }, null);
      await this.notify(sub.orgId, "payment_failed", { edition, downgradeInDays: policy.downgradeAfterDays }, `failed:${periodKey}`);
      out.failed += 1;
    }
  }

  private async dunning(sub: { orgId: string; interval: string; currentPeriodEnd: Date; paymentTokenRef: string | null; failedAttempts: number; firstFailedAt: Date | null; nextRetryAt: Date | null }, edition: Edition, market: string, policy: SubscriptionPolicy, now: Date, out: { retried: number; downgraded: number }) {
    const first = sub.firstFailedAt ?? now;
    const overdue = Math.floor((now.getTime() - first.getTime()) / DAY);
    const inv = await this.prisma.subscriptionInvoice.findFirst({ where: { orgId: sub.orgId, status: "ISSUED" }, orderBy: { issuedAt: "desc" } });
    if (!inv) { await this.prisma.orgSubscription.update({ where: { orgId: sub.orgId }, data: { status: "ACTIVE", failedAttempts: 0, firstFailedAt: null, nextRetryAt: null } }); return; }
    if (overdue >= policy.downgradeAfterDays) { if (await this.downgradeToLite(sub.orgId, "payment_failed", null, now)) out.downgraded += 1; return; }
    if (overdue >= policy.downgradeAfterDays - 1) await this.notify(sub.orgId, "downgrade_warning", { downgradeInDays: 1 }, `warn:${inv.periodKey}`);
    if (sub.nextRetryAt && sub.nextRetryAt <= now && sub.paymentTokenRef) {
      const attempt = sub.failedAttempts + 1;
      const res = await this.billing.charge({ orgId: sub.orgId, tokenRef: sub.paymentTokenRef, amount: inv.total.toFixed(2), currency: inv.currency, invoiceId: inv.id, idempotencyKey: `renew:${sub.orgId}:${inv.periodKey}:r${attempt}` });
      out.retried += 1;
      if (res.status === "succeeded") {
        await this.prisma.$transaction(async (tx) => {
          await tx.subscriptionInvoice.update({ where: { id: inv.id }, data: { status: "PAID", paidAt: now, providerRef: res.providerRef, attempts: attempt } });
          await tx.orgSubscription.update({ where: { orgId: sub.orgId }, data: { status: "ACTIVE", failedAttempts: 0, firstFailedAt: null, nextRetryAt: null, currentPeriodStart: inv.periodStart, currentPeriodEnd: inv.periodEnd } });
          await this.event(tx, sub.orgId, "renewed", null, { periodKey: inv.periodKey, invoice: inv.number, attempt }, null);
        });
      } else {
        const nextOffset = policy.retryDays[attempt - 1];
        await this.prisma.orgSubscription.update({ where: { orgId: sub.orgId }, data: { failedAttempts: attempt, nextRetryAt: nextOffset != null ? new Date(first.getTime() + nextOffset * DAY) : null } });
        await this.prisma.subscriptionInvoice.update({ where: { id: inv.id }, data: { attempts: attempt } });
      }
    }
    void edition; void market;
  }
}
