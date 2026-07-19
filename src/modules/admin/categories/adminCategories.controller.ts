import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { adminCategoryService } from "./adminCategories.service";
import { sendResponse } from "../../../utils/sendResponse";
import httpStatus from "http-status"

const createCategory = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const payload = req.body;
    const result = await adminCategoryService.createCategoryIntoDB(payload)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.CREATED,
        message : "Category created successfully!",
        data : result
    })
})

const getAllCategory = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const query = req.query;
    const result = await adminCategoryService.getAllCategories(query)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Categories retrieve successfully!",
        data : result
    })
})


export const adminCategoryController = {
    createCategory,
    getAllCategory
}