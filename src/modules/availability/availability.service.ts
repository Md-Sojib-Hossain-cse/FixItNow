import AppError from "../../errors/appError";
import httpStatus from "http-status"
import { prisma } from "../../lib/prisma";
import type { TAvailabilityQuery, TCreateAvailability, TUpdateAvailability } from "./availability.interface";
import type { AvailabilityWhereInput } from "../../../generated/prisma/models";

const createAvailabilityOnDB = async (userId : string, payload : TCreateAvailability)=> {
    const day = payload.day;
    const startTime = payload.startTime;
    const endTime = payload.endTime;

    const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

    if (
    !isSameDay(day, startTime) ||
    !isSameDay(day, endTime)
    ) {
        throw new AppError(httpStatus.BAD_REQUEST,"Day, start time, and end time must belong to the same date.");
    }

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

    const day = new Date(payload.day ?? availability.day);
    const startTime = new Date(payload.startTime ?? availability.startTime);
    const endTime = new Date(payload.endTime ?? availability.endTime);

    if (startTime >= endTime) {
        throw new AppError(httpStatus.BAD_REQUEST,"Start time must be earlier than end time.");
    }


    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    if (
        !isSameDay(day, startTime) ||
        !isSameDay(day, endTime)
    ) {
        throw new AppError(httpStatus.BAD_REQUEST,"Day, start time and end time must belong to the same date.");
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
            },
            isDeleted : false
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

const deleteAvailabilityFromDB = async (userId : string , availabilityId : string) => {
    const technician = await prisma.technicianProfiles.findUnique({
        where : {
            userId
        }
    })

    if(!technician){
        throw new AppError(httpStatus.NOT_FOUND , "Technician not found!")
    }

    const availability = await prisma.availability.findUnique({
        where : {
            id : availabilityId,
            isDeleted : false
        }
    })

    if(!availability){
        throw new AppError(httpStatus.NOT_FOUND , "Availability slot not found!")
    }

    if(technician.id !== availability.technicianProfileId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only delete your own availability!")
    }

    const result = await prisma.availability.update({
        where : {
            id : availabilityId
        },
        data : {
            isDeleted : true
        }
    })

    return result;

}


const getAllAvailabilityFromDB = async (query : TAvailabilityQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const skip = (page -1) * limit
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
        
        
    const andConditions : AvailabilityWhereInput[] = []
    const orConditions : AvailabilityWhereInput[] =[]
        
    const availabilitySearchableFields = ["day" , "startTime", "endTime"]
        
    andConditions.push({
        isDeleted: false
    });
    
    if(query.searchTerm){
        availabilitySearchableFields.forEach((field : string) => {
            orConditions.push({
                [field] : {
                            contains : query.searchTerm,
                            mode : "insensitive"
                        }
            })
        })
    
    andConditions.push({
            OR : orConditions
        })
    }

    if (query.day) {
        const startOfDay = new Date(query.day);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(query.day);
        endOfDay.setHours(23, 59, 59, 999);

        andConditions.push({
            day: {
                gte: startOfDay,
                lte: endOfDay,
            },
        });
    }

    if(query.startTime){
        andConditions.push({
            startTime : {
                gte : new Date(query.startTime)
            }
        })
    }

    if(query.endTime){
        andConditions.push({
            endTime: {
                lte: new Date(query.endTime),
            },
        });
    }
    
    const [result , total] =await Promise.all([
        prisma.availability.findMany({
            where : {
                AND : andConditions
            },
            skip,
            take : limit,
            orderBy: {
                [sortBy]: sortOrder,
            }
        }),
        prisma.availability.count({
            where: {
                AND: andConditions,
            }
        })
        ])
    
        return {
        meta: {
            page,
            limit,
            total
        },
        data: result
        };
}



export const availabilityService = {
    createAvailabilityOnDB,
    updateAvailabilityOnDB,
    deleteAvailabilityFromDB,
    getAllAvailabilityFromDB
}