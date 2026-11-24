import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import type { AuthUser } from "../../auth/auth-user";
import { DomainError, notFound } from "../../common/errors";
import { buildPlan, rolesWith, SETUP_DEFS, skipKey, type PlanDto, type SetupSnapshot } from "./setup-plan";
import { ROLE_PERMISSIONS } from "../../auth/permissions";

type Stored = { skipped?: Record<string, string>; dismissedAt?: string | null };

@Injectable()
export class SetupService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(AuditService) private readonly audit: AuditService) {}

  private async stored(orgId: string): Promise<{ settings: Record<string, unknown>; setup: Stored }> {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { settings: true } });
    const settings = (t.settings ?? {}) as Record<string, unknown>;
    return { settings, setup: (settings.setup ?? {}) as Stored };
  }
  private async save(orgId: string, settings: Record<string, unknown>, setup: Stored) {
    await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: { ...settings, setup } as never } });
  }

  async snapshot(orgId: string): Promise<SetupSnapshot> {
    const [tenant, branches, lotsBy, salesBy, drugCount, licensed, otherStaff] = await Promise.all([
      this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { settings: true } }),
      this.prisma.branch.findMany({ where: { orgId, active: true }, orderBy: { createdAt: "asc" }, select: { id: true, name: true, licenceNo: true, address: true } }),
      this.prisma.stockLot.groupBy({ by: ["branchId"], where: { orgId }, _count: { _all: true } }),
      this.prisma.sale.groupBy({ by: ["branchId"], where: { orgId, status: "COMPLETED" }, _count: { _all: true } }),
      this.prisma.priceBookEntry.count({ where: { orgId } }),
      this.prisma.staffUser.count({ where: { orgId, active: true, role: { in: ["OWNER", "PHARMACIST"] }, pharmacistLicenceNo: { not: null } } }),
      this.prisma.staffUser.count({ where: { orgId, active: true, role: { not: "OWNER" } } }),
    ]);
    const settings = (tenant.settings ?? {}) as { receipt?: { header?: string; footer?: string }; receiptFooter?: string; kiorexConnect?: { status?: string } };
    const lots = new Map(lotsBy.map((x) => [x.branchId, x._count._all]));
    const sales = new Map(salesBy.map((x) => [x.branchId, x._count._all]));
    return {
      branches: branches.map((b) => ({ ...b, stockLots: lots.get(b.id) ?? 0, sales: sales.get(b.id) ?? 0 })),
      pharmacistLicensed: licensed > 0,
      pricedDrugs: drugCount,
      otherStaff,
      receiptConfigured: Boolean(settings.receipt?.header?.trim() || settings.receipt?.footer?.trim() || settings.receiptFooter?.trim()),
      connectStatus: settings.kiorexConnect?.status ?? null,
    };
  }

  async get(u: AuthUser): Promise<PlanDto> {
    const [snap, { setup }] = await Promise.all([this.snapshot(u.orgId), this.stored(u.orgId)]);
    const plan = buildPlan(snap, setup.skipped ?? {}, { role: u.role }, setup.dismissedAt ?? null);
    // new pending work reopens a dismissed checklist
    if (setup.dismissedAt && !plan.allDone) { const s = await this.stored(u.orgId); await this.save(u.orgId, s.settings, { ...s.setup, dismissedAt: null }); }
    return plan;
  }

  async skip(u: AuthUser, key: string, entityId?: string): Promise<PlanDto> {
    const def = SETUP_DEFS.find((d) => d.key === key);
    if (!def) throw notFound("Setup step", key);
    if (def.required) throw new DomainError("STEP_REQUIRED", "Required steps cannot be skipped", 400);
    if (!ROLE_PERMISSIONS[u.role].has(def.perm)) throw new DomainError("FORBIDDEN", `Your role cannot change this step; ask the owner (${rolesWith(def.perm).join(", ")})`, 403);
    if (def.scope === "branch") {
      if (!entityId) throw new DomainError("ENTITY_REQUIRED", "entityId (branch) is required", 400);
      if (!(await this.prisma.branch.findFirst({ where: { id: entityId, orgId: u.orgId }, select: { id: true } }))) throw notFound("Branch", entityId);
    }
    const s = await this.stored(u.orgId);
    const skipped = { ...(s.setup.skipped ?? {}), [skipKey(key, def.scope === "branch" ? entityId : null)]: "skipped" };
    await this.save(u.orgId, s.settings, { ...s.setup, skipped });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "setup.step_skipped", entityType: "Tenant", entityId: u.orgId });
    return this.get(u);
  }

  async dismiss(u: AuthUser): Promise<PlanDto> {
    const cur = await this.get(u);
    if (!cur.allDone) throw new DomainError("NOT_DONE", "The checklist can be dismissed once every step is done or skipped", 400);
    const s = await this.stored(u.orgId);
    await this.save(u.orgId, s.settings, { ...s.setup, dismissedAt: new Date().toISOString() });
    return this.get(u);
  }
}
