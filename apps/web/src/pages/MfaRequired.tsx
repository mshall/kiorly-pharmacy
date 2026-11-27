import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth";
import { fetchAuthConfig } from "@/lib/passport";
import { passportSecurityUrl } from "@/lib/mfa-required";
import { Button, buttonClass } from "@/components/ui";

/** Shown instead of the app when the API answers 403 MFA_REQUIRED: tells a real owner to enrol a second factor in Kiorex Passport (link) and sign in again. */
export function MfaRequired() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { let live = true; void fetchAuthConfig().then((c) => { if (live) setUrl(passportSecurityUrl(c.passport?.issuer)); }); return () => { live = false; }; }, []);
  return (
    <main id="main" className="grid min-h-screen place-items-center p-6" data-testid="mfa-required">
      <div className="max-w-md space-y-4" role="alert">
        <h1 className="text-xl font-semibold">{t("auth.mfaRequired.title")}</h1>
        <p>{t("auth.mfaRequired.body")}</p>
        <ol className="list-decimal space-y-1 ps-5 text-sm">
          <li>{t("auth.mfaRequired.step1")}</li>
          <li>{t("auth.mfaRequired.step2")}</li>
        </ol>
        <div className="flex flex-wrap gap-2">
          {url ? <a className={buttonClass({})} href={url} data-testid="mfa-passport-link">{t("auth.mfaRequired.openPassport")}</a> : null}
          <Button variant="secondary" onClick={() => logout()}>{t("auth.mfaRequired.signOutAgain")}</Button>
        </div>
        <p className="text-sm text-muted-foreground">{t("auth.mfaRequired.help")}</p>
      </div>
    </main>
  );
}
