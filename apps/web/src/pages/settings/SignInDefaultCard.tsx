import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, ErrorNote } from "@/components/ui";
import { useToast } from "@/lib/toast";

type Choice = "AUTO" | "PASSPORT" | "PASSWORD";
interface SignInSettings { defaultSignInMethod: "PASSWORD" | "PASSPORT" | null; effectiveSignInMethod: "PASSWORD" | "PASSPORT"; linkedToKiorex: boolean }

/** Org default sign-in method (ADR-038 amendment): which method the login page preselects. Both methods stay available. Owner only (settings.write). */
export function SignInDefaultCard() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const toast = useToast(); const qc = useQueryClient();
  const canEdit = can("settings.write");
  const { data } = useQuery({ queryKey: ["settings"], queryFn: () => api<SignInSettings>("/settings") });
  const save = useMutation({ mutationFn: (v: "PASSWORD" | "PASSPORT" | null) => api("/settings", { method: "PATCH", body: { defaultSignInMethod: v } }), onSuccess: () => { setLocal(null); void qc.invalidateQueries({ queryKey: ["settings"] }); toast(t("set.signinSaved")); } });
  const [local, setLocal] = useState<Choice | null>(null);
  const stored: Choice = (data?.defaultSignInMethod ?? "AUTO") as Choice;
  const value = local ?? stored;
  const dirty = local !== null && local !== stored;
  const method = (m: string) => t(m === "PASSPORT" ? "set.signinPassport" : "set.signinPassword");
  return (
    <section aria-labelledby="signin-default-h" data-testid="signin-default-card" className="mt-4 rounded-xl border border-border bg-card p-5 shadow-kx-1">
      <h2 id="signin-default-h" className="text-base font-semibold">{t("set.signinTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("set.signinHint")}</p>
      <div role="radiogroup" aria-labelledby="signin-default-h" className="mt-4 grid gap-2 sm:grid-cols-3">
        {(["AUTO", "PASSPORT", "PASSWORD"] as const).map((c) => (
          <label key={c} className={`flex min-h-12 cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm ${value === c ? "border-primary bg-accent" : "border-border"} ${canEdit ? "" : "opacity-60"}`}>
            <input type="radio" name="defaultSignInMethod" value={c} data-testid={`signin-default-${c.toLowerCase()}`} checked={value === c} disabled={!canEdit} onChange={() => setLocal(c)} className="mt-0.5" />
            <span><span className="block font-medium">{c === "AUTO" ? t("set.signinAuto") : method(c)}</span>{c === "AUTO" ? <span className="block text-xs text-muted-foreground">{t("set.signinAutoHint")}</span> : null}</span>
          </label>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground" data-testid="signin-default-effective">{data ? `${t("set.signinEffective", { method: method(data.effectiveSignInMethod) })} · ${data.linkedToKiorex ? t("set.signinLinked") : t("set.signinNotLinked")}` : ""}</p>
      {!canEdit ? <p className="mt-1 text-xs text-muted-foreground">{t("set.signinOwnerOnly")}</p> : null}
      <div className="mt-3"><Button disabled={!canEdit || !dirty || save.isPending} data-testid="signin-default-save" onClick={() => save.mutate(value === "AUTO" ? null : value)}>{t("common.save")}</Button></div>
      <div className="mt-2"><ErrorNote error={save.error} /></div>
    </section>
  );
}
