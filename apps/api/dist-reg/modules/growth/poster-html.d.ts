export type PosterLang = "ar" | "en";
export type PosterSize = "A4" | "A5";
export type PosterKind = "POSTER" | "DESK";
export type PosterProduct = "PHARMACY" | "LAB";
export interface PosterInput {
    product: PosterProduct;
    kind: PosterKind;
    lang: PosterLang;
    size: PosterSize;
    nameEn: string;
    nameAr: string;
    subtitleEn?: string | null;
    subtitleAr?: string | null;
    shortUrl: string;
    qrSvg: string;
    autoPrint?: boolean;
}
export declare function escapeHtml(s: string): string;
export declare function renderPosterHtml(input: PosterInput): string;
