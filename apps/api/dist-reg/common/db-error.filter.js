"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
let AllExceptionsFilter = class AllExceptionsFilter {
    log = new common_1.Logger("Exceptions");
    catch(err, host) {
        const res = host.switchToHttp().getResponse();
        if (err instanceof common_1.HttpException) {
            const status = err.getStatus();
            const body = err.getResponse();
            const out = typeof body === "string" ? { statusCode: status, code: common_1.HttpStatus[status] ?? "ERROR", message: body } : { ...body };
            const o = out;
            if (!o.code)
                o.code = status === 400 ? "VALIDATION_FAILED" : common_1.HttpStatus[status] ?? "ERROR";
            if (Array.isArray(o.message)) {
                o.details = o.message;
                o.message = "Validation failed";
            }
            res.status(status).json(o);
            return;
        }
        const msg = err instanceof Error ? err.message : String(err);
        const dbCheck = /(check_violation|integrity_constraint_violation)|code: "23(514|000)"|requires manager approval|cannot be sold|sign-off|controlled-substance log|append-only|history is retained/i;
        if ((err instanceof client_1.Prisma.PrismaClientUnknownRequestError || err instanceof client_1.Prisma.PrismaClientKnownRequestError) && dbCheck.test(msg)) {
            const clean = (/message: "([^"]+)"/.exec(msg)?.[1] ?? /ERROR:\s*(.+)/.exec(msg)?.[1] ?? msg).split("\n")[0];
            res.status(409).json({ statusCode: 409, code: "DB_INVARIANT", message: clean });
            return;
        }
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (err.code === "P2002") {
                res.status(409).json({ statusCode: 409, code: "DUPLICATE", message: "Duplicate record", details: err.meta });
                return;
            }
            if (err.code === "P2025") {
                res.status(404).json({ statusCode: 404, code: "NOT_FOUND", message: "Record not found" });
                return;
            }
        }
        const code = err?.code ?? "";
        if (err?.name === "PrismaClientValidationError" || ["P2000", "P2006", "P2007", "P2020", "P2023", "P2033"].includes(code) || (err instanceof RangeError && /invalid (time value|date)/i.test(msg))) {
            res.status(400).json({ statusCode: 400, code: "INVALID_INPUT", message: "A value in the request is malformed or out of range" });
            return;
        }
        if (err instanceof TypeError && /Cannot read properties of (undefined|null)|is not iterable/.test(msg)) {
            const rq = host.switchToHttp().getRequest();
            const empty = !rq.body || typeof rq.body !== "object" || Array.isArray(rq.body) || Object.keys(rq.body).length === 0;
            if (["POST", "PUT", "PATCH"].includes(rq.method ?? "") && empty) {
                res.status(400).json({ statusCode: 400, code: "VALIDATION_FAILED", message: "The request body is missing or incomplete" });
                return;
            }
        }
        this.log.error(msg, err instanceof Error ? err.stack : undefined);
        res.status(500).json({ statusCode: 500, code: "INTERNAL", message: "Internal error" });
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
//# sourceMappingURL=db-error.filter.js.map