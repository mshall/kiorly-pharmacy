"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoSeedRefusedError = void 0;
exports.declaredEnvironment = declaredEnvironment;
exports.checkDemoSeedAllowed = checkDemoSeedAllowed;
exports.assertDemoSeedAllowed = assertDemoSeedAllowed;
const ENV_VARS = ["KIORLY_ENV", "KIOREX_ENV", "ENV_TAG"];
const PROD_NAMES = new Set(["prod", "production", "prd", "live"]);
const NON_PROD_NAMES = new Set(["dev", "development", "local", "test", "testing", "staging", "stage", "demo", "qa", "sandbox", "preview"]);
class DemoSeedRefusedError extends Error {
    reason;
    constructor(reason) {
        super(`Refusing to run the demo seed: ${reason}`);
        this.reason = reason;
        this.name = "DemoSeedRefusedError";
    }
}
exports.DemoSeedRefusedError = DemoSeedRefusedError;
function declaredEnvironment(env = process.env) {
    const values = ENV_VARS.map((k) => env[k]?.trim().toLowerCase()).filter((v) => Boolean(v));
    const prod = values.find((v) => PROD_NAMES.has(v));
    if (prod)
        return prod;
    return values[0] ?? null;
}
function databaseLooksProduction(url) {
    if (!url)
        return null;
    try {
        const u = new URL(url);
        const hay = `${u.hostname} ${u.pathname.replace(/^\//, "")}`.toLowerCase();
        if (/(^|[^a-z0-9])(prod|production|prd)([^a-z0-9]|$)/.test(hay))
            return u.pathname.replace(/^\//, "") || u.hostname;
    }
    catch {
    }
    return null;
}
function checkDemoSeedAllowed(env = process.env) {
    if (env.DEMO_SEED_ALLOWED !== "true")
        throw new DemoSeedRefusedError("DEMO_SEED_ALLOWED=true is not set");
    const declared = declaredEnvironment(env);
    if (declared && PROD_NAMES.has(declared))
        throw new DemoSeedRefusedError(`environment is "${declared}" (production)`);
    if (env.ALLOW_PRODUCTION_DEMO_SEED || env.ALLOW_DEMO_SEED === "prod")
        throw new DemoSeedRefusedError("there is no override that allows demo data in production");
    if (declared === null) {
        if ((env.NODE_ENV ?? "").toLowerCase() === "production")
            throw new DemoSeedRefusedError("NODE_ENV=production and no KIORLY_ENV/ENV_TAG declares a non-production environment");
    }
    else if (!NON_PROD_NAMES.has(declared)) {
        throw new DemoSeedRefusedError(`unknown environment "${declared}" (allowed: ${[...NON_PROD_NAMES].join(", ")})`);
    }
    const db = databaseLooksProduction(env.DATABASE_URL);
    if (db)
        throw new DemoSeedRefusedError(`DATABASE_URL points at a database that looks like production ("${db}")`);
    return declared ?? (env.NODE_ENV?.toLowerCase() || "local");
}
function assertDemoSeedAllowed(label, env = process.env, log = (m) => console.log(m)) {
    const environment = checkDemoSeedAllowed(env);
    let dbName = "(DATABASE_URL not set)";
    try {
        if (env.DATABASE_URL)
            dbName = new URL(env.DATABASE_URL).pathname.replace(/^\//, "") || "(default)";
    }
    catch {
        dbName = "(unparsable)";
    }
    log(`==================================================================\n  DEMO SEED (synthetic, NON-PRODUCTION ONLY): ${label}\n  environment=${environment} database=${dbName}\n==================================================================`);
    return environment;
}
//# sourceMappingURL=demo-seed-guard.js.map