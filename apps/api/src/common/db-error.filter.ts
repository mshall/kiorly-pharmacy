import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client";
import type { Response } from "express";

/** Maps database invariant violations (last line of defence, ADR-025) and Prisma errors to uniform API errors. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly log = new Logger("Exceptions");
  catch(err: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    if (err instanceof HttpException) {
      const status = err.getStatus();
      const body = err.getResponse();
      const out = typeof body === "string" ? { statusCode: status, code: HttpStatus[status] ?? "ERROR", message: body } : { ...(body as object) };
      const o = out as Record<string, unknown>;
      if (!o.code) o.code = status === 400 ? "VALIDATION_FAILED" : HttpStatus[status] ?? "ERROR";
      if (Array.isArray(o.message)) { o.details = o.message; o.message = "Validation failed"; }
      res.status(status).json(o);
      return;
    }
    const msg = err instanceof Error ? err.message : String(err);
    const dbCheck = /(check_violation|integrity_constraint_violation)|code: "23(514|000)"|requires manager approval|cannot be sold|sign-off|controlled-substance log|append-only|history is retained/i;
    if ((err instanceof Prisma.PrismaClientUnknownRequestError || err instanceof Prisma.PrismaClientKnownRequestError) && dbCheck.test(msg)) {
      const clean = (/message: "([^"]+)"/.exec(msg)?.[1] ?? /ERROR:\s*(.+)/.exec(msg)?.[1] ?? msg).split("\n")[0]!;
      res.status(409).json({ statusCode: 409, code: "DB_INVARIANT", message: clean });
      return;
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") { res.status(409).json({ statusCode: 409, code: "DUPLICATE", message: "Duplicate record", details: err.meta }); return; }
      if (err.code === "P2025") { res.status(404).json({ statusCode: 404, code: "NOT_FOUND", message: "Record not found" }); return; }
    }
    // Client faults that used to answer 500 (EDGE-49): Prisma argument validation (?from=garbage -> Invalid Date), malformed / out-of-range values, invalid dates, a mutating request with an empty body.
    const code = (err as { code?: string } | null)?.code ?? "";
    if ((err as { name?: string } | null)?.name === "PrismaClientValidationError" || ["P2000", "P2006", "P2007", "P2020", "P2023", "P2033"].includes(code) || (err instanceof RangeError && /invalid (time value|date)/i.test(msg))) {
      res.status(400).json({ statusCode: 400, code: "INVALID_INPUT", message: "A value in the request is malformed or out of range" }); return;
    }
    if (err instanceof TypeError && /Cannot read properties of (undefined|null)|is not iterable/.test(msg)) {
      const rq = host.switchToHttp().getRequest<{ method?: string; body?: unknown }>();
      const empty = !rq.body || typeof rq.body !== "object" || Array.isArray(rq.body) || Object.keys(rq.body as object).length === 0;
      if (["POST", "PUT", "PATCH"].includes(rq.method ?? "") && empty) { res.status(400).json({ statusCode: 400, code: "VALIDATION_FAILED", message: "The request body is missing or incomplete" }); return; }
    }
    this.log.error(msg, err instanceof Error ? err.stack : undefined);
    res.status(500).json({ statusCode: 500, code: "INTERNAL", message: "Internal error" });
  }
}
