import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const getAllCategory = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const query = req.query;
    const result = await categoryService.getAllCategoryFromDB(query)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Categories retrieve successfully!",
        data : result
    })
})


export const categoryController = {
    getAllCategory
}