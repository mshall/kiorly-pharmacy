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
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = exports.SUBJECTS = exports.TEMPLATES = void 0;
exports.renderSubject = renderSubject;
exports.renderTemplate = renderTemplate;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const http_1 = require("../../providers/http");
const messaging_provider_1 = require("../../providers/messaging-provider");
const provider_env_1 = require("../../providers/provider-env");
exports.TEMPLATES = {
    "shift.variance": { en: "Shift variance alert: branch {branch}, variance {variance} {currency} (threshold {threshold}).", ar: "تنبيه فرق الوردية: فرع {branch}، الفرق {variance} {currency} (الحد {threshold})." },
    "expiry.alert": { en: "Expiry alert: {drug} lot {lot} expires in {days} days ({qty} on hand).", ar: "تنبيه انتهاء صلاحية: {drug} تشغيلة {lot} تنتهي خلال {days} يوم (الكمية {qty})." },
    "recall.notice": { en: "RECALL: {drug} lot(s) {lots} blocked across all branches. Reason: {reason}", ar: "سحب: تم إيقاف {drug} التشغيلات {lots} في كل الفروع. السبب: {reason}" },
    "po.send": { en: "Purchase order {po} from Kiorly Pharmacy ({branch}). Lines: {lines}", ar: "أمر شراء {po} من كيورلي فارمسي ({branch}). البنود: {lines}" },
    "rx.refill_reminder": { en: "Refill reminder from {pharmacy}: your prescription {rx} is due for refill on {date}. Reply or visit us to collect it.", ar: "تذكير من {pharmacy}: موعد إعادة صرف الروشتة {rx} بتاريخ {date}. تفضل بزيارتنا لاستلامها." },
    "rfq.send": { en: "Request for quotation {rfq} from Kiorly Pharmacy ({branch}). Items: {lines}. Please reply with your prices by {due}.", ar: "طلب عرض سعر {rfq} من كيورلي فارمسي ({branch}). الأصناف: {lines}. يرجى الرد بالأسعار قبل {due}." },
    "order.ready": { en: "{pharmacy}: your order {order} is ready for {method}. Thank you.", ar: "{pharmacy}: طلبك {order} جاهز لـ{method}. شكراً لك." },
    "order.out_for_delivery": { en: "{pharmacy}: your order {order} is out for delivery. Thank you.", ar: "{pharmacy}: طلبك {order} في الطريق إليك. شكراً لك." },
    "receipt.email": { en: "{pharmacy}: receipt {receipt} on {date}. Total {total} {currency}. Thank you for your purchase.", ar: "{pharmacy}: إيصال {receipt} بتاريخ {date}. الإجمالي {total} {currency}. شكراً لشرائك." },
    "paylink.send": { en: "{pharmacy}: pay {amount} {currency} towards your account securely: {link}", ar: "{pharmacy}: ادفع {amount} {currency} لحسابك بأمان: {link}" },
    "paylink.receipt": { en: "{pharmacy}: we received your payment of {amount} {currency}. Remaining balance {balance} {currency}. Thank you.", ar: "{pharmacy}: استلمنا دفعتك بقيمة {amount} {currency}. الرصيد المتبقي {balance} {currency}. شكراً لك." },
    "order.inbox": { en: "New Kiorex order {order}: respond within {minutes} minutes.", ar: "طلب كيوريكس جديد {order}: يرجى الرد خلال {minutes} دقيقة." },
};
exports.SUBJECTS = {
    "rx.refill_reminder": { en: "Prescription refill reminder", ar: "تذكير بإعادة صرف الروشتة" },
    "order.ready": { en: "Your order is ready", ar: "طلبك جاهز" },
    "order.out_for_delivery": { en: "Your order is out for delivery", ar: "طلبك في الطريق إليك" },
    "receipt.email": { en: "Your receipt {receipt}", ar: "إيصالك {receipt}" },
    "paylink.send": { en: "Pay your account balance", ar: "سداد رصيد حسابك" },
    "paylink.receipt": { en: "Payment received", ar: "تم استلام الدفع" },
    "po.send": { en: "Purchase order {po}", ar: "أمر شراء {po}" },
    "rfq.send": { en: "Request for quotation {rfq}", ar: "طلب عرض سعر {rfq}" },
};
function renderSubject(template, locale, vars) {
    const t = exports.SUBJECTS[template]?.[locale] ?? "Kiorly Pharmacy";
    return t.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? `{${k}}`));
}
function renderTemplate(template, locale, vars) {
    const t = exports.TEMPLATES[template];
    if (!t)
        throw new Error(`Unknown notification template: ${template}`);
    return t[locale].replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? `{${k}}`));
}
let NotificationsService = class NotificationsService {
    static { NotificationsService_1 = this; }
    prisma;
    log = new common_1.Logger(NotificationsService_1.name);
    static fetchImpl;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(i) {
        const locale = i.locale ?? "ar";
        const vars = i.vars ?? {};
        const body = renderTemplate(i.template, locale, vars);
        const kind = i.channel === "SMS" || i.channel === "EMAIL" || i.channel === "WHATSAPP" ? i.channel : null;
        const base = { orgId: i.orgId, channel: i.channel, recipient: i.recipient, template: i.template, locale, body, refType: i.refType, refId: i.refId };
        if (!kind)
            return this.prisma.notification.create({ data: { ...base, status: "SENT", sentAt: new Date(), provider: "mock" } });
        const provider = (0, messaging_provider_1.messageProvider)(kind, process.env, NotificationsService_1.fetchImpl);
        const row = await this.prisma.notification.create({ data: { ...base, status: "QUEUED", provider: provider.name } });
        try {
            const cfg = (0, provider_env_1.providerConfig)(kind);
            const r = await provider.send({ channel: kind, to: i.recipient, from: cfg.senderId, templateId: i.template, locale, subject: kind === "EMAIL" ? renderSubject(i.template, locale, vars) : undefined, text: body, params: vars, reference: row.id, idempotencyKey: row.id });
            return this.prisma.notification.update({ where: { id: row.id }, data: { status: "SENT", sentAt: new Date(), providerMessageId: r.providerMessageId, error: null } });
        }
        catch (e) {
            const code = e instanceof http_1.ProviderError ? e.code : "UNEXPECTED";
            this.log.warn(`${kind} send failed (${code}) for notification ${row.id}`);
            return this.prisma.notification.update({ where: { id: row.id }, data: { status: "FAILED", error: `${code}: ${e instanceof http_1.ProviderError ? e.message : "unexpected provider failure"}`.slice(0, 200) } });
        }
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map