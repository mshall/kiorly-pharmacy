import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, ChevronDown, Lock, PartyPopper, SkipForward, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import "./setup-strings";
import "./setup.css";

/* ---------------------------------- types + api ---------------------------------- */
export type SetupStatus = "pending" | "done" | "skipped";
export interface SetupEntity { id: string; name: string; status: SetupStatus; href: string }
export interface SetupStep {
  key: string; order: number; required: boolean; manual: boolean; scope: string; status: SetupStatus; href: string;
  whoCan: string[]; canPerform: boolean; available: boolean; entities: SetupEntity[] | null; doneCount: number; totalCount: number;
}
export interface SetupPlan {
  steps: SetupStep[]; progressPercent: number; overallPercent: number; doneUnits: number; totalUnits: number; allDone: boolean;
  nextKey: string | null; nextHref: string | null; dismissedAt: string | null;
}

/** Self-contained button look (theme tokens only), so the setup UI follows whichever design tokens the product ships. */
type BtnVariant = "primary" | "outline" | "ghost";
const btn = (variant: BtnVariant = "primary", size: "md" | "sm" = "md") =>
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-[background-color,box-shadow,transform] duration-150 active:translate-y-px focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
    size === "sm" ? "min-h-9 px-3 text-xs" : "min-h-10 px-4",
    variant === "primary" ? "bg-primary text-primary-foreground shadow-kx-1 hover:bg-(--kx-primary-hover)" : variant === "outline" ? "border border-input bg-card shadow-kx-1 hover:bg-accent" : "hover:bg-accent",
  ].join(" ");
const fetchPlan = () => api<SetupPlan>("/setup");
const skipStep = (key: string, entityId?: string) => api<SetupPlan>(`/setup/steps/${key}`, { method: "PATCH", body: { action: "skip", entityId } });
const dismissPlan = () => api<SetupPlan>("/setup/dismiss", { method: "POST", body: {} });

/* ---------------------------------- session (per tab) ---------------------------------- */
interface Session { key: string; entity: string | null; path: string; returnTo: string; startedPending: boolean | null }
const ACTIVE = "kx.setup.active", JUST = "kx.setup.justDone", SKIP = "kx.setup.skipped", RETURN = "kx.setup.returnTo";
const listeners = new Set<() => void>();
const read = <T,>(k: string): T | null => { try { const r = sessionStorage.getItem(k); return r ? (JSON.parse(r) as T) : null; } catch { return null; } };
const write = (k: string, v: unknown) => { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } listeners.forEach((l) => l()); };
let cache: { raw: string | null; v: Session | null } = { raw: null, v: null };
function snapshot(): Session | null {
  let raw: string | null = null;
  try { raw = sessionStorage.getItem(ACTIVE); } catch { raw = null; }
  if (raw !== cache.raw) cache = { raw, v: raw ? (JSON.parse(raw) as Session) : null };
  return cache.v;
}
const subscribe = (l: () => void) => { listeners.add(l); return () => void listeners.delete(l); };
export const useSetupSession = () => useSyncExternalStore(subscribe, snapshot, () => null);
const setSession = (s: Session | null) => write(ACTIVE, s);
const reduced = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** `fast`: while a setup step is open the list is re-checked every 4 s, so work finished outside this tab is noticed without a reload. */
function usePlan(enabled = true, fast = false) {
  return useQuery({ queryKey: ["setup"], queryFn: fetchPlan, enabled, staleTime: 0, refetchOnWindowFocus: true, refetchInterval: fast ? 4_000 : 30_000, retry: false });
}
/** Re-evaluates the checklist right after any successful save anywhere in the app (no reload). */
function useAutoRefresh() {
  const qc = useQueryClient();
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    const unsub = qc.getMutationCache().subscribe((e) => {
      if (e.type === "updated" && e.action.type === "success") { clearTimeout(t); t = setTimeout(() => void qc.invalidateQueries({ queryKey: ["setup"] }), 350); }
    });
    return () => { clearTimeout(t); unsub(); };
  }, [qc]);
}
const Tick = ({ className, animate }: { className?: string; animate?: boolean }) => (
  <svg viewBox="0 0 24 24" className={`kx-setup-check ${className ?? ""}`} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={animate ? { animation: "kx-setup-check .6s cubic-bezier(.22,1,.36,1) both" } : undefined}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);

