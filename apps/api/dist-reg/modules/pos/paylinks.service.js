"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PayLinksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayLinksService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const ports_1 = require("../../kernel-adapter/ports");
const notifications_service_1 = require("../../platform/adapters/notifications.service");
const psp_adapter_1 = require("../../platform/adapters/psp.adapter");
const http_1 = require("../../providers/http");
const pos_service_1 = require("./pos.service");
const SYSTEM = "system:paylink";
let PayLinksService = PayLinksService_1 = class PayLinksService {
    prisma;
    psp;
    notify;
    packs;
    pos;
    log = new common_1.Logger(PayLinksService_1.name);
    constructor(prisma, psp, notify, packs, pos) {
        this.prisma = prisma;
        this.psp = psp;
        this.notify = notify;
        this.packs = packs;
        this.pos = pos;
    }
    view(l) {
        return { ...l, amount: (0, money_1.money)(l.amount), refundedAmount: (0, money_1.money)(l.refundedAmount), refundAmount: l.refundAmount == null ? null : (0, money_1.money)(l.refundAmount) };
    }
    async ctx(orgId) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        return { name: t.name, currency: this.packs.get(t.marketCode).currency, locale: (t.settings ?? {}).defaultLocale ?? "ar" };
    }
    async create(user, accountId, b, idemKey) {
        const acc = await this.prisma.customerAccount.findFirst({ where: { id: accountId, orgId: user.orgId }, include: { patient: true } });
        if (!acc)
            throw (0, errors_1.notFound)("Customer account", accountId);
        const amount = b.amount !== undefined ? (0, money_1.D)(b.amount) : (0, money_1.D)(acc.balance);
        if (amount.lte(0))
            throw new errors_1.DomainError("NOTHING_TO_PAY", "The account has no outstanding balance", 422);
        if (amount.gt(acc.balance))
            throw new errors_1.DomainError("OVERPAYMENT", "Payment exceeds the outstanding balance", 422, { balance: (0, money_1.money)(acc.balance) });
        const key = idemKey ?? `paylink:${accountId}:${(0, node_crypto_1.randomUUID)()}`;
        const existing = await this.prisma.payLink.findUnique({ where: { orgId_idempotencyKey: { orgId: user.orgId, idempotencyKey: key } } });
        if (existing)
            return { link: this.view(existing), replayed: true };
        const c = await this.ctx(user.orgId);
        const expiresAt = new Date(Date.now() + (b.expiresInHours ?? 72) * 3_600_000);
        const link = await this.prisma.payLink.create({ data: { orgId: user.orgId, accountId, amount, currency: c.currency, idempotencyKey: key, expiresAt, createdBy: user.userId } });
        try {
            const r = await this.psp.createPayLink({ amount: (0, money_1.money)(amount), currency: c.currency, reference: link.id, description: `Account balance ${acc.patient.displayName}`, idempotencyKey: key, expiresAt: expiresAt.toISOString(), customer: { name: acc.patient.displayName, email: acc.patient.email ?? undefined, phone: acc.patient.phone ?? undefined } });
            const upd = await this.prisma.payLink.update({ where: { id: link.id }, data: { providerRef: r.providerRef, payUrl: r.payUrl } });
            await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "paylink.create", entityType: "CustomerAccount", entityId: accountId, meta: { linkId: link.id, amount: (0, money_1.money)(amount) } } });
            let notification;
            if (b.sendVia) {
                const to = b.sendVia.to ?? (b.sendVia.channel === "EMAIL" ? acc.patient.email : acc.patient.phone);
                if (!to)
                    throw new errors_1.DomainError(b.sendVia.channel === "EMAIL" ? "NO_EMAIL" : "NO_PHONE", "The customer has no contact on file for that channel", 422);
                notification = await this.notify.send({ orgId: user.orgId, channel: b.sendVia.channel, recipient: to, template: "paylink.send", locale: c.locale, vars: { pharmacy: c.name, amount: (0, money_1.money)(amount), currency: c.currency, link: r.payUrl }, refType: "PayLink", refId: link.id });
            }
            return { link: this.view(upd), replayed: false, notification };
        }
        catch (e) {
            if (e instanceof http_1.ProviderError) {
                await this.prisma.payLink.update({ where: { id: link.id }, data: { status: "FAILED", failureReason: `${e.code}: ${e.message}`.slice(0, 200) } });
                throw new common_1.BadGatewayException({ code: "PSP_UNAVAILABLE", providerCode: e.code, message: e.message });
            }
            throw e;
        }
    }
    async list(orgId, accountId) {
        return (await this.prisma.payLink.findMany({ where: { orgId, ...(accountId ? { accountId } : {}) }, orderBy: { createdAt: "desc" }, take: 100 })).map((l) => this.view(l));
    }
    async onPaid(providerRef, amount) {
        const link = await this.prisma.payLink.findFirst({ where: { providerRef } });
        if (!link)
            return false;
        if (["PAID", "REFUND_PENDING", "REFUNDED"].includes(link.status))
            return true;
        const won = await this.prisma.payLink.updateMany({ where: { id: link.id, status: { in: ["PENDING", "FAILED", "EXPIRED"] } }, data: { status: "PAID", failureReason: null } });
        if (won.count !== 1)
            return true;
        if (amount !== undefined && !(0, money_1.D)(amount).equals(link.amount)) {
            await this.prisma.payLink.update({ where: { id: link.id }, data: { failureReason: "AMOUNT_MISMATCH_RECONCILE_MANUALLY" } });
            await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "paylink.amount_mismatch", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
            return true;
        }
        const booked = await this.prisma.$transaction(async (tx) => {
            const [a] = await tx.$queryRaw `SELECT balance FROM "CustomerAccount" WHERE id = ${link.accountId} AND "orgId" = ${link.orgId} FOR UPDATE`;
            if (!a || (0, money_1.D)(link.amount).gt(a.balance))
                return null;
            const e = await tx.customerCreditEntry.create({ data: { orgId: link.orgId, accountId: link.accountId, kind: "PAYMENT", amount: (0, money_1.D)(link.amount).neg(), note: `paylink:${link.id}`, createdBy: SYSTEM } });
            await tx.customerAccount.update({ where: { id: link.accountId }, data: { balance: { decrement: link.amount } } });
            await tx.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "customer.payment", entityType: "CustomerAccount", entityId: link.accountId, meta: { amount: (0, money_1.money)(link.amount), viaPayLink: link.id } } });
            await tx.payLink.update({ where: { id: link.id }, data: { entryId: e.id } });
            return true;
        });
        if (!booked) {
            await this.prisma.payLink.update({ where: { id: link.id }, data: { failureReason: "BALANCE_ALREADY_SETTLED_REFUND_REQUIRED" } });
            await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "paylink.paid_but_settled", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
            return true;
        }
        try {
            const acc = await this.prisma.customerAccount.findUniqueOrThrow({ where: { id: link.accountId }, include: { patient: true } });
            const c = await this.ctx(link.orgId);
            const ch = acc.patient.email ? "EMAIL" : acc.patient.phone ? "SMS" : null;
            if (ch)
                await this.notify.send({ orgId: link.orgId, channel: ch, recipient: (ch === "EMAIL" ? acc.patient.email : acc.patient.phone), template: "paylink.receipt", locale: c.locale, vars: { pharmacy: c.name, amount: (0, money_1.money)(link.amount), currency: c.currency, balance: (0, money_1.money)(acc.balance) }, refType: "PayLink", refId: link.id });
        }
        catch (e) {
            this.log.warn(`paylink receipt skipped: ${e.message}`);
        }
        return true;
    }
    async onNotPaid(providerRef, status, reason) {
        const link = await this.prisma.payLink.findFirst({ where: { providerRef } });
        if (!link)
            return false;
        await this.prisma.payLink.updateMany({ where: { id: link.id, status: "PENDING" }, data: { status, failureReason: reason ?? (status === "EXPIRED" ? "EXPIRED" : "PAYMENT_FAILED") } });
        await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: `paylink.${status.toLowerCase()}`, entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
        return true;
    }
    async refund(user, id, b) {
        const link = await this.prisma.payLink.findFirst({ where: { id, orgId: user.orgId } });
        if (!link)
            throw (0, errors_1.notFound)("Pay link", id);
        if (link.status !== "PAID" || !link.entryId || !link.providerRef)
            throw new errors_1.DomainError("PAYLINK_NOT_REFUNDABLE", `Pay link is ${link.status}`, 409);
        const left = (0, money_1.D)(link.amount).minus(link.refundedAmount);
        const amount = b.amount !== undefined ? (0, money_1.D)(b.amount) : left;
        if (amount.lte(0) || amount.gt(left))
            throw new errors_1.DomainError("REFUND_EXCEEDS_PAYMENT", "Refund exceeds what is left of the payment", 422, { refundable: (0, money_1.money)(left) });
        let r;
        try {
            r = await this.psp.refundPayment({ providerRef: link.providerRef, amount: (0, money_1.money)(amount), currency: link.currency, reason: b.reason, idempotencyKey: `refund:${link.id}:${(0, money_1.money)((0, money_1.D)(link.refundedAmount).plus(amount))}` });
        }
        catch (e) {
            if (e instanceof http_1.ProviderError)
                throw new common_1.BadGatewayException({ code: "PSP_UNAVAILABLE", providerCode: e.code, message: e.message });
            throw e;
        }
        if (r.status === "SUCCEEDED")
            return this.bookRefund(link.orgId, user.userId, link.id, amount, b.reason);
        const upd = await this.prisma.payLink.update({ where: { id: link.id }, data: { status: "REFUND_PENDING", refundRef: r.providerRef, refundAmount: amount, failureReason: b.reason ? `refund:${b.reason}`.slice(0, 200) : null } });
        return { link: this.view(upd), pending: true };
    }
    async bookRefund(orgId, actor, linkId, amount, reason) {
        const upd = await this.prisma.$transaction(async (tx) => {
            const link = await tx.payLink.findUniqueOrThrow({ where: { id: linkId } });
            await tx.$queryRaw `SELECT balance FROM "CustomerAccount" WHERE id = ${link.accountId} AND "orgId" = ${orgId} FOR UPDATE`;
            await tx.customerCreditEntry.create({ data: { orgId, accountId: link.accountId, kind: "REFUND", amount, note: `paylink-refund:${link.id}${reason ? `:${reason}` : ""}`.slice(0, 200), createdBy: actor } });
            await tx.customerAccount.update({ where: { id: link.accountId }, data: { balance: { increment: amount } } });
            await tx.auditLog.create({ data: { orgId, actorId: actor === SYSTEM ? null : actor, action: "paylink.refund", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId, amount: (0, money_1.money)(amount) } } });
            const refunded = (0, money_1.D)(link.refundedAmount).plus(amount);
            return tx.payLink.update({ where: { id: linkId }, data: { refundedAmount: refunded, status: refunded.gte(link.amount) ? "REFUNDED" : "PAID", refundRef: null, refundAmount: null, failureReason: null } });
        });
        return { link: this.view(upd), pending: false };
    }
    async onRefundSucceeded(refundRef) {
        const link = await this.prisma.payLink.findFirst({ where: { refundRef, status: "REFUND_PENDING" } });
        if (!link)
            return (await this.prisma.payLink.count({ where: { refundRef } })) > 0;
        await this.bookRefund(link.orgId, SYSTEM, link.id, (0, money_1.D)(link.refundAmount ?? link.amount), link.failureReason?.replace(/^refund:/, "") || undefined);
        return true;
    }
    async onRefundFailed(refundRef, reason) {
        const link = await this.prisma.payLink.findFirst({ where: { refundRef, status: "REFUND_PENDING" } });
        if (!link)
            return false;
        await this.prisma.payLink.update({ where: { id: link.id }, data: { status: "PAID", refundRef: null, refundAmount: null, failureReason: `REFUND_FAILED${reason ? `: ${reason}` : ""}`.slice(0, 200) } });
        await this.prisma.auditLog.create({ data: { orgId: link.orgId, actorId: null, action: "paylink.refund_failed", entityType: "CustomerAccount", entityId: link.accountId, meta: { linkId: link.id } } });
        return true;
    }
    async sendReceipt(user, saleId, b) {
        const r = await this.pos.receipt(user.orgId, saleId);
        const sale = await this.prisma.sale.findFirstOrThrow({ where: { id: saleId, orgId: user.orgId }, select: { patientId: true } });
        const p = sale.patientId ? await this.prisma.patientRef.findUnique({ where: { id: sale.patientId }, select: { email: true, phone: true } }) : null;
        const to = b.to ?? (b.channel === "EMAIL" ? p?.email : p?.phone);
        if (!to)
            throw new errors_1.DomainError(b.channel === "EMAIL" ? "NO_EMAIL" : "NO_PHONE", "No contact on file for that channel; pass `to`", 422);
        const c = await this.ctx(user.orgId);
        const n = await this.notify.send({ orgId: user.orgId, channel: b.channel, recipient: to, template: "receipt.email", locale: c.locale, vars: { pharmacy: r.pharmacy, receipt: r.receiptNo ?? saleId.slice(-6).toUpperCase(), date: new Date(r.soldAt).toISOString().slice(0, 10), total: r.total, currency: r.currency }, refType: "Sale", refId: saleId });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "sale.receipt_sent", entityType: "Sale", entityId: saleId, meta: { channel: b.channel, status: n.status } } });
        return { id: n.id, status: n.status };
    }
};
exports.PayLinksService = PayLinksService;
exports.PayLinksService = PayLinksService = PayLinksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(psp_adapter_1.PspAdapter)),
    __param(2, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(3, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(4, (0, common_1.Inject)(pos_service_1.PosService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        psp_adapter_1.PspAdapter,
        notifications_service_1.NotificationsService, Object, pos_service_1.PosService])
], PayLinksService);
//# sourceMappingURL=paylinks.service.js.map