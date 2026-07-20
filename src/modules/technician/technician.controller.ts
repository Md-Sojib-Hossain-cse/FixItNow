import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { technicianProfileService } from "./technician.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const updateOwnTechnicianProfile = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianProfileService.updateOwnTechnicianProfileOnDB(userId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Technician Profile updated Successfully!",
        data : result
    })
})

const updateAvailableStatus = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianProfileService.updateAvailableStatusOnDB(userId as string, payload)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Available Status updated Successfully!",
        data : result
    })
})

const getAllTechnician = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const query = req.query;

    const result = await technicianProfileService.getAllTechnicianFromDB(query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Technicians retrieve Successfully!",
        data : result
    })
})

export const technicianProfileController = {
    updateOwnTechnicianProfile , 
    updateAvailableStatus,
    getAllTechnician
}