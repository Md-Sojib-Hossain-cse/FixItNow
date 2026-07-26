import type { TechnicianProfilesWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { TTechnicianQuery, TUpdateAvailabilityStatus, TUpdateTechnicianProfile } from "./technician.interface";

const updateOwnTechnicianProfileOnDB = async (userId : string , payload : TUpdateTechnicianProfile) => {
    const result = await prisma.technicianProfiles.update({
        where : {
            userId
        },
        data : payload,
        include : {
            availability : true,
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
            services : true
        }
    })

    return result;
}

const getAllTechnicianFromDB = async (query : TTechnicianQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const skip = (page -1) * limit
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const minHourlyRate = query.minHourlyRate || 0;
    const skills = query.skills ? Array.isArray(query.skills) ? query.skills :[query.skills] : []
        
    const andConditions : TechnicianProfilesWhereInput[] = []
    const orConditions : TechnicianProfilesWhereInput[] =[]
        
    const technicianSearchableFields = [ "bio", "location"];

    if(skills.length){
        andConditions.push({skills : {
            hasSome : skills
        }})
    }
    
    if(query.experienceYears){
        andConditions.push({experienceYears : {
            gte : Number(query.experienceYears)
        }})
    }

    if(query.averageRating){
        andConditions.push({averageRating : {
            gte : Number(query.averageRating)
        }})
    }
    
    if(query.maxHourlyRate){
        andConditions.push({
            hourlyRate: {
                gte : Number(minHourlyRate),
                lte : Number(query.maxHourlyRate)
            }
        })
    }else {
        andConditions.push({
            hourlyRate: {
                gte : Number(minHourlyRate)
            }
        })
    }
    
    if(query.searchTerm){
        technicianSearchableFields.forEach((field : string) => {
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
    
    
    const [result, total] = await Promise.all([
        prisma.technicianProfiles.findMany({
            where: {
                AND: andConditions,
            },
            include: {
                availability : true,
                services : true,
                user : {
                    select : {
                        name : true,
                        avatar : true,
                        address : true,
                        email : true,
                        phone : true,
                        status : true
                    }
                }
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.technicianProfiles.count({
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

const getTechnicianProfileWithReviewsFromDB = async (id : string) => {
    const technicianProfile = await prisma.technicianProfiles.findUnique({
        where : {
            id
        }
    })

    const reviews = await prisma.reviews.findMany({
        where : {
            booking : {
                 service : {
                    technicianProfileId : id,
                 },
            }
        },
        orderBy : {
            createdAt : "desc"
        }
    })

    const technicianWithReviews = {
        ...technicianProfile,
        reviews : reviews
    }

    return technicianWithReviews;
}


export const technicianProfileService = {
    updateOwnTechnicianProfileOnDB,
    updateAvailableStatusOnDB,
    getAllTechnicianFromDB,
    getTechnicianProfileWithReviewsFromDB
}