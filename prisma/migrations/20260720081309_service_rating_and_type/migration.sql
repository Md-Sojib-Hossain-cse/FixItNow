-- CreateEnum
CREATE TYPE "ServiceTypes" AS ENUM ('ONLINE', 'OFFLINE');

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "rating" DECIMAL(2,1) DEFAULT 0.0,
ADD COLUMN     "type" "ServiceTypes" DEFAULT 'OFFLINE';
