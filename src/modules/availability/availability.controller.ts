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
        statusCode : httpStatus.CREATED,
        message : "Availability slot created successfully!",
        data : result
    })
})

const updateAvailability = catchAsync(async (req : Request , res : Response , next : NextFunction)=> {
    const userId = req.user?.id;
    const availabilityId = req.params.id;
    const payload =  req.body;

    const result = await availabilityService.updateAvailabilityOnDB(userId as string , availabilityId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Availability slot updated successfully!",
        data : result
    })
})

const deleteAvailability = catchAsync(async (req : Request , res : Response , next : NextFunction)=> {
    const userId = req.user?.id;
    const availabilityId = req.params.id;

    await availabilityService.deleteAvailabilityFromDB(userId as string , availabilityId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Availability slot deleted successfully!",
        data : null
    })
})

const getAllAvailability = catchAsync(async (req : Request , res : Response , next : NextFunction)=> {
    const query = req.query;

    const result  = await availabilityService.getAllAvailabilityFromDB(query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Availability slots retrieve successfully!",
        data : result
    })
})

const getSingleAvailability = catchAsync(async (req : Request , res : Response , next : NextFunction)=> {
    const id = req.params.id;

    const result  = await availabilityService.getSingleAvailabilityFromDB(id as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Availability slot retrieve successfully!",
        data : result
    })
})


export const availabilityController = {
    createAvailability,
    updateAvailability,
    deleteAvailability,
    getAllAvailability,
    getSingleAvailability
}