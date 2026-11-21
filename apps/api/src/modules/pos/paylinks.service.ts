import { BadGatewayException, Inject, Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { KERNEL, type MarketPackPort } from "../../kernel-adapter/ports";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { PspAdapter } from "../../platform/adapters/psp.adapter";
import { ProviderError } from "../../providers/http";
import { PosService } from "./pos.service";

const SYSTEM = "system:paylink";
type Via = { channel: "SMS" | "EMAIL" | "WHATSAPP"; to?: string };

/**
 * Pay-by-link for a customer's credit balance: PspAdapter.createPayLink -> optional SMS / email / WhatsApp with the link -> the PSP's signed webhook drives the status
 * (payment.succeeded books ONE PAYMENT credit entry; payment.failed / expired close the link; refund.* finish a refund). Identical in mock mode (dev simulator).
 */
@Injectable()
export class PayLinksService {
  private readonly log = new Logger(PayLinksService.name);
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(PspAdapter) private readonly psp: PspAdapter,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
    @Inject(PosService) private readonly pos: PosService,
  ) {}

  private view<T extends { amount: unknown; refundedAmount: unknown; refundAmount?: unknown }>(l: T) {
    return { ...l, amount: money(l.amount as never), refundedAmount: money(l.refundedAmount as never), refundAmount: l.refundAmount == null ? null : money(l.refundAmount as never) };
  }
  private async ctx(orgId: string) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
    return { name: t.name, currency: this.packs.get(t.marketCode).currency, locale: ((t.settings ?? {}) as { defaultLocale?: "ar" | "en" }).defaultLocale ?? "ar" };
  }

  async create(user: AuthUser, accountId: string, b: { amount?: string; sendVia?: Via; expiresInHours?: number }, idemKey?: string) {
    const acc = await this.prisma.customerAccount.findFirst({ where: { id: accountId, orgId: user.orgId }, include: { patient: true } });
    if (!acc) throw notFound("Customer account", accountId);
    const amount = b.amount !== undefined ? D(b.amount) : D(acc.balance);
    if (amount.lte(0)) throw new DomainError("NOTHING_TO_PAY", "The account has no outstanding balance", 422);
    if (amount.gt(acc.balance)) throw new DomainError("OVERPAYMENT", "Payment exceeds the outstanding balance", 422, { balance: money(acc.balance) });
    const key = idemKey ?? `paylink:${accountId}:${randomUUID()}`;
    const existing = await this.prisma.payLink.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: key } } });
    if (existing) return { link: this.view(existing), replayed: true };
    const c = await this.ctx(user.orgId);
    const expiresAt = new Date(Date.now() + (b.expiresInHours ?? 72) * 3_600_000);
    const link = await this.prisma.payLink.create({ data: { orgId: user.orgId, accountId, amount, currency: c.currency, idempotencyKey: key, expiresAt, createdBy: user.userId } });
    try {
      const r = await this.psp.createPayLink({ amount: money(amount), currency: c.currency, reference: link.id, description: `Account balance ${acc.patient.displayName}`, idempotencyKey: key, expiresAt: expiresAt.toISOString(), customer: { name: acc.patient.displayName, email: acc.patient.email ?? undefined, phone: acc.patient.phone ?? undefined } });
      const upd = await this.prisma.payLink.update({ where: { id: link.id }, data: { providerRef: r.providerRef, payUrl: r.payUrl } });
      await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "paylink.create", entityType: "CustomerAccount", entityId: accountId, meta: { linkId: link.id, amount: money(amount) } } });
      let notification: { id: string; status: string } | undefined;
      if (b.sendVia) {
        const to = b.sendVia.to ?? (b.sendVia.channel === "EMAIL" ? acc.patient.email : acc.patient.phone);
        if (!to) throw new DomainError(b.sendVia.channel === "EMAIL" ? "NO_EMAIL" : "NO_PHONE", "The customer has no contact on file for that channel", 422);
        notification = await this.notify.send({ orgId: user.orgId, channel: b.sendVia.channel, recipient: to, template: "paylink.send", locale: c.locale, vars: { pharmacy: c.name, amount: money(amount), currency: c.currency, link: r.payUrl }, refType: "PayLink", refId: link.id });
      }
      return { link: this.view(upd), replayed: false, notification };
    } catch (e) {
      if (e instanceof ProviderError) {
        await this.prisma.payLink.update({ where: { id: link.id }, data: { status: "FAILED", failureReason: `${e.code}: ${e.message}`.slice(0, 200) } });
        throw new BadGatewayException({ code: "PSP_UNAVAILABLE", providerCode: e.code, message: e.message });
      }
      throw e;
    }
  }

  async list(orgId: string, accountId?: string) {
    return (await this.prisma.payLink.findMany({ where: { orgId, ...(accountId ? { accountId } : {}) }, orderBy: { createdAt: "desc" }, take: 100 })).map((l) => this.view(l));
  }

  // ------------------------------------------------------------ webhook-driven transitions
  /** payment.succeeded: books ONE PAYMENT credit entry (only the PENDING/FAILED/EXPIRED -> PAID winner books). */
  async onPaid(providerRef: string, amount?: string): Promise<boolean> {
    const link = await this.prisma.payLink.findFirst({ where: { providerRef } });
    if (!link) return false;
    if (["PAID", "REFUND_PENDING", "REFUNDED"].includes(link.status)) return true;
    const won = await this.prisma.payLink.updateMany({ where: { id: link.id, status: { in: ["PENDING", "FAILED", "EXPIRED"] } }, data: { status: "PAID", failureReason: null } });
    if (won.count !== 1) return true;
    if (amount !== undefined && !D(amount).equals(link.amount)) {
      await this.prisma.payLink.update({ where: { id: link.id }, data: { failureReason: "AMOUNT_MISMATCH_RECONCILE_MANUALLY" } });
      await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "paylink.amount_mismatch", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
      return true;
    }
    const booked = await this.prisma.$transaction(async (tx) => {
      const [a] = await tx.$queryRaw<Array<{ balance: string }>>`SELECT balance FROM "CustomerAccount" WHERE id = ${link.accountId} AND "orgId" = ${link.orgId} FOR UPDATE`;
      if (!a || D(link.amount).gt(a.balance)) return null;
      const e = await tx.customerCreditEntry.create({ data: { orgId: link.orgId, accountId: link.accountId, kind: "PAYMENT", amount: D(link.amount).neg(), note: `paylink:${link.id}`, createdBy: SYSTEM } });
      await tx.customerAccount.update({ where: { id: link.accountId }, data: { balance: { decrement: link.amount } } });
      await tx.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "customer.payment", entityType: "CustomerAccount", entityId: link.accountId, meta: { amount: money(link.amount), viaPayLink: link.id } } });
      await tx.payLink.update({ where: { id: link.id }, data: { entryId: e.id } });
      return true;
    });
    if (!booked) {
      await this.prisma.payLink.update({ where: { id: link.id }, data: { failureReason: "BALANCE_ALREADY_SETTLED_REFUND_REQUIRED" } });
      await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "paylink.paid_but_settled", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
      return true;
    }
    // receipt to the customer (email preferred); never fails the webhook
    try {
      const acc = await this.prisma.customerAccount.findUniqueOrThrow({ where: { id: link.accountId }, include: { patient: true } });
      const c = await this.ctx(link.orgId);
      const ch = acc.patient.email ? "EMAIL" : acc.patient.phone ? "SMS" : null;
      if (ch) await this.notify.send({ orgId: link.orgId, channel: ch, recipient: (ch === "EMAIL" ? acc.patient.email : acc.patient.phone)!, template: "paylink.receipt", locale: c.locale, vars: { pharmacy: c.name, amount: money(link.amount), currency: c.currency, balance: money(acc.balance) }, refType: "PayLink", refId: link.id });
    } catch (e) { this.log.warn(`paylink receipt skipped: ${(e as Error).message}`); }
    return true;
  }

  async onNotPaid(providerRef: string, status: "FAILED" | "EXPIRED", reason?: string): Promise<boolean> {
    const link = await this.prisma.payLink.findFirst({ where: { providerRef } });
    if (!link) return false;
    await this.prisma.payLink.updateMany({ where: { id: link.id, status: "PENDING" }, data: { status, failureReason: reason ?? (status === "EXPIRED" ? "EXPIRED" : "PAYMENT_FAILED") } });
    await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: `paylink.${status.toLowerCase()}`, entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
    return true;
  }

  /** Refund a paid link: asks the PSP first; a synchronous success books it now, otherwise refund.succeeded books it. */
  async refund(user: AuthUser, id: string, b: { amount?: string; reason?: string }) {
    const link = await this.prisma.payLink.findFirst({ where: { id, orgId: user.orgId } });
    if (!link) throw notFound("Pay link", id);
    if (link.status !== "PAID" || !link.entryId || !link.providerRef) throw new DomainError("PAYLINK_NOT_REFUNDABLE", `Pay link is ${link.status}`, 409);
    const left = D(link.amount).minus(link.refundedAmount);
    const amount = b.amount !== undefined ? D(b.amount) : left;
    if (amount.lte(0) || amount.gt(left)) throw new DomainError("REFUND_EXCEEDS_PAYMENT", "Refund exceeds what is left of the payment", 422, { refundable: money(left) });
    let r;
    try {
      r = await this.psp.refundPayment({ providerRef: link.providerRef, amount: money(amount), currency: link.currency, reason: b.reason, idempotencyKey: `refund:${link.id}:${money(D(link.refundedAmount).plus(amount))}` });
    } catch (e) {
      if (e instanceof ProviderError) throw new BadGatewayException({ code: "PSP_UNAVAILABLE", providerCode: e.code, message: e.message });
      throw e;
    }
    if (r.status === "SUCCEEDED") return this.bookRefund(link.orgId, user.userId, link.id, amount, b.reason);
    const upd = await this.prisma.payLink.update({ where: { id: link.id }, data: { status: "REFUND_PENDING", refundRef: r.providerRef, refundAmount: amount, failureReason: b.reason ? `refund:${b.reason}`.slice(0, 200) : null } });
    return { link: this.view(upd), pending: true };
  }

  /** Puts the refunded money back on the customer's balance (a positive credit entry). */
  private async bookRefund(orgId: string, actor: string, linkId: string, amount: ReturnType<typeof D>, reason?: string) {
    const upd = await this.prisma.$transaction(async (tx) => {
      const link = await tx.payLink.findUniqueOrThrow({ where: { id: linkId } });
      await tx.$queryRaw`SELECT balance FROM "CustomerAccount" WHERE id = ${link.accountId} AND "orgId" = ${orgId} FOR UPDATE`;
      await tx.customerCreditEntry.create({ data: { orgId, accountId: link.accountId, kind: "REFUND", amount, note: `paylink-refund:${link.id}${reason ? `:${reason}` : ""}`.slice(0, 200), createdBy: actor } });
      await tx.customerAccount.update({ where: { id: link.accountId }, data: { balance: { increment: amount } } });
      await tx.auditLog.create({ data: { orgId, actorId: actor === SYSTEM ? null : actor, action: "paylink.refund", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId, amount: money(amount) } } });
      const refunded = D(link.refundedAmount).plus(amount);
      return tx.payLink.update({ where: { id: linkId }, data: { refundedAmount: refunded, status: refunded.gte(link.amount) ? "REFUNDED" : "PAID", refundRef: null, refundAmount: null, failureReason: null } });
    });
    return { link: this.view(upd), pending: false };
  }

  async onRefundSucceeded(refundRef: string): Promise<boolean> {
    const link = await this.prisma.payLink.findFirst({ where: { refundRef, status: "REFUND_PENDING" } });
    if (!link) return (await this.prisma.payLink.count({ where: { refundRef } })) > 0;
    await this.bookRefund(link.orgId, SYSTEM, link.id, D(link.refundAmount ?? link.amount), link.failureReason?.replace(/^refund:/, "") || undefined);
    return true;
  }

  async onRefundFailed(refundRef: string, reason?: string): Promise<boolean> {
    const link = await this.prisma.payLink.findFirst({ where: { refundRef, status: "REFUND_PENDING" } });
    if (!link) return false;
    await this.prisma.payLink.update({ where: { id: link.id }, data: { status: "PAID", refundRef: null, refundAmount: null, failureReason: `REFUND_FAILED${reason ? `: ${reason}` : ""}`.slice(0, 200) } });
    await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "paylink.refund_failed", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
    return true;
  }

  // ----------------------------------------------------------------------- receipt email
  /** Sends the sale receipt to the customer (email / SMS / WhatsApp). Defaults to the customer's contact on the sale. */
  async sendReceipt(user: AuthUser, saleId: string, b: { channel: "SMS" | "EMAIL" | "WHATSAPP"; to?: string }) {
    const r = await this.pos.receipt(user.orgId, saleId);
    const sale = await this.prisma.sale.findFirstOrThrow({ where: { id: saleId, orgId: user.orgId }, select: { patientId: true } });
    const p = sale.patientId ? await this.prisma.patientRef.findUnique({ where: { id: sale.patientId }, select: { email: true, phone: true } }) : null;
    const to = b.to ?? (b.channel === "EMAIL" ? p?.email : p?.phone);
    if (!to) throw new DomainError(b.channel === "EMAIL" ? "NO_EMAIL" : "NO_PHONE", "No contact on file for that channel; pass `to`", 422);
    const c = await this.ctx(user.orgId);
    const n = await this.notify.send({ orgId: user.orgId, channel: b.channel, recipient: to, template: "receipt.email", locale: c.locale, vars: { pharmacy: r.pharmacy, receipt: r.receiptNo ?? saleId.slice(-6).toUpperCase(), date: new Date(r.soldAt).toISOString().slice(0, 10), total: r.total, currency: r.currency }, refType: "Sale", refId: saleId });
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "sale.receipt_sent", entityType: "Sale", entityId: saleId, meta: { channel: b.channel, status: n.status } } });
    return { id: n.id, status: n.status };
  }
}
