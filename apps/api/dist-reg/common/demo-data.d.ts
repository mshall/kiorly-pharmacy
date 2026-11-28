export interface SqlClient {
    $executeRawUnsafe(sql: string, ...values: unknown[]): Promise<number>;
    $queryRawUnsafe<T = unknown>(sql: string, ...values: unknown[]): Promise<T>;
}
export interface DemoRoot {
    table: string;
    kind: 'org' | 'shared';
    seededWhere: string;
}
export declare const DEMO_ROOTS: DemoRoot[];
interface Fk {
    child: string;
    childCol: string;
    parent: string;
    parentCol: string;
    onDelete: string;
}
interface Catalogue {
    tables: Map<string, Set<string>>;
    fks: Fk[];
}
export declare function readCatalogue(db: SqlClient): Promise<Catalogue>;
export declare function scopePredicate(cat: Catalogue, table: string, seen?: string[]): string | null;
export declare function deletionOrder(cat: Catalogue): {
    table: string;
    where: string;
}[];
export declare function markDemoRows(db: SqlClient, opts?: {
    batch?: string;
}): Promise<Record<string, number>>;
export interface OrgReport {
    orgId: string;
    name: string | null;
    deleted: Record<string, number>;
    kept: {
        table: string;
        rows: number;
        reason: string;
    }[];
    organisationDeleted: boolean;
}
export interface RemovalReport {
    orgs: OrgReport[];
    shared: {
        table: string;
        deleted: number;
        kept: number;
    }[];
    markersCleaned: number;
    totalDeleted: number;
}
export declare function removeDemoData(db: SqlClient): Promise<RemovalReport>;
export type Mode = 'dry-run' | 'confirm' | 'mark';
export declare function parseMode(argv: string[]): Mode;
export declare function formatReport(rep: RemovalReport, confirmed: boolean): string[];
export {};
