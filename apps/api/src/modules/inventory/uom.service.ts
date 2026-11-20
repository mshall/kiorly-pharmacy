import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, conflict, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";

/** Units of measure / pack conversions: stock is counted in the drug's base unit; receiving and selling can use a larger (box) unit. */
@Injectable()
export class UomService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  list(orgId: string, drugId: string) { return this.prisma.uomConversion.findMany({ where: { orgId, drugId, active: true }, orderBy: { factor: "asc" } }); }

  async create(u: AuthUser, drugId: string, d: { name: string; factor: number; barcode?: string }) {
    if (!Number.isInteger(d.factor) || d.factor < 2) throw new DomainError("INVALID_FACTOR", "A conversion factor must be a whole number of at least 2 base units", 400);
    if (!(await this.prisma.drug.findFirst({ where: { id: drugId, OR: [{ orgId: null }, { orgId: u.orgId }] } }))) throw notFound("Drug", drugId);
    try {
      const r = await this.prisma.uomConversion.create({ data: { orgId: u.orgId, drugId, name: d.name.trim().toLowerCase(), factor: d.factor, barcode: d.barcode } });
      await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "uom.create", entityType: "UomConversion", entityId: r.id, meta: { factor: d.factor } } });
      return r;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") throw conflict("UOM_EXISTS", "This unit already exists for the drug");
      throw e;
    }
  }

  async remove(u: AuthUser, id: string) {
    const r = await this.prisma.uomConversion.updateMany({ where: { id, orgId: u.orgId }, data: { active: false } });
    if (!r.count) throw notFound("Unit", id);
    return { ok: true };
  }

  /** Factor for (drug, unit name); 1 for the base unit / no unit. */
  async factor(orgId: string, drugId: string, uom?: string | null): Promise<number> {
    if (!uom) return 1;
    const r = await this.prisma.uomConversion.findFirst({ where: { orgId, drugId, name: uom.trim().toLowerCase(), active: true } });
    if (!r) throw new DomainError("UNKNOWN_UOM", `Unit "${uom}" is not defined for this drug`, 400, { drugId, uom });
    return r.factor;
  }
}
