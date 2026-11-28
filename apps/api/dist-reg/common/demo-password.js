"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoPasswordsAllowed = demoPasswordsAllowed;
exports.demoPasswordHash = demoPasswordHash;
const demo_seed_guard_1 = require("./demo-seed-guard");
const password_1 = require("../auth/password");
function demoPasswordsAllowed(env = process.env) {
    const e = (0, demo_seed_guard_1.declaredEnvironment)(env);
    return e === null || e === "dev" || e === "development" || e === "local";
}
async function demoPasswordHash(pw, env = process.env) {
    return demoPasswordsAllowed(env) ? (0, password_1.hashPassword)(pw) : null;
}
//# sourceMappingURL=demo-password.js.map