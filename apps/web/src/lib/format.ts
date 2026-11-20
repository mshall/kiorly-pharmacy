import i18n from "@/lib/i18n";

const locale = () => (i18n.language === "ar" ? "ar-EG" : "en-GB");
export const fmtMoney = (v: string | number | null | undefined, currency = "EGP"): string => {
  const n = Number(v ?? 0);
  const cur = i18n.language === "ar" && currency === "EGP" ? "ج.م" : currency;
  return `${new Intl.NumberFormat(locale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} ${cur}`;
};
export const fmtNum = (v: number | string): string => new Intl.NumberFormat(locale()).format(Number(v));
export const fmtDate = (v: string | Date | null | undefined): string => (v ? new Intl.DateTimeFormat(locale(), { year: "numeric", month: "short", day: "2-digit" }).format(new Date(v)) : "—");
export const fmtDateTime = (v: string | Date | null | undefined): string => (v ? new Intl.DateTimeFormat(locale(), { dateStyle: "medium", timeStyle: "short" }).format(new Date(v)) : "—");
export const drugName = (d: { brandName: string; brandNameAr?: string | null } | undefined | null): string => (d ? (i18n.language === "ar" && d.brandNameAr ? d.brandNameAr : d.brandName) : "—");
export const todayIso = (): string => new Date().toISOString().slice(0, 10);
