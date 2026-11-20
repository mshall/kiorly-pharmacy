import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Field, Input } from "@/components/ui";

export interface WitnessCreds { email: string; password: string }
/** Second-person countersignature for controlled-substance stock changes (credentials of a different active staff member). */
export function useWitness() {
  const [w, setW] = useState<WitnessCreds>({ email: "", password: "" });
  const value = w.email && w.password ? w : undefined;
  return { value, w, setW, reset: () => setW({ email: "", password: "" }) };
}
export function WitnessFields({ w, setW, required }: { w: WitnessCreds; setW: (v: WitnessCreds) => void; required?: boolean }) {
  const { t } = useTranslation();
  return (
    <fieldset className="grid gap-3 rounded-xl border border-dashed border-border p-3 sm:grid-cols-2"><legend className="px-1 text-xs font-semibold text-muted-foreground">{t("ctl.witness")}</legend>
      <p className="text-xs text-muted-foreground sm:col-span-2">{t("ctl.witnessHint")}</p>
      <Field label={t("ctl.witnessEmail")}>{(id) => <Input id={id} type="email" dir="ltr" required={required} autoComplete="off" value={w.email} onChange={(e) => setW({ ...w, email: e.target.value })} />}</Field>
      <Field label={t("ctl.witnessPassword")}>{(id) => <Input id={id} type="password" required={required} autoComplete="new-password" value={w.password} onChange={(e) => setW({ ...w, password: e.target.value })} />}</Field>
    </fieldset>
  );
}
