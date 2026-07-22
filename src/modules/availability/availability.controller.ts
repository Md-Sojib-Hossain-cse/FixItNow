import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { availabilityService } from "./availability.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createAvailability = catchAsync(async (req : Request , res : Response , next : NextFunction)=> {
    const userId = req.user?.id;
    const payload =  req.body;

    const result = await availabilityService.createAvailabilityOnDB(userId as string , payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Availability slot created successfully!",
        data : result
    })
})


export const availabilityController = {
    createAvailability
}