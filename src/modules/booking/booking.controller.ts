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


export const bookingController = {
    createBooking
}