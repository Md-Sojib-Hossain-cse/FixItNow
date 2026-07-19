import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const updateUserInfo = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await userService.updateUserInfoOnDB(userId as string , payload)

    sendResponse(res , {
        success : true , 
        statusCode : httpStatus.OK,
        message : "User updated successfully!",
        data : result
    })
})


export const userController = {
    updateUserInfo
}