import  httpStatus  from 'http-status';
import type { NextFunction, Request, Response } from "express";
import type { Roles } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../errors/appError";
import { jwtUtils } from '../utils/jwtUtils';
import config from '../config';
import { prisma } from '../lib/prisma';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name : string;
        email: string;
        role : Roles;
      };
    }
  }
}

export const auth = (...roles : Roles[]) => {
    return catchAsync(async(req : Request , res : Response , next : NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken : 
                        req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : 
                        req.headers.authorization;

        if(!token){
            throw new AppError(httpStatus.UNAUTHORIZED , "You are not logged in , please logged in to access your resource!")
        }


        const verifyToken = jwtUtils.verifyToken(token , config.jwt_access_secret)


        if(!verifyToken.success){
            throw new AppError(httpStatus.UNAUTHORIZED , "Unauthorized access!")
        }


        const {email , name , id , role} = verifyToken.data


        if(roles.length && !roles.includes(role)){
            throw new AppError(httpStatus.FORBIDDEN, "Forbidden!")
        }


        const user = await prisma.user.findUnique({
            where : {
                id : id,
                name : name,
                email : email,
                role : role
            }, 
            omit : {
                password : true
            }
        })

        if(!user){
            throw new AppError(httpStatus.NOT_FOUND , "User not Exists!")
        }


        if(user.status === "BLOCKED"){
            throw new AppError(httpStatus.UNAUTHORIZED , "Your account is blocked , please contact to support.")
        }


        if(user.isDeleted === true){
            throw new AppError(httpStatus.NOT_FOUND , "Your account is deleted , please contact to support.")
        }

        req.user = {
            id : user.id,
            name : user.name,
            email : user.email,
            role : user.role
        }

        next()
    })
}