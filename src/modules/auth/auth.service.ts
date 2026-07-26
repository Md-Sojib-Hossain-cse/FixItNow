import config from "../../config"
import { prisma } from "../../lib/prisma"
import { type SignOptions } from "jsonwebtoken"
import { jwtUtils } from "../../utils/jwtUtils"
import bcrypt from "bcryptjs";
import type { TLoginUser, TRegisterUser } from "./auth.interface"
import AppError from "../../errors/appError";
import httpStatus from "http-status"
import { Roles } from "../../../generated/prisma/enums";
import type { TJwtPayload } from "../../types";
import type { UsersWhereInput } from "../../../generated/prisma/models";

const registerUserIntoDB = async (payload : TRegisterUser) => {

    if(!payload.email || !payload.name || !payload.password){
        throw new AppError(httpStatus.BAD_REQUEST , "Please provide all required field!")
    }

    const orConditions : UsersWhereInput[] = [{email : payload.email}];

    if(payload.phone){
        orConditions.push({phone : payload.phone})
    }

    const result = await prisma.users.findFirst({
    where: {
        isDeleted: false,
        OR : orConditions
  }, 
  omit : {
    password : true
  }
})


    if(result){
        throw new AppError(
            httpStatus.CONFLICT,
            "User with this email or phone already exists."
        )
    }


    if (payload.role === Roles.ADMIN) {
    throw new AppError(
        httpStatus.FORBIDDEN,
        "Admin registration is not allowed."
    );
}


    const hashedPassword =await bcrypt.hash(payload.password , Number(config.bcrypt_salt_round))

    const user = payload.role === Roles.TECHNICIAN ?
    await prisma.users.create({
        data : {
            ...payload,
            password : hashedPassword,
            technicianProfile : {
                create : {
                }
            }
        },
        omit : {
            password : true
        }
    })
      : await prisma.users.create({
        data : {
            ...payload,
            password : hashedPassword,
        },
        omit : {
            password : true
        }
    })

    const jwtPayload : TJwtPayload = {
        id : user.id,
        name : user.name,
        email : user.email,
        role : user.role
    }


    const accessToken = jwtUtils.createToken(jwtPayload , config.jwt_access_secret, config.jwt_access_expired_in as SignOptions)

    const refreshToken = jwtUtils.createToken(jwtPayload , config.jwt_refresh_secret, config.jwt_refresh_expired_in as SignOptions)

    return {
        user,
        accessToken,
        refreshToken
    };
}

const loginUserFromDB = async (payload : TLoginUser) => {
    const isUserExists = await prisma.users.findUnique({
        where : {
            email : payload.email,
        }
    })

    if(!isUserExists){
        throw new AppError(httpStatus.NOT_FOUND , "User not found!")
    }

    if(isUserExists.status === "BANNED"){
        throw new AppError(httpStatus.UNAUTHORIZED , "Your account is banned , please contact to support.")
    }
    
    if(isUserExists.isDeleted === true){
        throw new AppError(httpStatus.NOT_FOUND , "User has been deleted , please contact to the support!")
    }


    const isPasswordMatched = bcrypt.compare(payload.password , isUserExists.password)

    if(!isPasswordMatched){
        throw new AppError(httpStatus.UNAUTHORIZED , "Wrong credentials!")
    }


    const jwtPayload : TJwtPayload = {
        id : isUserExists.id,
        name : isUserExists.name,
        email : isUserExists.email,
        role : isUserExists.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload , config.jwt_access_secret, config.jwt_access_expired_in as SignOptions)

    const refreshToken = jwtUtils.createToken(jwtPayload , config.jwt_refresh_secret, config.jwt_refresh_expired_in as SignOptions)

    //preventing password to go on response
    const {password , ...userInfo} = isUserExists

    return {
        user : userInfo,
        accessToken,
        refreshToken
    };
}

const getMyUserInfoFromDB = async (userId : string) => {
    const result = await prisma.users.findUnique({
        where : {
            id : userId
        },
        include : {
            technicianProfile : true
        },
        omit : {
            password : true
        }
    })

    return result;
}

const refreshTokenFromDB = async(token : string) => {
    const verifyToken = jwtUtils.verifyToken(token , config.jwt_refresh_secret)

    if(!verifyToken.success){
        throw new AppError(httpStatus.UNAUTHORIZED , "Invalid token!")
    }

    const {id} = verifyToken.data;

    const user = await prisma.users.findUnique({
        where : {
            id : id
        }
    })

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND , "User Not Found!")
    }

    if(user.status === "BANNED"){
        throw new AppError(httpStatus.FORBIDDEN , "User is banned , please contact to our support!")
    }

    if(user.isDeleted === true){
        throw new AppError(httpStatus.NOT_FOUND , "User is deleted , please contact to our support!")
    }

    const jwtPayload = {
        id : user.id,
        name : user.name,
        email : user.email,
        role : user.role
    }

    const accessToken = jwtUtils.createToken(jwtPayload , config.jwt_access_secret , config.jwt_access_expired_in as SignOptions)

    return {accessToken}
}


export const authService = {
    registerUserIntoDB,
    loginUserFromDB,
    getMyUserInfoFromDB,
    refreshTokenFromDB
}