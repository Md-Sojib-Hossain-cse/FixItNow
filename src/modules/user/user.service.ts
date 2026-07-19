import AppError from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import type { TUpdateUser } from "./user.interface";
import httpStatus from "http-status"

const updateUserInfoOnDB = async (userId : string , payload : TUpdateUser) => {
    const user = await prisma.users.findUnique({
        where : {
            id : userId
        }
    })

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND , "User not Found!")
    }

    if(user.isDeleted === true){
        throw new AppError(httpStatus.NOT_FOUND , "User has been deleted , Please contact to our support!")
    }

    if(user.status === "BANNED"){
        throw new AppError(httpStatus.UNAUTHORIZED , "User has been banned , Please contact to our support!")
    }

    const result = await prisma.users.update({
        where : {
            id : userId
        },
        data : payload,
        omit : {
            password : true
        }
    })

    return result;
}



export const userService = {
    updateUserInfoOnDB
}