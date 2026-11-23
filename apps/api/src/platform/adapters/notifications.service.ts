import { Inject, Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ProviderError, type FetchLike } from "../../providers/http";
import { messageProvider } from "../../providers/messaging-provider";
import { providerConfig } from "../../providers/provider-env";

/** Placeholder templates (TODO_NEEDS_HUMAN: approved WhatsApp/SMS/email template ids + legal wording; the template key is the provider template name). Same rendering path in mock and real. */
export const TEMPLATES: Record<string, { en: string; ar: string }> = {
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

/** Email subjects (other channels ignore them). */
export const SUBJECTS: Record<string, { en: string; ar: string }> = {
  "rx.refill_reminder": { en: "Prescription refill reminder", ar: "تذكير بإعادة صرف الروشتة" },
  "order.ready": { en: "Your order is ready", ar: "طلبك جاهز" },
  "order.out_for_delivery": { en: "Your order is out for delivery", ar: "طلبك في الطريق إليك" },
  "receipt.email": { en: "Your receipt {receipt}", ar: "إيصالك {receipt}" },
  "paylink.send": { en: "Pay your account balance", ar: "سداد رصيد حسابك" },
  "paylink.receipt": { en: "Payment received", ar: "تم استلام الدفع" },
  "po.send": { en: "Purchase order {po}", ar: "أمر شراء {po}" },
  "rfq.send": { en: "Request for quotation {rfq}", ar: "طلب عرض سعر {rfq}" },
};

export function renderSubject(template: string, locale: "en" | "ar", vars: Record<string, string | number>): string {
  const t = SUBJECTS[template]?.[locale] ?? "Kiorly Pharmacy";
  return t.replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? `{${k}}`));
}

export function renderTemplate(template: string, locale: "en" | "ar", vars: Record<string, string | number>): string {
  const t = TEMPLATES[template];
  if (!t) throw new Error(`Unknown notification template: ${template}`);
  return t[locale].replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? `{${k}}`));
}

export interface SendInput {
  orgId: string; channel: "WHATSAPP" | "SMS" | "EMAIL" | "PUSH"; recipient: string; template: string; locale?: "en" | "ar";
  vars?: Record<string, string | number>; refType?: string; refId?: string;
}

/**
 * Notifications. SMS / EMAIL / WHATSAPP each have their own provider and switch (SMS_MODE / EMAIL_MODE / WHATSAPP_MODE; legacy MESSAGING_MODE is the default).
 * mock and real take the SAME path: render the template -> Notification row (QUEUED) -> provider.send (idempotency key = row id) -> SENT / FAILED with the mapped error;
 * delivery receipts then move it to DELIVERED via the signed webhook (POST /webhooks/providers/:kind). A provider failure is recorded, never thrown into the business flow.
 * PUSH channel rows are the in-app dev inbox only (real device push is PushService).
 */
@Injectable()
export class NotificationsService {
  private readonly log = new Logger(NotificationsService.name);
  /** Test seam: inject a fetch for the real HTTP providers. */
  static fetchImpl?: FetchLike;
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async send(i: SendInput) {
    const locale = i.locale ?? "ar";
    const vars = i.vars ?? {};
    const body = renderTemplate(i.template, locale, vars);
    const kind = i.channel === "SMS" || i.channel === "EMAIL" || i.channel === "WHATSAPP" ? i.channel : null;
    const base = { orgId: i.orgId, channel: i.channel, recipient: i.recipient, template: i.template, locale, body, refType: i.refType, refId: i.refId };
    if (!kind) return this.prisma.notification.create({ data: { ...base, status: "SENT", sentAt: new Date(), provider: "mock" } });
    const provider = messageProvider(kind, process.env, NotificationsService.fetchImpl);
    const row = await this.prisma.notification.create({ data: { ...base, status: "QUEUED", provider: provider.name } });
    try {
      const cfg = providerConfig(kind);
      const r = await provider.send({ channel: kind, to: i.recipient, from: cfg.senderId, templateId: i.template, locale, subject: kind === "EMAIL" ? renderSubject(i.template, locale, vars) : undefined, text: body, params: vars, reference: row.id, idempotencyKey: row.id });
      return this.prisma.notification.update({ where: { id: row.id }, data: { status: "SENT", sentAt: new Date(), providerMessageId: r.providerMessageId, error: null } });
    } catch (e) {
      const code = e instanceof ProviderError ? e.code : "UNEXPECTED";
      this.log.warn(`${kind} send failed (${code}) for notification ${row.id}`);
      return this.prisma.notification.update({ where: { id: row.id }, data: { status: "FAILED", error: `${code}: ${e instanceof ProviderError ? e.message : "unexpected provider failure"}`.slice(0, 200) } });
    }
  }
}
