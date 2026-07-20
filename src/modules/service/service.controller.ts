import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { servicesService } from "./service.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createService = catchAsync(async (req : Request, res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await servicesService.createServiceInDB(userId as string , payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Service created successfully!",
        data : result
    })
})

const updateService = catchAsync(async (req : Request, res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const serviceId = req.params.id;
    const payload = req.body;

    const result = await servicesService.updateServiceOnDB(userId as string  , serviceId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Service updated successfully!",
        data : result
    })
})

const getAllServices = catchAsync(async (req : Request, res : Response , next : NextFunction) => {
    const query = req.query;

    const result = await servicesService.getAllServiceFromDB(query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Services retrieve successfully!",
        data : result
    })
})


export const serviceController = {
    createService,
    updateService,
    getAllServices
}