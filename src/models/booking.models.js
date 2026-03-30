import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        property:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref : "User",
            required: true
        },
        vistDate :{
            type: String,
            required: true
        },
        message:{
            type: String,
            default: ""
        },
        status:{
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
        }
        },
    {timestamps: true}
)
export const Booking = mongoose.model("Booking", bookingSchema)