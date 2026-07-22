import type { Roles } from "../../../generated/prisma/enums";
import type { ServicesWhereInput } from "../../../generated/prisma/models";
import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import type { TCreateService, TServiceQuery, TUpdateService } from "./service.interface";
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
        data : {
            ...payload
        },
        include : {
            bookings : true,
            category : true,
            technicianProfile : true
        }
    })

    return result
}

const updateServiceOnDB = async (userId : string , serviceId : string, payload : TUpdateService) => {
    const {categoryId , ...rest} = payload
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
        data : {
            ...rest,
            ...(categoryId && {
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
        }),
        },
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

const getAllServiceFromDB = async (query :TServiceQuery) => {
    const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;
        const skip = (page -1) * limit
        const sortBy = query.sortBy || "createdAt";
        const sortOrder = query.sortOrder || "desc";
        const minPrice = query.minPrice || 0;
    
    
        const andConditions : ServicesWhereInput[] = []
        const orConditions : ServicesWhereInput[] =[]
    
        const serviceSearchableFields = [ "title", "description"]

    if(query.category){
        andConditions.push({
            category : {
                name : query.category,
            }
        })
    }

    if(query.type){
        andConditions.push({type : query.type})
    }

    if(query.rating){
        andConditions.push({rating : {
            gte : query.rating
        }})
    }

    if(query.maxPrice){
        andConditions.push({
            price: {
                gte : Number(minPrice),
                lte : Number(query.maxPrice)
            }
        })
    }else {
        andConditions.push({
            price: {
                gte : Number(minPrice)
            }
        })
    }

    if(query.searchTerm){
        serviceSearchableFields.forEach((field : string) => {
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
    
    andConditions.push({
        isDeleted: false
    });


        const [result, total] = await Promise.all([
    prisma.services.findMany({
        where: {
            AND: andConditions,
        },
        include: {
            category: true,
            technicianProfile: true,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        skip,
        take: limit,
    }),
    prisma.services.count({
        where: {
            AND: andConditions,
        },
    }),
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

const deleteServiceFromDB = async (serviceId : string , userId : string , role : Roles) => {

        const service = await prisma.services.findUnique({
            where : {
                id : serviceId,
                isDeleted : false
            }
        })

        if(!service){
            throw new AppError(httpStatus.NOT_FOUND , "Service not exists!")
        }

        const technician = await prisma.technicianProfiles.findUnique({
            where : {
                userId
            }
        })

        if (role !== "ADMIN" && (!technician || technician.id !== service.technicianProfileId)) {
            throw new AppError(httpStatus.UNAUTHORIZED,"Admin or technician can only delete their own service!");
        }

        const result = await prisma.services.update({
            where : {
                id : serviceId
            },
            data : {
                isDeleted : true
            }
        })

        return result
}


export const servicesService = {
    createServiceInDB,
    updateServiceOnDB,
    getAllServiceFromDB,
    deleteServiceFromDB
}