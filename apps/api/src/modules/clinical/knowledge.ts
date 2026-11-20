import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { INTERACTION_RULES, type InteractionRule } from "../prescriptions/safety/interaction-dataset";
import { DOSE_RULES, HEPATIC_RULES, LACTATION_RULES, PREGNANCY_RULES, RENAL_RULES, type DoseRule, type PopulationRule, type PregnancyRule, type Sev } from "./clinical-dataset";

/** What the safety engine needs (pure data): merged interaction rules and per-ingredient lookups. */
export interface ClinicalSnapshot {
  interactions: InteractionRule[];
  dose: Map<string, DoseRule>;
  pregnancy: Map<string, PregnancyRule>;
  lactation: Map<string, PopulationRule>;
  renal: Map<string, PopulationRule>;
  hepatic: Map<string, PopulationRule>;
}

/**
 * PLUGGABLE clinical knowledge adapter (ports & adapters, like the PSP / messaging adapters). The default `LocalClinicalKnowledge` reads the
 * built-in starter dataset merged with the database rules (global seed + the tenant's own). A licensed drug-database adapter can replace it by
 * providing another class for this token (CLINICAL_KB=... in a go-live pass) without touching the safety engine.
 */
export abstract class ClinicalKnowledge {
  abstract readonly mode: string;
  abstract snapshot(orgId: string): Promise<ClinicalSnapshot>;
}

const key = (a: string) => a.toLowerCase().trim();

@Injectable()
export class LocalClinicalKnowledge extends ClinicalKnowledge {
  readonly mode = "local";
  private readonly cache = new Map<string, { at: number; snap: ClinicalSnapshot }>();
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) { super(); }

  invalidate(orgId?: string) { if (orgId) this.cache.delete(orgId); else this.cache.clear(); }

  async snapshot(orgId: string): Promise<ClinicalSnapshot> {
    const hit = this.cache.get(orgId);
    if (hit && Date.now() - hit.at < 30_000) return hit.snap;
    const rows = await this.prisma.clinicalRule.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId }] }, orderBy: [{ orgId: { sort: "asc", nulls: "first" } }, { createdAt: "asc" }] });
    const snap: ClinicalSnapshot = { interactions: [...INTERACTION_RULES], dose: new Map(), pregnancy: new Map(), lactation: new Map(), renal: new Map(), hepatic: new Map() };
    for (const r of DOSE_RULES) snap.dose.set(r.ingredient, r);
    for (const r of PREGNANCY_RULES) snap.pregnancy.set(r.ingredient, r);
    for (const [m, src] of [[snap.lactation, LACTATION_RULES], [snap.renal, RENAL_RULES], [snap.hepatic, HEPATIC_RULES]] as const) for (const r of src) m.set(r.ingredient, r);
    // database rows override the built-in ones (tenant rows last, so they win over the global seed)
    for (const r of rows) {
      const ing = key(r.ingredient);
      if (r.kind === "INTERACTION" && r.ingredientB) {
        const b = key(r.ingredientB);
        snap.interactions = snap.interactions.filter((x) => !((x.a === ing && x.b === b) || (x.a === b && x.b === ing)));
        snap.interactions.push({ a: ing, b, severity: r.severity as Sev, note: r.note });
      } else if (r.kind === "DOSE_RANGE" && r.maxDailyMg) snap.dose.set(ing, { ingredient: ing, maxDailyMg: Number(r.maxDailyMg), maxSingleMg: r.maxSingleMg ? Number(r.maxSingleMg) : undefined, pediatricMaxMgPerKg: r.pediatricMaxMgPerKg ? Number(r.pediatricMaxMgPerKg) : undefined, note: r.note });
      else if (r.kind === "PREGNANCY" && r.category) snap.pregnancy.set(ing, { ingredient: ing, category: r.category as PregnancyRule["category"], note: r.note });
      else if (r.kind === "LACTATION") snap.lactation.set(ing, { ingredient: ing, severity: r.severity as Sev, note: r.note });
      else if (r.kind === "RENAL") snap.renal.set(ing, { ingredient: ing, severity: r.severity as Sev, note: r.note });
      else if (r.kind === "HEPATIC") snap.hepatic.set(ing, { ingredient: ing, severity: r.severity as Sev, note: r.note });
    }
    this.cache.set(orgId, { at: Date.now(), snap });
    return snap;
  }
}
