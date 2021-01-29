import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      required: true,
      type: String
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const User = model("user", userSchema);
