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
var OutboxDeliveryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEBHOOK_HEADERS = exports.OutboxDeliveryService = exports.kiorexMode = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@kiorex/contracts");
Object.defineProperty(exports, "WEBHOOK_HEADERS", { enumerable: true, get: function () { return contracts_1.WEBHOOK_HEADERS; } });
const secret_box_1 = require("../common/secret-box");
const prisma_service_1 = require("../prisma/prisma.service");
const MAX_ATTEMPTS = 8;
const kiorexMode = () => (process.env.KIOREX_MODE === "real" ? "real" : "mock");
exports.kiorexMode = kiorexMode;
let OutboxDeliveryService = OutboxDeliveryService_1 = class OutboxDeliveryService {
    prisma;
    log = new common_1.Logger(OutboxDeliveryService_1.name);
    timer = null;
    mockInbox = [];
    constructor(prisma) {
        this.prisma = prisma;
    }
    onModuleInit() {
        this.announceMode();
        if (process.env.OUTBOX_POLL_ENABLED !== "false" && process.env.NODE_ENV !== "test") {
            this.timer = setInterval(() => void this.deliverDue().catch((e) => this.log.warn(String(e))), Number(process.env.OUTBOX_POLL_INTERVAL_MS ?? 5000));
            this.timer.unref();
        }
    }
    announceMode() {
        const flagsPolling = process.env.FLAGS_POLL_ENABLED === "true";
        if ((0, exports.kiorexMode)() === "real")
            this.log.log(`Kiorex outbox delivery: real (flag polling ${flagsPolling ? "on" : "OFF"})`);
        else
            this.log.warn("KIOREX_MODE=mock: outbox events are verified locally and marked SENT WITHOUT reaching Kiorex, so patient orders will not move past SUBMITTED. Set KIOREX_MODE=real FLAGS_POLL_ENABLED=true (npm run dev:kiorex, or e2e/scripts/up.sh) for the full chain.");
        if (!flagsPolling)
            this.log.warn("FLAGS_POLL_ENABLED is not true: Kiorex flag changes (pharmacy.kiorex_orders, ...) reach this API only through the signed push.");
    }
    onModuleDestroy() { if (this.timer)
        clearInterval(this.timer); }
    async target(orgId) {
        const c = await this.prisma.integrationClient.findFirst({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } });
        const secret = c?.webhookSecretEnc ? (0, secret_box_1.open)(c.webhookSecretEnc) : (process.env.KIOREX_WEBHOOK_SECRET ?? "kx_dev_pharmacy_webhook_secret");
        const url = c?.kiorexBaseUrl ? `${c.kiorexBaseUrl.replace(/\/+$/, "")}${contracts_1.PARTNER_WEBHOOK_PATH.pharmacy}` : (process.env.KIOREX_WEBHOOK_URL ?? `http://localhost:4000${contracts_1.PARTNER_WEBHOOK_PATH.pharmacy}`);
        return { secret, url, clientKey: c?.key };
    }
    async deliverDue(limit = 50) {
        const due = await this.prisma.outboxEvent.findMany({
            where: { status: "PENDING", OR: [{ nextAttemptAt: null }, { nextAttemptAt: { lte: new Date() } }] },
            orderBy: { occurredAt: "asc" }, take: limit,
        });
        let sent = 0, failed = 0;
        for (const ev of due) {
            const body = JSON.stringify(ev.payload);
            try {
                const t = await this.target(ev.orgId);
                const signed = (0, contracts_1.signWebhook)({ secret: t.secret, eventType: ev.type, eventId: ev.id, body, clientKey: t.clientKey });
                if ((0, exports.kiorexMode)() === "mock") {
                    const ok = (0, contracts_1.verifyWebhook)({ secret: t.secret, body, timestamp: signed.timestamp, signature: signed.signature });
                    if (!ok.ok)
                        throw new Error(`mock receiver rejected signature: ${ok.reason}`);
                    this.mockInbox.push({ eventId: ev.id, type: ev.type, body });
                    if (this.mockInbox.length > 500)
                        this.mockInbox.shift();
                }
                else {
                    const res = await fetch(t.url, { method: "POST", headers: signed.headers, body, signal: AbortSignal.timeout(8000) });
                    if (!res.ok)
                        throw new Error(`Kiorex responded ${res.status}`);
                }
                await this.prisma.outboxEvent.update({ where: { id: ev.id }, data: { status: "SENT", sentAt: new Date(), attempts: { increment: 1 }, lastError: null } });
                sent++;
            }
            catch (err) {
                failed++;
                const attempts = ev.attempts + 1;
                await this.prisma.outboxEvent.update({
                    where: { id: ev.id },
                    data: { attempts, lastError: err.message.slice(0, 500), status: attempts >= MAX_ATTEMPTS ? "FAILED" : "PENDING", nextAttemptAt: new Date(Date.now() + Math.min(2 ** attempts, 600) * 1000) },
                });
            }
        }
        return { sent, failed };
    }
};
exports.OutboxDeliveryService = OutboxDeliveryService;
exports.OutboxDeliveryService = OutboxDeliveryService = OutboxDeliveryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboxDeliveryService);
//# sourceMappingURL=outbox-delivery.service.js.map