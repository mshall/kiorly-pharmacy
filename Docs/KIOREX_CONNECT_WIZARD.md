# Connect to Kiorex (Kiorly Pharmacy), ADR-040

Kiorly Pharmacy works fully on its own. **Connect to Kiorex** (`/kiorex-connect`) guides an organisation that started standalone through joining the marketplace later.

- **Checklist.** `GET /api/v1/kiorex-connect` returns the steps computed from real state, each `done | action_needed | waiting_kiorex | blocked`, with a deep link to fix it. Subscription, branch opt-in (edited in the wizard because the normal Kiorex orders settings are 403 while standalone), priced in-stock non-controlled catalogue, hours and map pin, licence number per branch and an uploaded licence document, payout LABEL placeholder (account-number-like input is refused; no bank data is stored), terms.
- **Request.** `POST /api/v1/kiorex-connect/request` issues a fresh HMAC client and webhook secret, switches the tenant to INTEGRATED, and sends the signed request. Kiorex runs a signed handshake against `/marketplace/v1/catalogue`.
- **Secrets.** Stored sealed in `IntegrationClient`; returned only in the rotation response (`credentials.shownOnce`); never logged or audited.
- **Status.** The product polls Kiorex with a status token it derives itself (HMAC of the organisation id); nothing is stored. Rejection returns the organisation to standalone.
- **After Go live.** The page offers to make Kiorex Passport the default sign-in (`defaultSignInMethod`) and to invite staff to link their phone.
- **Tests.** ``modules/marketplace/kiorex-connect.node.test.ts`, `web/src/pages/kiorex-connect.node.test.ts``; end to end: `e2e/test/22-standalone-connect.e2e.ts` in the workspace repo.
- **Not done / needs a human.** Counsel-approved terms and fee wording, real notification providers, real launch-gate evidence, the production signing of the request with a per-partner enrolment secret (today the Clinic uses the shared webhook secret and Pharmacy/Lab prove control of their API through the signed handshake).
