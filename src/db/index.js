import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}`)
        console.error(`\n MONGODB CONNECTED !! BD HOST ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.error("MONGO DB CONNECTION IS FAILED !!", error);
        
    }
}

export default connectDb;