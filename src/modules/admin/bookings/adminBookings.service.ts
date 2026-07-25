import httpStatus  from 'http-status';
import type { BookingsWhereInput } from "../../../../generated/prisma/models";
import AppError from "../../../errors/appError";
import { prisma } from "../../../lib/prisma";
import type { TBookingQuery } from "../../booking/booking.interface";
import type { TAdminUpdateBooking } from "./adminBookings.interface";

const getAllBookingsFromDB = async (query : TBookingQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const skip = (page -1) * limit
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder || "desc";
    const minPrice = query.minPrice || 0;
        
        
    const andConditions : BookingsWhereInput[] = []
    const orConditions : BookingsWhereInput[] =[]
        
    const bookingSearchableFields = [ "address", "note"]
    
    if(query.status){
        andConditions.push({status : query.status})
    }
    
    if(query.maxPrice){
        andConditions.push({totalPrice : {
            lte : Number(query.maxPrice),
            gte : Number(minPrice)
        }})
    }else {
        andConditions.push({totalPrice : {
            gte : Number(minPrice)
        }})
    }
    
    if(query.startAfter){
        andConditions.push({availability : {
            startTime : {
                gt : new Date(query.startAfter)
            }
        }})
    }

    if(query.endBefore){
        andConditions.push({availability : {
            endTime : {
                lt : new Date(query.endBefore)
            }
        }})
    }

    
        if(query.searchTerm){
            bookingSearchableFields.forEach((field : string) => {
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
        prisma.bookings.findMany({
            where: {
                AND: andConditions,
            },
            include: {
                availability : true,
                payment : true,
                service : true
            },
            orderBy: {
                [sortBy]: sortOrder,
            },
            skip,
            take: limit,
        }),
        prisma.bookings.count({
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

const updateBookingOnDB = async (bookingId : string , payload : TAdminUpdateBooking) => {
    const booking = await prisma.bookings.update({
        where : {
            id : bookingId
        },
        data : payload
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking you're trying to update , not exists!")
    }

    return booking;
}


const deleteBookingFromDB = async (bookingId : string) => {
    const booking = await prisma.bookings.update({
        where : {
            id : bookingId
        },
        data : {
            isDeleted : true
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking you're trying to delete , not exists!")
    }

    return booking;
}



export const adminBookingService = {
    getAllBookingsFromDB,
    updateBookingOnDB,
    deleteBookingFromDB
}