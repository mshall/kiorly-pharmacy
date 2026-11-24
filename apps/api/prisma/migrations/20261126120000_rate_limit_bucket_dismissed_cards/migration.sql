-- Shared (cross-instance) rate-limit counters for the sign-in throttles.
CREATE TABLE "RateLimitBucket" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key","windowStart")
);
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");

-- Per-user dismissed home cards (Kiorex front door card), stored server-side instead of the browser.
ALTER TABLE "StaffUser" ADD COLUMN "dismissedCards" JSONB NOT NULL DEFAULT '[]';
