import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status"
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await reviewService.createReviewOnDB(userId as string , payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Review posted successfully!",
        data : result
    })
})


const getMyReview = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const query = req.query;

    const result = await reviewService.getMyReviewsFromDB(userId as string , query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Reviews retrieve successfully!",
        data : result
    })
})

const getSingleReview = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const reviewId = req.params.id;

    const result = await reviewService.getSingleReviewsFromDB(reviewId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Review retrieve successfully!",
        data : result
    })
})

export const reviewController = {
    createReview,
    getMyReview,
    getSingleReview
}