import type { PaymentProvider, PaymentStatus } from "../../../generated/prisma/enums";

export type TCreatePaymentPayload = {
    bookingId : string;
    transactionId : string;
    amount : number;
    provider : PaymentProvider;
    status : PaymentStatus;
    meta : any;
}

export type TUpdatePaymentPayload = {
    transactionId : string;
    status : PaymentStatus;
    provider : PaymentProvider;
    meta : any;
}


export type TPaymentQuery = {
    minAmount ?: number;
    maxAmount ?: number;
    provider ?: PaymentProvider;
    status ?: PaymentStatus;
    paidBefore ?: Date;
    paidAfter ?: Date;
    searchTerm ?: string;
    page ?: number;
    limit ?: number;
    sortBy ?: "paidAt" | "amount" | "createdAt";
    sortOrder ?: "asc" | "desc";
}