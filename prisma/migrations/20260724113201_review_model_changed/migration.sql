/*
  Warnings:

  - You are about to drop the column `customerId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `technicianProfileId` on the `reviews` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_customerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_technicianProfileId_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "customerId",
DROP COLUMN "technicianProfileId";
