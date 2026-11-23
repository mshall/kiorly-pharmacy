import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Lock, RefreshCw } from "lucide-react";
import i18n from "@/lib/i18n";
import { api } from "@/lib/api";
import { useAction } from "@/lib/hooks";
import { Button, Card, ErrorNote, Input } from "@/components/ui";
import { ar, en } from "./kiorexConnect.strings";

i18n.addResourceBundle("en", "translation", { kiorexConnect: en }, true, false);
i18n.addResourceBundle("ar", "translation", { kiorexConnect: ar }, true, false);

type StepStatus = "done" | "action_needed" | "waiting_kiorex" | "blocked";
interface Step { key: string; status: StepStatus; optional?: boolean; link?: string; detail?: Record<string, unknown> }
interface Connect { legacy: boolean; status: string; progress: number; canRequest: boolean; steps: Step[]; termsVersion: string; payoutLabel: string | null; terms: { at: string } | null; licenceDocument: unknown; clientKey: string | null; credentials?: { clientKey: string; clientSecret: string; webhookSecret: string } }
const ICON = { done: CheckCircle2, action_needed: AlertCircle, waiting_kiorex: Clock, blocked: Lock } as const;
const TONE = { done: "text-emerald-600", action_needed: "text-amber-600", waiting_kiorex: "text-sky-600", blocked: "text-muted-foreground" } as const;
const KEY = ["kiorex-connect"];

