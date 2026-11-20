output "app_url" {
  description = "HTTPS URL of the product (SPA + /api/*)."
  value       = one(module.kiorly_pharmacy[*].app_url)
}

output "api_origin" {
  description = "Direct App Runner URL."
  value       = one(module.kiorly_pharmacy[*].api_origin)
}

output "db_secret_arn" {
  description = "RDS-managed master secret ARN."
  value       = one(module.kiorly_pharmacy[*].db_secret_arn)
}

output "db_endpoint" {
  description = "Database host:port."
  value       = one(module.kiorly_pharmacy[*].db_endpoint)
}

output "db_seed_function_name" {
  description = "Seed Lambda name (non-prod)."
  value       = one(module.kiorly_pharmacy[*].db_seed_function_name)
}

output "host_cell" {
  description = "Data residency cell."
  value       = one(module.kiorly_pharmacy[*].host_cell)
}

output "data_region" {
  description = "Data region."
  value       = one(module.kiorly_pharmacy[*].data_region)
}

output "ecr_repository_url" {
  description = "API image repository."
  value       = one(module.kiorly_pharmacy[*].ecr_repository_url)
}

output "seed_ecr_repository_url" {
  description = "Seed image repository (non-prod)."
  value       = one(module.kiorly_pharmacy[*].seed_ecr_repository_url)
}

output "web_bucket" {
  description = "Web bucket for aws s3 sync."
  value       = one(module.kiorly_pharmacy[*].web_bucket)
}

output "uploads_bucket" {
  description = "Uploads bucket."
  value       = one(module.kiorly_pharmacy[*].uploads_bucket)
}

output "distribution_id" {
  description = "CloudFront distribution id."
  value       = one(module.kiorly_pharmacy[*].distribution_id)
}

output "alerts_topic_arn" {
  description = "SNS alert topic."
  value       = one(module.kiorly_pharmacy[*].alerts_topic_arn)
}

output "app_runner_service_name" {
  description = "App Runner service name."
  value       = one(module.kiorly_pharmacy[*].app_runner_service_name)
}

output "app_runner_service_arn" {
  description = "App Runner service ARN."
  value       = one(module.kiorly_pharmacy[*].app_runner_service_arn)
}

output "demo_seed_function_name" {
  description = "Demo seed Lambda (staging only; null unless enable_demo_seed)."
  value       = one(module.kiorly_pharmacy[*].demo_seed_function_name)
}

output "demo_seed_invoke" {
  description = "How to run the demo seed after the staging deploy (a human runs it; see scripts/seed-staging.sh)."
  value       = one(module.kiorly_pharmacy[*].demo_seed_invoke)
}
