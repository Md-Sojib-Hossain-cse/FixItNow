import  jwt, { type JwtPayload, type SignOptions }  from 'jsonwebtoken';

const createToken =(jwtPayload : JwtPayload , secret : string , expiresIn : SignOptions ) => {
    const token = jwt.sign(jwtPayload , secret , {expiresIn : expiresIn} as SignOptions)
    return token;
}

export const jwtUtils = {
    createToken,
}