-- GRW-P4-B1: partner-side provider links for Kiorly Pharmacy (additive; no existing table changes).
-- Code rules are database rules: 8 Crockford base32 characters (no I, L, O, U); a BRANCH or DESK link needs a branch; an ORG link has none; revoked_at matches status.

CREATE TYPE "ReferralLinkOwnerScope" AS ENUM ('ORG', 'BRANCH', 'DESK');
CREATE TYPE "ReferralLinkChannelKind" AS ENUM ('WEB_LINK', 'QR_POSTER', 'QR_DESK', 'SOCIAL', 'SMS', 'WHATSAPP_SHARE', 'EMAIL_SIG', 'GOOGLE_PROFILE');
CREATE TYPE "ReferralLinkStatus" AS ENUM ('ACTIVE', 'PAUSED', 'REVOKED');

CREATE TABLE "ProviderReferralLink" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchRef" TEXT,
    "ownerScope" "ReferralLinkOwnerScope" NOT NULL,
    "channelKind" "ReferralLinkChannelKind" NOT NULL DEFAULT 'WEB_LINK',
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" "ReferralLinkStatus" NOT NULL DEFAULT 'ACTIVE',
    "tags" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    CONSTRAINT "ProviderReferralLink_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProviderReferralLink_code_format_chk" CHECK ("code" ~ '^[0-9A-HJKMNP-TV-Z]{8}$'),
    CONSTRAINT "ProviderReferralLink_scope_branch_chk" CHECK (("ownerScope" = 'ORG' AND "branchRef" IS NULL) OR ("ownerScope" IN ('BRANCH', 'DESK') AND "branchRef" IS NOT NULL)),
    CONSTRAINT "ProviderReferralLink_label_chk" CHECK (char_length("label") BETWEEN 2 AND 80),
    CONSTRAINT "ProviderReferralLink_revoked_chk" CHECK (("status" = 'REVOKED') = ("revokedAt" IS NOT NULL))
);
CREATE UNIQUE INDEX "ProviderReferralLink_code_key" ON "ProviderReferralLink"("code");
CREATE INDEX "ProviderReferralLink_orgId_status_idx" ON "ProviderReferralLink"("orgId", "status");
CREATE INDEX "ProviderReferralLink_orgId_branchRef_idx" ON "ProviderReferralLink"("orgId", "branchRef");
CREATE INDEX "ProviderReferralLink_updatedAt_id_idx" ON "ProviderReferralLink"("updatedAt", "id");

CREATE TABLE "ProviderReferralLinkDaily" (
    "linkId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "visits" INTEGER NOT NULL DEFAULT 0,
    "orders" INTEGER NOT NULL DEFAULT 0,
    "completed" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProviderReferralLinkDaily_pkey" PRIMARY KEY ("linkId", "date"),
    CONSTRAINT "ProviderReferralLinkDaily_nonneg_chk" CHECK ("visits" >= 0 AND "orders" >= 0 AND "completed" >= 0)
);
CREATE INDEX "ProviderReferralLinkDaily_orgId_date_idx" ON "ProviderReferralLinkDaily"("orgId", "date");
ALTER TABLE "ProviderReferralLinkDaily" ADD CONSTRAINT "ProviderReferralLinkDaily_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "ProviderReferralLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
