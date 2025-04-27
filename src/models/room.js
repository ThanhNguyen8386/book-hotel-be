// server/models/room.js
import mongoose, { Schema, ObjectId } from "mongoose";

const RoomSchema = Schema(
  {
    name: {
      type: String,
      minLength: 5,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
    image: {
      type: [String],
    },
    price: [
      {
        brand: {
          type: String,
          enum: ["overnight", "daily", "hourly"],
        },
        title: String,
        value: Number,
      },
    ],
    description: {
      type: String,
      minLength: 5,
    },
    status: {
      type: Boolean,
      default: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    date: {
      type: ObjectId,
      ref: "dateBooked",
    },
    facilities: [
      {
        type: ObjectId,
        ref: "Facilities",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// List rating
RoomSchema.virtual("ratings", {
  ref: "Comment",
  foreignField: "room",
  localField: "_id",
});

RoomSchema.pre(/^find/, function (next) {
  this.populate(["ratings", "listFacility"]);
  next();
});

RoomSchema.virtual("ratingAvg").get(function () {
  if (this.ratings && this.ratings.length > 0) {
    let totalStar = 0;
    this.ratings.forEach((item) => (totalStar += +item.star));
    return (totalStar / this.ratings.length).toFixed(1);
  }
  return 0;
});

RoomSchema.virtual("listFacility", {
  ref: "Facilities",
  foreignField: "_id",
  localField: "facilities", // Liên kết với mảng facilities
});

export default mongoose.model("Room", RoomSchema);