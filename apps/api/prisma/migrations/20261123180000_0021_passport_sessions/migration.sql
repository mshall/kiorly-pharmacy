-- Staff phone is unique inside a tenant (Passport phone linking needs an unambiguous match). Keep the oldest row of any pre-existing duplicate.
UPDATE "StaffUser" s SET "phone" = NULL
WHERE s."phone" IS NOT NULL
  AND s."id" <> (SELECT x."id" FROM "StaffUser" x WHERE x."orgId" = s."orgId" AND x."phone" = s."phone" ORDER BY x."createdAt", x."id" LIMIT 1);

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_orgId_phone_key" ON "StaffUser"("orgId", "phone");

-- CreateTable
CREATE TABLE "PassportSession" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "sid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" TEXT,

    CONSTRAINT "PassportSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PassportRevocation" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PassportRevocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogoutTokenSeen" (
    "jti" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LogoutTokenSeen_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE INDEX "PassportSession_sid_idx" ON "PassportSession"("sid");
CREATE INDEX "PassportSession_sub_idx" ON "PassportSession"("sub");
CREATE INDEX "PassportSession_staffId_idx" ON "PassportSession"("staffId");
CREATE UNIQUE INDEX "PassportRevocation_kind_value_key" ON "PassportRevocation"("kind", "value");
CREATE INDEX "LogoutTokenSeen_expiresAt_idx" ON "LogoutTokenSeen"("expiresAt");
