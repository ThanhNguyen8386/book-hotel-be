// server/models/Facilities.js
import mongoose, { Schema } from "mongoose";

const FacilitiesSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Facilities", FacilitiesSchema);