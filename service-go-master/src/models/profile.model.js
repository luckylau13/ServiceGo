import mongoose, { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: Number,
      required: false
    },
    category: {
      type: String
    },
    description: {
      type: String
    },
    provider: {
      type: Boolean,
      required: true
    },
    photoName: {
      type: String
    },

    handle: { type: String, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Profile = model("profile", profileSchema);
