"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_API_PREFIX = void 0;
exports.apiPrefix = apiPrefix;
exports.corsOrigins = corsOrigins;
exports.corsNotice = corsNotice;
exports.storageDirIsEphemeral = storageDirIsEphemeral;
exports.ephemeralStorageWarning = ephemeralStorageWarning;
exports.warnStartupConfig = warnStartupConfig;
const node_path_1 = require("node:path");
exports.DEFAULT_API_PREFIX = "api/v1";
function apiPrefix(env = process.env) {
    const raw = (env.API_PREFIX ?? "").trim().replace(/^\/+|\/+$/g, "");
    if (!raw)
        return exports.DEFAULT_API_PREFIX;
    if (!/^[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(raw))
        throw new Error("API_PREFIX must be a URL path of letters, digits and . _ ~ - separated by / (for example api/v1)");
    return raw;
}
function corsOrigins(env = process.env, localDefault = "") {
    const raw = env.CORS_ORIGINS?.trim() ?? (env.NODE_ENV === "production" ? "" : localDefault);
    return raw.split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean);
}
function corsNotice(env = process.env) {
    return env.NODE_ENV === "production" && !env.CORS_ORIGINS?.trim()
        ? "cors: CORS_ORIGINS is not set; cross-origin browser calls are refused (same-origin calls through a reverse proxy keep working)."
        : null;
}
const EPHEMERAL_ROOTS = ["/tmp", "/var/tmp", "/dev/shm", "/run"];
function storageDirIsEphemeral(env = process.env, cwd = process.cwd()) {
    const dir = env.STORAGE_DIR?.trim();
    if (!dir)
        return true;
    if (!(0, node_path_1.isAbsolute)(dir))
        return true;
    const p = (0, node_path_1.resolve)(dir);
    if (EPHEMERAL_ROOTS.some((r) => p === r || p.startsWith(r + node_path_1.sep)))
        return true;
    const c = (0, node_path_1.resolve)(cwd);
    return p === c || p.startsWith(c + node_path_1.sep);
}
function ephemeralStorageWarning(env = process.env, cwd = process.cwd()) {
    if (env.NODE_ENV !== "production")
        return null;
    if ((env.STORAGE_MODE ?? "mock").trim().toLowerCase() === "real")
        return null;
    if (env.STORAGE_DIR_PERSISTENT?.trim().toLowerCase() === "true")
        return null;
    if (!storageDirIsEphemeral(env, cwd))
        return null;
    return "storage: STORAGE_MODE=mock writes to local disk and STORAGE_DIR is unset or on an ephemeral path; files are LOST on every redeploy or restart. Mount a persistent volume (single Docker host: -v <host-dir>:/data/storage with STORAGE_DIR=/data/storage) or use STORAGE_MODE=real. Set STORAGE_DIR_PERSISTENT=true once a volume is mounted at that path.";
}
function warnStartupConfig(log = (m) => console.warn(m), env = process.env) {
    for (const m of [ephemeralStorageWarning(env), corsNotice(env)])
        if (m)
            log(m);
}
//# sourceMappingURL=runtime-env.js.map