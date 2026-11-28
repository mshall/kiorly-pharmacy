"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveBranchId = resolveBranchId;
exports.branchFilter = branchFilter;
const errors_1 = require("./errors");
async function resolveBranchId(db, user, requested) {
    let branchId = requested ?? user.branchId ?? undefined;
    if (user.branchId && branchId !== user.branchId)
        throw (0, errors_1.forbidden)("BRANCH_FORBIDDEN", "You can only act on your own branch");
    if (!branchId) {
        const branches = await db.branch.findMany({ where: { orgId: user.orgId, active: true }, select: { id: true }, take: 2 });
        if (branches.length !== 1)
            throw (0, errors_1.badRequest)("BRANCH_REQUIRED", "branchId is required");
        branchId = branches[0].id;
    }
    const b = await db.branch.findFirst({ where: { id: branchId, orgId: user.orgId }, select: { id: true } });
    if (!b)
        throw (0, errors_1.forbidden)("BRANCH_FORBIDDEN", "Branch not found in your organisation");
    return b.id;
}
function branchFilter(user, requested) {
    if (user.branchId)
        return { branchId: user.branchId };
    return requested ? { branchId: requested } : {};
}
//# sourceMappingURL=branch-scope.js.map