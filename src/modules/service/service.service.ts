import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import type { TCreateService, TUpdateService } from "./service.interface";
import httpStatus from "http-status"

const createServiceInDB = async (userId : string  ,  payload : TCreateService) => {
    const technicianProfile = await prisma.technicianProfiles.findUnique({
        where : {
            userId
        }
    })

    if(!technicianProfile){
        throw new AppError(httpStatus.NOT_FOUND , "Technician not exists!")
    }

    if(technicianProfile.id !== payload.technicianProfileId){
        throw new AppError(httpStatus.UNAUTHORIZED , "Technician can only create his own service!")
    }

    const category = await prisma.categories.findUnique({
        where : {
            id : payload.categoryId
        }
    })

    if(!category){
        throw new AppError(httpStatus.NOT_FOUND , "Category does not exists!")
    }

    const result = await prisma.services.create({
        data : payload,
        include : {
            bookings : true,
            category : true,
            technicianProfile : true
        }
    })

    return result
}

const updateServiceOnDB = async (userId : string , serviceId : string, payload : TUpdateService) => {
    const technician = await prisma.technicianProfiles.findUnique({
        where : {
            userId
        }
    })

    const service = await prisma.services.findUnique({
        where  : {
            id : serviceId
        }
    })

    if(!service){
        throw new AppError(httpStatus.NOT_FOUND , "Service you try to update not exists!")
    }

    if(service.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND , "Service you try to update already deleted!")
    }

    if(technician?.id !== service.technicianProfileId){
        throw  new AppError(httpStatus.UNAUTHORIZED , "You can only update your own service!")
    }

    const result = await prisma.services.update({
        where : {
            id : serviceId
        },
        data : payload,
        include : {
            bookings : true,
            technicianProfile : true,
            category : {
                select : {
                    id : true,
                    name : true
                }
            }
        }
    })

    return result;

}


export const servicesService = {
    createServiceInDB,
    updateServiceOnDB
}