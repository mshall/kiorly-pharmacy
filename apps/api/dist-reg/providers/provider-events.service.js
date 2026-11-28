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
var ProviderEventsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderEventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const paylinks_service_1 = require("../modules/pos/paylinks.service");
const messaging_provider_1 = require("./messaging-provider");
const payment_provider_1 = require("./payment-provider");
const consent_provider_1 = require("./consent-provider");
const consent_service_1 = require("../platform/adapters/consent.service");
const provider_env_1 = require("./provider-env");
const vendor_kit_1 = require("./vendor-kit");
const webhook_signature_1 = require("./webhook-signature");
const RANK = { QUEUED: 0, SENT: 1, DELIVERED: 2 };
let ProviderEventsService = ProviderEventsService_1 = class ProviderEventsService {
    prisma;
    payLinks;
    consents;
    log = new common_1.Logger(ProviderEventsService_1.name);
    constructor(prisma, payLinks, consents) {
        this.prisma = prisma;
        this.payLinks = payLinks;
        this.consents = consents;
    }
    async ingest(kind, rawBody, signature, ctx = {}) {
        const secret = (0, provider_env_1.webhookSecretFor)(kind);
        if (!secret)
            throw new common_1.ServiceUnavailableException({ code: "WEBHOOK_NOT_CONFIGURED", message: `${kind}_WEBHOOK_SECRET is not set` });
        const vendor = (0, provider_env_1.providerConfig)(kind).mode === "real" ? (0, vendor_kit_1.vendorOf)(kind) : undefined;
        let events;
        if (vendor) {
            const hook = vendor_kit_1.VENDOR_WEBHOOKS[vendor];
            if (!hook.verify({ secret, rawBody, headers: ctx.headers ?? {}, query: ctx.query ?? {}, publicUrl: process.env[`${kind}_WEBHOOK_PUBLIC_URL`] }))
                throw new common_1.UnauthorizedException({ code: "INVALID_WEBHOOK_SIGNATURE", message: "MISMATCH", reason: "MISMATCH" });
            const confirm = hook.confirmUrl?.(rawBody);
            if (confirm) {
                await fetch(confirm).catch(() => undefined);
                return { accepted: 0, applied: 0, duplicates: 0, unmatched: 0 };
            }
            try {
                events = hook.parse(rawBody);
            }
            catch {
                throw new common_1.BadRequestException({ code: "INVALID_WEBHOOK_EVENT" });
            }
        }
        else {
            const v = (0, webhook_signature_1.verifyWebhookSignature)(secret, rawBody, signature);
            if (!v.ok)
                throw new common_1.UnauthorizedException({ code: "INVALID_WEBHOOK_SIGNATURE", message: v.reason, reason: v.reason });
            let json;
            try {
                json = JSON.parse(rawBody);
            }
            catch {
                throw new common_1.BadRequestException({ code: "INVALID_JSON" });
            }
            try {
                events = kind === "CONSENT" ? (0, consent_provider_1.consentRegistry)(process.env).parseWebhook(json) : kind === "PAYMENT" ? (0, payment_provider_1.paymentProvider)(process.env).parseWebhook(json) : (0, messaging_provider_1.messageProvider)(kind, process.env).parseWebhook(json);
            }
            catch {
                throw new common_1.BadRequestException({ code: "INVALID_WEBHOOK_EVENT" });
            }
        }
        let applied = 0, duplicates = 0, unmatched = 0;
        for (const e of events) {
            try {
                await this.prisma.providerWebhookEvent.create({ data: { kind, eventId: e.eventId, type: e.type } });
            }
            catch {
                duplicates++;
                continue;
            }
            try {
                if (await this.apply(e))
                    applied++;
                else
                    unmatched++;
            }
            catch (err) {
                await this.prisma.providerWebhookEvent.deleteMany({ where: { kind, eventId: e.eventId } });
                this.log.error(`webhook ${kind} ${e.type} failed to apply: ${err.message}`);
                throw err;
            }
        }
        return { accepted: events.length, applied, duplicates, unmatched };
    }
    async apply(e) {
        switch (e.type) {
            case "message.sent":
            case "message.delivered":
            case "message.read":
            case "message.failed": return this.applyMessage(e);
            case "payment.succeeded": return this.payLinks.onPaid(e.providerRef, e.amount);
            case "payment.failed": return this.payLinks.onNotPaid(e.providerRef, "FAILED", e.error);
            case "payment.expired": return this.payLinks.onNotPaid(e.providerRef, "EXPIRED");
            case "refund.succeeded": return this.payLinks.onRefundSucceeded(e.providerRef);
            case "refund.failed": return this.payLinks.onRefundFailed(e.providerRef, e.error);
            case "consent.granted":
            case "consent.revoked":
            case "consent.expired": return this.consents.onEvent(e);
        }
    }
    async applyMessage(e) {
        const row = await this.prisma.notification.findFirst({ where: { providerMessageId: e.providerRef } });
        if (!row)
            return false;
        const cur = RANK[row.status] ?? 0;
        if (e.type === "message.failed") {
            if (cur < RANK.DELIVERED && row.status !== "FAILED")
                await this.prisma.notification.update({ where: { id: row.id }, data: { status: "FAILED", error: (e.error ?? "PROVIDER_REPORTED_FAILURE").slice(0, 200) } });
        }
        else if (e.type === "message.sent") {
            if (row.status === "QUEUED")
                await this.prisma.notification.update({ where: { id: row.id }, data: { status: "SENT", sentAt: new Date() } });
        }
        else if (cur < RANK.DELIVERED || row.status === "FAILED") {
            await this.prisma.notification.update({ where: { id: row.id }, data: { status: "DELIVERED", deliveredAt: e.occurredAt ? new Date(e.occurredAt) : new Date(), error: null } });
        }
        return true;
    }
};
exports.ProviderEventsService = ProviderEventsService;
exports.ProviderEventsService = ProviderEventsService = ProviderEventsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(paylinks_service_1.PayLinksService)),
    __param(2, (0, common_1.Inject)(consent_service_1.ConsentService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, paylinks_service_1.PayLinksService, consent_service_1.ConsentService])
], ProviderEventsService);
//# sourceMappingURL=provider-events.service.js.map