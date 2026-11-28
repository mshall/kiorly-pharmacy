"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canGrowth = exports.growthLevel = void 0;
const ADMIN = new Set(["OWNER", "BRANCH_MANAGER"]);
const READ = new Set(["PHARMACIST", "CASHIER", "ASSISTANT", "CHAIN_OPS"]);
const growthLevel = (role) => (ADMIN.has(role) ? "admin" : READ.has(role) ? "read" : "none");
exports.growthLevel = growthLevel;
const MATRIX = {
    admin: new Set(["view", "create", "update", "revoke"]),
    read: new Set(["view"]),
    none: new Set(),
};
const canGrowth = (role, action) => MATRIX[(0, exports.growthLevel)(role)].has(action);
exports.canGrowth = canGrowth;
//# sourceMappingURL=growth-access.js.map