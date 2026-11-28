export interface RxLabelData {
    pharmacy: string;
    branch: string;
    branchPhone: string | null;
    licenceNo: string | null;
    rxNo: string;
    dispensedAt: Date;
    patient: string;
    refillsLeft: number | null;
    prescriber: string | null;
    pharmacist: string | null;
    pharmacistLicence: string | null;
    counselling: string | null;
    lines: Array<{
        name: string;
        nameAr: string | null;
        strength: string | null;
        quantity: number;
        directions: string | null;
        lotNumber: string;
        expiryDate: Date;
        coldChain: boolean;
        controlled: boolean;
        substituted: boolean;
    }>;
}
export declare function renderRxLabelsHtml(d: RxLabelData, lang: "ar" | "en"): string;
