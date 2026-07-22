import AppError from "../../errors/appError";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import type { TCreateAvailability } from "./availability.interface";

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

export const availabilityService = {
    createAvailabilityOnDB
}