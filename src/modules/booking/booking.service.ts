import { BookingStatus } from "../../../generated/prisma/enums";
import type { BookingsWhereInput } from "../../../generated/prisma/models";
import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import type { TBookingQuery, TCreateBooking } from "./booking.interface";
import httpStatus from "http-status"

const createBookingOnDB = async (userId : string , payload : TCreateBooking) => {
    const {customerId , availabilityId , serviceId , address , note} = payload;

    if(!customerId || !availabilityId || !serviceId || !address){
        throw new AppError(httpStatus.BAD_REQUEST , "Please provide all required field!")
    }

    if(userId !== customerId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only book services for your own!")
    }

    const service = await prisma.services.findFirst({
        where : {
            id : serviceId,
            isDeleted : false,
            isActive : true
        }
    })

    if(!service){
        throw new AppError(httpStatus.NOT_FOUND , "Service you're trying to book , isn't available at this moment!")
    }

    const availability = await prisma.availability.findUnique({
        where : {
            id : availabilityId,
            isBooked : false,
            isDeleted : false,
            technicianProfileId : service.technicianProfileId,
        }
    })

    if(!availability){
        throw new AppError(httpStatus.NOT_FOUND , "Service isn't available at your providing time slot ,Please choose a different availability slot.")
    }

    const result = await prisma.bookings.create({
        data : {
            customerId , 
            availabilityId , 
            serviceId , 
            address,
            note : note ?? "",
            totalPrice : service.price,
            status : BookingStatus.REQUESTED
        },
        include : {
            availability : true,
            customer : {
                omit : {
                    password : true
                }
            },
            service : true,
        }
    })

    return result;
}

const cancelBookingOnDB = async (userId : string , bookingId : string) => {
    const booking = await prisma.bookings.findUnique({
        where : {
            id : bookingId,
            isDeleted : false
        },
        select : {
            customerId : true,
            status : true
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking you're trying to update not exists!")
    }

    if(userId !== booking.customerId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only cancel you're own booking.")
    }

    if(booking.status !== BookingStatus.REQUESTED){
        throw new AppError(httpStatus.FORBIDDEN , "After accepted, declined or cancelled you can't change your booking status!")
    }

    const result = await prisma.bookings.update({
        where : {
            id : bookingId
        },
        data : {
            status : BookingStatus.CANCELLED
        },
        include : {
            service : true,
            availability : true
        }
    })

    return result;
}

const declineBookingOnDB = async(userId : string , bookingId : string) => {
    const booking = await prisma.bookings.findUnique({
        where : {
            id : bookingId,
            isDeleted : false,
        },
        select: {
            service : {
                select : {
                    technicianProfile : {
                        select : {
                            userId : true
                        }
                    }
                }
            },
            status : true,
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking not Exists!")
    }

    if(userId !== booking.service.technicianProfile.userId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only declined your own service bookings.")
    }

    if(booking.status !== BookingStatus.REQUESTED){
        throw new AppError(httpStatus.FORBIDDEN, "After being accepted , declined or cancelled you can't declined any booking!")
    }

    const result = await prisma.bookings.update({
        where : {
            id : bookingId
        },
        data : {
            status : BookingStatus.DECLINED
        }
    })

    return result;
}

const acceptBookingOnDB = async(userId : string , bookingId : string) => {
    const booking = await prisma.bookings.findUnique({
        where : {
            id : bookingId,
            isDeleted : false,
        },
        select: {
            service : {
                select : {
                    technicianProfile : {
                        select : {
                            userId : true,
                            isAvailable : true
                        }
                    }
                }
            },
            status : true,
            availability : {
                select : {
                    isBooked : true,
                    isDeleted : true,
                    id : true
                }
            }
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking not Exists!")
    }

    if(userId !== booking.service.technicianProfile.userId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only declined your own service bookings.")
    }

    if(booking.status !== BookingStatus.REQUESTED){
        throw new AppError(httpStatus.FORBIDDEN, "Booking can be accepted only if its status is requested!")
    }

    if(booking.availability.isBooked || booking.availability.isDeleted){
        throw new AppError(httpStatus.CONFLICT , "Availability slot is either booked or deleted!")
    }

    const result = await prisma.$transaction(async (tx) => {
    const acceptedBooking = await tx.bookings.update({
        where: {
            id: bookingId,
        },
        data: {
            status: BookingStatus.ACCEPTED,
            availability: {
                update: {
                    isBooked: true,
                },
            },
        },
    });

    await tx.bookings.updateMany({
        where: {
            availabilityId: booking.availability.id,
            status: BookingStatus.REQUESTED,
            NOT: {
                id: bookingId,
            },
        },
        data: {
            status: BookingStatus.DECLINED,
        },
    });

    return acceptedBooking;
});

    return result;
}

const inProgressBookingOnDB = async(userId : string , bookingId : string) => {
    const booking = await prisma.bookings.findUnique({
        where : {
            id : bookingId
        },
        select: {
            service : {
                select : {
                    technicianProfile : {
                        select : {
                            userId : true,
                            isAvailable : true
                        }
                    }
                }
            },
            status : true,
            availability : {
                select : {
                    isBooked : true,
                    isDeleted : true,
                    id : true
                }
            },
            isDeleted : true
        }
    })

    if(!booking || booking.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND , "Booking not Exists!")
    }

    if(userId !== booking.service.technicianProfile.userId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only in progress your own service bookings.")
    }

    if(booking.status !== BookingStatus.PAID){
        throw new AppError(httpStatus.FORBIDDEN, "Booking can In progress only if its status is paid!")
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId,
        },
        data: {
            status: BookingStatus.IN_PROGRESS
        },
    });

    return result;
}

const completeBookingOnDB = async(userId : string , bookingId : string) => {
    const booking = await prisma.bookings.findUnique({
        where : {
            id : bookingId
        },
        select: {
            service : {
                select : {
                    technicianProfile : {
                        select : {
                            userId : true,
                            isAvailable : true
                        }
                    }
                }
            },
            status : true,
            availability : {
                select : {
                    isBooked : true,
                    isDeleted : true,
                    id : true
                }
            },
            isDeleted : true
        }
    })

    if(!booking || booking.isDeleted){
        throw new AppError(httpStatus.NOT_FOUND , "Booking not Exists!")
    }

    if(userId !== booking.service.technicianProfile.userId){
        throw new AppError(httpStatus.UNAUTHORIZED , "You can only in progress your own service bookings.")
    }

    if(booking.status !== BookingStatus.IN_PROGRESS){
        throw new AppError(httpStatus.FORBIDDEN, "Booking can completed only if its status is in progress!")
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId,
        },
        data: {
            status: BookingStatus.COMPLETED
        },
    });

    return result;
}

const getMyBookingsFromDB = async (userId : string , query : TBookingQuery) => {
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
            isDeleted: false,
            customerId : userId
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

const getSingleBooking = async (userId : string , bookingId : string) => {
    const booking = await prisma.bookings.findUnique({
        where : {
            id : bookingId,
            customerId : userId
        },
        include : {
            customer : {
                omit : {
                    password : true
                }
            },
            availability : true,
            payment : true,
            reviews : true,
            service : true
        }
    })

    if(!booking){
        throw new AppError(httpStatus.NOT_FOUND , "Booking not found!")
    }

    return booking;
}

export const bookingService = {
    createBookingOnDB,
    cancelBookingOnDB,
    declineBookingOnDB,
    acceptBookingOnDB,
    getMyBookingsFromDB,
    getSingleBooking,
    inProgressBookingOnDB,
    completeBookingOnDB
}