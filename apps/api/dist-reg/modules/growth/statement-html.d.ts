import type { StatementView } from "./commission-statement";
export type StatementLang = "ar" | "en";
export type StatementProduct = "PHARMACY" | "LAB";
export declare function renderStatementHtml(i: {
    product: StatementProduct;
    lang: StatementLang;
    periodKey: string;
    organisation: string;
    statement: StatementView;
    autoPrint?: boolean;
}): string;
