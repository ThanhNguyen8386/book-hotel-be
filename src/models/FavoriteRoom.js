import mongoose, { Schema, ObjectId } from "mongoose";

const favoriteRoomSchema = Schema(
  {
    user: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model('FavoriteRoom', favoriteRoomSchema);