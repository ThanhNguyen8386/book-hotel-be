import mongoose from "mongoose";
import { createHmac } from "crypto";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: process.env.DEFAULT_IMG,
    },
    role: {
      type: String,
      enum: [0, 1],
      default: 0
    },
    gender: {
      type: String
    },
    address: {
      type: String
    },
    status: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.password = this.encryptPassword(this.password);

  next();
});

UserSchema.methods = {
  encryptPassword(password) {
    if (!password) return;

    try {
      return createHmac("SHA256", "Happyweekend")
        .update(password)
        .digest("hex");
    } catch (error) {
      console.log(error);
    }
  },
  isAuthenticate(password) {
    return this.password == this.encryptPassword(password);
  },
};

const User = mongoose.model("User", UserSchema);
export default User;
