export type TCreateAvailability = {
    technicianProfileId : string;
    day : Date;
    startTime : Date;
    endTime : Date;
}

export type TUpdateAvailability = {
    day ?: Date;
    startTime ?: Date;
    endTime ?: Date;
}

export type TAvailabilityQuery = {
    day ?: Date;
    searchTerm ?: string;
    limit ?: number;
    page ?:number;
    sortBy ?: "day" | "startTime" | "endTime" | "createdAt";
    sortOrder ?: "asc" | "desc";
}