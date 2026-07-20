import type { CategoriesWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../../lib/prisma";
import type { TCategoryQuery, TCreateCategory } from "./adminCategories.interface";

const createCategoryIntoDB = async (payload : TCreateCategory) => {
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
    deleteCategoryFromDB
}