import type { Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";

export const notFound = (req : Request , res : Response) => {
    sendResponse(res , {
        success : false,
        statusCode : 404,
        message : "Route not Found!",
    })
}