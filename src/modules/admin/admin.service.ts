import type { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { TUserQuery } from "./admin.interface";

const getAllUsersFromDB = async (query : TUserQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const skip = (page -1) * limit
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const isDeleted = query.isDeleted === "true" ? true : false;


    const andConditions : UserWhereInput[] = []
    const orConditions : UserWhereInput[] =[]

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
        prisma.user.findMany({
            where: {
                AND: andConditions,
            },
            take: limit,
            skip,
            orderBy: {
                [sortBy]: sortOrder,
            },
            omit: {
                password: true,
            },
        }),

        prisma.user.count({
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


export const adminService = {
    getAllUsersFromDB
}