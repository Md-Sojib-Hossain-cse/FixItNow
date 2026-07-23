import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { bookingService } from "./booking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createBooking = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await bookingService.createBookingOnDB(userId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Booking Request created successfully!",
        data : result
    })
})

const cancelBooking = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    const result = await bookingService.cancelBookingOnDB(userId as string, bookingId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Booking cancelled successfully!",
        data : result
    })
})


const declineBooking = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    const result = await bookingService.declineBookingOnDB(userId as string, bookingId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Booking declined successfully!",
        data : result
    })
})


const acceptBooking = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    const result = await bookingService.acceptBookingOnDB(userId as string, bookingId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Booking accepted successfully!",
        data : result
    })
})

const getMyBookings = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const query = req.query;

    const result = await bookingService.getMyBookingsFromDB(userId as string, query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Bookings retrieve successfully!",
        data : result
    })
})



export const bookingController = {
    createBooking,
    cancelBooking,
    declineBooking,
    acceptBooking,
    getMyBookings
}