import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.routes.js";
import { propertyRouter } from "./routes/property.routes.js";

const app = express()
app.use(json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use('/api/v1/user', userRouter)
app.use('/api/v1/property', propertyRouter)
export default
app;