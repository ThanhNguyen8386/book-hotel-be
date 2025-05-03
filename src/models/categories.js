// server/models/categories.js
import mongoose, { Schema } from "mongoose";

const categoryRoom = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
    address: {
      type: String,
      default: "Hà nội",
    },
    image: {
      type: String,
      default:
        "http://res.cloudinary.com/dkhutgvlb/image/upload/v1739795711/xwfbzfrvi09g0h3sxwfs.jpg",
    },
    rooms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Room",
      },
    ],
    facilities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Facilities",
      },
    ],
    type: {
      type:String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Category", categoryRoom);