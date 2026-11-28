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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevProvidersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const node_crypto_1 = require("node:crypto");
const decorators_1 = require("../auth/decorators");
const notifications_service_1 = require("../platform/adapters/notifications.service");
const paylinks_service_1 = require("../modules/pos/paylinks.service");
const prisma_service_1 = require("../prisma/prisma.service");
const provider_events_service_1 = require("./provider-events.service");
const provider_env_1 = require("./provider-env");
const webhook_signature_1 = require("./webhook-signature");
const ai_gateway_1 = require("../platform/adapters/ai.gateway");
const consent_service_1 = require("../platform/adapters/consent.service");
const storage_adapter_1 = require("../platform/adapters/storage.adapter");
const provider_types_1 = require("./provider-types");
const storage_policy_1 = require("./storage-policy");
const EVENT_TYPES = ["message.sent", "message.delivered", "message.read", "message.failed", "payment.succeeded", "payment.failed", "payment.expired", "refund.succeeded", "refund.failed", "consent.granted", "consent.revoked", "consent.expired"];
const on = () => { if (!(0, provider_env_1.devToolsEnabled)())
    throw new common_1.NotFoundException(); };
let DevProvidersController = class DevProvidersController {
    prisma;
    notify;
    payLinks;
    events;
    consents;
    ai;
    storage;
    constructor(prisma, notify, payLinks, events, consents, ai, storage) {
        this.prisma = prisma;
        this.notify = notify;
        this.payLinks = payLinks;
        this.events = events;
        this.consents = consents;
        this.ai = ai;
        this.storage = storage;
    }
    status() {
        on();
        return provider_env_1.PROVIDER_KINDS.map((k) => { const c = (0, provider_env_1.providerConfig)(k); return { kind: k, mode: (0, provider_env_1.providerMode)(k), apiUrlSet: !!c.apiUrl, apiKeySet: !!c.apiKey, webhookSecretSet: !!c.webhookSecret, senderIdSet: !!c.senderId, ...(k === "AI" ? { modelSet: !!c.model } : {}) }; });
    }
    async messages(u, q) {
        on();
        const rows = await this.prisma.notification.findMany({ where: { orgId: u.orgId, ...(q.channel ? { channel: q.channel } : {}) }, orderBy: { createdAt: "desc" }, take: Math.min(Number(q.limit) || 50, 200) });
        return rows.map((r) => ({ ...r, subject: r.channel === "EMAIL" ? (0, notifications_service_1.renderSubject)(r.template, r.locale === "en" ? "en" : "ar", {}) : undefined }));
    }
    payLinkList(u) { on(); return this.payLinks.list(u.orgId); }
    async simulate(b) {
        on();
        return this.simulateEvent(b.kind, b.type, b.providerRef, { error: b.error, amount: b.amount, eventId: b.eventId });
    }
    async simulateEvent(kindIn, type, providerRef, x = {}) {
        const kind = String(kindIn).toUpperCase();
        if (!provider_env_1.WEBHOOK_KINDS.includes(kind))
            throw new common_1.BadRequestException({ code: "UNKNOWN_KIND", kinds: provider_env_1.WEBHOOK_KINDS });
        if (!EVENT_TYPES.includes(type) || !providerRef)
            throw new common_1.BadRequestException({ code: "BAD_EVENT", types: EVENT_TYPES });
        if ((0, provider_env_1.providerMode)(kind) !== "mock")
            throw new common_1.ConflictException({ code: "SIMULATION_ONLY_IN_MOCK_MODE", message: `${kind}_MODE is real; the provider sends real callbacks` });
        const body = JSON.stringify({ id: x.eventId ?? `evt_sim_${(0, node_crypto_1.randomUUID)()}`, type, createdAt: new Date().toISOString(), data: { id: providerRef, ...(x.error ? { error: x.error } : {}), ...(x.amount ? { amount: x.amount } : {}) } });
        const result = await this.events.ingest(kind, body, (0, webhook_signature_1.signWebhook)((0, provider_env_1.webhookSecretFor)(kind) ?? provider_env_1.MOCK_WEBHOOK_SECRET, body));
        return { simulated: type, providerRef, ...result };
    }
    async consentDemo(u) { on(); return this.runConsentDemo(u); }
    async runConsentDemo(u) {
        let p = await this.prisma.patientRef.findFirst({ where: { orgId: u.orgId, displayName: "Demo Consent Customer (DEMO)" } });
        if (!p)
            p = await this.prisma.patientRef.create({ data: { orgId: u.orgId, displayName: "Demo Consent Customer (DEMO)", phone: "+201000000005", consentMarketing: true, consentDataProcessing: true } });
        await this.prisma.patientRef.update({ where: { id: p.id }, data: { consentMarketing: true } });
        const granted = await this.consents.grant(u.orgId, { subjectRef: p.id, patientId: p.id, purpose: "MARKETING", source: "DEV_DEMO", actorId: u.userId });
        const before = await this.consents.status(u.orgId, p.id, "MARKETING");
        let revoke;
        if ((0, provider_env_1.providerMode)("CONSENT") === "mock")
            revoke = await this.simulateEvent("CONSENT", "consent.revoked", granted.providerRef, { error: "patient withdrew consent (demo)" });
        else {
            await this.consents.revoke(u.orgId, granted.id, "demo revoke", u.userId);
            revoke = { via: "local revoke synced to the registry" };
        }
        const after = await this.consents.status(u.orgId, p.id, "MARKETING");
        const patient = await this.prisma.patientRef.findUniqueOrThrow({ where: { id: p.id }, select: { consentMarketing: true } });
        return { purposes: provider_types_1.CONSENT_PURPOSES, customerId: p.id, consentId: granted.id, providerRef: granted.providerRef, validAfterGrant: before.valid, revoke, validAfterRevoke: after.valid, customerMarketingFlag: patient.consentMarketing, record: after.history[0] };
    }
    async aiSample(u, b = {}) {
        on();
        return this.ai.assist({
            orgId: u.orgId, actorId: u.userId, task: "dev.sample", names: b.names ?? ["Mona Hassan"],
            prompt: b.prompt ?? "Patient Mona Hassan (phone +201001234567, email mona.demo@example.test, DOB 1984-03-02, MRN 884213) asks whether metformin 500 mg can be taken with ibuprofen. Summarise key counselling points.",
        });
    }
    async storageRoundtrip(u) {
        on();
        const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
        const put = await this.storage.putDataUrl(`dev-demo/${u.orgId}/roundtrip-${(0, node_crypto_1.randomUUID)()}`, `data:image/png;base64,${png.toString("base64")}`);
        const got = await this.storage.get(put.key);
        const url = this.storage.signedUrl(put.key, 60);
        const q = new URL(`http://x${url.path}`).searchParams;
        const tampered = (0, storage_policy_1.verifyDownload)(put.key, q.get("exp"), "0".repeat(64));
        const expired = (0, storage_policy_1.verifyDownload)(put.key, q.get("exp"), q.get("sig"), process.env, Date.now() + 3_600_000);
        return { key: put.key, bytes: put.bytes, contentType: put.contentType, readBack: { bytes: got?.bytes.length ?? null, identical: !!got && got.bytes.equals(png), contentType: got?.contentType }, signedUrl: url.path, expiresAt: url.expiresAt, tamperedSignature: tampered, afterExpiry: expired };
    }
    async demo(u, b = {}) {
        on();
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
        const sends = [
            { flow: "order ready (WhatsApp)", channel: "WHATSAPP", to: "+201000000001", template: "order.ready", vars: { pharmacy: t.name, order: "DEMO-ORD-1", method: "pickup" } },
            { flow: "refill reminder (WhatsApp)", channel: "WHATSAPP", to: "+201000000002", template: "rx.refill_reminder", vars: { pharmacy: t.name, rx: "DEMO01", date: new Date().toISOString().slice(0, 10) } },
            { flow: "receipt email", channel: "EMAIL", to: "customer.demo@example.test", template: "receipt.email", vars: { pharmacy: t.name, receipt: "R-DEMO-1", date: new Date().toISOString().slice(0, 10), total: "125.50", currency: "EGP" } },
            { flow: "receipt SMS", channel: "SMS", to: "+201000000003", template: "receipt.email", vars: { pharmacy: t.name, receipt: "R-DEMO-2", date: new Date().toISOString().slice(0, 10), total: "48.00", currency: "EGP" } },
        ];
        const messages = [];
        for (const s of sends) {
            const n = await this.notify.send({ orgId: u.orgId, channel: s.channel, recipient: s.to, template: s.template, locale: "en", vars: s.vars, refType: "DemoFlow", refId: s.flow });
            let receipt = null;
            if (n.providerMessageId && n.status !== "FAILED" && (0, provider_env_1.providerMode)(s.channel) === "mock")
                receipt = await this.simulateEvent(s.channel, "message.delivered", n.providerMessageId);
            messages.push({ flow: s.flow, notificationId: n.id, status: n.status, providerMessageId: n.providerMessageId, receipt });
        }
        const payments = {};
        if (b.payments !== false && (0, provider_env_1.providerMode)("PAYMENT") === "mock") {
            let acc = await this.prisma.customerAccount.findFirst({ where: { orgId: u.orgId, balance: { gt: 5 } }, orderBy: { createdAt: "desc" } });
            if (!acc) {
                const p = await this.prisma.patientRef.create({ data: { orgId: u.orgId, displayName: "Demo Credit Customer (DEMO)", phone: "+201000000004", email: "credit.demo@example.test" } });
                acc = await this.prisma.customerAccount.create({ data: { orgId: u.orgId, patientId: p.id, creditLimit: 500, balance: 120 } });
                await this.prisma.customerCreditEntry.create({ data: { orgId: u.orgId, accountId: acc.id, kind: "CHARGE", amount: 120, note: "demo balance", createdBy: u.userId } });
            }
            const ok = await this.payLinks.create(u, acc.id, { amount: "1.00" }, `demo-ok-${(0, node_crypto_1.randomUUID)()}`);
            payments.success = { linkId: ok.link.id, payUrl: ok.link.payUrl, paid: await this.simulateEvent("PAYMENT", "payment.succeeded", ok.link.providerRef, { amount: "1.00" }) };
            payments.refund = await this.payLinks.refund(u, ok.link.id, { reason: "demo refund" });
            const bad = await this.payLinks.create(u, acc.id, { amount: "1.00" }, `demo-fail-${(0, node_crypto_1.randomUUID)()}`);
            payments.failure = { linkId: bad.link.id, result: await this.simulateEvent("PAYMENT", "payment.failed", bad.link.providerRef, { error: "card_declined" }) };
            payments.account = acc.id;
        }
        const extras = {};
        if (b.consent !== false)
            extras.consent = await this.runConsentDemo(u);
        if (b.ai !== false)
            extras.ai = await this.aiSample(u);
        if (b.storage !== false)
            extras.storage = await this.storageRoundtrip(u);
        return { messages, payments, ...extras };
    }
};
exports.DevProvidersController = DevProvidersController;
__decorate([
    (0, common_1.Get)("status"),
    (0, decorators_1.Perm)("settings.write"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DevProvidersController.prototype, "status", null);
__decorate([
    (0, common_1.Get)("messages"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevProvidersController.prototype, "messages", null);
__decorate([
    (0, common_1.Get)("pay-links"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DevProvidersController.prototype, "payLinkList", null);
__decorate([
    (0, common_1.Post)("simulate/webhook"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevProvidersController.prototype, "simulate", null);
__decorate([
    (0, common_1.Post)("consent/demo"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevProvidersController.prototype, "consentDemo", null);
__decorate([
    (0, common_1.Post)("ai/sample"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevProvidersController.prototype, "aiSample", null);
__decorate([
    (0, common_1.Post)("storage/roundtrip"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevProvidersController.prototype, "storageRoundtrip", null);
__decorate([
    (0, common_1.Post)("demo/run"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DevProvidersController.prototype, "demo", null);
exports.DevProvidersController = DevProvidersController = __decorate([
    (0, swagger_1.ApiTags)("dev-providers"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("dev/providers"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(2, (0, common_1.Inject)(paylinks_service_1.PayLinksService)),
    __param(3, (0, common_1.Inject)(provider_events_service_1.ProviderEventsService)),
    __param(4, (0, common_1.Inject)(consent_service_1.ConsentService)),
    __param(5, (0, common_1.Inject)(ai_gateway_1.AiGateway)),
    __param(6, (0, common_1.Inject)(storage_adapter_1.StorageAdapter)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        paylinks_service_1.PayLinksService,
        provider_events_service_1.ProviderEventsService,
        consent_service_1.ConsentService,
        ai_gateway_1.AiGateway,
        storage_adapter_1.StorageAdapter])
], DevProvidersController);
//# sourceMappingURL=dev-providers.controller.js.map