import { BookingStatus } from "../../../generated/prisma/enums";
import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import type { TCreateBooking } from "./booking.interface";
import httpStatus from "http-status"

const createBookingOnDB = async (userId : string , payload : TCreateBooking) => {
    const {customerId , availabilityId , serviceId , address , note} = payload;

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
            customer : true,
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


export const bookingService = {
    createBookingOnDB,
    cancelBookingOnDB,
    declineBookingOnDB
}