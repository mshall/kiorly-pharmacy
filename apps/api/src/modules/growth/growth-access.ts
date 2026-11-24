import type { StaffRole } from "../../generated/prisma/client";

/**
 * Growth workspace permissions for Kiorly Pharmacy (GRW-P4-B1, PROPOSED_DEFAULT: the role matrix is a founder decision, see Docs/GROWTH.md). No doctor scope.
 *  - admin  (OWNER, BRANCH_MANAGER): create, pause, resume, revoke; QR and posters; performance.
 *  - read   (PHARMACIST, CASHIER, ASSISTANT, CHAIN_OPS): view links, counts, QR and the counter card (the counter prints its own card).
 * A branch-scoped user (StaffUser.branchId set) only sees org-wide links and links of their own branch, and can change only links of their own branch.
 */
const ADMIN = new Set<StaffRole>(["OWNER", "BRANCH_MANAGER"]);
const READ = new Set<StaffRole>(["PHARMACIST", "CASHIER", "ASSISTANT", "CHAIN_OPS"]);

export type GrowthLevel = "admin" | "read" | "none";
export const growthLevel = (role: StaffRole): GrowthLevel => (ADMIN.has(role) ? "admin" : READ.has(role) ? "read" : "none");

export type GrowthAction = "view" | "create" | "update" | "revoke";
const MATRIX: Record<GrowthLevel, ReadonlySet<GrowthAction>> = {
  admin: new Set(["view", "create", "update", "revoke"]),
  read: new Set(["view"]),
  none: new Set(),
};
export const canGrowth = (role: StaffRole, action: GrowthAction): boolean => MATRIX[growthLevel(role)].has(action);
