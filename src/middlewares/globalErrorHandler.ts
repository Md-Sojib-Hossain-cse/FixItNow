import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"

export const globalErrorHandler = (error : any , req : Request , res : Response , next : NextFunction) => {
    let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
    let message : string = error.message || "Something went wrong!";
    let errorName : string = error.name || "Internal Server Error!";

    res.status(statusCode).json({
            success : false,
            statusCode,
            message : message || "Something went wrong!",
            name : errorName,
            error : error.stack
        })
}