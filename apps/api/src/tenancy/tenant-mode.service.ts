import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export type OperatingMode = "STANDALONE" | "INTEGRATED";
export interface TenantSettings {
  mode?: OperatingMode;
  vatRate?: string;
  currency?: string;
  defaultLocale?: "ar" | "en";
  languages?: Array<"ar" | "en">;
  taxRates?: Array<{ code: string; label: string; rate: string }>;
  receipt?: { header?: string; footer?: string; showVat?: boolean; showLicence?: boolean; paper?: "80mm" | "a4"; logoText?: string };
  printers?: Array<{ id: string; name: string; kind: "RECEIPT" | "LABEL" | "A4"; paper?: string; note?: string }>;
  loyalty?: { enabled?: boolean; earnPer?: string; pointsPerEarn?: number; redeemValue?: string; tiers?: Array<{ name: string; minSpend: string }> };
  maxCashierDiscountPct?: number;
  refillReminderDays?: number;
  /** Receiving flags a line whose cost differs from the PO / previous cost by more than this percentage (default 5). */
  costVarianceTolerancePct?: number;
  /** Days before a customer credit charge is overdue (receivables aging), default 30. */
  customerCreditDays?: number;
  ownerPhone?: string; ownerEmail?: string; receiptFooter?: string; shiftVarianceThreshold?: string;
  [k: string]: unknown;
}

/**
 * STANDALONE is a first-class operating mode (default for new tenants): the pharmacy runs with no Kiorex / Kiorly service at all.
 * INTEGRATED turns on the optional Kiorex marketplace orders, e-Rx intake and outbox delivery. Existing tenants that already have a
 * Kiorex integration client are treated as INTEGRATED unless they explicitly chose STANDALONE.
 */
@Injectable()
export class TenantModeService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async settings(orgId: string): Promise<TenantSettings> {
    const t = await this.prisma.tenant.findUnique({ where: { id: orgId }, select: { settings: true } });
    return (t?.settings ?? {}) as TenantSettings;
  }

  async mode(orgId: string): Promise<OperatingMode> {
    const s = await this.settings(orgId);
    if (s.mode === "STANDALONE" || s.mode === "INTEGRATED") return s.mode;
    const clients = await this.prisma.integrationClient.count({ where: { orgId, active: true } });
    return clients > 0 ? "INTEGRATED" : "STANDALONE";
  }

  async isStandalone(orgId: string): Promise<boolean> { return (await this.mode(orgId)) === "STANDALONE"; }
}
