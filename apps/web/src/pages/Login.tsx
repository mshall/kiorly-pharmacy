import { lazy, Suspense, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button, ErrorNote, Field, Input } from "@/components/ui";
import { KiorlyBrandLockup, KiorlyFootText, KxControlPair, LanguageToggle, Pulse, ThemeToggle } from "@/brand/ui-kit";
import { KiorexLogo } from "@/brand/components";
import { setLang } from "@/lib/i18n";
import { fetchAuthConfig, startPassportSignIn } from "@/lib/passport";
import { currentNavigationType, readHandoff, wantsPassportAutostart, withoutHandoff } from "@/lib/kiorly-home";
import { rememberSignInMethod } from "@/lib/sign-in-method";
import { currentOrgHint } from "@/lib/sign-in-default";
import { SwitchProductLink } from "@/components/switch-product-link";
import { SignInMethodTabs } from "@/components/sign-in-method-tabs";
import { useSignInMethod } from "@/components/use-sign-in-method";

// DEV ONLY quick-pick test users. Keep the condition inline: Vite folds `import.meta.env.DEV` to false in production builds, which drops the
// dynamic import and the whole ../dev folder (asserted by scripts/check-no-dev-test-users.mjs).
const DevTestUsers = import.meta.env.DEV && import.meta.env.VITE_DEV_TEST_USERS !== "false" ? lazy(() => import("@/dev/dev-test-users")) : null;

function Shell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside aria-hidden={false} className="relative hidden flex-col justify-between overflow-hidden bg-(--kx-indigo-950) p-12 text-white lg:sticky lg:top-0 lg:flex lg:h-screen" data-testid="login-brand-panel">
        <div className="pointer-events-none absolute -inset-e-32 -top-32 size-112 rounded-full bg-(--kx-indigo-800)/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -inset-s-24 size-104 rounded-full bg-(--kx-ocean-700)/40 blur-3xl" />
        <div className="relative"><KiorexLogo variant="lockup" product="pharmacy" lang={i18n.language} tone="inverse" height={52} /><p data-kx-tagline className="mt-1 text-xs text-white/70">{t("app.tagline")}</p></div>
        <div className="relative max-w-md">
          <Pulse size={28} loop />
          <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-balance">{t("auth.heroTitle")}</h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">{t("auth.heroBody")}</p>
          <ul className="mt-8 space-y-3 text-sm text-white/85">{["heroA", "heroB", "heroC"].map((k) => <li key={k} className="flex items-center gap-3"><span aria-hidden className="size-1.5 rounded-full bg-(--kx-coral-500)" />{t(`auth.${k}`)}</li>)}</ul>
        </div>
        <p className="relative text-xs text-white/60"><KiorlyFootText text={t("auth.heroFoot")} word={t("auth.heroFootWord")} /></p>
      </aside>
      <main className="flex min-h-screen flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between gap-3"><span className="lg:invisible"><KiorlyBrandLockup height={40} /></span>
          <KxControlPair><ThemeToggle labels={{ theme: t("theme.label"), light: t("theme.light"), dark: t("theme.dark"), system: t("theme.system") }} /><LanguageToggle onChange={setLang} /></KxControlPair></div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

