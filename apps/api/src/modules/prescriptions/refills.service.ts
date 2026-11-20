import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";

/** NEEDS_HUMAN default: refills are honoured for 180 days after the issue date (regulation / pharmacist policy to confirm). */
export const REFILL_VALIDITY_DAYS = 180;
const DAY = 86_400_000;

/** Repeat prescriptions: refill grant, due list and (mock-provider) reminders. Controlled medicines are never refillable. */
@Injectable()
export class RefillsService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(NotificationsService) private readonly notify: NotificationsService,
    @Inject(TenantModeService) private readonly modes: TenantModeService,
  ) {}

  /** Refill = the same Rx becomes dispensable again for another full fill (lines reset, status VALIDATED, refillsUsed + 1). */
  async refill(user: AuthUser, id: string, d: { earlyReason?: string } = {}) {
    const rx = await this.prisma.prescription.findFirst({ where: { id, orgId: user.orgId }, include: { lines: { include: { drug: { select: { controlledSchedule: true } } } } } });
    if (!rx) throw notFound("Prescription", id);
    if (rx.status !== "DISPENSED") throw new DomainError("REFILL_NOT_READY", `Only a fully dispensed prescription can be refilled (status ${rx.status})`, 409);
    if (rx.refillsUsed >= rx.refillsAllowed) throw new DomainError("NO_REFILLS_LEFT", "No refills remaining on this prescription", 409, { allowed: rx.refillsAllowed, used: rx.refillsUsed });
    if (rx.lines.some((l) => l.controlled || (l.drug && l.drug.controlledSchedule !== "NONE"))) throw new DomainError("REFILL_NOT_ALLOWED_CONTROLLED", "Controlled medicines cannot be refilled; a new prescription is required", 409);
    const issued = rx.issuedAt ?? rx.receivedAt;
    if (Date.now() > issued.getTime() + REFILL_VALIDITY_DAYS * DAY) throw new DomainError("REFILL_EXPIRED", `Refills are valid for ${REFILL_VALIDITY_DAYS} days from the issue date`, 409);
    const early = !!rx.nextRefillDueAt && Date.now() < rx.nextRefillDueAt.getTime() - 3 * DAY;
    if (early && !d.earlyReason) throw new DomainError("REFILL_TOO_EARLY", "This refill is more than 3 days early; a pharmacist reason is required", 409, { dueAt: rx.nextRefillDueAt });
    return this.prisma.$transaction(async (tx) => {
      const refillNo = rx.refillsUsed + 1;
      await tx.prescriptionLine.updateMany({ where: { prescriptionId: id }, data: { qtyDispensed: 0 } });
      const r = await tx.prescription.update({ where: { id }, data: { status: "VALIDATED", refillsUsed: refillNo, nextRefillDueAt: null, validUntil: new Date(Math.max((rx.validUntil ?? new Date()).getTime(), Date.now() + 30 * DAY)), validatedBy: user.userId, validatedAt: new Date() } });
      await tx.rxRefill.create({ data: { orgId: user.orgId, prescriptionId: id, refillNo, early, earlyReason: d.earlyReason, createdBy: user.userId } });
      await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.refill", entityType: "Prescription", entityId: id, meta: { refillNo, early } } });
      return { prescription: r, refillNo, remaining: rx.refillsAllowed - refillNo };
    });
  }

  history(orgId: string, id: string) { return this.prisma.rxRefill.findMany({ where: { orgId, prescriptionId: id }, orderBy: { refillNo: "asc" } }); }

  /** Repeat prescriptions whose next refill is due within `days` (or overdue), for the refill worklist and reminders. */
  async due(orgId: string, q: { days: number; branchId?: string }) {
    const rows = await this.prisma.prescription.findMany({
      where: { orgId, status: "DISPENSED", nextRefillDueAt: { not: null, lte: new Date(Date.now() + q.days * DAY) }, ...(q.branchId ? { branchId: q.branchId } : {}) },
      include: { patient: { select: { id: true, displayName: true, phone: true, consentMarketing: true } }, lines: { select: { drugName: true, activeIngredient: true, quantity: true } } }, orderBy: { nextRefillDueAt: "asc" }, take: 300,
    });
    const reminded = await this.prisma.refillReminder.findMany({ where: { orgId, prescriptionId: { in: rows.map((r) => r.id) } } });
    const rm = new Set(reminded.map((r) => `${r.prescriptionId}:${r.refillNo}`));
    return rows.filter((r) => r.refillsUsed < r.refillsAllowed).map((r) => ({
      id: r.id, patient: r.patient, dueAt: r.nextRefillDueAt, overdueDays: Math.max(Math.floor((Date.now() - r.nextRefillDueAt!.getTime()) / DAY), 0), refillsLeft: r.refillsAllowed - r.refillsUsed,
      items: r.lines.map((l) => l.drugName ?? l.activeIngredient), reminded: rm.has(`${r.id}:${r.refillsUsed + 1}`), canRemind: !!r.patient?.phone && !!r.patient.consentMarketing,
    }));
  }

  /** Queues a refill reminder (mock WhatsApp) for every due Rx with a phone number AND the customer's reminder consent; once per Rx per refill number. */
  async runReminders(user: AuthUser | { orgId: string; userId?: string }, daysAhead?: number) {
    const settings = await this.modes.settings(user.orgId);
    const lead = daysAhead ?? settings.refillReminderDays ?? 3;
    const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
    const list = await this.due(user.orgId, { days: lead });
    let sent = 0, skipped = 0;
    for (const r of list) {
      if (r.reminded || !r.canRemind || !r.patient?.phone) { skipped++; continue; }
      const refillNo = r.refillsLeft > 0 ? (await this.prisma.prescription.findUniqueOrThrow({ where: { id: r.id } })).refillsUsed + 1 : 0;
      try {
        await this.prisma.refillReminder.create({ data: { orgId: user.orgId, prescriptionId: r.id, refillNo } });
      } catch { skipped++; continue; }
      const n = await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: r.patient.phone, template: "rx.refill_reminder", locale: settings.defaultLocale ?? "ar", vars: { pharmacy: tenant.name, rx: r.id.slice(-6).toUpperCase(), date: (r.dueAt ?? new Date()).toISOString().slice(0, 10) }, refType: "Prescription", refId: r.id });
      await this.prisma.refillReminder.updateMany({ where: { prescriptionId: r.id, refillNo }, data: { notificationId: n.id } });
      sent++;
    }
    await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: (user as AuthUser).userId ?? null, action: "rx.refill_reminders", entityType: "Prescription", entityId: "batch", meta: { sent, skipped } } });
    return { due: list.length, sent, skipped };
  }
}
