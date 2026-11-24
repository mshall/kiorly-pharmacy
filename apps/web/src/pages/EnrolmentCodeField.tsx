import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui";

/** Enrolment code field of the "Request to go live" step (kiorex-contracts 1.9.0): a one-time code from Kiorex ops, held in component state only, never stored. */
export function EnrolmentCodeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="mt-3 max-w-md space-y-1" data-testid="connect-enrolment">
      <label className="text-sm font-medium" htmlFor="connect-enrolment-code">{t("kiorexConnect.enrolment.label")}</label>
      <Input id="connect-enrolment-code" dir="ltr" autoComplete="off" spellCheck={false} placeholder={t("kiorexConnect.enrolment.placeholder")} value={value} onChange={(e) => onChange(e.target.value)} data-testid="connect-enrolment-input" />
      <p className="text-xs text-muted-foreground">{t("kiorexConnect.enrolment.hint")}</p>
    </div>
  );
}
