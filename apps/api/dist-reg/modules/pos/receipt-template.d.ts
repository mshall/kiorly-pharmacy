interface ReceiptData {
    receiptNo: string | null;
    soldAt: Date;
    pharmacy: string;
    branch: string;
    branchAddress: string | null;
    licenceNo: string | null;
    currency: string;
    vatLabel: string;
    vatLabelAr: string;
    lines: Array<{
        name: string;
        nameAr: string | null;
        strength: string | null;
        lotNumber: string;
        quantity: number;
        unitPrice: string;
        discount: string;
        lineTotal: string;
        vatRate: string;
        vatAmount: string;
    }>;
    subtotal: string;
    discountTotal: string;
    vatTotal: string;
    total: string;
    payments: Array<{
        method: string;
        amount: string;
    }>;
    status: string;
    footer: string | null;
    notice: {
        en: string;
        ar: string;
    };
    template?: {
        header?: string;
        showVat?: boolean;
        showLicence?: boolean;
        logoText?: string;
    };
    customer?: {
        name: string;
        customerNo: string | null;
        phone?: string | null;
    } | null;
    loyalty?: {
        earned: number;
        balance: number;
        tier: string;
    } | null;
    discounts?: Array<{
        name: string;
        amount: string;
    }>;
    vatBreakdown?: Array<{
        rate: string;
        net: string;
        vat: string;
        gross: string;
    }>;
}
export declare function renderReceiptHtml(r: ReceiptData, lang: "ar" | "en"): string;
export declare function renderInvoiceA4Html(r: ReceiptData, lang: "ar" | "en"): string;
export {};
