-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "totalPrice" DROP NOT NULL,
ALTER COLUMN "totalPrice" SET DEFAULT 0;
