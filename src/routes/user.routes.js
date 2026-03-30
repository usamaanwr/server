import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, reqisterUser } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createProperty } from "../controllers/property.controller.js";
const router = Router();
router.post('/register', upload.fields([{
    name: "avatar",
    maxCount: 1
}
]),
reqisterUser)
router.post('/login' , loginUser)
router.post('/logout' , verifyJWT , logoutUser)
router.post('/refresh-Token', refreshAccessToken)

export default router