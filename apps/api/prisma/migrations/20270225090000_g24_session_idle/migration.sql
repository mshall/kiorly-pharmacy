-- G-24: idle limit for web sessions. Additive column, existing sessions start their idle clock at the migration.
ALTER TABLE "PassportSession" ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
