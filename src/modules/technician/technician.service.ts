import { prisma } from "../../lib/prisma";
import type { TUpdateAvailabilityStatus, TUpdateTechnicianProfile } from "./technician.interface";

const updateOwnTechnicianProfileOnDB = async (userId : string , payload : TUpdateTechnicianProfile) => {
    const result = await prisma.technicianProfiles.update({
        where : {
            userId
        },
        data : payload,
        include : {
            availability : true,
            reviews : true,
            services : true,
            user : true
        }
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
        },
        include : {
            availability : true,
            reviews : true,
            services : true,
        }
    })

    return result;
}


export const technicianProfileService = {
    updateOwnTechnicianProfileOnDB,
    updateAvailableStatusOnDB
}