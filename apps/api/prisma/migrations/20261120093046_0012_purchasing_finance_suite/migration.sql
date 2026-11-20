-- AlterTable
ALTER TABLE "GoodsReceiptLine" ADD COLUMN     "poUnitCost" DECIMAL(14,2),
ADD COLUMN     "prevUnitCost" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "InsurerClaim" ADD COLUMN     "approvedAmount" DECIMAL(14,2),
ADD COLUMN     "dueAt" TIMESTAMP(3),
ADD COLUMN     "paidAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "submissionRef" TEXT;

-- CreateTable
CREATE TABLE "RequestForQuote" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "dueAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "awardedAt" TIMESTAMP(3),

    CONSTRAINT "RequestForQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqLine" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "RfqLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqQuote" (
    "id" TEXT NOT NULL,
    "rfqId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'INVITED',
    "leadTimeDays" INTEGER,
    "validUntil" TIMESTAMP(3),
    "notes" TEXT,
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RfqQuote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqQuoteLine" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "rfqLineId" TEXT NOT NULL,
    "unitPrice" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "RfqQuoteLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "vatAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "method" TEXT NOT NULL DEFAULT 'CASH',
    "description" TEXT NOT NULL,
    "supplierId" TEXT,
    "expenseDate" DATE NOT NULL,
    "receiptRef" TEXT,
    "fromDrawer" BOOLEAN NOT NULL DEFAULT false,
    "cashMovementId" TEXT,
    "createdBy" TEXT NOT NULL,
    "voidedAt" TIMESTAMP(3),
    "voidedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimPayment" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reference" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "ClaimPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestForQuote_orgId_status_idx" ON "RequestForQuote"("orgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "RequestForQuote_orgId_number_key" ON "RequestForQuote"("orgId", "number");

-- CreateIndex
CREATE INDEX "RfqLine_rfqId_idx" ON "RfqLine"("rfqId");

-- CreateIndex
CREATE INDEX "RfqQuote_rfqId_idx" ON "RfqQuote"("rfqId");

-- CreateIndex
CREATE UNIQUE INDEX "RfqQuote_rfqId_supplierId_key" ON "RfqQuote"("rfqId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "RfqQuoteLine_quoteId_rfqLineId_key" ON "RfqQuoteLine"("quoteId", "rfqLineId");

-- CreateIndex
CREATE INDEX "Expense_orgId_branchId_expenseDate_idx" ON "Expense"("orgId", "branchId", "expenseDate");

-- CreateIndex
CREATE INDEX "Expense_orgId_category_idx" ON "Expense"("orgId", "category");

-- CreateIndex
CREATE INDEX "ClaimPayment_orgId_claimId_idx" ON "ClaimPayment"("orgId", "claimId");

-- AddForeignKey
ALTER TABLE "RfqLine" ADD CONSTRAINT "RfqLine_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RequestForQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqQuote" ADD CONSTRAINT "RfqQuote_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RequestForQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RfqQuoteLine" ADD CONSTRAINT "RfqQuoteLine_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "RfqQuote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

