export type TCreateReview = {
    bookingId : string;
    rating : number;
    comment : string;
}

export type TReviewQuery = {
    rating ?: number;
    searchTerm ?: string;
    page ?: number;
    limit ?: number;
    sortBy ?: "rating" | "createdAt";
    sortOrder ?: "asc" | "desc";
}

export type TUpdateReview = {
    rating ?: number;
    comment ?: string;
}