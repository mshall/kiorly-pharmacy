"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPerm = void 0;
const hasPerm = (u, p, roleHas) => roleHas(u.role, p);
exports.hasPerm = hasPerm;
//# sourceMappingURL=auth-user.js.map