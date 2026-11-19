import { HttpException, HttpStatus } from "@nestjs/common";

/** Uniform API error: { statusCode, code, message, details? }. `code` is stable and machine-readable. */
export class DomainError extends HttpException {
  constructor(
    public readonly code: string,
    message: string,
    status: number = HttpStatus.UNPROCESSABLE_ENTITY,
    public readonly details?: unknown,
  ) {
    super({ statusCode: status, code, message, ...(details !== undefined ? { details } : {}) }, status);
  }
}

export const notFound = (what: string, id?: string) => new DomainError("NOT_FOUND", `${what} not found${id ? `: ${id}` : ""}`, HttpStatus.NOT_FOUND);
export const conflict = (code: string, message: string, details?: unknown) => new DomainError(code, message, HttpStatus.CONFLICT, details);
export const forbidden = (code: string, message: string, details?: unknown) => new DomainError(code, message, HttpStatus.FORBIDDEN, details);
export const badRequest = (code: string, message: string, details?: unknown) => new DomainError(code, message, HttpStatus.BAD_REQUEST, details);
