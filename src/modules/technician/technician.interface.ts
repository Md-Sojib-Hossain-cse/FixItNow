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