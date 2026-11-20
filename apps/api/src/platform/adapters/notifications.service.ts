import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { adapterMode, ProviderNotWiredError } from "./adapter-mode";

/** Placeholder templates (TODO_NEEDS_HUMAN: real WhatsApp/SMS/email template ids + legal wording). Same rendering path in mock and real. */
export const TEMPLATES: Record<string, { en: string; ar: string }> = {
  "shift.variance": { en: "Shift variance alert: branch {branch}, variance {variance} {currency} (threshold {threshold}).", ar: "تنبيه فرق الوردية: فرع {branch}، الفرق {variance} {currency} (الحد {threshold})." },
  "expiry.alert": { en: "Expiry alert: {drug} lot {lot} expires in {days} days ({qty} on hand).", ar: "تنبيه انتهاء صلاحية: {drug} تشغيلة {lot} تنتهي خلال {days} يوم (الكمية {qty})." },
  "recall.notice": { en: "RECALL: {drug} lot(s) {lots} blocked across all branches. Reason: {reason}", ar: "سحب: تم إيقاف {drug} التشغيلات {lots} في كل الفروع. السبب: {reason}" },
  "po.send": { en: "Purchase order {po} from Kiorly Pharmacy ({branch}). Lines: {lines}", ar: "أمر شراء {po} من كيورلي فارمسي ({branch}). البنود: {lines}" },
  "rx.refill_reminder": { en: "Refill reminder from {pharmacy}: your prescription {rx} is due for refill on {date}. Reply or visit us to collect it.", ar: "تذكير من {pharmacy}: موعد إعادة صرف الروشتة {rx} بتاريخ {date}. تفضل بزيارتنا لاستلامها." },
  "order.inbox": { en: "New Kiorex order {order}: respond within {minutes} minutes.", ar: "طلب كيوريكس جديد {order}: يرجى الرد خلال {minutes} دقيقة." },
};

export function renderTemplate(template: string, locale: "en" | "ar", vars: Record<string, string | number>): string {
  const t = TEMPLATES[template];
  if (!t) throw new Error(`Unknown notification template: ${template}`);
  return t[locale].replace(/\{(\w+)\}/g, (_m, k: string) => String(vars[k] ?? `{${k}}`));
}

export interface SendInput {
  orgId: string; channel: "WHATSAPP" | "SMS" | "EMAIL" | "PUSH"; recipient: string; template: string; locale?: "en" | "ar";
  vars?: Record<string, string | number>; refType?: string; refId?: string;
}

/** Notifications (mock): renders the template, records the message in the DB dev inbox (Notification) and marks it SENT. Real providers go-live later. */
@Injectable()
export class NotificationsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async send(i: SendInput) {
    const locale = i.locale ?? "ar";
    const body = renderTemplate(i.template, locale, i.vars ?? {});
    if (adapterMode("MESSAGING") === "real") throw new ProviderNotWiredError("messaging");
    return this.prisma.notification.create({
      data: { orgId: i.orgId, channel: i.channel, recipient: i.recipient, template: i.template, locale, body, status: "SENT", sentAt: new Date(), refType: i.refType, refId: i.refId, provider: "mock" },
    });
  }
}