export function Login() {
  const { t, i18n } = useTranslation();
  const { login, signedIn, adoptSession } = useAuth();
  const nav = useNavigate();
  // The login page is pre-auth: the org is identified by `?org=`, a tenant subdomain or the org remembered on this browser; the API answers uniformly for unknown orgs.
  const orgHint = useMemo(() => currentOrgHint(), []);
  const cfg = useQuery({ queryKey: ["auth-config", orgHint], queryFn: () => fetchAuthConfig(orgHint), staleTime: 60_000 });
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState<unknown>(null); const [busy, setBusy] = useState(false);
  const { search } = useLocation();
  const passport = cfg.data?.passport ?? null;
  // Two methods only: Kiorex Passport (default) and Password; the last method that signed this browser in is preselected. No Passport on the API: password only.
  const sim = useSignInMethod(cfg.isPending ? undefined : passport !== null, cfg.data?.defaultMethod);
  // Kiorly Home sends `?sso=passport`: start "Sign in with Kiorex Passport" by itself (once per page load; the Passport SSO session makes it silent).
  const autostarted = useRef(false);
  // Kiorly Home password handoff: redeem the single-use code once, strip it from the address bar first, then adopt the normal session.
  const [handoff] = useState(() => readHandoff(window.location.search));
  const [handoffBusy, setHandoffBusy] = useState(!!handoff.code);
  const redeemed = useRef(false);
  useEffect(() => {
    if (!handoff.code && !handoff.reason) return;
    window.history.replaceState(window.history.state, "", withoutHandoff(window.location.pathname, window.location.search, window.location.hash));
    if (!handoff.code || redeemed.current) return;
    redeemed.current = true;
    api<{ accessToken: string }>("/auth/handoff/exchange", { body: { code: handoff.code } })
      .then(async (r) => { await adoptSession(r.accessToken); rememberSignInMethod("password"); nav("/", { replace: true }); })
      .catch(() => { setHandoffBusy(false); setErr(new Error(t("auth.handoffFailed"))); });
  }, [handoff, adoptSession, nav, t]);
  // the handoff could not complete (second factor, expired password, organisation): show the product's own password form
  useEffect(() => { if (handoff.reason && sim.ready) sim.choose("password"); }, [handoff.reason, sim.ready]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (signedIn || handoff.code || !passport || autostarted.current || !wantsPassportAutostart(search, currentNavigationType())) return;
    autostarted.current = true; void startPassportSignIn(passport, i18n.language);
  }, [signedIn, passport, search, i18n.language, handoff.code]);
  if (signedIn) return <Navigate to="/" replace />;
  const localLogin = cfg.data?.localLogin ?? true;
  const method = localLogin ? sim.method : "passport"; // a Passport-only deployment has no Password option
  const signInWith = async (em: string, pw: string) => { setBusy(true); setErr(null); try { await login(em, pw); rememberSignInMethod("password"); nav("/"); } catch (x) { setErr(x); } finally { setBusy(false); } };
  const submit = async (e: FormEvent) => { e.preventDefault(); await signInWith(email, password); };
  return (
    <Shell title={t("auth.signIn")} subtitle={t("auth.signInLede")}>
      {handoffBusy ? <p role="status" data-testid="handoff-busy" className="mb-4 text-sm text-muted-foreground">{t("auth.handoffBusy")}</p> : null}
      {handoff.reason ? <p role="status" data-testid="handoff-reason" className="mb-4 rounded-lg border border-border bg-muted/50 p-3 text-sm">{t(`auth.handoffReason.${handoff.reason}`, { defaultValue: t("auth.handoffReason.other") })}</p> : null}
      {!sim.ready ? <div role="status" aria-busy="true" aria-label={t("auth.signIn")} data-testid="signin-loading" className="h-40 animate-pulse rounded-xl bg-muted/60" /> : null}
      {sim.ready && passport && localLogin ? <SignInMethodTabs className="mb-6" value={method} onChange={sim.choose} labels={{ group: t("auth.method"), passport: t("auth.methodPassport"), password: t("auth.methodPassword") }} /> : null}
      {sim.ready && passport && method === "passport" ? (
        <div role="tabpanel" id="signin-panel-passport" className="space-y-3" data-testid="signin-passport-panel">
          <Button type="button" size="lg" className="w-full" data-testid="signin-passport" onClick={() => void startPassportSignIn(passport, i18n.language)}>{t("auth.passport")}</Button>
          <p className="text-center text-xs text-muted-foreground">{t("auth.passportHint")}</p>
        </div>
      ) : null}
      {sim.ready && localLogin && (!passport || method === "password") ? <form onSubmit={submit} role={passport ? "tabpanel" : undefined} id="signin-panel-password" className="space-y-4" data-testid="signin-password-panel">
        <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
        <Field label={t("auth.password")}>{(id) => <Input id={id} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />}</Field>
        <ErrorNote error={err} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? <Pulse size={16} loop /> : null}{t("auth.signIn")}</Button>
        <p className="text-center text-sm text-muted-foreground">{t("auth.noAccount")} <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/signup">{t("auth.signUp")}</Link></p>
      </form> : null}
      <p className="mt-6 text-center"><SwitchProductLink /></p>
      {DevTestUsers ? <Suspense fallback={null}><DevTestUsers busy={busy} onPick={(em, pw) => { setEmail(em); setPassword(pw); void signInWith(em, pw); }} /></Suspense> : null}
    </Shell>
  );
}

export function Signup() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ pharmacyName: "", ownerName: "", email: "", password: "", pharmacistLicenceNo: "" });
  const [err, setErr] = useState<unknown>(null); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    try { await api("/onboarding/signup", { body: { ...f, pharmacistLicenceNo: f.pharmacistLicenceNo || undefined } }); await login(f.email, f.password); nav("/onboarding"); }
    catch (x) { setErr(x); } finally { setBusy(false); }
  };
  return (
    <Shell title={t("auth.signUp")} subtitle={t("auth.signUpLede")}>
      <form onSubmit={submit} className="space-y-3">
        <Field label={t("onb.pharmacyName")}>{(id) => <Input id={id} required minLength={2} value={f.pharmacyName} onChange={set("pharmacyName")} />}</Field>
        <Field label={t("onb.ownerName")}>{(id) => <Input id={id} required minLength={2} value={f.ownerName} onChange={set("ownerName")} />}</Field>
        <Field label={t("onb.licence")} hint={t("onb.licenceHint")}>{(id) => <Input id={id} value={f.pharmacistLicenceNo} onChange={set("pharmacistLicenceNo")} />}</Field>
        <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" required value={f.email} onChange={set("email")} />}</Field>
        <Field label={t("auth.password")} hint={t("auth.passwordHint")}>{(id) => <Input id={id} type="password" required minLength={8} autoComplete="new-password" value={f.password} onChange={set("password")} />}</Field>
        <ErrorNote error={err} />
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? <Pulse size={16} loop /> : null}{t("auth.signUp")}</Button>
        <p className="text-center text-sm"><Link className="font-medium text-primary underline-offset-4 hover:underline" to="/login">{t("auth.signIn")}</Link></p>
      </form>
    </Shell>
  );
}