/** Connect to Kiorex (ADR-040): checklist computed by the API from real state. Secrets from a rotation are shown once, from memory only. */
export function KiorexConnect() {
  const { t } = useTranslation(); const qc = useQueryClient();
  const q = useQuery({ queryKey: KEY, queryFn: () => api<Connect>("/kiorex-connect"), refetchInterval: (s) => (s.state.data?.status === "REQUESTED" ? 15000 : false) });
  const [label, setLabel] = useState(""); const [creds, setCreds] = useState<Connect["credentials"]>(); const file = useRef<HTMLInputElement>(null);
  const onData = (d: Connect) => { qc.setQueryData(KEY, d); if (d.credentials) setCreds(d.credentials); };
  const terms = useAction((v: string) => api<Connect>("/kiorex-connect/terms", { method: "PUT", body: { version: v } }), [], { onDone: onData });
  const payout = useAction((v: string) => api<Connect>("/kiorex-connect/payout", { method: "PUT", body: { label: v } }), [], { ok: t("kiorexConnect.payout.saved"), onDone: onData });
  const upload = useAction((f: File) => f.arrayBuffer().then((b) => api<Connect>("/kiorex-connect/licence", { method: "POST", body: { name: f.name, contentBase64: btoa(String.fromCharCode(...new Uint8Array(b))) } })), [], { ok: t("kiorexConnect.licenceUpload.uploaded"), onDone: onData });
  const request = useAction((rotate: boolean) => api<Connect>("/kiorex-connect/request", { method: "POST", body: { rotate } }), [], { ok: t("kiorexConnect.requested"), onDone: onData });
  const refresh = useAction(() => api<Connect>("/kiorex-connect/refresh", { method: "POST" }), [], { onDone: onData, silent: true });
  const d = q.data;
  return (
    <div className="space-y-4" data-testid="kiorex-connect">
      <div><h1 className="text-xl font-semibold">{t("kiorexConnect.title")}</h1><p className="text-sm text-muted-foreground">{t("kiorexConnect.subtitle")}</p></div>
      <ErrorNote error={q.error || terms.error || payout.error || upload.error || request.error} />
      {d?.legacy ? <Card><p data-testid="connect-legacy">{t("kiorexConnect.legacy")}</p></Card> : null}
      {d && !d.legacy ? (
        <>
          <div role="progressbar" aria-valuenow={d.progress} aria-valuemin={0} aria-valuemax={100} aria-label={t("kiorexConnect.progress")} data-testid="connect-progress">
            <div className="mb-1 flex justify-between text-sm"><span>{t("kiorexConnect.progress")} · <b data-testid="connect-status">{t(`kiorexConnect.status.${d.status}`)}</b></span><b>{d.progress}%</b></div>
            <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${d.progress}%` }} /></div>
          </div>
          <ol className="space-y-3" data-testid="connect-steps">
            {d.steps.map((s, i) => { const Icon = ICON[s.status]; const dt = s.detail ?? {}; return (
              <li key={s.key} data-testid={`connect-step-${s.key}`} data-status={s.status} className="rounded-2xl border bg-card p-4">
                <div className="flex flex-wrap items-start gap-3">
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${TONE[s.status]}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><b>{i + 1}. {t(`kiorexConnect.step.${s.key}.title`)}</b><span className={`text-xs font-medium ${TONE[s.status]}`}>{t(`kiorexConnect.state.${s.status}`)}</span></div>
                    <p className="text-sm text-muted-foreground">{t(`kiorexConnect.step.${s.key}.hint`)}</p>
                    {s.key === "branch_optin" ? <p className="text-xs text-muted-foreground">{t("kiorexConnect.detail.branches", dt)}</p> : null}
                    {s.key === "catalogue" ? <p className="text-xs text-muted-foreground">{t("kiorexConnect.detail.priced", dt)}</p> : null}
                    {s.key === "hours_delivery" && Number(dt.missing) > 0 ? <p className="text-xs">{t("kiorexConnect.detail.missing", dt)}</p> : null}
                  </div>
                  {s.link && s.status === "action_needed" && !["payout", "terms", "request"].includes(s.key) ? <Link className="rounded-md border px-3 py-1.5 text-sm" to={s.link}>{t("kiorexConnect.fix")}</Link> : null}
                  {s.key === "request" && (s.status === "action_needed" || s.status === "waiting_kiorex") ? <Button disabled={!d.canRequest || request.isPending} onClick={() => request.mutate(false)} data-testid="connect-request">{t("kiorexConnect.request")}</Button> : null}
                </div>
                {s.key === "licence" && s.status !== "done" ? <div className="mt-3"><input ref={file} type="file" accept=".pdf,.png,.jpg,.jpeg" className="sr-only" data-testid="connect-licence-input" onChange={(e) => e.target.files?.[0] && upload.mutate(e.target.files[0])} /><Button variant="outline" onClick={() => file.current?.click()}>{t("kiorexConnect.licenceUpload.choose")}</Button></div> : null}
                {s.key === "payout" ? <div className="mt-3 flex flex-wrap gap-2"><Input aria-label={t("kiorexConnect.payout.label")} placeholder={t("kiorexConnect.payout.label")} className="max-w-xs" value={label || d.payoutLabel || ""} onChange={(e) => setLabel(e.target.value)} data-testid="connect-payout" /><Button variant="outline" disabled={!label.trim() || payout.isPending} onClick={() => payout.mutate(label)}>{t("kiorexConnect.payout.save")}</Button></div> : null}
                {s.key === "terms" ? (d.terms ? <p className="mt-2 text-sm text-emerald-700" data-testid="connect-terms-done">{t("kiorexConnect.terms.accepted")}</p> : <div className="mt-3"><p className="mb-2 text-sm">{t("kiorexConnect.terms.body", { version: d.termsVersion })}</p><Button variant="outline" disabled={terms.isPending} onClick={() => terms.mutate(d.termsVersion)} data-testid="connect-accept">{t("kiorexConnect.terms.accept")}</Button></div>) : null}
              </li>); })}
          </ol>
          {d.status === "APPROVED" ? <Card title={t("kiorexConnect.passport.title")}><p className="mb-2 text-sm">{t("kiorexConnect.passport.body")}</p><div className="flex flex-wrap gap-2"><Link className="rounded-md border px-3 py-1.5 text-sm" to="/settings">{t("kiorexConnect.passport.set")}</Link><Link className="rounded-md border px-3 py-1.5 text-sm" to="/settings">{t("kiorexConnect.passport.invite")}</Link><Button variant="outline" disabled={request.isPending} onClick={() => request.mutate(true)} data-testid="connect-rotate">{t("kiorexConnect.rotate")}</Button></div></Card> : null}
          {creds ? <Card title={t("kiorexConnect.rotated")}><dl className="space-y-1 text-sm" dir="ltr" data-testid="connect-secrets"><dt>{t("kiorexConnect.clientKey")}</dt><dd><code>{creds.clientKey}</code></dd><dt>{t("kiorexConnect.clientSecret")}</dt><dd><code>{creds.clientSecret}</code></dd><dt>{t("kiorexConnect.webhookSecret")}</dt><dd><code>{creds.webhookSecret}</code></dd></dl><p className="mt-2 text-xs text-muted-foreground">{t("kiorexConnect.secretsOnce")}</p><Button className="mt-2" variant="outline" onClick={() => setCreds(undefined)}>OK</Button></Card> : null}
          {["REQUESTED", "CHANGES_REQUESTED", "REJECTED", "PAUSED"].includes(d.status) ? <Button variant="ghost" onClick={() => refresh.mutate(undefined)} disabled={refresh.isPending}><RefreshCw aria-hidden="true" className="h-4 w-4" />{t("kiorexConnect.refresh")}</Button> : null}
        </>
      ) : null}
    </div>
  );
}
