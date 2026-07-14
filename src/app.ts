import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import config from "./config"
import cookieParser from "cookie-parser"
import { notFound } from "./middlewares/notFound"

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

app.use(notFound)


export default app;