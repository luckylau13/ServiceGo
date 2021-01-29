import mongoose, { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    text: {
      type: String,
      required: true
    },
    stars: {
      type: Number,
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export const Review = model("review", reviewSchema);
