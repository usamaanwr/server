import { Router } from "express";
import { createProperty } from "../controllers/property.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const propertyRouter = Router()

propertyRouter.post('/add-property', upload.fields([{
name: "images",
maxCount: 10
}]), createProperty)

export {propertyRouter}