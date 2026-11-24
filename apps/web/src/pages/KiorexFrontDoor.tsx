import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, Circle, Clock, Lock, ShieldCheck, Sparkles, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Input, Textarea } from "@/components/ui";

/**
 * State-aware front door of "Connect to Kiorex" (ADR-040). Marketing wording lives ONLY in the `kiorexMarketing` locale namespace (NEEDS_HUMAN: founder and counsel approve it
 * before launch); functional labels are in `kiorexDoor`. No prices or numbers are invented: counts come from real state and the dashboard from real Kiorex orders.
 */
type StepStatus = "done" | "action_needed" | "waiting_kiorex" | "blocked";
interface Step { key: string; status: StepStatus; optional?: boolean }
interface Connect { legacy: boolean; status: string; progress: number; steps: Step[] }
export type DoorState = "NOT_CONNECTED" | "IN_PROGRESS" | "WAITING" | "LIVE" | "ATTENTION";
interface Door { state: DoorState; listing?: { paused: boolean; pausedAt: string | null; reason: string | null }; deliveryFeeMinor?: number | null; currency?: string | null; status: string; legacy: boolean; started: boolean; interestedAt: string | null; leadAt: string | null; month: Record<string, number> | null; recent: Array<Record<string, string | number>>; branches?: Array<{ id: string; name: string; optedIn: boolean }>; labs?: Array<{ id: string; name: string }>; connect: Connect }
const BASE = "/kiorex-connect"; const KEY = ["kiorex-front-door"];
const ICON = { done: CheckCircle2, action_needed: AlertCircle, waiting_kiorex: Clock, blocked: Lock } as const;
const TONE = { done: "text-emerald-800 dark:text-emerald-300", action_needed: "text-amber-800 dark:text-amber-300", waiting_kiorex: "text-sky-700 dark:text-sky-400", blocked: "text-muted-foreground" } as const;
const linkBtn = "inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-sm font-medium focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2";
const LINK_PRIMARY = `${linkBtn} bg-primary text-primary-foreground hover:opacity-90`; const LINK_OUTLINE = `${linkBtn} border border-input bg-card hover:bg-accent`;
const TIMES = ["MORNING", "AFTERNOON", "EVENING", "ANYTIME"] as const;

const nextStep = (steps: Step[]) => steps.find((s) => !s.optional && s.status !== "done" && s.status !== "waiting_kiorex" && s.key !== "live") ?? steps.find((s) => !s.optional && s.status === "waiting_kiorex");
import { HOME_CARD, loadDismissed, setCardDismissed, type DismissedRemote } from "@/lib/dismissed-cards";
const PREF = "/me/preferences/dismissed-cards";
const remote: DismissedRemote = { get: () => api<{ keys: string[] }>(PREF).then((r) => r.keys), put: (keys) => api<{ keys: string[] }>(PREF, { method: "PUT", body: { keys } }).then((r) => r.keys) };
const browserStore = () => { try { return localStorage; } catch { return null; } };
/** The home-card dismissal of the signed-in user: server side (per user), with the browser as fallback and a one-time migration of the old browser flag. */
function useDismissedHomeCard(userId: string) {
  const qc = useQueryClient(); const key = ["dismissed-cards", userId];
  const q = useQuery({ queryKey: key, queryFn: () => loadDismissed(userId, remote, browserStore()), enabled: !!userId, staleTime: Infinity, retry: false });
  const set = useMutation({ mutationFn: (on: boolean) => setCardDismissed(userId, HOME_CARD, on, q.data ?? [], remote, browserStore()), onSuccess: (keys) => { qc.setQueryData(key, keys); void qc.invalidateQueries({ queryKey: ["kiorex-home-card"] }); } });
  return { ready: q.isSuccess, dismissed: !!q.data?.includes(HOME_CARD), dismiss: () => set.mutate(true), show: () => set.mutate(false) };
}
const useDoor = (enabled = true) => useQuery({ queryKey: KEY, queryFn: () => api<Door>(`${BASE}/front-door`), enabled, retry: false, refetchInterval: (s) => (s.state.data?.state === "WAITING" ? 15000 : false) });
const num = (n: number, lang: string) => new Intl.NumberFormat(lang.startsWith("ar") ? "ar-EG" : "en").format(n);

