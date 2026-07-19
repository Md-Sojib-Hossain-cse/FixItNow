import httpStatus from "http-status"
import { catchAsync } from "../../utils/catchAsync";
import type { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";

const getAllUsers = catchAsync(async(req : Request, res : Response , next : NextFunction) => {
    const query = req.query;
    const result = await adminService.getAllUsersFromDB(query)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Users retrieve successfully!",
        data : result
    })
})

const updateUserStatus = catchAsync(async(req : Request, res : Response , next : NextFunction) => {
    const adminId = req.user?.id;
    const userId = req.params.id;
    const payload = req.body;
    const result = await adminService.updateUserStatusOnDB(adminId as string , payload , userId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Users updated successfully!",
        data : result
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus
}