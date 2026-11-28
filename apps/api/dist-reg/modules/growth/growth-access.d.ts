import type { StaffRole } from "../../generated/prisma/client";
export type GrowthLevel = "admin" | "read" | "none";
export declare const growthLevel: (role: StaffRole) => GrowthLevel;
export type GrowthAction = "view" | "create" | "update" | "revoke";
export declare const canGrowth: (role: StaffRole, action: GrowthAction) => boolean;
