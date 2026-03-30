import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../../utils/cloudinary.js"
import {ApiResponse} from "../../utils/ApiResponse.js"
import jwt, { decode } from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken , refreshToken}
    } catch (error) {
           throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const reqisterUser = asyncHandler(async (req , res) => {
    //get user details from frontend
    //validation-not empty 
    //check if user already exists: username, email 
    // check for images , check for avatar
    // upload them to cloudinary , avator
    // create user object-create entry in db 
    // remove password and refresh token field form response 
    // check for user creation 
    // return res


const {fullName , email , username , password } = req.body
console.log(req.body);

if ([fullName , email , username , password].some((field)=>field?.trim() === "")) {
    throw new ApiError(400, "All fields are required")
}

const existedUser = await User.findOne({
$or:[{ username },{ email }]
})

if (existedUser)  {
    throw new ApiError(409, "User with email or username already exists")
  
}
console.log(req.files);

const avatarLocalPath  = req.files?.avatar[0]?.path


if (!avatarLocalPath) {
    throw new ApiError(400 , "Avatar files is required")
}
const avatar = await uploadOnCloudinary(avatarLocalPath, "users_avatars")

if (!avatar) {
    throw new ApiError(400, "Avatar file is  required")
}

const user = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    username: username.toLowerCase()
})
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
}
return res.status(201).json(
    new ApiResponse(200 , createdUser , "User reqistered succesFully")
)
})

const loginUser = asyncHandler(async (req , res)=>{
    //req body -> data 
    //username or email 
    //find the user
    // password check 
    // access and refresh token 
    // send cookie 
    const {email , username , password}= req.body
    console.log(req.body);
    
    if (!username && !email) {
        throw new ApiError(400,"username or email is required");
    }
    const user = await User.findOne({
        $or:[{username}, {email}]
    })
    console.log("userka password" , user.password);
    
    if (!user) {
        throw new ApiError(400, "user does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    console.log("is Password valid" , isPasswordValid);
    
    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid user credentials");
    }
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).
select("-password -refreshToken")
    const options = {
        httpOnly:true,
        secure: true
    }
    return res 
    .status(200)
    .cookie("accessToken", accessToken , options)
    .cookie("refreshToken", refreshToken, options )
    .json(
        new ApiResponse(
            200,{user: loggedInUser , accessToken , refreshToken},"user logged in sucessFully"
        )
    )
})

const logoutUser = asyncHandler(async(req , res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },{
            new: true
        }
    )
    const options={
         httpOnly:true,
        secure: true
    }
     return res 
    .status(200)
    .cookie("accessToken",  options)
    .cookie("refreshToken", options )
    .json(
        new ApiResponse(
            200,{},"user logged Out sucessFully"
        )
    )
})
const refreshAccessToken = asyncHandler(async (req , res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (incomingRefreshToken) {
        throw new ApiError(401 , "unauthorized request");
    }
   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken,
          process.env.ACCESS_TOKEN_SECRET
     )
    const user = await User.findById(decodedToken?._id)
    if (!user) {
         throw new ApiError(401 , "inavlid refreshToken request");
     }
     if(incomingRefreshToken !== user?.refreshToken){
 throw new ApiError(401, "refresh token is expired or user")
     }
     const options={
         httpOnly:true,
         secure: true
     }
    const {accessToken , newRefreshToken} =await generateAccessAndRefreshToken(user._id)
     return res
     .status(200)
     .cookie("accessToken", accessToken , options)
     .cookie("resfreshToken", newRefreshToken , options)
     .json(
         new ApiResponse(
            200, {accessToken , refreshToken : newRefreshToken},
            "Acess token refreshed"
         )
     )
   } catch (error) {
    throw new ApiError(401 , error?.message|| "Invalid refresh token");
    
   }
})
export { reqisterUser , loginUser , logoutUser ,refreshAccessToken}