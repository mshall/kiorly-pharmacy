"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../auth/decorators");
const storage_adapter_1 = require("./adapters/storage.adapter");
let FilesController = class FilesController {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async download(key, exp, sig, res) {
        const v = this.storage.verify(key, exp, sig);
        if (!v.ok)
            throw new common_1.UnauthorizedException({ code: "INVALID_DOWNLOAD_SIGNATURE", message: v.reason, reason: v.reason });
        const f = await this.storage.get(key);
        if (!f)
            throw new common_1.NotFoundException({ code: "NOT_FOUND", message: "File not found" });
        res.setHeader("content-type", f.contentType);
        res.setHeader("content-length", String(f.bytes.length));
        res.setHeader("content-disposition", `attachment; filename="${key.split("/").pop().replace(/[^a-zA-Z0-9._-]/g, "_")}"`);
        res.setHeader("x-content-type-options", "nosniff");
        res.setHeader("cache-control", "private, no-store");
        res.setHeader("content-security-policy", "default-src 'none'; sandbox");
        res.end(f.bytes);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("key")),
    __param(1, (0, common_1.Query)("exp")),
    __param(2, (0, common_1.Query)("sig")),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "download", null);
exports.FilesController = FilesController = __decorate([
    (0, swagger_1.ApiTags)("files"),
    (0, common_1.Controller)("files"),
    __param(0, (0, common_1.Inject)(storage_adapter_1.StorageAdapter)),
    __metadata("design:paramtypes", [storage_adapter_1.StorageAdapter])
], FilesController);
//# sourceMappingURL=files.controller.js.map