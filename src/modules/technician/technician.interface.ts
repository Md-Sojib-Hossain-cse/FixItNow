export type TUpdateTechnicianProfile = {
    bio ?: string;
    skills ?: string[];
    experienceYears ?: number;
    hourlyRate ?: number;
    location ?: string;
    isAvailable ?: boolean;
}

export type TUpdateAvailabilityStatus = {
    isAvailable : boolean
}


export type TTechnicianQuery = {
    skills ?: string | string[];
    experienceYears ?: number;
    minHourlyRate ?: number;
    maxHourlyRate ?: number;
    averageRating ?: number;
    searchTerm ?: string;
    limit ?: number;
    page ?:number;
    sortBy ?: "hourlyRate" | "averageRating" | "createdAt";
    sortOrder ?: "asc" | "desc";
}