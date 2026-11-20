import { Body, Controller, Delete, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsIn, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { DomainError, conflict, notFound } from "../../common/errors";
import { pageArgs } from "../../common/pagination";
import { ClinicalKnowledge, LocalClinicalKnowledge } from "./knowledge";
import { DOSE_RULES, HEPATIC_RULES, LACTATION_RULES, PREGNANCY_RULES, RENAL_RULES } from "./clinical-dataset";
import { INTERACTION_RULES } from "../prescriptions/safety/interaction-dataset";

const KINDS = ["INTERACTION", "DOSE_RANGE", "PREGNANCY", "LACTATION", "RENAL", "HEPATIC"] as const;
class RuleDto {
  @IsIn(KINDS) kind!: (typeof KINDS)[number];
  @IsString() @MinLength(2) ingredient!: string;
  @IsOptional() @IsString() ingredientB?: string;
  @IsOptional() @IsIn(["MINOR", "MODERATE", "MAJOR", "CONTRAINDICATED"]) severity?: string;
  @IsString() @MinLength(3) note!: string;
  @IsOptional() @IsNumberString() maxDailyMg?: string;
  @IsOptional() @IsNumberString() maxSingleMg?: string;
  @IsOptional() @IsNumberString() pediatricMaxMgPerKg?: string;
  @IsOptional() @IsIn(["A", "B", "C", "D", "X"]) category?: string;
}

@ApiTags("clinical")
@ApiBearerAuth()
@Controller("clinical")
export class ClinicalController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(ClinicalKnowledge) private readonly kb: ClinicalKnowledge, @Inject(LocalClinicalKnowledge) private readonly local: LocalClinicalKnowledge) {}

  /** Knowledge base overview: adapter mode + the merged rules (built-in starter set, global seed rows and this tenant's own). */
  @Get("kb") @Perm("rx.read")
  async list(@CurrentUser() u: AuthUser, @Query() q: { kind?: string; q?: string }) {
    const rows = await this.prisma.clinicalRule.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: u.orgId }], ...(q.kind ? { kind: q.kind } : {}), ...(q.q ? { ingredient: { contains: q.q.toLowerCase() } } : {}) }, orderBy: [{ kind: "asc" }, { ingredient: "asc" }], take: 500 });
    const builtIn = [
      ...INTERACTION_RULES.map((r) => ({ kind: "INTERACTION", ingredient: r.a, ingredientB: r.b, severity: r.severity, note: r.note })),
      ...DOSE_RULES.map((r) => ({ kind: "DOSE_RANGE", ingredient: r.ingredient, maxDailyMg: r.maxDailyMg, maxSingleMg: r.maxSingleMg ?? null, pediatricMaxMgPerKg: r.pediatricMaxMgPerKg ?? null, note: `max ${r.maxDailyMg} mg/day` })),
      ...PREGNANCY_RULES.map((r) => ({ kind: "PREGNANCY", ingredient: r.ingredient, category: r.category, note: r.note })), ...LACTATION_RULES.map((r) => ({ kind: "LACTATION", ...r })), ...RENAL_RULES.map((r) => ({ kind: "RENAL", ...r })), ...HEPATIC_RULES.map((r) => ({ kind: "HEPATIC", ...r })),
    ].filter((r) => (!q.kind || r.kind === q.kind) && (!q.q || r.ingredient.includes(q.q.toLowerCase())));
    return { mode: this.kb.mode, counts: { builtIn: builtIn.length, database: rows.length }, rules: [...rows.map((r) => ({ id: r.id, scope: r.orgId ? "TENANT" : "GLOBAL", source: r.source, kind: r.kind, ingredient: r.ingredient, ingredientB: r.ingredientB, severity: r.severity, note: r.note, maxDailyMg: r.maxDailyMg?.toString() ?? null, maxSingleMg: r.maxSingleMg?.toString() ?? null, pediatricMaxMgPerKg: r.pediatricMaxMgPerKg?.toString() ?? null, category: r.category })), ...builtIn.slice(0, 400).map((r) => ({ id: null, scope: "BUILT_IN", source: "starter", ...r }))] };
  }

  /** A tenant adds (or overrides) a rule for itself. Global rows are never edited. */
  @Post("kb") @Perm("safety.kb.manage")
  async add(@CurrentUser() u: AuthUser, @Body() d: RuleDto) {
    const ing = d.ingredient.toLowerCase().trim(), b = d.ingredientB?.toLowerCase().trim();
    if (d.kind === "INTERACTION" && !b) throw new DomainError("INGREDIENT_B_REQUIRED", "An interaction needs two ingredients", 400);
    if (d.kind === "DOSE_RANGE" && !d.maxDailyMg) throw new DomainError("MAX_DAILY_REQUIRED", "A dose rule needs a maximum daily dose", 400);
    if (d.kind === "PREGNANCY" && !d.category) throw new DomainError("CATEGORY_REQUIRED", "A pregnancy rule needs a category (A-X)", 400);
    const key = `${d.kind.toLowerCase()}:${[ing, b].filter(Boolean).sort().join("|")}:org:${u.orgId}`;
    if (await this.prisma.clinicalRule.findUnique({ where: { key } })) throw conflict("RULE_EXISTS", "This tenant already has a rule for this entry; remove it first");
    const r = await this.prisma.clinicalRule.create({ data: { orgId: u.orgId, key, kind: d.kind, ingredient: ing, ingredientB: b, severity: d.severity ?? "MODERATE", note: d.note, maxDailyMg: d.maxDailyMg, maxSingleMg: d.maxSingleMg, pediatricMaxMgPerKg: d.pediatricMaxMgPerKg, category: d.category, source: "tenant", createdBy: u.userId } });
    this.local.invalidate(u.orgId);
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "clinical.rule_add", entityType: "ClinicalRule", entityId: r.id, meta: { kind: d.kind, ingredient: ing } } });
    return r;
  }

  @Delete("kb/:id") @Perm("safety.kb.manage")
  async remove(@CurrentUser() u: AuthUser, @Param("id") id: string) {
    const r = await this.prisma.clinicalRule.findFirst({ where: { id, orgId: u.orgId } });
    if (!r) throw notFound("Rule", id);
    await this.prisma.clinicalRule.delete({ where: { id } });
    this.local.invalidate(u.orgId);
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "clinical.rule_remove", entityType: "ClinicalRule", entityId: id } });
    return { ok: true };
  }

  /** Review of pharmacist safety overrides (who overrode which check, why, when) — the audit trail the owner reviews. */
  @Get("overrides") @Perm("audit.read")
  async overrides(@CurrentUser() u: AuthUser, @Query() q: { from?: string; to?: string; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q);
    const where = { dispensing: { orgId: u.orgId }, outcome: "OVERRIDDEN_BY_PHARMACIST" as const, ...(q.from || q.to ? { checkedAt: { ...(q.from ? { gte: new Date(q.from) } : {}), ...(q.to ? { lte: new Date(q.to) } : {}) } } : {}) };
    const [rows, total] = await Promise.all([this.prisma.safetyCheckResult.findMany({ where, include: { dispensing: { select: { id: true, branchId: true, prescriptionId: true, patientId: true, createdAt: true } } }, orderBy: { checkedAt: "desc" }, skip, take }), this.prisma.safetyCheckResult.count({ where })]);
    const staff = await this.prisma.staffUser.findMany({ where: { id: { in: rows.map((r) => r.overriddenBy).filter((x): x is string => !!x) } }, select: { id: true, displayName: true, pharmacistLicenceNo: true } });
    const sm = new Map(staff.map((s) => [s.id, s]));
    return { total, items: rows.map((r) => ({ id: r.id, kind: r.kind, detail: r.detail, reason: r.overrideReason, checkedAt: r.checkedAt, dispensingId: r.dispensingId, prescriptionId: r.dispensing.prescriptionId, pharmacist: r.overriddenBy ? sm.get(r.overriddenBy) ?? { id: r.overriddenBy } : null })) };
  }
}
