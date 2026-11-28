import { PrismaService } from "../../prisma/prisma.service";
import { type FetchLike } from "../../providers/http";
export declare const TEMPLATES: Record<string, {
    en: string;
    ar: string;
}>;
export declare const SUBJECTS: Record<string, {
    en: string;
    ar: string;
}>;
export declare function renderSubject(template: string, locale: "en" | "ar", vars: Record<string, string | number>): string;
export declare function renderTemplate(template: string, locale: "en" | "ar", vars: Record<string, string | number>): string;
export interface SendInput {
    orgId: string;
    channel: "WHATSAPP" | "SMS" | "EMAIL" | "PUSH";
    recipient: string;
    template: string;
    locale?: "en" | "ar";
    vars?: Record<string, string | number>;
    refType?: string;
    refId?: string;
}
export declare class NotificationsService {
    private readonly prisma;
    private readonly log;
    static fetchImpl?: FetchLike;
    constructor(prisma: PrismaService);
    send(i: SendInput): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").NotificationStatus;
        sentAt: Date | null;
        refType: string | null;
        refId: string | null;
        body: string;
        channel: import("../../generated/prisma/enums").NotificationChannel;
        recipient: string;
        template: string;
        locale: string;
        provider: string;
        providerMessageId: string | null;
        error: string | null;
        deliveredAt: Date | null;
    }>;
}
