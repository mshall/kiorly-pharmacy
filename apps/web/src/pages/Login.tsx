import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button, Card, ErrorNote, Field, Input } from "@/components/ui";
import { setLang, type Lang } from "@/lib/i18n";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const next: Lang = i18n.language === "ar" ? "en" : "ar";
  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center justify-between"><div className="flex items-center gap-3"><img src="/logo.svg" alt="" className="h-10 w-10" /><span className="text-xl font-semibold">{t("app.product")}</span></div>
          <Button variant="outline" size="sm" onClick={() => setLang(next)}>{t("app.lang")}</Button></div>
        <Card title={title}>{children}</Card>
      </div>
    </div>
  );
}

export function Login() {
  const { t } = useTranslation();
  const { login, signedIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [err, setErr] = useState<unknown>(null); const [busy, setBusy] = useState(false);
  if (signedIn) return <Navigate to="/" replace />;
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setErr(null); try { await login(email, password); nav("/"); } catch (x) { setErr(x); } finally { setBusy(false); } };
  return (
    <Shell title={t("auth.signIn")}>
      <form onSubmit={submit} className="space-y-4">
        <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />}</Field>
        <Field label={t("auth.password")}>{(id) => <Input id={id} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />}</Field>
        <ErrorNote error={err} />
        <Button type="submit" className="w-full" disabled={busy}>{t("auth.signIn")}</Button>
        <p className="text-center text-sm text-muted-foreground">{t("auth.noAccount")} <Link className="text-primary underline" to="/signup">{t("auth.signUp")}</Link></p>
      </form>
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
    <Shell title={t("auth.signUp")}>
      <form onSubmit={submit} className="space-y-3">
        <Field label={t("onb.pharmacyName")}>{(id) => <Input id={id} required minLength={2} value={f.pharmacyName} onChange={set("pharmacyName")} />}</Field>
        <Field label={t("onb.ownerName")}>{(id) => <Input id={id} required minLength={2} value={f.ownerName} onChange={set("ownerName")} />}</Field>
        <Field label={t("onb.licence")} hint={t("onb.licenceHint")}>{(id) => <Input id={id} value={f.pharmacistLicenceNo} onChange={set("pharmacistLicenceNo")} />}</Field>
        <Field label={t("auth.email")}>{(id) => <Input id={id} type="email" required value={f.email} onChange={set("email")} />}</Field>
        <Field label={t("auth.password")} hint={t("auth.passwordHint")}>{(id) => <Input id={id} type="password" required minLength={8} autoComplete="new-password" value={f.password} onChange={set("password")} />}</Field>
        <ErrorNote error={err} />
        <Button type="submit" className="w-full" disabled={busy}>{t("auth.signUp")}</Button>
        <p className="text-center text-sm"><Link className="text-primary underline" to="/login">{t("auth.signIn")}</Link></p>
      </form>
    </Shell>
  );
}
