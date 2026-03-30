import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Property } from "../models/properties.models.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

// Property add -
const createProperty = asyncHandler(async (req , res)=>{
  
    const propertyData = req.body
    if (!propertyData) {
        throw new ApiError( 400 , "all fields required ");
        
    }
   const propertyFiles = req.files?.images;
   let imageUrls = [];
   if (propertyFiles) {
    for (const file of propertyFiles){
        const result = await uploadOnCloudinary(file.path, "property_images");
        if (result) {
            imageUrls.push(result.url);
        }
    }
   }
   
   const property = await Property.create({
    ...propertyData,
    images: imageUrls
   })
   return res.status(201).json(
    new ApiResponse(201 , property , "Property saves!")
   )
})

// get by property ..

const getProperty = asyncHandler( async (req , res)=>{

})

export {createProperty}