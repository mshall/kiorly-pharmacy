import type { StaffRole } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { type FetchLike } from "../../providers/http";
import { MobileEntitlementService } from "./mobile-entitlement.service";
export type PushKind = "GENERAL" | "SAFETY" | "CLINICAL" | "OPS";
export interface PushInput {
    orgId: string;
    kind: PushKind;
    title: string;
    titleAr: string;
    body: string;
    bodyAr: string;
    data?: Record<string, unknown>;
    userIds?: string[];
    roles?: StaffRole[];
    branchId?: string | null;
    allowUnentitled?: boolean;
}
export declare const PUSH_TEMPLATES: {
    readonly "rx.awaiting": {
        readonly kind: "CLINICAL";
        readonly en: readonly ["Prescription awaiting verification", "A new prescription is waiting in the verification queue."];
        readonly ar: readonly ["وصفة بانتظار المراجعة", "وصفة جديدة في طابور مراجعة الصيدلي."];
    };
    readonly "order.received": {
        readonly kind: "OPS";
        readonly en: readonly ["New Kiorex order", "Order {order} arrived. Respond within {minutes} minutes."];
        readonly ar: readonly ["طلب كيوريكس جديد", "وصل الطلب {order}. يرجى الرد خلال {minutes} دقيقة."];
    };
    readonly "controlled.discrepancy": {
        readonly kind: "SAFETY";
        readonly en: readonly ["Controlled-drug discrepancy", "{drug}: expected {expected}, counted {counted}. Countersign required."];
        readonly ar: readonly ["فرق في دواء مراقب", "{drug}: المتوقع {expected} والمعدود {counted}. مطلوب توقيع شاهد."];
    };
    readonly "stock.expiry": {
        readonly kind: "OPS";
        readonly en: readonly ["Expiry alert", "{drug} lot {lot} expires in {days} days ({qty} on hand)."];
        readonly ar: readonly ["تنبيه صلاحية", "{drug} تشغيلة {lot} تنتهي خلال {days} يوم (الكمية {qty})."];
    };
    readonly "upgrade.request": {
        readonly kind: "OPS";
        readonly en: readonly ["Staff asked to upgrade Kiorly", "A team member asked for the Kiorly staff app (Pro plan). Review your plan in Settings."];
        readonly ar: readonly ["طلب موظف ترقية كيورلي", "طلب أحد أعضاء الفريق تطبيق كيورلي للموظفين (باقة Pro). راجع باقتك من الإعدادات."];
    };
    readonly "push.test": {
        readonly kind: "GENERAL";
        readonly en: readonly ["Kiorly test", "Push notifications are working on this device."];
        readonly ar: readonly ["اختبار كيورلي", "الإشعارات تعمل على هذا الجهاز."];
    };
};
export type PushTemplate = keyof typeof PUSH_TEMPLATES;
export declare function renderPush(t: PushTemplate, vars?: Record<string, string | number>): {
    kind: PushKind;
    title: string;
    body: string;
    titleAr: string;
    bodyAr: string;
};
export declare class PushService {
    private readonly prisma;
    private readonly ent;
    private readonly log;
    static fetchImpl?: FetchLike;
    constructor(prisma: PrismaService, ent: MobileEntitlementService);
    static channelFor(kind: PushKind): string;
    send(i: PushInput): Promise<{
        delivered: number;
    }>;
    sendTemplate(orgId: string, t: PushTemplate, vars: Record<string, string | number>, to: {
        roles?: StaffRole[];
        userIds?: string[];
        branchId?: string | null;
    }, data?: Record<string, unknown>): Promise<{
        delivered: number;
    }>;
}
