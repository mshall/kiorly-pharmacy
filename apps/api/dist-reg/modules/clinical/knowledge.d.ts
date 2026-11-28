import { PrismaService } from "../../prisma/prisma.service";
import { type InteractionRule } from "../prescriptions/safety/interaction-dataset";
import { type DoseRule, type PopulationRule, type PregnancyRule } from "./clinical-dataset";
export interface ClinicalSnapshot {
    interactions: InteractionRule[];
    dose: Map<string, DoseRule>;
    pregnancy: Map<string, PregnancyRule>;
    lactation: Map<string, PopulationRule>;
    renal: Map<string, PopulationRule>;
    hepatic: Map<string, PopulationRule>;
}
export declare abstract class ClinicalKnowledge {
    abstract readonly mode: string;
    abstract snapshot(orgId: string): Promise<ClinicalSnapshot>;
}
export declare class LocalClinicalKnowledge extends ClinicalKnowledge {
    private readonly prisma;
    readonly mode = "local";
    private readonly cache;
    constructor(prisma: PrismaService);
    invalidate(orgId?: string): void;
    snapshot(orgId: string): Promise<ClinicalSnapshot>;
}
