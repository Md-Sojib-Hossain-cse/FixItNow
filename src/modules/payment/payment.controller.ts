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
    const transactionId = req.params.id;
    const result = await paymentService.successPayment(transactionId as string)

    res.status(httpStatus.OK).redirect(result.url)
})

const failPayment = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const transactionId = req.params.id;
    const result = await paymentService.failPayment(transactionId as string)

    res.status(httpStatus.OK).redirect(result.url)
})

const cancelPayment = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const transactionId = req.params.id;
    const result = await paymentService.cancelPayment(transactionId as string)

    res.status(httpStatus.OK).redirect(result.url)
})

const getMyPayments = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const query = req.query;
    const result = await paymentService.getMyPaymentsFromDB(userId as string, query)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Payemnts retrieve successfully!",
        data : result
    })
})


const getSinglePayment = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const paymentId = req.params.id;
    const result = await paymentService.getSinglePaymentFromDB(userId as string, paymentId as string)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Payemnt retrieve successfully!",
        data : result
    })
})

export const paymentController = {
    initiatePayment,
    successPayment,
    failPayment,
    cancelPayment,
    getMyPayments,
    getSinglePayment
}