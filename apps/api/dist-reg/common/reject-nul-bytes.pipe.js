"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectNulBytesPipe = void 0;
exports.containsNul = containsNul;
const common_1 = require("@nestjs/common");
function containsNul(value, depth = 0) {
    if (typeof value === "string")
        return value.includes("\u0000");
    if (depth > 8 || value === null || typeof value !== "object" || Buffer.isBuffer(value))
        return false;
    if (Array.isArray(value))
        return value.some((v) => containsNul(v, depth + 1));
    return Object.entries(value).some(([k, v]) => k.includes("\u0000") || containsNul(v, depth + 1));
}
let RejectNulBytesPipe = class RejectNulBytesPipe {
    transform(value, meta) {
        if (meta.type !== "custom" && containsNul(value))
            throw new common_1.BadRequestException({ code: "INVALID_CHARACTER", message: "Text must not contain NUL (\\u0000) characters" });
        return value;
    }
};
exports.RejectNulBytesPipe = RejectNulBytesPipe;
exports.RejectNulBytesPipe = RejectNulBytesPipe = __decorate([
    (0, common_1.Injectable)()
], RejectNulBytesPipe);
//# sourceMappingURL=reject-nul-bytes.pipe.js.map