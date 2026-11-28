export interface Page<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}
export declare function pageArgs(q: {
    page?: number | string;
    pageSize?: number | string;
}, max?: number): {
    skip: number;
    take: number;
    page: number;
    pageSize: number;
};
