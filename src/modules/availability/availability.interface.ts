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