import { Inject, Injectable } from "@nestjs/common";
import { createHmac } from "node:crypto";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, conflict, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import type { AuthUser } from "../../auth/auth-user";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
import { adjustPoints, loyaltyConfig, pointsValue } from "../../common/loyalty";

export interface CustomerInput {
  displayName?: string; phone?: string | null; email?: string | null; gender?: string | null; dateOfBirth?: string | null; birthYear?: number | null; address?: string | null;
  allergies?: string[]; chronicConditions?: string[]; medicalNotes?: string | null; pregnant?: boolean; lactating?: boolean; renalImpairment?: boolean; hepaticImpairment?: boolean;
  weightKg?: string | null; nationalId?: string; consentDataProcessing?: boolean; consentMarketing?: boolean; active?: boolean;
}

const norm = (xs: string[] | undefined) => [...new Set((xs ?? []).map((x) => x.toLowerCase().trim()).filter(Boolean))];
export const normPhone = (p?: string | null) => (p ? p.replace(/[^\d+]/g, "") : null);
const nidHash = (orgId: string, nid: string) => createHmac("sha256", process.env.NATIONAL_ID_PEPPER ?? "dev-only-pepper").update(`${orgId}:${nid}`).digest("hex");
const SAFE = { nationalIdHash: false } as const;

