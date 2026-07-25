import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import httpStatus from "http-status"
import { adminBookingService } from "./adminBookings.service";
import { sendResponse } from "../../../utils/sendResponse";

const getAllBookings = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const query = req.query;

    const result = await adminBookingService.getAllBookingsFromDB(query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Bookings retrieve successfully!",
        data : result
    })
})

const updateBooking = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const bookingId = req.params.id;
    const payload = req.body;

    const result = await adminBookingService.updateBookingOnDB(bookingId as string , payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Booking updated successfully!",
        data : result
    })
})

const deleteBooking = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const bookingId = req.params.id;

    const result = await adminBookingService.deleteBookingFromDB(bookingId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Booking delete successfully!",
        data : result
    })
})


export const adminBookingController = {
    getAllBookings,
    updateBooking,
    deleteBooking
}