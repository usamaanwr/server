import dotenv from "dotenv";
dotenv.config();
import connectDb from "./db/index.js";
import app from "./app.js";
const port = process.env.PORT || 3000;

connectDb()

.then(()=>{
 app.listen(port,()=>{
    console.log(`server is start running : ${process.env.PORT}`);
    
 })
})
.catch((err)=>{
   console.log("MONGO db Connection failed !!!" , err);
   
})
