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
}

domain             = "pharmacy.kiorly.com"
zone_name          = "kiorly.com"
waf_enabled        = true
use_cmk            = true
log_retention_days = 90
alarm_emails       = [] # NEEDS_HUMAN

enable_demo_seed = false # Q10: never seed demo data in prod (the plan fails if this is true)
