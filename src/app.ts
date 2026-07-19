import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import config from "./config"
import cookieParser from "cookie-parser"
import { notFound } from "./middlewares/notFound"
import { globalErrorHandler } from "./middlewares/globalErrorHandler"
import { authRoutes } from "./modules/auth/auth.routes"
import { userRoutes } from "./modules/user/user.routes"
import { adminRoutes } from "./modules/admin/admin.routes"
import { technicianProfileRoutes } from "./modules/technicianProfile/technicianProfile.routes"

const app : Application = express()

app.use(cors({
    origin : config.app_url
}))

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())

app.get("/" , async(req : Request , res : Response) => {
    res.json({
        message : "Welcome to FixItNow!"
    })
})


app.use("/api/auth" , authRoutes)
app.use("/api/admin" , adminRoutes)
app.use("/api/user", userRoutes)
app.use("/api/technicianProfile" , technicianProfileRoutes)

app.use(notFound)

app.use(globalErrorHandler)


export default app;