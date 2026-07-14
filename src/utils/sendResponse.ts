import type { Response } from "express";


type TMeta = {
        page : number;
        limit: number;
        total : number
    }

type TResponse<T> = {
    success : boolean;
    statusCode : number;
    message : string;
    data ?: T | T[];
    meta ?: TMeta;
}

export const sendResponse = <T>(res : Response , data : TResponse<T>) => {
    res.status(data.statusCode).json({
        success : true,
        statusCode : data.statusCode || 500,
        message : data.message || "Internal Server Error!",
        data : data.data,
        meta : data.meta,
    })
}