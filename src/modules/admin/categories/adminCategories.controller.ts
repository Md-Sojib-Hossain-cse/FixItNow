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
    const result = await adminCategoryService.getAllCategoriesFromDB(query)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Categories retrieve successfully!",
        data : result
    })
})

const updateCategory = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const categoryId = req.params.id;
    const payload = req.body;
    await adminCategoryService.updateCategoryOnDB(categoryId as string , payload)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Categories updated successfully!",
        data : null
    })
})

const deleteCategory = catchAsync(async(req : Request , res : Response , next : NextFunction) => {
    const categoryId = req.params.id;
    await adminCategoryService.deleteCategoryFromDB(categoryId as string)

    sendResponse(res , {
        success : true, 
        statusCode : httpStatus.OK,
        message : "Categories deleted successfully!",
        data : null
    })
})


export const adminCategoryController = {
    createCategory,
    getAllCategory,
    deleteCategory,
    updateCategory
}