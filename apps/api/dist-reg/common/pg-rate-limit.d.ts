export interface RawSql {
    $queryRawUnsafe<T = unknown>(q: string, ...v: unknown[]): Promise<T>;
    $executeRawUnsafe(q: string, ...v: unknown[]): Promise<number>;
}
export interface LimitResult {
    ok: boolean;
    retryAfterSec: number;
}
export declare class PgRateLimiter {
    private readonly db;
    private readonly now;
    constructor(db: RawSql, now?: () => number);
    private win;
    hit(key: string, limit: number, windowMs: number): Promise<LimitResult>;
    sweep(): Promise<number>;
    reset(): Promise<void>;
}
