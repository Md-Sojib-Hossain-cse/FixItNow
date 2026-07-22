import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import config from "./config"
import cookieParser from "cookie-parser"
import { notFound } from "./middlewares/notFound"
import { globalErrorHandler } from "./middlewares/globalErrorHandler"
import { authRoutes } from "./modules/auth/auth.routes"
import { userRoutes } from "./modules/user/user.routes"
import { adminRoutes } from "./modules/admin/admin.routes"
import { technicianRoutes } from "./modules/technician/technician.routes"
import { serviceRoutes } from "./modules/service/service.routes"
import { categoryRoutes } from "./modules/category/category.routes"
import { availabilityRoutes } from "./modules/availability/availability.routes"
import { bookingRoutes } from "./modules/booking/booking.routes"

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
app.use("/api/technician" , technicianRoutes)
app.use("/api/service" , serviceRoutes)
app.use("/api/categories" , categoryRoutes)
app.use("/api/availability" , availabilityRoutes)
app.use("/api/bookings" , bookingRoutes)

app.use(notFound)

app.use(globalErrorHandler)


export default app;