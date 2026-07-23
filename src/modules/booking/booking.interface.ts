import type { BookingStatus } from "../../../generated/prisma/enums";

export type TCreateBooking = {
    customerId : string;
    serviceId : string;
    availabilityId : string;
    address : string;
    note ?: string;
}

export type TBookingQuery = {
    minPrice ?: string;
    maxPrice ?: string;
    startAfter ?: Date;
    endBefore ?: Date;
    status ?: BookingStatus;
    searchTerm ?: string;
    limit ?: number;
    page ?:number;
    sortBy ?: "totalPrice" | "createdAt";
    sortOrder ?: "asc" | "desc";
}