"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = exports.forbidden = exports.conflict = exports.notFound = exports.DomainError = void 0;
const common_1 = require("@nestjs/common");
class DomainError extends common_1.HttpException {
    code;
    details;
    constructor(code, message, status = common_1.HttpStatus.UNPROCESSABLE_ENTITY, details) {
        super({ statusCode: status, code, message, ...(details !== undefined ? { details } : {}) }, status);
        this.code = code;
        this.details = details;
    }
}
exports.DomainError = DomainError;
const notFound = (what, id) => new DomainError("NOT_FOUND", `${what} not found${id ? `: ${id}` : ""}`, common_1.HttpStatus.NOT_FOUND);
exports.notFound = notFound;
const conflict = (code, message, details) => new DomainError(code, message, common_1.HttpStatus.CONFLICT, details);
exports.conflict = conflict;
const forbidden = (code, message, details) => new DomainError(code, message, common_1.HttpStatus.FORBIDDEN, details);
exports.forbidden = forbidden;
const badRequest = (code, message, details) => new DomainError(code, message, common_1.HttpStatus.BAD_REQUEST, details);
exports.badRequest = badRequest;
//# sourceMappingURL=errors.js.map