/** Customer registry (works with no Kiorly / Kiorex at all). PatientRef is the single person record shared by Rx, dispensing, POS, loyalty and credit. */
@Injectable()
export class CustomerRegistryService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(TenantModeService) private readonly modes: TenantModeService) {}

  private audit(tx: Prisma.TransactionClient | PrismaService, u: AuthUser, action: string, id: string, meta?: Prisma.InputJsonValue) {
    return tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action, entityType: "Customer", entityId: id, meta } });
  }

  private view<T extends { nationalIdHash?: unknown }>(p: T) { const { nationalIdHash: _h, ...rest } = p; return rest; }

  async create(u: AuthUser, d: CustomerInput & { displayName: string }, opts: { force?: boolean } = {}) {
    const phone = normPhone(d.phone);
    if (phone && !opts.force) {
      const dup = await this.prisma.patientRef.findMany({ where: { orgId: u.orgId, active: true, phone }, select: { id: true, displayName: true, customerNo: true }, take: 5 });
      if (dup.length) throw conflict("DUPLICATE_CUSTOMER", "A customer with this phone number already exists", { candidates: dup });
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        return await this.prisma.$transaction(async (tx) => {
          const [{ n }] = await tx.$queryRaw<Array<{ n: number }>>`SELECT COALESCE(MAX(CAST(SUBSTRING("customerNo" FROM 5) AS INTEGER)),0)::int + 1 AS n FROM "PatientRef" WHERE "orgId" = ${u.orgId} AND "customerNo" ~ '^CUS-[0-9]+$'`;
          const p = await tx.patientRef.create({ data: this.data(u, d, { customerNo: `CUS-${String(n).padStart(6, "0")}`, orgId: u.orgId }) as Prisma.PatientRefUncheckedCreateInput });
          await this.audit(tx, u, "customer.create", p.id, { customerNo: p.customerNo });
          return this.view(p);
        });
      } catch (e) { if (!(e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")) throw e; }
    }
    throw new DomainError("CUSTOMER_NO_CONFLICT", "Could not allocate a customer number, retry", 409);
  }

  private data(u: AuthUser, d: CustomerInput, extra: object = {}) {
    const consentChange = d.consentDataProcessing !== undefined || d.consentMarketing !== undefined;
    return {
      ...(d.displayName !== undefined ? { displayName: d.displayName.trim() } : {}),
      ...(d.phone !== undefined ? { phone: normPhone(d.phone) } : {}), ...(d.email !== undefined ? { email: d.email?.toLowerCase().trim() || null } : {}),
      ...(d.gender !== undefined ? { gender: d.gender } : {}), ...(d.dateOfBirth !== undefined ? { dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null, birthYear: d.dateOfBirth ? new Date(d.dateOfBirth).getUTCFullYear() : null } : {}),
      ...(d.birthYear !== undefined && d.dateOfBirth === undefined ? { birthYear: d.birthYear } : {}), ...(d.address !== undefined ? { address: d.address } : {}),
      ...(d.allergies ? { allergies: norm(d.allergies) } : {}), ...(d.chronicConditions ? { chronicConditions: norm(d.chronicConditions) } : {}), ...(d.medicalNotes !== undefined ? { medicalNotes: d.medicalNotes } : {}),
      ...(d.pregnant !== undefined ? { pregnant: d.pregnant } : {}), ...(d.lactating !== undefined ? { lactating: d.lactating } : {}),
      ...(d.renalImpairment !== undefined ? { renalImpairment: d.renalImpairment } : {}), ...(d.hepaticImpairment !== undefined ? { hepaticImpairment: d.hepaticImpairment } : {}),
      ...(d.weightKg !== undefined ? { weightKg: d.weightKg } : {}), ...(d.active !== undefined ? { active: d.active } : {}),
      ...(d.nationalId ? { nationalIdHash: nidHash(u.orgId, d.nationalId), nationalIdLast4: d.nationalId.slice(-4) } : {}),
      ...(d.consentDataProcessing !== undefined ? { consentDataProcessing: d.consentDataProcessing } : {}), ...(d.consentMarketing !== undefined ? { consentMarketing: d.consentMarketing } : {}),
      ...(consentChange ? { consentRecordedAt: new Date(), consentRecordedBy: u.userId } : {}),
      ...extra,
    };
  }

  async update(u: AuthUser, id: string, d: CustomerInput) {
    await this.mustGet(u.orgId, id);
    return this.prisma.$transaction(async (tx) => {
      const p = await tx.patientRef.update({ where: { id }, data: this.data(u, d) });
      await this.audit(tx, u, "customer.update", id, { fields: Object.keys(d).filter((k) => k !== "nationalId") });
      return this.view(p);
    });
  }

  async mustGet(orgId: string, id: string) {
    const p = await this.prisma.patientRef.findFirst({ where: { id, orgId } });
    if (!p) throw notFound("Customer", id);
    return p;
  }

  /** Search by name, phone, customer number, e-mail or national-ID last 4. */
  async search(orgId: string, q: { q?: string; page: number; pageSize: number; includeInactive?: boolean; withCredit?: boolean; withAllergies?: boolean }) {
    const s = q.q?.trim();
    const digits = s ? s.replace(/[^\d+]/g, "") : "";
    const where: Prisma.PatientRefWhereInput = {
      orgId, mergedIntoId: null, ...(q.includeInactive ? {} : { active: true }),
      ...(q.withCredit ? { customerAccount: { isNot: null } } : {}), ...(q.withAllergies ? { NOT: { allergies: { isEmpty: true } } } : {}),
      ...(s ? { OR: [{ displayName: { contains: s, mode: "insensitive" } }, { customerNo: { contains: s, mode: "insensitive" } }, { email: { contains: s, mode: "insensitive" } }, ...(digits.length >= 3 ? [{ phone: { contains: digits } }] : []), ...(/^\d{4}$/.test(s) ? [{ nationalIdLast4: s }] : [])] } : {}),
    };
    const [rows, total] = await Promise.all([
      this.prisma.patientRef.findMany({ where, orderBy: [{ displayName: "asc" }], skip: (q.page - 1) * q.pageSize, take: q.pageSize, include: { customerAccount: { select: { id: true, balance: true, creditLimit: true } } } }),
      this.prisma.patientRef.count({ where }),
    ]);
    return { total, page: q.page, pageSize: q.pageSize, items: rows.map((r) => ({ ...this.view(r), customerAccount: r.customerAccount ? { id: r.customerAccount.id, balance: money(r.customerAccount.balance), creditLimit: money(r.customerAccount.creditLimit) } : null })) };
  }

  async profile(orgId: string, id: string) {
    const p = await this.prisma.patientRef.findFirst({ where: { id, orgId }, include: { customerAccount: true } });
    if (!p) throw notFound("Customer", id);
    const [family, rxCount, saleAgg, lastVisit] = await Promise.all([
      this.family(orgId, id),
      this.prisma.prescription.count({ where: { orgId, patientId: id } }),
      this.prisma.sale.aggregate({ where: { orgId, status: { not: "VOIDED" }, OR: [{ patientId: id }, { customerAccount: { patientId: id } }] }, _sum: { total: true }, _count: true }),
      this.prisma.sale.findFirst({ where: { orgId, OR: [{ patientId: id }, { customerAccount: { patientId: id } }] }, orderBy: { soldAt: "desc" }, select: { soldAt: true } }),
    ]);
    const cfg = loyaltyConfig(await this.modes.settings(orgId));
    const { customerAccount, ...rest } = this.view(p);
    return {
      ...rest, customerAccount: customerAccount ? { ...customerAccount, balance: money(customerAccount.balance), creditLimit: money(customerAccount.creditLimit), available: money(D(customerAccount.creditLimit).minus(customerAccount.balance)) } : null,
      family, stats: { prescriptions: rxCount, purchases: saleAgg._count, totalSpend: money(saleAgg._sum.total ?? 0), lastVisit: lastVisit?.soldAt ?? null },
      loyalty: { points: p.loyaltyPoints, tier: p.loyaltyTier, value: money(pointsValue(p.loyaltyPoints, cfg)), redeemValue: money(cfg.redeemValue), enabled: cfg.enabled },
    };
  }

  /** Medication history: everything dispensed on Rx (with Rx link) plus OTC purchases attached to the customer, newest first. */
  async history(orgId: string, id: string, take = 100) {
    await this.mustGet(orgId, id);
    const lines = await this.prisma.dispensingLine.findMany({ where: { dispensing: { orgId, patientId: id, status: "DISPENSED" } }, include: { dispensing: { select: { id: true, dispensedAt: true, prescriptionId: true } } }, orderBy: { dispensing: { dispensedAt: "desc" } }, take });
    const sl = await this.prisma.saleLine.findMany({ where: { sale: { orgId, status: { not: "VOIDED" }, dispensingId: null, OR: [{ patientId: id }, { customerAccount: { patientId: id } }] } }, include: { sale: { select: { id: true, soldAt: true, receiptNo: true } } }, orderBy: { sale: { soldAt: "desc" } }, take });
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...lines.map((l) => l.drugId), ...sl.map((l) => l.drugId)] } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, dosageForm: true, activeIngredient: true, rxOnly: true, controlledSchedule: true } });
    const dm = new Map(drugs.map((d) => [d.id, d]));
    const items = [
      ...lines.map((l) => ({ kind: "RX" as const, at: l.dispensing.dispensedAt, drug: dm.get(l.drugId) ?? null, quantity: l.quantity, prescriptionId: l.dispensing.prescriptionId, dispensingId: l.dispensing.id, saleId: null as string | null, receiptNo: null as string | null })),
      ...sl.map((l) => ({ kind: "OTC" as const, at: l.sale.soldAt, drug: dm.get(l.drugId) ?? null, quantity: l.quantity, prescriptionId: null, dispensingId: null, saleId: l.sale.id, receiptNo: l.sale.receiptNo })),
    ].sort((a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0)).slice(0, take);
    return { items };
  }

  // ----------------------------------------------------------------------------------------------- notes
  async notes(orgId: string, id: string) { await this.mustGet(orgId, id); return this.prisma.customerNote.findMany({ where: { orgId, patientId: id }, orderBy: { createdAt: "desc" }, take: 200 }); }
  async addNote(u: AuthUser, id: string, d: { body: string; kind?: string }) {
    await this.mustGet(u.orgId, id);
    const n = await this.prisma.customerNote.create({ data: { orgId: u.orgId, patientId: id, kind: d.kind ?? "NOTE", body: d.body, createdBy: u.userId } });
    await this.audit(this.prisma, u, "customer.note", id, { kind: n.kind });
    return n;
  }

  // ----------------------------------------------------------------------------------------------- family
  async family(orgId: string, id: string) {
    const links = await this.prisma.familyLink.findMany({ where: { orgId, OR: [{ patientId: id }, { relatedPatientId: id }] } });
    const ids = links.map((l) => (l.patientId === id ? l.relatedPatientId : l.patientId));
    const people = await this.prisma.patientRef.findMany({ where: { id: { in: ids } }, select: { id: true, displayName: true, customerNo: true, phone: true, birthYear: true, allergies: true } });
    const pm = new Map(people.map((p) => [p.id, p]));
    return links.map((l) => { const other = l.patientId === id ? l.relatedPatientId : l.patientId; return { id: l.id, relation: l.patientId === id ? l.relation : `${l.relation}:inverse`, person: pm.get(other) ?? null }; });
  }
  async addFamily(u: AuthUser, id: string, d: { relatedPatientId: string; relation: string }) {
    if (id === d.relatedPatientId) throw new DomainError("SELF_LINK", "A customer cannot be linked to themselves", 400);
    await this.mustGet(u.orgId, id); await this.mustGet(u.orgId, d.relatedPatientId);
    const exists = await this.prisma.familyLink.findFirst({ where: { orgId: u.orgId, OR: [{ patientId: id, relatedPatientId: d.relatedPatientId }, { patientId: d.relatedPatientId, relatedPatientId: id }] } });
    if (exists) throw conflict("ALREADY_LINKED", "These customers are already linked");
    const l = await this.prisma.familyLink.create({ data: { orgId: u.orgId, patientId: id, relatedPatientId: d.relatedPatientId, relation: d.relation, createdBy: u.userId } });
    await this.audit(this.prisma, u, "customer.family_link", id, { related: d.relatedPatientId, relation: d.relation });
    return l;
  }
  async removeFamily(u: AuthUser, id: string, linkId: string) {
    const l = await this.prisma.familyLink.findFirst({ where: { id: linkId, orgId: u.orgId, OR: [{ patientId: id }, { relatedPatientId: id }] } });
    if (!l) throw notFound("Family link", linkId);
    await this.prisma.familyLink.delete({ where: { id: linkId } });
    await this.audit(this.prisma, u, "customer.family_unlink", id, { linkId });
    return { ok: true };
  }

  // ----------------------------------------------------------------------------------------------- consent / credit / loyalty
  async setConsent(u: AuthUser, id: string, d: { dataProcessing: boolean; marketing: boolean }) {
    await this.mustGet(u.orgId, id);
    const p = await this.prisma.patientRef.update({ where: { id }, data: { consentDataProcessing: d.dataProcessing, consentMarketing: d.marketing, consentRecordedAt: new Date(), consentRecordedBy: u.userId } });
    await this.audit(this.prisma, u, "customer.consent", id, { dataProcessing: d.dataProcessing, marketing: d.marketing });
    return this.view(p);
  }

  async openCreditAccount(u: AuthUser, id: string, creditLimit: string) {
    await this.mustGet(u.orgId, id);
    if (D(creditLimit).isNeg()) throw new DomainError("INVALID_LIMIT", "Credit limit must be >= 0", 400);
    const ex = await this.prisma.customerAccount.findUnique({ where: { patientId: id } });
    const a = ex ? await this.prisma.customerAccount.update({ where: { id: ex.id }, data: { creditLimit } }) : await this.prisma.customerAccount.create({ data: { orgId: u.orgId, patientId: id, creditLimit } });
    await this.audit(this.prisma, u, "customer.credit_account", id, { creditLimit: money(creditLimit) });
    return { ...a, balance: money(a.balance), creditLimit: money(a.creditLimit) };
  }

  async loyalty(orgId: string, id: string) {
    const p = await this.mustGet(orgId, id);
    const cfg = loyaltyConfig(await this.modes.settings(orgId));
    const entries = await this.prisma.loyaltyEntry.findMany({ where: { orgId, patientId: id }, orderBy: { createdAt: "desc" }, take: 100 });
    const next = cfg.tiers.find((t) => t.minSpend.gt(p.lifetimeSpend));
    return { points: p.loyaltyPoints, tier: p.loyaltyTier, lifetimeSpend: money(p.lifetimeSpend), value: money(pointsValue(p.loyaltyPoints, cfg)), nextTier: next ? { name: next.name, remaining: money(next.minSpend.minus(p.lifetimeSpend)) } : null, entries };
  }
  async adjustLoyalty(u: AuthUser, id: string, d: { points: number; note: string }) {
    await this.mustGet(u.orgId, id);
    if (!Number.isInteger(d.points) || d.points === 0) throw new DomainError("INVALID_POINTS", "Points must be a non-zero whole number", 400);
    const cfg = loyaltyConfig(await this.modes.settings(u.orgId));
    return this.prisma.$transaction(async (tx) => {
      const cur = await tx.patientRef.findUniqueOrThrow({ where: { id }, select: { loyaltyPoints: true } });
      if (cur.loyaltyPoints + d.points < 0) throw new DomainError("INSUFFICIENT_POINTS", "Balance cannot go below zero", 409);
      const balance = await adjustPoints(tx, { orgId: u.orgId, patientId: id, points: d.points, note: d.note, by: u.userId }, cfg);
      await this.audit(tx, u, "customer.loyalty_adjust", id, { points: d.points });
      return { balance };
    });
  }

  // ----------------------------------------------------------------------------------------------- duplicates & merge
  /** Duplicate candidates: same phone, or same normalised name + year of birth. */
  async duplicates(orgId: string) {
    const rows = await this.prisma.patientRef.findMany({ where: { orgId, active: true, mergedIntoId: null }, select: { id: true, displayName: true, phone: true, birthYear: true, customerNo: true, createdAt: true }, take: 5000 });
    const groups = new Map<string, typeof rows>();
    const add = (k: string, r: (typeof rows)[number]) => groups.set(k, [...(groups.get(k) ?? []), r]);
    for (const r of rows) {
      if (r.phone) add(`phone:${r.phone}`, r);
      add(`name:${r.displayName.toLowerCase().replace(/\s+/g, " ").trim()}|${r.birthYear ?? ""}`, r);
    }
    const seen = new Set<string>();
    const out: Array<{ reason: string; customers: typeof rows }> = [];
    for (const [k, g] of groups) {
      if (g.length < 2) continue;
      const sig = g.map((x) => x.id).sort().join(",");
      if (seen.has(sig)) continue;
      seen.add(sig);
      out.push({ reason: k.startsWith("phone:") ? "SAME_PHONE" : "SAME_NAME_YOB", customers: g });
    }
    return { groups: out };
  }

  /** Merge `sourceId` INTO `id` (the survivor). Re-points every reference; the source is deactivated and kept for audit. */
  async merge(u: AuthUser, id: string, sourceId: string) {
    if (id === sourceId) throw new DomainError("SAME_CUSTOMER", "Choose two different customers", 400);
    const cfg = loyaltyConfig(await this.modes.settings(u.orgId));
    return this.prisma.$transaction(async (tx) => {
      const [t, s] = await Promise.all([tx.patientRef.findFirst({ where: { id, orgId: u.orgId } }), tx.patientRef.findFirst({ where: { id: sourceId, orgId: u.orgId } })]);
      if (!t) throw notFound("Customer", id);
      if (!s) throw notFound("Customer", sourceId);
      if (t.mergedIntoId || s.mergedIntoId) throw new DomainError("ALREADY_MERGED", "A merged customer cannot be merged again", 409);
      const w = { patientId: sourceId };
      const to = { patientId: id };
      const counts = {
        prescriptions: (await tx.prescription.updateMany({ where: w, data: to })).count,
        dispensings: (await tx.dispensing.updateMany({ where: w, data: to })).count,
        sales: (await tx.sale.updateMany({ where: w, data: to })).count,
        notes: (await tx.customerNote.updateMany({ where: w, data: to })).count,
        loyalty: (await tx.loyaltyEntry.updateMany({ where: w, data: to })).count,
      };
      // family links: re-point both ends, drop self-links and duplicates
      await tx.familyLink.updateMany({ where: { patientId: sourceId }, data: { patientId: id } });
      await tx.familyLink.updateMany({ where: { relatedPatientId: sourceId }, data: { relatedPatientId: id } });
      await tx.familyLink.deleteMany({ where: { patientId: id, relatedPatientId: id } });
      const links = await tx.familyLink.findMany({ where: { orgId: u.orgId, OR: [{ patientId: id }, { relatedPatientId: id }] }, orderBy: { createdAt: "asc" } });
      const keep = new Set<string>();
      for (const l of links) { const k = [l.patientId, l.relatedPatientId].sort().join("|"); if (keep.has(k)) await tx.familyLink.delete({ where: { id: l.id } }); else keep.add(k); }
      // credit account
      const [sa, ta] = await Promise.all([tx.customerAccount.findUnique({ where: { patientId: sourceId } }), tx.customerAccount.findUnique({ where: { patientId: id } })]);
      if (sa && !ta) await tx.customerAccount.update({ where: { id: sa.id }, data: { patientId: id } });
      else if (sa && ta) {
        await tx.sale.updateMany({ where: { customerAccountId: sa.id }, data: { customerAccountId: ta.id } });
        await tx.customerCreditEntry.updateMany({ where: { accountId: sa.id }, data: { accountId: ta.id } });
        await tx.customerAccount.update({ where: { id: ta.id }, data: { balance: { increment: sa.balance }, creditLimit: D(ta.creditLimit).gt(sa.creditLimit) ? ta.creditLimit : sa.creditLimit } });
        await tx.customerAccount.delete({ where: { id: sa.id } });
      }
      const points = s.loyaltyPoints;
      const spend = D(t.lifetimeSpend).plus(s.lifetimeSpend);
      await tx.patientRef.update({
        where: { id },
        data: {
          phone: t.phone ?? s.phone, email: t.email ?? s.email, gender: t.gender ?? s.gender, dateOfBirth: t.dateOfBirth ?? s.dateOfBirth, birthYear: t.birthYear ?? s.birthYear, address: t.address ?? s.address,
          nationalIdHash: t.nationalIdHash ?? s.nationalIdHash, nationalIdLast4: t.nationalIdLast4 ?? s.nationalIdLast4, externalId: t.externalId ?? s.externalId, weightKg: t.weightKg ?? s.weightKg,
          allergies: norm([...t.allergies, ...s.allergies]), chronicConditions: norm([...t.chronicConditions, ...s.chronicConditions]), medicalNotes: [t.medicalNotes, s.medicalNotes].filter(Boolean).join("\n") || null,
          pregnant: t.pregnant || s.pregnant, lactating: t.lactating || s.lactating, renalImpairment: t.renalImpairment || s.renalImpairment, hepaticImpairment: t.hepaticImpairment || s.hepaticImpairment,
          consentMarketing: t.consentMarketing && s.consentMarketing, consentDataProcessing: t.consentDataProcessing || s.consentDataProcessing,
        },
      });
      await tx.patientRef.update({ where: { id: sourceId }, data: { active: false, mergedIntoId: id, loyaltyPoints: 0, phone: null, externalId: null } });
      if (points) await adjustPoints(tx, { orgId: u.orgId, patientId: id, points, note: `Merged from ${s.customerNo ?? s.id}`, by: u.userId, kind: "MERGE" }, cfg);
      await tx.patientRef.update({ where: { id }, data: { lifetimeSpend: spend } });
      await this.audit(tx, u, "customer.merge", id, { sourceId, ...counts, points });
      return { mergedInto: id, source: sourceId, moved: counts };
    }, { timeout: 30_000 }).then(async (r) => ({ ...r, customer: await this.profile(u.orgId, id) }));
  }
}
