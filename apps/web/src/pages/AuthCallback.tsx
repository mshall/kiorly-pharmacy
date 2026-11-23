import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { completePassportSignIn } from "@/lib/passport";
import { rememberSignInMethod } from "@/lib/sign-in-method";
import { Pulse } from "@/brand/ui-kit";
import { ErrorNote } from "@/components/ui";

/** OIDC redirect target (`/auth/callback`): redeem the code through the API, adopt the session, go to the app. */
export function AuthCallback() {
  const { t } = useTranslation();
  const { adoptSession } = useAuth();
  const nav = useNavigate();
  const [err, setErr] = useState<unknown>(null);
  const ran = useRef(false); // StrictMode double effect: the code is single use
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    completePassportSignIn(window.location.search)
      .then((r) => adoptSession(r.accessToken))
      .then(() => { rememberSignInMethod("passport"); nav("/", { replace: true }); })
      .catch(setErr);
  }, [adoptSession, nav]);
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="max-w-sm space-y-4 text-center" role="status" aria-live="polite">
        {err ? (
          <>
            <h1 className="text-xl font-semibold">{t("auth.passportFailed")}</h1>
            <ErrorNote error={err} />
            <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/login">{t("auth.signIn")}</Link>
          </>
        ) : (
          <><Pulse size={28} loop /><p className="text-sm text-muted-foreground">{t("auth.passportBusy")}</p></>
        )}
      </div>
    </main>
  );
}
