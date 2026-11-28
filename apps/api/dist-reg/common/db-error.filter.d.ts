import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly log;
    catch(err: unknown, host: ArgumentsHost): void;
}
