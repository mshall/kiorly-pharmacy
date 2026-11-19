# infra/tofu — OpenTofu for Kiorly Pharmacy

Implements ADR-028 / KX-21 §01. OpenTofu **1.13.9** (`.opentofu-version`), `hashicorp/aws ~> 6.0`. **Nothing in this
tree has been applied.** Do not deploy until the founder approves the first deploy.

```
.opentofu-version   .tflint.hcl
modules/contracts/README.md      inputs/outputs of the 10 contracts
modules/aws/{network,database,container-service,object-storage,cdn-edge,secrets,email,dns-certs,waf,observability,ci-oidc}
modules/product-stack/    one product in one cell (precondition: provider region == platform/data-cells.json)
live/{staging,prod}/frankfurt/kiorly-pharmacy/    backend.tf main.tf variables.tf outputs.tf terraform.tfvars
```

`modules/` is a verbatim copy of the Kiorly Clinic skeleton (KX-22). Fix a module in `clinics-management` first, then re-copy.

## State
S3 (`kiorex-tofu-state-<env>-euc1`, native `use_lockfile`) + OpenTofu client-side KMS encryption (`alias/kiorex-tofu-state`)
for state **and plan** files. One state per product / environment / cell. Backend config cannot use variables, so the
bucket names are literal in each `backend.tf`.

## 1. Bootstrap (platform admin, once per account, locally with SSO/MFA)
State buckets, KMS key and GitHub roles are created by **`clinics-management/infra/tofu/bootstrap`** (one set per AWS account,
roles already trust this repo). Run it there first; nothing to bootstrap here.

## 2. Plan (local, same as CI)
```sh
export AWS_PROFILE=aws-kiorex-profile      # eu-central-1
cd infra/tofu/live/staging/frankfurt/kiorly-pharmacy
tofu init
tofu fmt -check -recursive && tofu validate
tflint --recursive && trivy config .
tofu plan -var "git_sha=$GIT_SHA" -out plan.tfplan
```
Offline checks (no AWS): `tofu fmt -recursive && tofu init -backend=false && tofu validate` in every live directory.

## 3. Apply
Never from a laptop except documented break-glass; use `deploy.yml` (staging) and `release.yml` (production, approval).
Image first: an App Runner service needs its image, so the first apply is two-phase —
`tofu apply -target=<module>.module.container_service.aws_ecr_repository.this`, push the image tagged `$GIT_SHA`, then the full apply
(the workflows do this).
`prod` tfvars carry `aws_account_id = "REPLACE_WITH_PROD_ACCOUNT_ID"` on purpose: **NEEDS_HUMAN** decide the production
account (HB05); the validation fails until then. Staging targets the Kiorex account 599243104052.

## 4. Adopting existing resources (migration path T4-alt)
If real data already lives in the CDK stack: set CDK removal policies to RETAIN, then add `import` blocks, e.g.
```hcl
import {
  to = module.kiorly_pharmacy.module.database[0].aws_db_instance.this
  id = "<existing-rds-identifier>"
}
```
(also VPC, S3 buckets, KMS keys), run `tofu plan` until it shows **0 changes**, `cdk destroy` the stateless rest, recreate those
with OpenTofu. Prefer greenfield (T4) while there are no live tenants.

## 5. GitHub Actions (`.github/workflows`)
`infra-plan.yml` (PR: fmt, validate, tflint, trivy, plan with read-only `tofu-plan`), `deploy.yml` (staging),
`release.yml` (production), `drift.yml` (nightly). **All apply workflows are `workflow_dispatch` only** until the founder
approves the first deploy. Repository variables: `AWS_TOFU_PLAN_ROLE_ARN`, `AWS_TOFU_APPLY_STAGING_ROLE_ARN`,
`AWS_TOFU_APPLY_PROD_ROLE_ARN` (from bootstrap outputs); GitHub Environments `staging` and `production` (required reviewers).

## Known blockers
- AWS Organization SCPs: in account 599243104052, user `cursor-admin` gets explicit denies on `cloudformation:ListStacks`,
  `apprunner:ListServices`, `rds:DescribeDBInstances`, `s3:ListAllMyBuckets`. The org admin must relax them before plan/apply.
- HB07: with App Runner VPC egress and no NAT, calls to third-party APIs need a path — verify in staging; add a NAT or egress proxy.
- tflint is not installed locally; config is kept and runs in CI. App Runner log retention is set by the AWS CLI via a
  `terraform_data` provisioner (the service owns those log groups) — runners need the AWS CLI.
- Placeholder: `enabled = false` in both tfvars (ships M9–M13, KX-06). Domains `pharmacy.kiorly.com` are placeholders (NEEDS_HUMAN).
