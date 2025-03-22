import mongoose,{Schema} from "mongoose";
import { type } from "os";

const categoryRoom = Schema({
    name:{
        type: String,
        required:true,
        trim:true,
    },
    slug:{
        type:String,
        lowercase:true,
        unique:true 
    },
    status: {
        type: Boolean,
        default: true,
        require: true
    },
    address: {
        type: String,
        default: "Hà nội"
    },
    image: {
        type: String,
        default: "http://res.cloudinary.com/dkhutgvlb/image/upload/v1739795711/xwfbzfrvi09g0h3sxwfs.jpg",
        require: true
    },
}, {timestamps:true})

export default mongoose.model("Category", categoryRoom)