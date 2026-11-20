import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { setLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { ArrowRight, Check } from "lucide-react";
import { Button, ErrorNote, Field, Input, PageHeader } from "@/components/ui";
import { KiorlyBrandLockup, KxControlPair, LanguageToggle, Skeleton, ThemeToggle, Stepper, StatusChip } from "@/brand/ui-kit";
import type { Page, Drug } from "@/lib/types";

function Step({ n, title, done, children }: { n: number; title: string; done?: boolean; children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby={`onb-${n}`} className="relative rounded-xl border border-border/80 bg-card p-5 shadow-[var(--kx-shadow-1)]">
      <div className="mb-3 flex items-center gap-3"><span aria-hidden className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${done ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}>{done ? <Check className="size-4" /> : n}</span><h2 id={`onb-${n}`} className="text-base font-semibold">{title}</h2>{done && <StatusChip tone="good" className="ms-auto">{t("common.saved")}</StatusChip>}</div>
      {children}
    </section>
  );
}

/** First-run checklist: branch licence, catalogue present, then mark onboarded. Each step is skippable and re-visitable in Settings. */
export function Onboarding() {
  const { t } = useTranslation();
  const { me, signedIn, branchId } = useAuth();
  const qc = useQueryClient();
  const nav = useNavigate();
  const [licence, setLicence] = useState(""); const [address, setAddress] = useState("");
  const drugs = useQuery({ queryKey: ["onb-drugs"], queryFn: () => api<Page<Drug>>("/catalogue/drugs", { query: { pageSize: 1 } }), enabled: signedIn });
  const branch = useMutation({ mutationFn: () => api(`/branches/${branchId}`, { method: "PATCH", body: { licenceNo: licence || undefined, address: address || undefined } }), onSuccess: () => qc.invalidateQueries() });
  const done = useMutation({ mutationFn: () => api("/onboarding/complete", { method: "POST" }), onSuccess: async () => { await qc.invalidateQueries({ queryKey: ["me"] }); nav("/"); } });
  if (!signedIn) return <Navigate to="/login" replace />;
  const hasDrugs = !!drugs.data && drugs.data.total > 0;
  const steps = [t("onb.stepBranch"), t("onb.stepCatalogue"), t("onb.stepSafety")];
  const current = branch.isSuccess ? (hasDrugs ? 2 : 1) : 0;
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8 sm:py-12">
      <div className="flex items-start justify-between gap-3">
        <KiorlyBrandLockup height={40} />
        <KxControlPair><ThemeToggle labels={{ theme: t("theme.label"), light: t("theme.light"), dark: t("theme.dark"), system: t("theme.system") }} /><LanguageToggle onChange={setLang} /></KxControlPair>
      </div>
      <PageHeader className="mt-8" eyebrow={t("onb.eyebrow")} title={t("onb.title", { name: me?.tenant.name })} description={t("onb.lede")} />
      <Stepper steps={steps} current={current} className="mb-6" />
      <div className="space-y-4">
        <Step n={1} title={t("onb.stepBranch")} done={branch.isSuccess}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("onb.branchLicence")} hint={t("onb.branchLicenceHint")}>{(id) => <Input id={id} value={licence} onChange={(e) => setLicence(e.target.value)} />}</Field>
            <Field label={t("onb.address")}>{(id) => <Input id={id} value={address} onChange={(e) => setAddress(e.target.value)} />}</Field>
          </div>
          <div className="mt-4 flex items-center gap-3"><Button onClick={() => branch.mutate()} disabled={branch.isPending}>{t("common.save")}</Button></div>
          <ErrorNote error={branch.error} />
        </Step>
        <Step n={2} title={t("onb.stepCatalogue")} done={hasDrugs}>
          {drugs.isLoading ? <Skeleton className="h-5 w-2/3" /> : <p className="text-sm text-muted-foreground">{hasDrugs ? t("onb.catalogueReady", { count: drugs.data!.total }) : t("onb.catalogueEmpty")}</p>}
        </Step>
        <Step n={3} title={t("onb.stepSafety")}><p className="text-sm text-muted-foreground">{t("onb.safetyNote")}</p></Step>
      </div>
      <ErrorNote error={done.error} />
      <div className="mt-6 flex justify-end"><Button size="lg" onClick={() => done.mutate()} disabled={done.isPending}>{t("onb.finish")}<ArrowRight aria-hidden className="size-5 rtl:rotate-180" /></Button></div>
    </div>
  );
}
