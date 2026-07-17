import  jwt, { type JwtPayload, type SignOptions }  from 'jsonwebtoken';

const createToken =(jwtPayload : JwtPayload , secret : string , expiresIn : SignOptions ) => {
    const token = jwt.sign(jwtPayload , secret , {expiresIn : expiresIn} as SignOptions)
    return token;
}

const verifyToken = (token : string , secret : string) => {
    try {
        const verifiedToken = jwt.verify(token , secret)
        return {
            success : true , 
            data : verifiedToken
        }
    } catch (error : any) {
        console.log("Invalid token verification error :" , error)
        return {
            success : false,
            data : error.message
        }
    }
}

export const jwtUtils = {
    createToken,
    verifyToken
}