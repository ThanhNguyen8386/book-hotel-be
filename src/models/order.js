import mongoose,{Schema,ObjectId} from "mongoose";

const orderSchema = Schema({
    name:{
        type: String,
        required:true,
        trim:true,
    },
    phone:{
        type:Number,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    statusorder:{
        type:String
    },
    total:{
        type:Number
    },
    checkins:{
        type: String,
    },
    checkouts:{
        type: String,
    },
    room:{
        type: ObjectId,
        ref:"Room"
    },
    user:{
        type: ObjectId,
        ref:"Users"
    },
    status:{
        type: ObjectId,
        ref:"DateBooked"
    },
    voucherCode:{
        type:ObjectId,
        ref:"Voucher2"
    },
    year: {
        type: String
    },
    month: {
        type: String,
    },
    duration: {
        type: String
    },
    methodpay:{
        type: String
    },
    bookingType:{
        type: String,
        required: true
    },
    discountAmount:{
        type: Number
    },
    originalPrice:{
        type: Number
    }
}, {timestamps:true})


export default mongoose.model("Order", orderSchema)