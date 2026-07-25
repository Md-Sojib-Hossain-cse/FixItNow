import type { BookingStatus } from "../../../../generated/prisma/enums";

export type TAdminUpdateBooking = {
  status?: BookingStatus;
  address?: string;
  note?: string;
  isDeleted?: boolean;
};