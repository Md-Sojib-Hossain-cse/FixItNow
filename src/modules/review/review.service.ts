import { BookingStatus } from "../../../generated/prisma/enums"
import AppError from "../../errors/appError"
import { prisma } from "../../lib/prisma"
import type { TCreateReview } from "./review.interface"
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


export const reviewService = {
    createReviewOnDB
}