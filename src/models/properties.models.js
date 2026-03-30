import mongoose from "mongoose";
const propertySchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type: String,
            required: true
        },
        price:{
            type: Number,
            required: true
        },
        city:{
            type: String,
            required: true,
            trim: true
        },
        location:{
            type: String,
            required: true,
            trim: true
        },
        type:{
            type: String,
            enum:["house" , "apartment" , "plot", "villa" , "commercial"],
            required: true
        },
        bedroom:{
            type: Number,
            default:0
        },
        bathroom:{
            type:Number,
            default: 0
        },
        area:{
            type:Number,
            required: true
        },
        areaUnit:{
            type:String,
            enum:["sqft", "sqyd", "marla", "kanal"],
            default:"sqft"
        },
        images:[
            {
                type: String,
            }
        ]
    },{timestamps: true}
)

export const Property = mongoose.model("Property", propertySchema)