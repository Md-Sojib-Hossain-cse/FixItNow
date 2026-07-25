import type { CategoriesWhereInput } from "../../../../generated/prisma/models";
import AppError from "../../../errors/appError";
import { prisma } from "../../../lib/prisma";
import type { TCategoryQuery, TCreateCategory, TUpdateCategory } from "./adminCategories.interface";
import httpStatus from "http-status"

const createCategoryIntoDB = async (payload : TCreateCategory) => {

    if(!payload.name){
        throw new AppError(httpStatus.BAD_REQUEST , "Please provide all required field!")
    }

    if(!payload.slug){
        payload.slug = payload.name.split(" ").join("_")
    }

    const result = await prisma.categories.create({
        data : payload
    })

    return result;
}

const getAllCategoriesFromDB = async (query : TCategoryQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const skip = (page -1) * limit
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const isDeleted = query.isDeleted === "true" ? true : false;
    
    
    const andConditions : CategoriesWhereInput[] = []
    const orConditions : CategoriesWhereInput[] =[]
    
    const categorySearchableFields = ["name" , "slug", "description"]
    
    andConditions.push({
        isDeleted: isDeleted
    });

    if(query.searchTerm){
        categorySearchableFields.forEach((field : string) => {
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

    const [result , total] =await Promise.all([
        prisma.categories.findMany({
            where : {
                AND : andConditions
            },
            skip,
            take : limit,
            orderBy: {
                [sortBy]: sortOrder,
            }
        }),
        prisma.categories.count({
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

const updateCategoryOnDB = async(categoryId : string , payload : TUpdateCategory) => {
    let slug : string;
    const organizedPayload = {...payload}

    if(payload.name){
        slug = payload.name.split(" ").join("_")

        organizedPayload.slug = slug
    }

    const result = await prisma.categories.update({
        where : {
            id : categoryId
        },
        data : {
            ...organizedPayload
        }
    })

    return result;
}


const deleteCategoryFromDB = async(categoryId : string) => {
    const result = await prisma.categories.update({
        where : {
            id : categoryId
        }, 
        data : {
            isDeleted : true
        }
    })

    return result;
}

export const adminCategoryService = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    deleteCategoryFromDB,
    updateCategoryOnDB
}