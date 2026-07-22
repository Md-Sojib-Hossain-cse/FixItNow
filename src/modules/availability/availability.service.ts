import AppError from "../../errors/appError";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import type { TCreateAvailability, TUpdateAvailability } from "./availability.interface";

const createAvailabilityOnDB = async (userId : string, payload : TCreateAvailability)=> {
    const technician = await prisma.technicianProfiles.findUnique({
        where : {
            userId
        }
    })

    if(!technician){
        throw new AppError(httpStatus.NOT_FOUND , "Technician not found!")
    }

    if(technician.id !== payload.technicianProfileId){
        throw new AppError(httpStatus.UNAUTHORIZED , "Technician only can create his own availability!")
    }

    if (payload.startTime >= payload.endTime) {
    throw new AppError(httpStatus.BAD_REQUEST,"Start time must be earlier than end time.");
    }

    const availability = await prisma.availability.findFirst({
        where : {
            technicianProfileId : payload.technicianProfileId,
            day : payload.day,
            endTime : {
                gt : payload.startTime
            },
            startTime : {
                lt : payload.endTime
            }
        }
    })

    if(availability){
        throw new AppError(httpStatus.CONFLICT , "Availability slot is already listed!")
    }

    const result = await prisma.availability.create({
        data : payload
    })

    return result
}

const updateAvailabilityOnDB = async (userId : string , availabilityId : string , payload : TUpdateAvailability) => {
    const technician = await prisma.technicianProfiles.findUnique({
        where : {
            userId
        }
    })

    if(!technician){
        throw new AppError(httpStatus.UNAUTHORIZED , "Only technician can update availability slots!")
    }

    const availability = await prisma.availability.findUnique({
        where : {
            id : availabilityId
        }
    })

    if(!availability){
        throw new AppError(httpStatus.NOT_FOUND , "Availability slot you're trying to update not exists!")
    }

    if(technician.id !== availability.technicianProfileId){
        throw new AppError(httpStatus.UNAUTHORIZED , "Technician can only update his own availability slots!")
    }

    const startTime = payload.startTime ?? availability.startTime;
    const endTime = payload.endTime ?? availability.endTime;

    if (startTime >= endTime) {
        throw new AppError(httpStatus.BAD_REQUEST,"Start time must be earlier than end time.");
    }



    const isTimeOverlapped = await prisma.availability.findFirst({
        where : {
            technicianProfileId : technician.id,
            id : {
                not : availabilityId
            },
            day : payload.day ?? availability.day,
            endTime : {
                gt : payload.startTime ?? availability.startTime
            },
            startTime : {
                lt : payload.endTime ?? availability.endTime
            }
        }
    })

    if(isTimeOverlapped){
        throw new AppError(httpStatus.CONFLICT , "Availability slot overlapping with another slot!")
    }

    const result = await prisma.availability.update({
        where : {
            id : availabilityId
        },
        data : payload
    })

    return result;
}

export const availabilityService = {
    createAvailabilityOnDB,
    updateAvailabilityOnDB
}