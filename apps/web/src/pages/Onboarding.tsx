import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, ErrorNote, Field, Input } from "@/components/ui";
import type { Page, Drug } from "@/lib/types";

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
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold">{t("onb.title", { name: me?.tenant.name })}</h1>
      <p className="text-muted-foreground">{t("onb.lede")}</p>
      <Card title={t("onb.stepBranch")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label={t("onb.branchLicence")} hint={t("onb.branchLicenceHint")}>{(id) => <Input id={id} value={licence} onChange={(e) => setLicence(e.target.value)} />}</Field>
          <Field label={t("onb.address")}>{(id) => <Input id={id} value={address} onChange={(e) => setAddress(e.target.value)} />}</Field>
        </div>
        <div className="mt-3 flex items-center gap-3"><Button onClick={() => branch.mutate()} disabled={branch.isPending}>{t("common.save")}</Button>{branch.isSuccess && <Badge tone="good">{t("common.saved")}</Badge>}</div>
        <ErrorNote error={branch.error} />
      </Card>
      <Card title={t("onb.stepCatalogue")}>
        <p className="text-sm">{drugs.data && drugs.data.total > 0 ? t("onb.catalogueReady", { count: drugs.data.total }) : t("onb.catalogueEmpty")}</p>
      </Card>
      <Card title={t("onb.stepSafety")}><p className="text-sm text-muted-foreground">{t("onb.safetyNote")}</p></Card>
      <ErrorNote error={done.error} />
      <Button size="lg" onClick={() => done.mutate()} disabled={done.isPending}>{t("onb.finish")}</Button>
    </div>
  );
}
