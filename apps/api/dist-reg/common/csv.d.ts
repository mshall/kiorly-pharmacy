export declare function parseCsv(text: string): {
    headers: string[];
    rows: Array<Record<string, string>>;
};
export declare const csvCell: (v: unknown) => string;
export declare const toCsvText: (headers: string[], rows: Array<Array<unknown>>) => string;
