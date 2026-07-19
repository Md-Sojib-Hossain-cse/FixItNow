import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status"
import AppError from "../errors/appError";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (error : any , req : Request , res : Response , next : NextFunction) => {
    let statusCode : number = httpStatus.INTERNAL_SERVER_ERROR;
    let message : string = error.message || "Something went wrong!";
    let errorName : string = error.name || "Internal Server Error!";

    if(error instanceof AppError){
        statusCode = error.statusCode;
        message = error.message;
        errorName = error.name;
    }

    else if (error instanceof Error){
        message = error.message;
        errorName = error.name;
    }

    if(error instanceof Prisma.PrismaClientValidationError){
        statusCode = httpStatus.BAD_REQUEST
        message = "You have provided a incorrect type or incorrect field."
    } else if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code === "P2002"){
            statusCode = httpStatus.BAD_REQUEST
            message = "Duplicate key error!"
        } else if (error.code = "P2003"){
            statusCode = httpStatus.BAD_REQUEST
            message = "Foreign key constraint failed!"
        }else if (error.code = "P2025"){
            statusCode = httpStatus.BAD_REQUEST
            message = "An operation failed because it depends on one or more records that were required but not found. {cause}"
        }
    }
    else if(error instanceof Prisma.PrismaClientInitializationError){
        if(error.errorCode === "P1000"){
        statusCode = httpStatus.UNAUTHORIZED
        message = "Authentication failed against database server , please check your credentials!"
    } else if(error.errorCode === "P1001"){
        statusCode = httpStatus.BAD_REQUEST
        message = "Can't reach database server!"
    }
    }else if (error instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = httpStatus.INTERNAL_SERVER_ERROR
        message = "Error occurred during query execution!"
    }

    res.status(statusCode).json({
            success : false,
            statusCode,
            message : message || "Something went wrong!",
            name : errorName,
            error : error.stack
        })
}