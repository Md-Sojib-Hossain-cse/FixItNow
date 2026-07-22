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
            technicianProfileId : service.technicianProfileId
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


export const bookingService = {
    createBookingOnDB
}