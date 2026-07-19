import { prisma } from "../../lib/prisma";
import type { TUpdateAvailabilityStatus, TUpdateTechnicianProfile } from "./technicianProfile.interface";

const updateOwnTechnicianProfileOnDB = async (userId : string , payload : TUpdateTechnicianProfile) => {
    const result = await prisma.technicianProfiles.update({
        where : {
            userId
        },
        data : payload
    })

    return result;
}

const updateAvailableStatusOnDB = async(userId : string , payload : TUpdateAvailabilityStatus) => {
    const result = await prisma.technicianProfiles.update({
        where : {
            userId
        },
        data : {
            isAvailable : payload.isAvailable
        }
    })

    return result;
}


export const technicianProfileService = {
    updateOwnTechnicianProfileOnDB,
    updateAvailableStatusOnDB
}