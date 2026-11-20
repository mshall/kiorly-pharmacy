import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { conflict, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";

export interface PrescriberInput { name?: string; nameAr?: string; licenceNo?: string; specialty?: string; phone?: string; clinicName?: string; clinicAddress?: string; notes?: string; active?: boolean }

/** Doctor directory: standalone pharmacies build it from the Rx they enter (licence = natural key); a pharmacist verifies the licence once. */
@Injectable()
export class PrescribersService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async list(orgId: string, q: { q?: string; verified?: boolean; page: number; pageSize: number }) {
    const where: Prisma.PrescriberWhereInput = { orgId, active: true, ...(q.verified !== undefined ? { verified: q.verified } : {}), ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { nameAr: { contains: q.q } }, { licenceNo: { contains: q.q, mode: "insensitive" } }, { clinicName: { contains: q.q, mode: "insensitive" } }] } : {}) };
    const [items, total] = await Promise.all([this.prisma.prescriber.findMany({ where, orderBy: { name: "asc" }, skip: (q.page - 1) * q.pageSize, take: q.pageSize }), this.prisma.prescriber.count({ where })]);
    const counts = await this.prisma.prescription.groupBy({ by: ["prescriberId"], where: { orgId, prescriberId: { in: items.map((i) => i.id) } }, _count: true });
    const cm = new Map(counts.map((c) => [c.prescriberId, c._count]));
    return { total, page: q.page, pageSize: q.pageSize, items: items.map((i) => ({ ...i, prescriptions: cm.get(i.id) ?? 0 })) };
  }

  async get(orgId: string, id: string) {
    const p = await this.prisma.prescriber.findFirst({ where: { id, orgId } });
    if (!p) throw notFound("Prescriber", id);
    return p;
  }

  async create(u: AuthUser, d: PrescriberInput & { name: string; licenceNo: string }) {
    try {
      const p = await this.prisma.prescriber.create({ data: { orgId: u.orgId, name: d.name.trim(), nameAr: d.nameAr, licenceNo: d.licenceNo.trim(), specialty: d.specialty, phone: d.phone, clinicName: d.clinicName, clinicAddress: d.clinicAddress, notes: d.notes } });
      await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "prescriber.create", entityType: "Prescriber", entityId: p.id } });
      return p;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw conflict("PRESCRIBER_EXISTS", "A prescriber with this licence number already exists");
      throw e;
    }
  }

  async update(u: AuthUser, id: string, d: PrescriberInput) {
    await this.get(u.orgId, id);
    const p = await this.prisma.prescriber.update({ where: { id }, data: d });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "prescriber.update", entityType: "Prescriber", entityId: id, meta: { fields: Object.keys(d) } } });
    return p;
  }

  /** A pharmacist records that the syndicate licence was checked. */
  async verify(u: AuthUser, id: string, verified: boolean) {
    await this.get(u.orgId, id);
    const p = await this.prisma.prescriber.update({ where: { id }, data: { verified, verifiedBy: verified ? u.userId : null, verifiedAt: verified ? new Date() : null } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: verified ? "prescriber.verify" : "prescriber.unverify", entityType: "Prescriber", entityId: id } });
    return p;
  }

  /** Find-or-create by licence so manual Rx entry grows the directory (new entries start unverified). */
  async ensure(tx: Prisma.TransactionClient, orgId: string, d: { name: string; licenceNo: string; specialty?: string }) {
    const ex = await tx.prescriber.findUnique({ where: { orgId_licenceNo: { orgId, licenceNo: d.licenceNo.trim() } } });
    return ex ?? tx.prescriber.create({ data: { orgId, name: d.name.trim(), licenceNo: d.licenceNo.trim(), specialty: d.specialty } });
  }
}
