"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StorageAdapter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageAdapter = void 0;
const common_1 = require("@nestjs/common");
const http_1 = require("../../providers/http");
const storage_provider_1 = require("../../providers/storage-provider");
const storage_policy_1 = require("../../providers/storage-policy");
const errors_1 = require("../../common/errors");
let StorageAdapter = class StorageAdapter {
    static { StorageAdapter_1 = this; }
    static fetchImpl;
    store() { return (0, storage_provider_1.objectStore)(process.env, StorageAdapter_1.fetchImpl); }
    async put(key, bytes, contentType) {
        const base = (0, storage_policy_1.safeKey)(key);
        let type;
        try {
            type = (0, storage_policy_1.validateUpload)(bytes, contentType);
        }
        catch (e) {
            throw this.asDomain(e);
        }
        const finalKey = /\.[a-z0-9]{2,5}$/.test(base) ? base : `${base}.${storage_policy_1.ALLOWED_TYPES[type]}`;
        try {
            await this.store().put(finalKey, bytes, type);
        }
        catch (e) {
            throw this.asDomain(e);
        }
        return { key: finalKey, bytes: bytes.length, contentType: type };
    }
    async putDataUrl(key, dataUrl) {
        try {
            const p = (0, storage_policy_1.parseDataUrl)(dataUrl);
            return this.put(key, p.bytes, p.contentType);
        }
        catch (e) {
            throw this.asDomain(e);
        }
    }
    async get(key) {
        let b;
        try {
            b = await this.store().get(key);
        }
        catch (e) {
            throw this.asDomain(e);
        }
        if (!b)
            return null;
        const ext = /\.(csv|json)$/.exec(key)?.[1];
        return { bytes: b, contentType: (0, storage_policy_1.sniffType)(b) ?? (ext === "csv" ? "text/csv" : ext === "json" ? "application/json" : "application/octet-stream") };
    }
    signedUrl(key, ttlSec) { try {
        return (0, storage_policy_1.signDownload)(key, ttlSec);
    }
    catch (e) {
        throw this.asDomain(e);
    } }
    verify(key, exp, sig) { return (0, storage_policy_1.verifyDownload)(key, exp, sig); }
    asDomain(e) {
        if (e instanceof errors_1.DomainError)
            return e;
        if (e instanceof http_1.ProviderError)
            return new errors_1.DomainError("STORAGE_UNAVAILABLE", `Object storage failed (${e.code})`, 503, { code: e.code });
        if (e && typeof e === "object" && e.name === "StorageValidationError") {
            const v = e;
            return new errors_1.DomainError(v.code === "FILE_TOO_LARGE" ? "FILE_TOO_LARGE" : "INVALID_FILE", v.message, v.code === "FILE_TOO_LARGE" ? 413 : 400, { reason: v.code });
        }
        return e;
    }
};
exports.StorageAdapter = StorageAdapter;
exports.StorageAdapter = StorageAdapter = StorageAdapter_1 = __decorate([
    (0, common_1.Injectable)()
], StorageAdapter);
//# sourceMappingURL=storage.adapter.js.map