import dotenv from "dotenv";
import path from "path";

dotenv.config({path : path.join(process.cwd() , ".env")})

export default {
    database_url : process.env.DATABASE_URL,
    port : process.env.PORT,
    app_url : process.env.APP_URL,
    jwt_access_secret : process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret : process.env.JWT_REFRESH_SECRET!,
    jwt_access_expired_in : process.env.JWT_ACCESS_EXPIRED_IN!,
    jwt_refresh_expired_in : process.env.JWT_REFRESH_EXPIRED_IN!,
    bcrypt_salt_round : process.env.BCRYPT_SALT_ROUND!,
    ssl_commerz_store_id : process.env.SSL_COMMERZ_STORE_ID!,
    ssl_commerz_store_password : process.env.SSL_COMMERZ_STORE_PASSWORD!
}