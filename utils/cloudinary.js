import {v2 as cloudinary} from "cloudinary"
import fs from "fs";
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (locaFilePath, folderName)=>{
    try {
        if (!locaFilePath)return null 
            
        const response = await cloudinary.uploader.upload(locaFilePath , {
            resource_type: "auto",
            folder: folderName
        });
        // logger.info("response:" , response.url)
        fs.unlinkSync(locaFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(locaFilePath);
        console.log("Cloudinary Error:", error.message); 
        return null
    }
}

export { uploadOnCloudinary }