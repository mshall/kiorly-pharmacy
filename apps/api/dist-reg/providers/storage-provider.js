"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpObjectStore = exports.LocalObjectStore = void 0;
exports.objectStore = objectStore;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
const http_1 = require("./http");
const provider_env_1 = require("./provider-env");
const storage_mapping_1 = require("./mapping/storage.mapping");
const storage_policy_1 = require("./storage-policy");
class LocalObjectStore {
    env;
    mode = "mock";
    name = "local-disk";
    constructor(env = process.env) {
        this.env = env;
    }
    path(key) { return (0, node_path_1.join)((0, node_path_1.resolve)(this.env.STORAGE_DIR ?? (0, node_path_1.join)(process.cwd(), ".data")), (0, storage_policy_1.safeKey)(key)); }
    async put(key, bytes, _contentType) { const p = this.path(key); await (0, promises_1.mkdir)((0, node_path_1.dirname)(p), { recursive: true }); await (0, promises_1.writeFile)(p, bytes); }
    async get(key) { try {
        return await (0, promises_1.readFile)(this.path(key));
    }
    catch (e) {
        if (e.code === "ENOENT")
            return null;
        throw e;
    } }
}
exports.LocalObjectStore = LocalObjectStore;
class HttpObjectStore {
    cfg;
    fetchImpl;
    mode = "real";
    name = "object-gateway";
    constructor(cfg, fetchImpl) {
        this.cfg = cfg;
        this.fetchImpl = fetchImpl;
    }
    async put(key, bytes, contentType) {
        await (0, http_1.providerRequest)(this.cfg, { method: "PUT", path: storage_mapping_1.storageMapping.objectPath((0, storage_policy_1.safeKey)(key)), rawBody: bytes, headers: storage_mapping_1.storageMapping.putHeaders(contentType), idempotencyKey: (0, node_crypto_1.createHash)("sha256").update(bytes).digest("hex").slice(0, 32) }, storage_mapping_1.storageMapping.authHeaders(this.cfg), this.fetchImpl);
    }
    async get(key) {
        try {
            return Buffer.from((await (0, http_1.providerRequest)(this.cfg, { method: "GET", path: storage_mapping_1.storageMapping.objectPath((0, storage_policy_1.safeKey)(key)), binary: true }, storage_mapping_1.storageMapping.authHeaders(this.cfg), this.fetchImpl)).raw);
        }
        catch (e) {
            if (e instanceof http_1.ProviderError && e.httpStatus === 404)
                return null;
            throw e;
        }
    }
}
exports.HttpObjectStore = HttpObjectStore;
function objectStore(env = process.env, fetchImpl) {
    const cfg = (0, provider_env_1.providerConfig)("STORAGE", env);
    return cfg.mode === "real" ? new HttpObjectStore(cfg, fetchImpl) : new LocalObjectStore(env);
}
//# sourceMappingURL=storage-provider.js.map