-- 1.8.0 OUT_FOR_DELIVERY: DELIVERY orders have a distinct state between READY and DISPENSED (additive).
ALTER TYPE "KiorexOrderStatus" ADD VALUE IF NOT EXISTS 'OUT_FOR_DELIVERY' AFTER 'READY';
ALTER TABLE "KiorexOrder" ADD COLUMN "outForDeliveryAt" TIMESTAMP(3);
