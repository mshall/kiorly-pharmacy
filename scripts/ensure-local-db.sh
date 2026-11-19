#!/usr/bin/env bash
# Creates the local kiorly_pharmacy database on the workspace Postgres (:5433) if missing. No-op when it exists.
set -euo pipefail
PGBIN="${PGBIN:-/Users/postgres/bin}"
export PGPASSWORD="${PGPASSWORD:-postgres}"
for DB in kiorly_pharmacy kiorly_pharmacy_test; do
  if "$PGBIN/psql" -h 127.0.0.1 -p 5433 -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB'" | grep -q 1; then
    echo "db $DB: exists"
  else
    "$PGBIN/createdb" -h 127.0.0.1 -p 5433 -U postgres "$DB"
    echo "db $DB: created"
  fi
done
