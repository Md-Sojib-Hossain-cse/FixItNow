import type { UsersWhereInput } from "../../../generated/prisma/models";
import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import type { TUpdateUserStatus, TUserQuery } from "./admin.interface";
import httpStatus from "http-status"

const getAllUsersFromDB = async (query : TUserQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const skip = (page -1) * limit
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const isDeleted = query.isDeleted === "true" ? true : false;


    const andConditions : UsersWhereInput[] = []
    const orConditions : UsersWhereInput[] =[]

    const userSearchableFields = ["name" , "email", "phone", "address"]

    andConditions.push({
        isDeleted: isDeleted
    });
    if(query.status){
        andConditions.push({status : query.status})
    }
    if(query.role){
        andConditions.push({role : query.role})
    }
    if(query.searchTerm){
        userSearchableFields.forEach((field : string) => {
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
        prisma.users.findMany({
            where: {
                AND: andConditions,
            },
            take: limit,
            skip,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include : {
                technicianProfile : true
            },
            omit: {
                password: true,
            },
        }),

        prisma.users.count({
            where: {
                AND: andConditions,
            },
        }),
    ]);
    
    return {
    meta: {
        page,
        limit,
        total
    },
    data: result
};
}

const updateUserStatusOnDB = async (adminId : string, payload : TUpdateUserStatus , userId : string) => {
    const user = await prisma.users.findUnique({
        where : {
            id : adminId
        }
    })

    if(!user || user.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND , "User does not exists or maybe deleted ,please contact to our support!")
    }

    if(user.status === "BANNED"){
        throw new AppError(httpStatus.UNAUTHORIZED , "User has been banned , please contact to out support!")
    }

    if(user.role !== "ADMIN"){
        throw new AppError(httpStatus.UNAUTHORIZED , "You do not have permission to change user status!")
    }

    const result = await prisma.users.update({
        where : {
            id : userId
        },
        data : {
            status : payload.status
        },
        include : {
            technicianProfile : true
        },
        omit : {
            password : true
        }
    })

    return result
}


export const adminService = {
    getAllUsersFromDB,
    updateUserStatusOnDB
}