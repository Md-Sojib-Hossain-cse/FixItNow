import config from "../../config"
import { prisma } from "../../lib/prisma"
import { type SignOptions } from "jsonwebtoken"
import { jwtUtils } from "../../utils/jwtUtils"
import bcrypt from "bcryptjs";
import type { TRegisterUser } from "./auth.interface"
import AppError from "../../errors/appError";
import httpStatus from "http-status"
import { Roles } from "../../../generated/prisma/enums";
import type { TJwtPayload } from "../../types";
import type { UserWhereInput } from "../../../generated/prisma/models";

const registerUserIntoDB = async (payload : TRegisterUser) => {

    const orConditions : UserWhereInput[] = [{email : payload.email}];

    if(payload.phone){
        orConditions.push({phone : payload.phone})
    }

    const result = await prisma.user.findFirst({
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
    await prisma.user.create({
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
      : await prisma.user.create({
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

export const authService = {
    registerUserIntoDB
}