import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Prisma } from "@prisma/client";
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
    this.log.error(msg, err instanceof Error ? err.stack : undefined);
    res.status(500).json({ statusCode: 500, code: "INTERNAL", message: "Internal error" });
  }
}
