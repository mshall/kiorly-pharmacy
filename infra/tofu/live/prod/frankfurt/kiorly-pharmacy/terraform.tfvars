aws_account_id = "REPLACE_WITH_PROD_ACCOUNT_ID" # NEEDS_HUMAN: production account (HB05). Intentionally invalid so plan/apply fails until decided.

# PLACEHOLDER: kiorly-pharmacy ships with M9-M13 (KX-06) - nothing is created while enabled = false.
# To bring the stack up: set enabled = true, review the sizing below, then follow infra/tofu/README.md.
enabled = false

api = {
  cpu             = "1024"
  memory          = "2048"
  min             = 2
  max             = 25
  max_concurrency = 100
  health_path     = "/api/v1/health/live"
}

db = {
  engine_version       = "16"
  instance_class       = "db.t4g.medium"
  multi_az             = true
  backup_days          = 35
  deletion_protection  = true
  skip_final_snapshot  = false
  storage_gb           = 20
  max_storage_gb       = 100
  name                 = "pharmacy"
  username             = "pharmacyapp"
  performance_insights = true
}

uploads = { versioning = true, kms = true } # S3 for documents; offline POS sync endpoint lives in the API

env_vars = {
  NODE_ENV        = "production"
  SWAGGER_ENABLED = "false"
  # Kiorex Passport staff sign-in (INTEGRATION.md "Staff sign-in with Kiorex Passport"). Config only: the client is registered from
  # kiorex-account/config/idp.json (clients kiorly-pharmacy-web, kiorly); nothing secret here. The session HS256 key comes from the JWT_SECRET runtime secret.
  AUTH_MODE                    = "oidc"
  OIDC_ISSUER                  = "https://account.kiorex.com"
  OIDC_WEB_CLIENT_ID           = "kiorly-pharmacy-web" # NEEDS_HUMAN S6: replace with the Cognito app client id (identity stack output client_ids) when the IdP is applied
  OIDC_SESSION_MAX_AGE_SECONDS = "3600"                # fallback re-validation: a Passport web session never outlives this (60..28800), even if a back-channel logout is missed
}

domain             = "pharmacy.kiorly.com"
zone_name          = "kiorly.com"
waf_enabled        = true
use_cmk            = true
log_retention_days = 90
alarm_emails       = [] # NEEDS_HUMAN

enable_demo_seed           = false # Q10: never seed demo data in prod (the plan fails if this is true)
seed_ensure_demo_passwords = false # never in prod (the plan fails if true)

# ADR-040 front door: EMPTY container /kiorly-pharmacy/prod/kiorex-lead-signing. Founder steps (docs: kiorex-platform Docs/NEEDS_HUMAN.md "Partner lead signing secret"):
#   1. tofu apply (creates the container)  2. kiorex-platform/scripts/setup-partner-lead-secret.sh prod  3. set lead_signing_secret_inject = true and apply.
lead_signing_secret        = true
lead_signing_secret_inject = false
