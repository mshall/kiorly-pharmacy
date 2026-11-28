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
var PushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = exports.PUSH_TEMPLATES = void 0;
exports.renderPush = renderPush;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const adapter_mode_1 = require("../../platform/adapters/adapter-mode");
const http_1 = require("../../providers/http");
const provider_env_1 = require("../../providers/provider-env");
const push_provider_1 = require("../../providers/push-provider");
const mobile_entitlement_service_1 = require("./mobile-entitlement.service");
exports.PUSH_TEMPLATES = {
    "rx.awaiting": { kind: "CLINICAL", en: ["Prescription awaiting verification", "A new prescription is waiting in the verification queue."], ar: ["وصفة بانتظار المراجعة", "وصفة جديدة في طابور مراجعة الصيدلي."] },
    "order.received": { kind: "OPS", en: ["New Kiorex order", "Order {order} arrived. Respond within {minutes} minutes."], ar: ["طلب كيوريكس جديد", "وصل الطلب {order}. يرجى الرد خلال {minutes} دقيقة."] },
    "controlled.discrepancy": { kind: "SAFETY", en: ["Controlled-drug discrepancy", "{drug}: expected {expected}, counted {counted}. Countersign required."], ar: ["فرق في دواء مراقب", "{drug}: المتوقع {expected} والمعدود {counted}. مطلوب توقيع شاهد."] },
    "stock.expiry": { kind: "OPS", en: ["Expiry alert", "{drug} lot {lot} expires in {days} days ({qty} on hand)."], ar: ["تنبيه صلاحية", "{drug} تشغيلة {lot} تنتهي خلال {days} يوم (الكمية {qty})."] },
    "upgrade.request": { kind: "OPS", en: ["Staff asked to upgrade Kiorly", "A team member asked for the Kiorly staff app (Pro plan). Review your plan in Settings."], ar: ["طلب موظف ترقية كيورلي", "طلب أحد أعضاء الفريق تطبيق كيورلي للموظفين (باقة Pro). راجع باقتك من الإعدادات."] },
    "push.test": { kind: "GENERAL", en: ["Kiorly test", "Push notifications are working on this device."], ar: ["اختبار كيورلي", "الإشعارات تعمل على هذا الجهاز."] },
};
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_m, k) => String(v[k] ?? `{${k}}`));
function renderPush(t, vars = {}) {
    const d = exports.PUSH_TEMPLATES[t];
    return { kind: d.kind, title: fill(d.en[0], vars), body: fill(d.en[1], vars), titleAr: fill(d.ar[0], vars), bodyAr: fill(d.ar[1], vars) };
}
let PushService = class PushService {
    static { PushService_1 = this; }
    prisma;
    ent;
    log = new common_1.Logger(PushService_1.name);
    static fetchImpl;
    constructor(prisma, ent) {
        this.prisma = prisma;
        this.ent = ent;
    }
    static channelFor(kind) { return kind === "SAFETY" ? "safety" : kind === "CLINICAL" ? "clinical" : kind === "OPS" ? "ops" : "default"; }
    async send(i) {
        try {
            if (i.kind !== "SAFETY" && !i.allowUnentitled && !(await this.ent.evaluate(i.orgId)).enabled)
                return { delivered: 0 };
            const users = await this.prisma.staffUser.findMany({
                where: { orgId: i.orgId, active: true, ...(i.userIds ? { id: { in: i.userIds } } : {}), ...(i.roles ? { role: { in: i.roles } } : {}), ...(i.branchId ? { OR: [{ branchId: null }, { branchId: i.branchId }] } : {}) },
                select: { id: true },
            });
            if (!users.length)
                return { delivered: 0 };
            const mode = (0, adapter_mode_1.adapterMode)("PUSH");
            if (mode === "real" && (0, provider_env_1.validateProviderConfig)(process.env, ["PUSH"]).length)
                throw new http_1.ProviderError("NOT_CONFIGURED", "push credentials are not set (PUSH_MODE=real: PUSH_FCM_SERVICE_ACCOUNT_JSON and/or PUSH_EXPO_ENABLED, or PUSH_API_URL)");
            const now = new Date();
            await this.prisma.pushMessage.createMany({
                data: users.map((u) => ({ orgId: i.orgId, userId: u.id, kind: i.kind, title: i.title, titleAr: i.titleAr, body: i.body, bodyAr: i.bodyAr, data: (i.data ?? {}), provider: mode === "real" ? "push" : "mock", deliveredAt: mode === "real" ? null : now })),
            });
            if (mode === "real") {
                const tokens = (await this.prisma.mobileDevice.findMany({ where: { orgId: i.orgId, status: "ACTIVE", userId: { in: users.map((u) => u.id) }, pushToken: { not: null } }, select: { pushToken: true } })).map((d) => d.pushToken).filter((t) => t && !t.startsWith("mock-"));
                if (tokens.length) {
                    const r = await (0, push_provider_1.sendPush)(tokens.map((to) => ({ to, title: i.title, body: i.body, data: i.data, channelId: PushService_1.channelFor(i.kind) })), process.env, PushService_1.fetchImpl);
                    if (r.invalid.length)
                        await this.prisma.mobileDevice.updateMany({ where: { orgId: i.orgId, pushToken: { in: r.invalid } }, data: { pushToken: null, pushProvider: null } });
                }
            }
            if (mode === "mock") {
                const devices = await this.prisma.mobileDevice.count({ where: { orgId: i.orgId, status: "ACTIVE", userId: { in: users.map((u) => u.id) }, pushToken: { not: null } } });
                this.log.debug(`[mock push] ${i.kind} "${i.title}" -> ${users.length} inbox(es), ${devices} device(s)`);
            }
            return { delivered: users.length };
        }
        catch (e) {
            this.log.warn(`push failed (ignored): ${e.message}`);
            return { delivered: 0 };
        }
    }
    sendTemplate(orgId, t, vars, to, data = {}) {
        return this.send({ orgId, ...renderPush(t, vars), ...to, data: { template: t, ...data } });
    }
};
exports.PushService = PushService;
exports.PushService = PushService = PushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(mobile_entitlement_service_1.MobileEntitlementService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, mobile_entitlement_service_1.MobileEntitlementService])
], PushService);
//# sourceMappingURL=push.service.js.map