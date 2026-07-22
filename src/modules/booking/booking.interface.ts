export type TCreateBooking = {
    customerId : string;
    serviceId : string;
    availabilityId : string;
    address : string;
    note ?: string;
}