/* ---------------------------------- checklist ---------------------------------- */
export function SetupChecklist() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const loc = useLocation();
  const q = usePlan(true);
  const [justDone, setJustDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);
  const [skippedNow, setSkippedNow] = useState<string | null>(() => read<string>(SKIP));
  const prev = useRef<Map<string, string> | null>(null);
  const root = useRef<HTMLElement>(null);
  const data = q.data;

  useEffect(() => {
    if (!data) return;
    const now = new Map<string, string>(); const flipped = new Set<string>();
    for (const s of data.steps) { s.entities?.forEach((e) => now.set(`${s.key}@${e.id}`, e.status)); now.set(s.key, s.status); }
    if (prev.current) { for (const [k, v] of now) if (v === "done" && prev.current.get(k) === "pending") flipped.add(k); }
    else { const jd = read<{ key: string; entity: string | null }>(JUST); if (jd) { write(JUST, null); flipped.add(jd.key); if (jd.entity) flipped.add(`${jd.key}@${jd.entity}`); } }
    prev.current = now;
    if (!flipped.size) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setJustDone(flipped); write(SKIP, null); setSkippedNow(null);
    const timer = window.setTimeout(() => {
      setJustDone(new Set());
      const row = root.current?.querySelector<HTMLElement>('[data-next="true"]');
      row?.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
      root.current?.querySelector<HTMLElement>('[data-next="true"] .kx-setup-cta')?.focus({ preventScroll: true });
    }, reduced() ? 50 : 1300);
    return () => window.clearTimeout(timer);
  }, [data]);

  const skip = useMutation({ mutationFn: (v: { key: string; entityId?: string }) => skipStep(v.key, v.entityId), onSuccess: (d) => qc.setQueryData(["setup"], d) });
  const dismiss = useMutation({ mutationFn: dismissPlan, onSuccess: (d) => qc.setQueryData(["setup"], d) });
  const nextKey = useMemo(() => {
    if (!data) return null;
    const pending = data.steps.filter((s) => s.available && s.status === "pending");
    const pool = pending.filter((s) => s.canPerform).length ? pending.filter((s) => s.canPerform) : pending;
    return (pool.find((s) => s.key !== skippedNow) ?? pool[0])?.key ?? null;
  }, [data, skippedNow]);

  if (q.isLoading) return <section aria-busy="true" role="status" data-testid="setup-checklist-loading" className="mb-4 min-h-48 rounded-xl border border-border/80 bg-card p-4 shadow-kx-1" />;
  if (q.isError || !data) return null;
  if (data.allDone && data.dismissedAt) return null;
  const remember = () => { try { sessionStorage.setItem(RETURN, loc.pathname); } catch { /* ignore */ } };

  return (
    <section ref={root} className="mb-4 rounded-xl border border-border/80 bg-card p-4 shadow-kx-1" aria-labelledby="setup-title" data-testid="setup-checklist" data-all-done={String(data.allDone)} data-progress={data.progressPercent}>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="setup-title" className="text-base font-semibold tracking-tight">{t("setup.title")}</h2>
          <p className="text-sm text-muted-foreground">{data.allDone ? t("setup.subtitleDone") : t("setup.subtitle")}</p>
        </div>
        {!data.allDone ? <button type="button" className={btn("ghost", "sm")} aria-expanded={!collapsed} aria-controls="setup-steps" onClick={() => setCollapsed((c) => !c)} data-testid="setup-collapse"><ChevronDown className={`size-4 transition-transform ${collapsed ? "-rotate-90 rtl:rotate-90" : ""}`} aria-hidden />{collapsed ? t("setup.expand") : t("setup.collapse")}</button> : null}
      </header>
      <div className="mt-2 flex items-center gap-3">
        <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={data.overallPercent} aria-valuemin={0} aria-valuemax={100} aria-label={t("setup.progress")} data-testid="setup-progressbar"><div className="kx-setup-fill h-full rounded-full bg-primary" style={{ width: `${data.overallPercent}%` }} /></div>
        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground" data-testid="setup-progress-label">{t("setup.progressCount", { done: data.doneUnits, total: data.totalUnits, percent: data.overallPercent })}</span>
      </div>
      {data.allDone ? (
        <div className="kx-setup-celebrate mt-3 flex flex-col items-center gap-3 rounded-xl border border-[hsl(var(--success)/0.35)] bg-[hsl(var(--success)/0.07)] px-4 py-8 text-center" data-testid="setup-complete">
          <span className="flex size-14 items-center justify-center rounded-full bg-[hsl(var(--success))] text-white"><Tick className="size-8" animate /></span>
          <div><p className="flex items-center justify-center gap-2 text-lg font-semibold"><PartyPopper className="size-5 text-primary" aria-hidden />{t("setup.completeTitle")}</p><p className="mt-1 text-sm text-muted-foreground">{t("setup.completeBody")}</p></div>
          <button type="button" className={btn("primary")} onClick={() => dismiss.mutate()} disabled={dismiss.isPending} data-testid="setup-dismiss">{t("setup.dismiss")}</button>
        </div>
      ) : (
        <div id="setup-steps" hidden={collapsed} className="mt-3">
          <ol className="space-y-1.5" data-testid="setup-steps">
            {data.steps.map((s, idx) => {
              const isNext = s.key === nextKey; const multi = (s.entities?.length ?? 0) > 1;
              const expanded = multi && (open[s.key] ?? (isNext || (s.status === "pending" && s.doneCount > 0)));
              const label = t(`setup.steps.${s.key}`);
              return (
                <li key={s.key} className="kx-setup-row rounded-xl border border-transparent px-2 py-2" data-testid="setup-step" data-step={s.key} data-status={s.status} data-next={String(isNext)} data-just-done={String(justDone.has(s.key))} data-can-perform={String(s.canPerform)} data-scope={s.scope}>
                  <div className="flex items-start gap-3">
                    <Badge status={s.status} index={idx + 1} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p id={`setup-step-${s.key}`} className={`text-sm ${s.status === "pending" ? "font-semibold" : "text-muted-foreground"}`}>{label}</p>
                        {!s.required ? <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium text-foreground">{t("setup.optional")}</span> : null}
                        {multi ? <span className="text-xs tabular-nums text-muted-foreground" data-testid="setup-aggregate">{t("setup.aggregate", { done: s.doneCount, total: s.totalCount })}</span> : null}
                      </div>
                      <div className="kx-setup-collapse"><div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{t(`setup.why.${s.key}`)}</p>
                        {!s.canPerform ? <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground" data-testid="setup-ask-owner"><Lock className="size-3" aria-hidden />{t("setup.askOwner")} {t("setup.whoCan", { roles: s.whoCan.map((r) => t(`setup.roles.${r}`, r)).join(", ") })}</p> : null}
                      </div></div>
                    </div>
                    {s.status === "pending" ? (
                      <div className="flex shrink-0 items-center gap-1">
                        {!s.required && s.canPerform && !multi ? <button type="button" className={btn("ghost", "sm")} disabled={skip.isPending} onClick={() => skip.mutate({ key: s.key, entityId: s.entities?.[0]?.id })} data-testid="setup-skip" aria-label={`${t("setup.skip")}: ${label}`}>{t("setup.skip")}</button> : null}
                        {multi ? <button type="button" className={btn("outline", "sm")} aria-expanded={expanded} aria-controls={`setup-ent-${s.key}`} onClick={() => setOpen((o) => ({ ...o, [s.key]: !expanded }))} data-testid="setup-toggle"><ChevronDown className={`size-4 transition-transform ${expanded ? "" : "-rotate-90 rtl:rotate-90"}`} aria-hidden />{expanded ? t("setup.hideEntities") : t("setup.showEntities", { count: s.totalCount })}</button>
                          : s.canPerform ? <Link to={s.href} onClick={remember} aria-describedby={`setup-step-${s.key}`} data-testid="setup-cta" className={`${btn(isNext ? "primary" : "outline", "sm")} kx-setup-cta`}>{isNext ? t("setup.start") : t("setup.open")}</Link>
                          : <button type="button" disabled className={btn("outline", "sm")} aria-describedby={`setup-step-${s.key}`} data-testid="setup-cta-disabled">{t("setup.open")}</button>}
                      </div>
                    ) : <span className="shrink-0 pt-1 text-xs font-medium text-[hsl(var(--success))]" data-testid="setup-state-label">{s.status === "skipped" ? t("setup.skipped") : t("setup.done")}</span>}
                  </div>
                  {multi ? (
                    <div id={`setup-ent-${s.key}`} hidden={!expanded} className="mt-2 ms-9">
                      <ul className="space-y-1" data-testid="setup-entities">
                        {s.entities!.map((e) => (
                          <li key={e.id} className="kx-setup-row flex items-center gap-2 rounded-lg px-2 py-1.5" data-testid="setup-entity" data-entity={e.id} data-status={e.status} data-just-done={String(justDone.has(`${s.key}@${e.id}`))}>
                            <Badge status={e.status} small />
                            <span className={`min-w-0 flex-1 truncate text-sm ${e.status === "pending" ? "font-medium" : "text-muted-foreground"}`}>{e.name}</span>
                            {e.status === "pending" ? (<>
                              {!s.required && s.canPerform ? <button type="button" className={btn("ghost", "sm")} disabled={skip.isPending} onClick={() => skip.mutate({ key: s.key, entityId: e.id })} aria-label={`${t("setup.skip")}: ${label} - ${e.name}`}>{t("setup.skip")}</button> : null}
                              {s.canPerform ? <Link to={e.href} onClick={remember} aria-label={`${t("setup.open")}: ${label} - ${e.name}`} data-testid="setup-entity-cta" className={btn("outline", "sm")}>{t("setup.open")}</Link> : <button type="button" disabled className={btn("outline", "sm")}>{t("setup.open")}</button>}
                            </>) : <span className="text-xs font-medium text-[hsl(var(--success))]">{e.status === "skipped" ? t("setup.skipped") : t("setup.done")}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p className="flex items-center gap-1.5 pt-2 text-xs text-muted-foreground"><Sparkles className="size-3.5" aria-hidden />{t("setup.autoDetect")}</p>
        </div>
      )}
    </section>
  );
}

function Badge({ status, index, small }: { status: SetupStatus; index?: number; small?: boolean }) {
  const size = small ? "size-5" : "size-7";
  if (status === "done") return <span className={`kx-setup-badge flex ${size} shrink-0 items-center justify-center rounded-full bg-[hsl(var(--success))] text-white`} data-testid="setup-badge-done"><Tick className={small ? "size-3" : "size-4"} /></span>;
  if (status === "skipped") return <span className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground`} aria-hidden>-</span>;
  return <span className={`flex ${size} shrink-0 items-center justify-center rounded-full border border-border bg-card text-xs font-semibold tabular-nums text-muted-foreground`} aria-hidden>{index ?? ""}</span>;
}

/* ---------------------------------- contextual bar ---------------------------------- */
function useFocusTarget(stepKey: string | null, path: string) {
  useEffect(() => {
    if (!stepKey) return;
    let tries = 0; let marked: HTMLElement | null = null;
    const timer = window.setInterval(() => {
      tries += 1;
      const specific = document.querySelector<HTMLElement>(`[data-setup-target="${stepKey}"]`);
      const dialog = Array.from(document.querySelectorAll<HTMLElement>("[role=dialog]")).find((d) => d.getAttribute("data-state") !== "closed" && d.getClientRects().length > 0 && d.getAttribute("aria-modal") !== "false") ?? null;
      const generic = !specific && !dialog ? document.querySelector<HTMLElement>("main input:not([type=hidden]):not([disabled]), main textarea:not([disabled]), main select:not([disabled])") : null;
      const el = specific ?? generic;
      if (el && el.offsetParent !== null) {
        window.clearInterval(timer);
        el.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" }); el.focus({ preventScroll: true });
        el.setAttribute("data-setup-highlight", "true"); marked = el;
        window.setTimeout(() => marked?.removeAttribute("data-setup-highlight"), 4500);
      } else if (dialog || tries > 40) window.clearInterval(timer);
    }, 150);
    return () => { window.clearInterval(timer); marked?.removeAttribute("data-setup-highlight"); };
  }, [stepKey, path]);
}

/** Sticky "Step 2 of 7: ..." bar on the page a quick-setup step opened: detects completion, animates, and returns to the checklist. */
export function SetupBar({ onEntity }: { onEntity?: (id: string) => void } = {}) {
  const { t } = useTranslation();
  const loc = useLocation(); const nav = useNavigate();
  const session = useSetupSession();
  useAutoRefresh();
  useEffect(() => {
    const p = new URLSearchParams(loc.search); const key = p.get("setup");
    if (key) {
      let returnTo = "/"; try { returnTo = sessionStorage.getItem(RETURN) || "/"; } catch { /* ignore */ }
      const entity = p.get("entity");
      if (!session || session.key !== key || session.entity !== entity || session.path !== loc.pathname) { setSession({ key, entity, path: loc.pathname, returnTo, startedPending: null }); if (entity) onEntity?.(entity); }
    } else if (session && session.path !== loc.pathname) setSession(null);
  }, [loc.search, loc.pathname, session, onEntity]);
  const q = usePlan(Boolean(session), true);
  const step = useMemo(() => q.data?.steps.find((s) => s.key === session?.key), [q.data, session?.key]);
  const unit = session?.entity ? step?.entities?.find((e) => e.id === session.entity) : step;
  const status = unit?.status;
  const [success, setSuccess] = useState(false);
  const leaving = useRef(false);
  useEffect(() => { if (session && session.startedPending === null && status) setSession({ ...session, startedPending: status === "pending" }); }, [session, status]);
  useEffect(() => {
    if (!session || !step || !session.startedPending || status !== "done" || leaving.current) return;
    leaving.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuccess(true); write(JUST, { key: session.key, entity: session.entity });
    const timer = window.setTimeout(() => { leaving.current = false; setSuccess(false); setSession(null); nav(session.returnTo || "/"); }, reduced() ? 400 : 1500);
    return () => window.clearTimeout(timer);
  }, [session, step, status, nav]);
  useFocusTarget(session?.key ?? null, `${loc.pathname}${session?.entity ?? ""}`);
  if (!session || !q.data || !step) return null;
  const live = q.data.steps.filter((s) => s.available);
  const n = Math.max(1, live.findIndex((s) => s.key === step.key) + 1);
  const where = session.entity ? step.entities?.find((e) => e.id === session.entity)?.name : null;
  const back = () => { setSession(null); nav(session.returnTo || "/"); };
  return (
    <section aria-label={t("setup.bar.region")} className="kx-setup-bar sticky top-0 md:top-14 z-10 -mx-4 -mt-4 mb-4 border-b border-primary/25 bg-primary/5 px-4 py-2.5 backdrop-blur-sm md:-mx-6 md:-mt-6 md:px-6" data-testid="setup-bar" data-step={session.key} data-success={String(success)} data-status={status ?? "pending"}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1" role="status" aria-live="polite">
          <p className="text-xs font-medium uppercase tracking-wide text-primary rtl:normal-case rtl:tracking-normal" data-testid="setup-bar-count">{t("setup.bar.stepOf", { n, total: live.length })}</p>
          <p className="flex items-center gap-2 text-sm font-semibold" data-testid="setup-bar-title">
            {success || status === "done" ? <span className="flex size-5 items-center justify-center rounded-full bg-[hsl(var(--success))] text-white"><Tick className="size-3.5" /></span> : null}
            <span className="truncate">{t(`setup.steps.${step.key}`)}{where ? ` - ${where}` : ""}</span>
          </p>
          <p className="text-xs text-muted-foreground" data-testid="setup-bar-hint">{success ? t("setup.bar.doneReturning") : status === "done" ? t("setup.bar.alreadyDone") : t(`setup.why.${step.key}`)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" className={btn("outline", "sm")} onClick={back} data-testid="setup-bar-back"><ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />{t("setup.bar.back")}</button>
          {status !== "done" ? <button type="button" className={btn("ghost", "sm")} onClick={() => { write(SKIP, session.key); back(); }} data-testid="setup-bar-skip"><SkipForward className="size-4 rtl:rotate-180" aria-hidden />{t("setup.bar.skipForNow")}</button> : null}
        </div>
      </div>
    </section>
  );
}
void Check;
