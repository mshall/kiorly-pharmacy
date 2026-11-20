import type { Prisma, PrismaClient } from "../generated/prisma/client";
import type { AuthUser } from "../auth/auth-user";
import { badRequest, forbidden } from "./errors";

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * Resolves the branch a request operates on. Branch-bound staff can only act on their own branch;
 * OWNER / CHAIN_OPS (branchId null) choose one (or default to the only branch). The branch must belong to the caller's tenant.
 */
export async function resolveBranchId(db: Db, user: AuthUser, requested?: string | null): Promise<string> {
  let branchId = requested ?? user.branchId ?? undefined;
  if (user.branchId && branchId !== user.branchId) throw forbidden("BRANCH_FORBIDDEN", "You can only act on your own branch");
  if (!branchId) {
    const branches = await db.branch.findMany({ where: { orgId: user.orgId, active: true }, select: { id: true }, take: 2 });
    if (branches.length !== 1) throw badRequest("BRANCH_REQUIRED", "branchId is required");
    branchId = branches[0]!.id;
  }
  const b = await db.branch.findFirst({ where: { id: branchId, orgId: user.orgId }, select: { id: true } });
  if (!b) throw forbidden("BRANCH_FORBIDDEN", "Branch not found in your organisation");
  return b.id;
}

/** Branch filter for list queries: branch-bound users see only their branch; others may filter optionally. */
export function branchFilter(user: AuthUser, requested?: string | null): { branchId?: string } {
  if (user.branchId) return { branchId: user.branchId };
  return requested ? { branchId: requested } : {};
}
