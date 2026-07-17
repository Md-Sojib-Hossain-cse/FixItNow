import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const registerUser = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const payload = req.body;

    const result = await authService.registerUserIntoDB(payload)

    res.cookie("accessToken" , result.accessToken , {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 //24 hour
    })

    res.cookie("refreshToken" , result.refreshToken , {
        httpOnly : true,
        secure : false,
        sameSite : 'none',
        maxAge : 1000 * 60 * 60 * 24 * 7 // 7 day
    })

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "User created successfully!",
        data : result
    })
})

const loginUser = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const payload = req.body;

    const result = await authService.loginUserFromDB(payload)

    res.cookie("accessToken" , result.accessToken , {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 //24 hour
    })

    res.cookie("refreshToken" , result.refreshToken , {
        httpOnly : true,
        secure : false,
        sameSite : 'none',
        maxAge : 1000 * 60 * 60 * 24 * 7 // 7 day
    })

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "User logged in successfully!",
        data : result
    })
})

const getMyUserInfo = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const userId = req.user?.id
    const result = await authService.getMyUserInfoFromDB(userId as string)
    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "Your user info retrieve successfully!",
        data : result
    })
})

const refreshToken = catchAsync(async (req : Request , res : Response , next : NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const {accessToken} = await authService.refreshTokenFromDB(refreshToken)

    res.cookie("accessToken" , accessToken , {
        httpOnly : true,
        secure : false,
        sameSite : "none",
        maxAge : 1000 * 60 * 60 * 24 //24 hour
    })


    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Token refreshed successfully!",
        data : {accessToken}
    })
} )


const logout = catchAsync(async (req : Request , res : Response , next : NextFunction) => {

    console.log("hello")
    res.cookie("accessToken" , {
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 0 
    })

    res.cookie("refreshToken" , {
        httpOnly : true,
        secure : false,
        sameSite : "lax",
        maxAge : 0 
    })

    sendResponse(res , {
        success : true,
        statusCode : httpStatus.OK,
        message : "User logged out successfully!"
    })
})

export const authController = {
    registerUser,
    loginUser,
    getMyUserInfo,
    refreshToken,
    logout
}