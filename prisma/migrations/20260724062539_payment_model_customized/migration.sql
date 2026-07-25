/*
  Warnings:

  - You are about to drop the column `method` on the `payments` table. All the data in the column will be lost.
  - Added the required column `meta` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "method",
ADD COLUMN     "meta" JSONB NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(8,1);
