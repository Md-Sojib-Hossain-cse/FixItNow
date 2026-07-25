import { BookingStatus, Roles } from "../../../generated/prisma/enums"
import type { ReviewsWhereInput } from "../../../generated/prisma/models"
import AppError from "../../errors/appError"
import { prisma } from "../../lib/prisma"
import type { TCreateReview, TReviewQuery, TUpdateReview } from "./review.interface"
import httpStatus from "http-status"

const createReviewOnDB = async (userId : string, payload : TCreateReview) => {
    if(!payload.bookingId || !payload.comment || !payload.rating){
        throw new AppError(httpStatus.BAD_REQUEST, "Please provide bookingId and comment text and a rating.")
    }

    const booking = await prisma.bookings.findFirst({
        where : {
            id : payload.bookingId,
            customerId : userId,
            status : BookingStatus.COMPLETED,
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND, "You can only provide review for your own booking that are completed.")
    }

    const result = await prisma.reviews.create({
        data : payload,
        include : {
            booking : true
        }
    })

    return result;
}

const getMyReviewsFromDB = async (userId : string , query : TReviewQuery) => {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 5;
        const skip = (page -1) * limit
        const sortBy = query.sortBy || "createdAt";
        const sortOrder = query.sortOrder || "desc";
        
        
        const andConditions : ReviewsWhereInput[] = []
        const orConditions : ReviewsWhereInput[] =[]
        
        const serviceSearchableFields = [ "comment"]
    
        if(query.rating){
            andConditions.push({
                rating : {
                    gte : Number(query.rating)
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
    
    
        const [result, total] = await Promise.all([
        prisma.reviews.findMany({
            where: {
                AND: andConditions,
            },
            include: {
                booking : true
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.reviews.count({
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

const getSingleReviewsFromDB = async (reviewId : string) => {
    const result = await prisma.reviews.findUnique({
        where : {
            id : reviewId
        },
        include : {
            booking : true
        }
    })

    if(!result){
        throw new AppError(httpStatus.NOT_FOUND , "Review not found!")
    }
    
    return result;
}

const updateReviewOnDB = async (userId : string , reviewId : string , payload : TUpdateReview) => {
    if(!payload.comment && !payload.rating){
        throw new AppError(httpStatus.BAD_REQUEST , "Provide payload to update review!")
    }

    const review = await prisma.reviews.findUnique({
        where : {
            id : reviewId
        },
        include : {
            booking :{
                select : {
                    customerId : true
                }
            }
        }
    })

    if(!review){
        throw new AppError(httpStatus.NOT_FOUND , "Review not found!")
    }

    if(review.booking.customerId !== userId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only update your own review!")
    }

    const result = await prisma.reviews.update({
        where : {
            id : reviewId
        },
        data : payload,
        include : {
            booking : true
        }
    })

    return result;
}

const deleteReviewFromDB = async(reviewId : string , user : {id : string , role : Roles}) => {
    const review = await prisma.reviews.findUnique({
        where : {
            id : reviewId
        },
        include : {
            booking :{
                select : {
                    customerId : true
                }
            }
        }
    })

    if(!review){
        throw new AppError(httpStatus.NOT_FOUND , "Review not found!")
    }

    if(review.booking.customerId !== user.id || user.role === Roles.ADMIN){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only delete your own review or admins can delete review!")
    }

    const result = await prisma.reviews.delete({
        where : {
            id : reviewId
        }
    })

    return result;
}

export const reviewService = {
    createReviewOnDB,
    getMyReviewsFromDB,
    getSingleReviewsFromDB,
    updateReviewOnDB,
    deleteReviewFromDB
}