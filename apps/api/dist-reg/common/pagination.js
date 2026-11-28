"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageArgs = pageArgs;
function pageArgs(q, max = 100) {
    const pageSize = Math.min(Math.max(Number(q.pageSize ?? 25) || 25, 1), max);
    const page = Math.max(Number(q.page ?? 1) || 1, 1);
    return { skip: (page - 1) * pageSize, take: pageSize, page, pageSize };
}
//# sourceMappingURL=pagination.js.map