import { HttpException } from "@nestjs/common";
export declare class DomainError extends HttpException {
    readonly code: string;
    readonly details?: unknown | undefined;
    constructor(code: string, message: string, status?: number, details?: unknown | undefined);
}
export declare const notFound: (what: string, id?: string) => DomainError;
export declare const conflict: (code: string, message: string, details?: unknown) => DomainError;
export declare const forbidden: (code: string, message: string, details?: unknown) => DomainError;
export declare const badRequest: (code: string, message: string, details?: unknown) => DomainError;
