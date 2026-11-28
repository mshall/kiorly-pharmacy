export interface LabelData {
    brandName: string;
    brandNameAr?: string | null;
    activeIngredient: string;
    strength: string;
    dosageForm: string;
    packSize: string;
    barcode?: string | null;
    price?: string | null;
}
export declare function renderShelfLabels(labels: LabelData[], lang: "ar" | "en", currency?: string): string;