function TalkToUsForm({ already, onDone }: { already: boolean; onDone: () => void }) {
  const { t } = useTranslation(); const qc = useQueryClient(); const { me } = useAuth();
  const [f, setF] = useState({ contactName: me?.user.displayName ?? "", contactRole: "", phone: "", email: "", preferredTime: "ANYTIME", note: "", consent: false });
  const [err, setErr] = useState<string | null>(null);
  const send = useMutation({ mutationFn: () => api<Door>(`${BASE}/front-door/talk`, { method: "POST", body: f }), onSuccess: (d) => { qc.setQueryData(KEY, d); onDone(); }, onError: (e) => setErr(t(`kiorexMarketing.errors.${e instanceof ApiError ? e.code : ""}`, { defaultValue: t("kiorexMarketing.errors.generic") })) });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const lbl = "text-sm font-medium";
  return (
    <form className="space-y-4 rounded-2xl border bg-card p-4 sm:p-6" data-testid="talk-form" aria-labelledby="talk-h" onSubmit={(e) => { e.preventDefault(); setErr(null); send.mutate(); }}>
      <div><h3 id="talk-h" className="text-lg font-semibold">{t("kiorexMarketing.talkTitle")}</h3><p className="text-sm text-muted-foreground">{t("kiorexMarketing.talkIntro")}</p>{already ? <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400" data-testid="talk-already">{t("kiorexMarketing.form.sentAgain")}</p> : null}</div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1"><label className={lbl} htmlFor="tk-name">{t("kiorexMarketing.form.name")}</label><Input id="tk-name" required maxLength={120} autoComplete="name" value={f.contactName} onChange={set("contactName")} data-testid="talk-name" /></div>
        <div className="space-y-1"><label className={lbl} htmlFor="tk-role">{t("kiorexMarketing.form.role")}</label><Input id="tk-role" maxLength={80} value={f.contactRole} onChange={set("contactRole")} data-testid="talk-role" /></div>
        <div className="space-y-1"><label className={lbl} htmlFor="tk-phone">{t("kiorexMarketing.form.phone")}</label><Input id="tk-phone" type="tel" dir="ltr" maxLength={24} autoComplete="tel" value={f.phone} onChange={set("phone")} aria-describedby="tk-hint" data-testid="talk-phone" /></div>
        <div className="space-y-1"><label className={lbl} htmlFor="tk-email">{t("kiorexMarketing.form.email")}</label><Input id="tk-email" type="email" dir="ltr" maxLength={160} autoComplete="email" value={f.email} onChange={set("email")} aria-describedby="tk-hint" data-testid="talk-email" /></div>
        <p id="tk-hint" className="text-xs text-muted-foreground sm:col-span-2">{t("kiorexMarketing.form.contactHint")}</p>
        <div className="space-y-1"><label className={lbl} htmlFor="tk-time">{t("kiorexMarketing.form.time")}</label>
          <select id="tk-time" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={f.preferredTime} onChange={set("preferredTime")} data-testid="talk-time">{TIMES.map((x) => <option key={x} value={x}>{t(`kiorexMarketing.form.times.${x}`)}</option>)}</select></div>
        <div className="space-y-1 sm:col-span-2"><label className={lbl} htmlFor="tk-note">{t("kiorexMarketing.form.note")}</label><Textarea id="tk-note" maxLength={500} rows={3} value={f.note} onChange={set("note")} data-testid="talk-note" /></div>
      </div>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 size-4" checked={f.consent} onChange={(e) => setF((x) => ({ ...x, consent: e.target.checked }))} data-testid="talk-consent" />{t("kiorexMarketing.form.consent")}</label>
      {err ? <p role="alert" className="text-sm text-destructive" data-testid="talk-error">{err}</p> : null}
      <div className="flex flex-wrap gap-2"><Button type="submit" disabled={!f.consent || (!f.phone.trim() && !f.email.trim()) || !f.contactName.trim() || send.isPending} data-testid="talk-send">{t("kiorexMarketing.form.send")}</Button><Button type="button" variant="outline" onClick={onDone}>{t("kiorexMarketing.form.cancel")}</Button></div>
    </form>
  );
}

function Landing({ door }: { door: Door }) {
  const { t } = useTranslation(); const qc = useQueryClient(); const { me } = useAuth(); const nav = useNavigate(); const [talking, setTalking] = useState(false); const sent = useRef(false);
  const start = useMutation({ mutationFn: () => api<Door>(`${BASE}/front-door/start`, { method: "POST" }), onSuccess: (d) => { qc.setQueryData(KEY, d); nav(`${BASE}/steps`); } });
  useEffect(() => { if (!sent.current && !door.interestedAt) { sent.current = true; void api(`${BASE}/front-door/interest`, { method: "POST" }).catch(() => undefined); } }, [door.interestedAt]);
  const required = door.connect.steps.filter((s) => !s.optional && s.key !== "live"); const done = required.filter((s) => s.status === "done").length;
  const benefits = ["search", "orders", "prepaid", "queue", "rx"];
  const userId = me?.user.id ?? ""; const card = useDismissedHomeCard(userId);
  return (
    <div className="space-y-8" data-testid="kiorex-landing">
      <section className="rounded-3xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10" aria-labelledby="kx-hero">
        <h2 id="kx-hero" className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">{t("kiorexMarketing.headline")}</h2>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">{t("kiorexMarketing.intro")}</p>
        <div className="mt-6 flex flex-wrap gap-3"><Button size="lg" disabled={start.isPending} onClick={() => start.mutate()} data-testid="landing-start">{t("kiorexMarketing.start")}</Button><Button size="lg" variant="outline" onClick={() => setTalking((x) => !x)} aria-expanded={talking} data-testid="landing-talk">{t("kiorexMarketing.talk")}</Button></div>
        {door.leadAt && !talking ? <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400" data-testid="landing-lead-sent">{t("kiorexMarketing.form.sent")}</p> : null}
      </section>
      {talking ? <TalkToUsForm already={!!door.leadAt} onDone={() => setTalking(false)} /> : null}
      <section aria-labelledby="kx-benefits"><h2 id="kx-benefits" className="mb-3 text-xl font-semibold">{t("kiorexMarketing.benefitsTitle")}</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{benefits.map((k) => <li key={k} className="flex gap-3 rounded-2xl border bg-card p-4" data-testid={`benefit-${k}`}><Sparkles className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><div><h3 className="font-medium">{t(`kiorexMarketing.benefits.${k}.title`)}</h3><p className="text-sm text-muted-foreground">{t(`kiorexMarketing.benefits.${k}.body`)}</p></div></li>)}</ul></section>
      <section aria-labelledby="kx-how"><h2 id="kx-how" className="mb-3 text-xl font-semibold">{t("kiorexMarketing.howTitle")}</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="landing-how">{(["prepare", "request", "review", "live"] as const).map((k, i) => <li key={k} className="rounded-2xl border bg-card p-4"><span className="mb-2 inline-flex size-7 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground" aria-hidden="true">{i + 1}</span><h3 className="font-medium">{t(`kiorexMarketing.how.${k}.title`)}</h3><p className="text-sm text-muted-foreground">{t(`kiorexMarketing.how.${k}.body`)}</p></li>)}</ol></section>
      <section aria-labelledby="kx-ready" className="rounded-2xl border bg-card p-4 sm:p-6" data-testid="landing-readiness">
        <h2 id="kx-ready" className="text-xl font-semibold">{t("kiorexMarketing.readinessTitle")}</h2>
        <p className="mb-3 text-sm text-muted-foreground" data-testid="landing-readiness-count">{t("kiorexMarketing.readinessProgress", { done, total: required.length })}</p>
        <div role="progressbar" aria-valuenow={door.connect.progress} aria-valuemin={0} aria-valuemax={100} aria-label={t("kiorexMarketing.readinessTitle")} className="mb-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${door.connect.progress}%` }} /></div>
        <ul className="grid gap-2 sm:grid-cols-2">{required.map((s) => <li key={s.key} data-testid={`readiness-${s.key}`} data-status={s.status} className="relative flex items-center gap-2 text-sm">{s.status === "done" ? <CheckCircle2 className="size-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" /> : <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />}<span>{t(`kiorexConnect.step.${s.key}.title`)}</span><span className="sr-only">: {s.status === "done" ? t("kiorexMarketing.readinessDone") : t("kiorexMarketing.readinessMissing")}</span></li>)}</ul>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <section aria-labelledby="kx-reassure" className="rounded-2xl border bg-card p-4 sm:p-6"><h2 id="kx-reassure" className="mb-3 flex items-center gap-2 text-xl font-semibold"><ShieldCheck className="size-5 text-primary" aria-hidden="true" />{t("kiorexMarketing.reassureTitle")}</h2>
          <ul className="space-y-2 text-sm" data-testid="landing-reassure">{(["optional", "reversible", "data", "choose"] as const).map((k) => <li key={k} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />{t(`kiorexMarketing.reassure.${k}`)}</li>)}</ul></section>
        <section aria-labelledby="kx-fee" className="rounded-2xl border bg-card p-4 sm:p-6"><h2 id="kx-fee" className="mb-3 text-xl font-semibold">{t("kiorexMarketing.feeTitle")}</h2><p className="text-sm" data-testid="landing-fee">{t("kiorexMarketing.feeUnconfigured")}</p></section>
      </div>
      {userId && card.dismissed ? <Button variant="outline" size="sm" data-testid="home-card-show" onClick={card.show}>{t("kiorexMarketing.homeCard.show")}</Button> : null}
    </div>
  );
}

function Panel({ door, state }: { door: Door; state: Exclude<DoorState, "NOT_CONNECTED" | "LIVE"> }) {
  const { t } = useTranslation(); const c = door.connect;
  const next = state === "IN_PROGRESS" || state === "ATTENTION" ? nextStep(c.steps) : undefined;
  const required = c.steps.filter((s) => !s.optional); const done = required.filter((s) => s.status === "done").length;
  const decision = ["CHANGES_REQUESTED", "REJECTED", "PAUSED"].includes(c.status) ? c.status : null;
  const missing = state === "ATTENTION" ? c.steps.filter((s) => !s.optional && s.status !== "done" && !["live", "request"].includes(s.key)) : [];
  return (
    <div className="space-y-5" data-testid={`kiorex-panel-${state}`}>
      {decision ? <div role="status" className="rounded-2xl border border-amber-500/50 bg-amber-500/10 p-4" data-testid="connect-decision"><h2 className="font-semibold">{t(`kiorexDoor.attention.${decision}`)}</h2><p className="text-sm">{t(`kiorexConnect.decision.${decision}`)}</p><p className="mt-1 text-sm text-muted-foreground">{decision === "PAUSED" ? t("kiorexDoor.attention.howToPaused") : t("kiorexDoor.attention.howTo")}</p>{missing.length ? <div className="mt-2 text-sm" data-testid="attention-missing"><b>{t("kiorexDoor.attention.fix")}:</b> {missing.map((m) => t(`kiorexConnect.step.${m.key}.title`)).join(" · ")}</div> : null}</div> : null}
      {state === "WAITING" ? <div className="rounded-2xl border bg-card p-5" data-testid="waiting-card"><div className="flex items-center gap-2"><Clock className="size-5 text-sky-700 dark:text-sky-400" aria-hidden="true" /><h2 className="text-lg font-semibold">{t("kiorexDoor.waiting.title")}</h2></div><p className="mt-1 text-sm text-muted-foreground">{t("kiorexDoor.waiting.body")}</p><h3 className="mt-4 text-sm font-semibold">{t("kiorexDoor.waiting.next")}</h3><ol className="mt-1 list-decimal space-y-1 ps-5 text-sm"><li>{t("kiorexDoor.waiting.n1")}</li><li>{t("kiorexDoor.waiting.n2")}</li><li>{t("kiorexDoor.waiting.n3")}</li></ol></div> : null}
      <div className="rounded-2xl border bg-card p-5">
        <div role="progressbar" aria-valuenow={c.progress} aria-valuemin={0} aria-valuemax={100} aria-label={t("kiorexDoor.progress.title")} data-testid="kiorex-progress"><div className="mb-1 flex items-center justify-between text-sm"><span className="font-medium">{t("kiorexDoor.progress.title")} · {t("kiorexDoor.progress.of", { done, total: required.length })}</span><b>{c.progress}%</b></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${c.progress}%` }} /></div></div>
        {next ? <div className="mt-4 rounded-xl border-2 border-primary/60 bg-primary/5 p-4" data-testid="next-step" data-step={next.key}><p className="text-xs font-semibold uppercase tracking-wide text-primary">{t("kiorexDoor.progress.next")}</p><p className="font-medium">{t(`kiorexConnect.step.${next.key}.title`)}</p><p className="text-sm text-muted-foreground">{t(`kiorexConnect.step.${next.key}.hint`)}</p><Link to={`${BASE}/steps`} className={`${LINK_PRIMARY} mt-2`} data-testid="next-step-go">{t("kiorexConnect.fix")}</Link></div> : state === "IN_PROGRESS" ? <p className="mt-3 text-sm text-emerald-700 dark:text-emerald-400">{t("kiorexDoor.progress.allDone")}</p> : null}
        <ol className="mt-4 space-y-1.5" data-testid="kiorex-steps">{c.steps.map((s, i) => { const Icon = ICON[s.status]; return <li key={s.key} data-status={s.status} data-testid={`panel-step-${s.key}`} className={`flex items-center gap-2 text-sm ${next?.key === s.key ? "font-semibold" : ""}`}><Icon className={`size-4 shrink-0 ${TONE[s.status]}`} aria-hidden="true" /><span>{i + 1}. {t(`kiorexConnect.step.${s.key}.title`)}</span>{s.optional ? <span className="rounded-full border px-2 text-xs text-muted-foreground">{t("kiorexConnect.optional")}</span> : null}<span className={`ms-auto text-xs ${TONE[s.status]}`}>{t(`kiorexConnect.state.${s.status}`)}</span></li>; })}</ol>
        <Link to={`${BASE}/steps`} className={`${LINK_OUTLINE} mt-4`} data-testid="panel-open-wizard">{t("kiorexDoor.progress.open")}</Link>
      </div>
    </div>
  );
}

function Live({ door }: { door: Door }) {
  const { t, i18n } = useTranslation(); const qc = useQueryClient(); const lang = i18n.language; const m = door.month ?? {};
  const toggle = useMutation({ mutationFn: (v: { id: string; optedIn: boolean }) => api(`${BASE}/branches/${v.id}`, { method: "PUT", body: { optedIn: v.optedIn } }), onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }) });
  const pause = useMutation({ mutationFn: (on: boolean) => api<Door>(`${BASE}/front-door/listing/${on ? "pause" : "resume"}`, { method: "POST", body: {} }), onSuccess: (d) => { qc.setQueryData(KEY, d); void qc.invalidateQueries({ queryKey: KEY }); } });
  const paused = !!door.listing?.paused;
  const sites = door.branches ?? door.labs?.map((l) => ({ ...l, optedIn: true })) ?? [];
  const tiles = Object.keys(m);
  return (
    <section className="space-y-5" aria-labelledby="kx-live-h" data-testid="kiorex-live-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="kx-live-h" className="text-xl font-semibold">{t("kiorexDoor.live.title")}</h2><Link to={`${BASE}/steps`} className={LINK_OUTLINE} data-testid="live-settings">{t("kiorexDoor.live.settings")}</Link></div>
      <div className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 ${door.listing?.paused ? "border-amber-500/50 bg-amber-500/10" : "bg-card"}`} data-testid="live-listing-pause" data-paused={door.listing?.paused ? "true" : "false"}>
        <div className="min-w-0 flex-1"><h3 className="font-medium">{door.listing?.paused ? t("kiorexDoor.live.listingPausedTitle") : t("kiorexDoor.live.listingLiveTitle")}</h3><p className="text-sm text-muted-foreground">{door.listing?.paused ? t("kiorexDoor.live.listingPausedBody") : t("kiorexDoor.live.listingLiveBody")}</p></div>
        <Button size="sm" variant="outline" disabled={pause.isPending || door.state !== "LIVE"} onClick={() => pause.mutate(!door.listing?.paused)} data-testid={door.listing?.paused ? "listing-resume" : "listing-pause"}>{door.listing?.paused ? t("kiorexDoor.live.resumeListing") : t("kiorexDoor.live.pauseListing")}</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{tiles.map((k) => <div key={k} className="rounded-2xl border bg-card p-4" data-testid={`live-${k}`}><p className="text-xs text-muted-foreground">{t(`kiorexDoor.live.tile.${k}`)} · {t("kiorexDoor.live.month")}</p><p className="text-2xl font-semibold" dir="ltr">{num(m[k]!, lang)}</p></div>)}{door.deliveryFeeMinor ? <div className="rounded-2xl border bg-card p-4" data-testid="live-deliveryFee"><p className="text-xs text-muted-foreground">{t("kiorexDoor.live.tile.deliveryFee")}</p><p className="text-2xl font-semibold" dir="ltr">{new Intl.NumberFormat(lang.startsWith("ar") ? "ar-EG" : "en", door.currency ? { style: "currency", currency: door.currency } : undefined).format(door.deliveryFeeMinor / 100)}</p></div> : null}</div>
      {sites.length ? <div className="rounded-2xl border bg-card" data-testid="live-listings"><h3 className="px-4 pt-3 font-medium">{t("kiorexDoor.live.listings")} <span className="text-xs font-normal text-muted-foreground">{t("kiorexDoor.live.listingsHint")}</span></h3><ul className="divide-y">{sites.map((b) => <li key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm" data-testid={`live-listing-${b.id}`} data-status={b.optedIn ? "LIVE" : "PAUSED"}><span className="font-medium" dir="auto">{b.name}</span><span className="rounded-full border px-2 text-xs">{!b.optedIn || paused ? t("kiorexDoor.live.pausedByYou") : door.state === "LIVE" ? t("kiorexDoor.state.LIVE") : t(`kiorexDoor.state.${door.state}`)}</span>{door.branches ? <span className="ms-auto"><Button size="sm" variant="outline" disabled={toggle.isPending} onClick={() => toggle.mutate({ id: b.id, optedIn: !b.optedIn })} data-testid={`live-${b.optedIn ? "pause" : "resume"}-${b.id}`}>{b.optedIn ? t("kiorexDoor.live.pause") : t("kiorexDoor.live.resume")}</Button></span> : null}</li>)}</ul></div> : null}
      <div className="rounded-2xl border bg-card p-4" data-testid="live-recent"><h3 className="mb-2 font-medium">{t("kiorexDoor.live.recent")}</h3>
        {door.recent.length === 0 ? <p className="text-sm text-muted-foreground">{t("kiorexDoor.live.noRecent")}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[420px] text-sm"><thead><tr className="text-xs text-muted-foreground"><th scope="col" className="py-1 text-start font-medium">{t("kiorexDoor.live.when")}</th><th scope="col" className="py-1 text-start font-medium">{t("kiorexDoor.live.where")}</th><th scope="col" className="py-1 text-start font-medium">{t("kiorexDoor.live.status")}</th><th scope="col" className="py-1 text-start font-medium">{t("kiorexDoor.live.via")}</th></tr></thead><tbody>{door.recent.map((r) => <tr key={String(r.id)} className="border-t"><td className="py-1.5" dir="ltr">{new Date(String(r.createdAt)).toLocaleString(lang.startsWith("ar") ? "ar-EG" : "en", { dateStyle: "medium", timeStyle: "short" })}</td><td className="py-1.5" dir="auto">{String(r.branch ?? r.lab ?? "")}</td><td className="py-1.5">{String(r.status).replace(/_/g, " ").toLowerCase()}</td><td className="py-1.5">{t(`kiorexDoor.live.delivery.${String(r.delivery ?? r.collection)}`, { defaultValue: String(r.delivery ?? r.collection ?? "") })}</td></tr>)}</tbody></table></div>}
      </div>
    </section>
  );
}

function Wrap({ d, children }: { d?: Door; children: ReactNode }) {
  const { t } = useTranslation();
  return <div className="space-y-6" data-testid="kiorex-front-door"><div><h1 className="text-xl font-semibold">{t("kiorexConnect.title")}</h1>{d ? <p className="mt-1 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium" data-testid="kiorex-state" data-state={d.state}>{t(`kiorexDoor.state.${d.state}`)}</p> : null}</div>{children}</div>;
}

/** The page behind the "Connect to Kiorex" nav item: picks the right state. The old checklist moved to `/kiorex-connect/steps`. */
export function KiorexFrontDoor() {
  const { t } = useTranslation();
  const q = useDoor(); const d = q.data;
  if (q.isError) return <Wrap d={d}><p className="text-sm text-destructive" data-testid="kiorex-load-error">{t("kiorexDoor.unavailable")}</p></Wrap>;
  if (!d) return <Wrap d={d}><p className="text-sm text-muted-foreground" role="status">{t("kiorexDoor.loading")}</p></Wrap>;
  return <Wrap d={d}>{d.state === "NOT_CONNECTED" ? <Landing door={d} /> : d.state === "LIVE" ? <Live door={d} /> : <><Panel door={d} state={d.state} />{d.state === "ATTENTION" ? <Live door={d} /> : null}</>}</Wrap>;
}

/** One dismissible card on the home dashboard for standalone owners/admins. No pop-up; dismissal is remembered per user and the card returns only when asked from the Kiorex page. */
export function KiorexHomeCard() {
  const { t } = useTranslation(); const { me, can } = useAuth(); const id = me?.user.id ?? ""; const card = useDismissedHomeCard(id); const hidden = !card.ready || card.dismissed;
  const allowed = !!me && can("settings.write");
  const q = useQuery({ queryKey: ["kiorex-home-card"], queryFn: () => api<Door>(`${BASE}/front-door`), enabled: allowed && !hidden, retry: false });
  if (!allowed || hidden || !q.data || !["NOT_CONNECTED", "IN_PROGRESS"].includes(q.data.state)) return null;
  return (
    <section className="relative rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-4 pe-12 sm:p-5 sm:pe-14" aria-labelledby="kx-home-h" data-testid="kiorex-home-card">
      <div className="flex flex-wrap items-center gap-3"><Sparkles className="size-5 shrink-0 text-primary" aria-hidden="true" /><div className="min-w-0 flex-1"><h2 id="kx-home-h" className="font-semibold">{t("kiorexMarketing.homeCard.title")}</h2><p className="text-sm text-muted-foreground">{t("kiorexMarketing.homeCard.body")}</p></div><Link to={BASE} className={LINK_PRIMARY} data-testid="home-card-open">{t("kiorexMarketing.homeCard.open")}</Link></div>
      <button type="button" className="absolute end-2 top-2 inline-flex size-9 items-center justify-center rounded-md hover:bg-muted focus-visible:outline focus-visible:outline-2" aria-label={t("kiorexMarketing.homeCard.dismiss")} data-testid="home-card-dismiss" onClick={card.dismiss}><X className="size-4" aria-hidden="true" /></button>
    </section>
  );
}
