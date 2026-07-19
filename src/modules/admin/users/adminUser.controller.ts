import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { adminUserService } from "./adminUser.service";
import httpStatus from "http-status"

const getAllUsers = catchAsync(async(req : Request, res : Response , next : NextFunction) => {
    const query = req.query;
    const result = await adminUserService.getAllUsersFromDB(query)

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
    const result = await adminUserService.updateUserStatusOnDB(adminId as string , payload , userId as string)

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Users updated successfully!",
        data : result
    })
})

export const adminUserController = {
    getAllUsers,
    updateUserStatus
}