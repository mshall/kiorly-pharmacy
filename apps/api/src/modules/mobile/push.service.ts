import { Inject, Injectable, Logger } from "@nestjs/common";
import type { Prisma, StaffRole } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { adapterMode } from "../../platform/adapters/adapter-mode";
import { MobileEntitlementService } from "./mobile-entitlement.service";

export type PushKind = "GENERAL" | "SAFETY" | "CLINICAL" | "OPS";
export interface PushInput {
  orgId: string; kind: PushKind; title: string; titleAr: string; body: string; bodyAr: string; data?: Record<string, unknown>;
  userIds?: string[]; roles?: StaffRole[]; branchId?: string | null;
}

/** Bilingual templates (rendered the same way in mock and real mode). */
export const PUSH_TEMPLATES = {
  "rx.awaiting": { kind: "CLINICAL", en: ["Prescription awaiting verification", "A new prescription is waiting in the verification queue."], ar: ["وصفة بانتظار المراجعة", "وصفة جديدة في طابور مراجعة الصيدلي."] },
  "order.received": { kind: "OPS", en: ["New Kiorex order", "Order {order} arrived. Respond within {minutes} minutes."], ar: ["طلب كيوريكس جديد", "وصل الطلب {order}. يرجى الرد خلال {minutes} دقيقة."] },
  "controlled.discrepancy": { kind: "SAFETY", en: ["Controlled-drug discrepancy", "{drug}: expected {expected}, counted {counted}. Countersign required."], ar: ["فرق في دواء مراقب", "{drug}: المتوقع {expected} والمعدود {counted}. مطلوب توقيع شاهد."] },
  "stock.expiry": { kind: "OPS", en: ["Expiry alert", "{drug} lot {lot} expires in {days} days ({qty} on hand)."], ar: ["تنبيه صلاحية", "{drug} تشغيلة {lot} تنتهي خلال {days} يوم (الكمية {qty})."] },
  "push.test": { kind: "GENERAL", en: ["Kiorly Work test", "Push notifications are working on this device."], ar: ["اختبار كيورلي ورك", "الإشعارات تعمل على هذا الجهاز."] },
} as const;
export type PushTemplate = keyof typeof PUSH_TEMPLATES;
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_m, k: string) => String(v[k] ?? `{${k}}`));
export function renderPush(t: PushTemplate, vars: Record<string, string | number> = {}) {
  const d = PUSH_TEMPLATES[t];
  return { kind: d.kind as PushKind, title: fill(d.en[0], vars), body: fill(d.en[1], vars), titleAr: fill(d.ar[0], vars), bodyAr: fill(d.ar[1], vars) };
}

/**
 * Push sender. PUSH_MODE=mock (default): the in-app inbox row (PushMessage) is the dev inbox and delivery to each registered device
 * is simulated (deliveredAt set). Real Expo push is wired in the provider go-live pass. Never throws into business flows.
 * SAFETY messages are sent for every plan (ADR-025); everything else only when the org holds mobile_staff_app.
 */
@Injectable()
export class PushService {
  private readonly log = new Logger(PushService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(MobileEntitlementService) private readonly ent: MobileEntitlementService) {}

  async send(i: PushInput): Promise<{ delivered: number }> {
    try {
      if (i.kind !== "SAFETY" && !(await this.ent.evaluate(i.orgId)).enabled) return { delivered: 0 };
      const users = await this.prisma.staffUser.findMany({
        where: { orgId: i.orgId, active: true, ...(i.userIds ? { id: { in: i.userIds } } : {}), ...(i.roles ? { role: { in: i.roles } } : {}), ...(i.branchId ? { OR: [{ branchId: null }, { branchId: i.branchId }] } : {}) },
        select: { id: true },
      });
      if (!users.length) return { delivered: 0 };
      const mode = adapterMode("PUSH");
      const now = new Date();
      await this.prisma.pushMessage.createMany({
        data: users.map((u) => ({ orgId: i.orgId, userId: u.id, kind: i.kind, title: i.title, titleAr: i.titleAr, body: i.body, bodyAr: i.bodyAr, data: (i.data ?? {}) as Prisma.InputJsonValue, provider: mode === "real" ? "expo" : "mock", deliveredAt: mode === "real" ? null : now })),
      });
      if (mode === "mock") {
        const devices = await this.prisma.mobileDevice.count({ where: { orgId: i.orgId, status: "ACTIVE", userId: { in: users.map((u) => u.id) }, pushToken: { not: null } } });
        this.log.debug(`[mock push] ${i.kind} "${i.title}" -> ${users.length} inbox(es), ${devices} device(s)`);
      }
      return { delivered: users.length };
    } catch (e) {
      this.log.warn(`push failed (ignored): ${(e as Error).message}`);
      return { delivered: 0 };
    }
  }

  sendTemplate(orgId: string, t: PushTemplate, vars: Record<string, string | number>, to: { roles?: StaffRole[]; userIds?: string[]; branchId?: string | null }, data: Record<string, unknown> = {}) {
    return this.send({ orgId, ...renderPush(t, vars), ...to, data: { template: t, ...data } });
  }
}
