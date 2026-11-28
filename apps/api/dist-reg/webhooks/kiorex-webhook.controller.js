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
exports.WebhooksModule = exports.KiorexWebhookController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@kiorex/contracts");
const secret_box_1 = require("../common/secret-box");
const decorators_1 = require("../auth/decorators");
const prisma_service_1 = require("../prisma/prisma.service");
const prescriptions_service_1 = require("../modules/prescriptions/prescriptions.service");
const prescriptions_module_1 = require("../modules/prescriptions/prescriptions.module");
const requires_flag_guard_1 = require("../feature-flags/requires-flag.guard");
const errors_1 = require("../common/errors");
const tenant_mode_service_1 = require("../tenancy/tenant-mode.service");
let KiorexWebhookController = class KiorexWebhookController {
    prisma;
    rx;
    mode;
    constructor(prisma, rx, mode) {
        this.prisma = prisma;
        this.rx = rx;
        this.mode = mode;
    }
    async receive(req, h) {
        const key = h[contracts_1.WEBHOOK_HEADERS.clientKey.toLowerCase()];
        const client = key ? await this.prisma.integrationClient.findUnique({ where: { key } }) : null;
        if (!client || !client.active || !client.webhookSecretEnc)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "INVALID_CLIENT", message: "unknown client key" });
        if (await this.mode.isStandalone(client.orgId))
            throw new errors_1.DomainError("STANDALONE_MODE", "This pharmacy runs in standalone mode; Kiorex integration is off", 403);
        const secret = (0, secret_box_1.open)(client.webhookSecretEnc);
        const raw = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
        const v = (0, contracts_1.verifyWebhook)({ secret, body: raw, timestamp: h["x-kiorly-timestamp"], signature: h["x-kiorly-signature"] });
        if (!v.ok)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "BAD_SIGNATURE", message: v.reason });
        const type = String(req.body.type ?? "");
        const eventId = String(req.body.eventId ?? "");
        if (!eventId)
            throw new common_1.BadRequestException({ statusCode: 400, code: "EVENT_ID_REQUIRED", message: "eventId required" });
        if (type !== "PrescriptionIssued") {
            return { accepted: true, ignored: true, type };
        }
        const tenant = await this.prisma.tenant.findUnique({ where: { id: client.orgId } });
        if (!tenant)
            throw new errors_1.DomainError("UNKNOWN_ORG", "client key is not bound to a pharmacy tenant", 404);
        const branchId = h["x-kiorex-branch-id"] ?? (await this.prisma.branch.findFirst({ where: { orgId: tenant.id, active: true }, orderBy: { createdAt: "asc" } }))?.id;
        if (!branchId)
            throw new errors_1.DomainError("NO_BRANCH", "Tenant has no branch", 409);
        const dup = await this.prisma.inboundEvent.findUnique({ where: { orgId_eventId: { orgId: tenant.id, eventId } } });
        if (dup)
            return { accepted: true, duplicate: true };
        const r = await this.rx.intakeEvent(tenant.id, branchId, req.body);
        return { accepted: true, ...r };
    }
};
exports.KiorexWebhookController = KiorexWebhookController;
__decorate([
    (0, common_1.Post)("kiorex"),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard),
    (0, requires_flag_guard_1.RequiresFlag)("pharmacy.module"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], KiorexWebhookController.prototype, "receive", null);
exports.KiorexWebhookController = KiorexWebhookController = __decorate([
    (0, swagger_1.ApiTags)("webhooks"),
    (0, decorators_1.Public)(),
    (0, common_1.Controller)("webhooks"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(prescriptions_service_1.PrescriptionsService)),
    __param(2, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, prescriptions_service_1.PrescriptionsService, tenant_mode_service_1.TenantModeService])
], KiorexWebhookController);
let WebhooksModule = class WebhooksModule {
};
exports.WebhooksModule = WebhooksModule;
exports.WebhooksModule = WebhooksModule = __decorate([
    (0, common_1.Module)({ imports: [prescriptions_module_1.PrescriptionsModule], controllers: [KiorexWebhookController] })
], WebhooksModule);
//# sourceMappingURL=kiorex-webhook.controller.js.map