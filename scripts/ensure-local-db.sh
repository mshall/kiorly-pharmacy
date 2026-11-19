#!/usr/bin/env bash
# Creates the local kiorly_pharmacy database on the workspace Postgres (:5433) if missing. No-op when it exists.
set -euo pipefail
PGBIN="${PGBIN:-/Users/postgres/bin}"
export PGPASSWORD="${PGPASSWORD:-postgres}"
if "$PGBIN/psql" -h 127.0.0.1 -p 5433 -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='kiorly_pharmacy'" | grep -q 1; then
  echo "db kiorly_pharmacy: exists"
else
  "$PGBIN/createdb" -h 127.0.0.1 -p 5433 -U postgres kiorly_pharmacy
  echo "db kiorly_pharmacy: created"
fi
