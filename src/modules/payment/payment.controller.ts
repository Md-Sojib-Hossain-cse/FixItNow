import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const initiatePayment = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const bookingId = req.params.id;
    const result = await paymentService.initiatePayment(userId as string, bookingId as string)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Payemnt initiate successfully!",
        data : result
    })
})

const successPayment = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const transactionId = req.params.id;
    const result = await paymentService.successPayment(userId as string, transactionId as string)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Payemnt received successfully!",
        data : result
    })
})

export const paymentController = {
    initiatePayment,
    successPayment
}