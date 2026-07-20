/*
  Warnings:

  - You are about to alter the column `price` on the `services` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(8,2)`.

*/
-- AlterTable
ALTER TABLE "services" ALTER COLUMN "price" SET DATA TYPE DECIMAL(8,2);
