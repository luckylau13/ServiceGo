import mongoose, { Schema, model } from "mongoose";

/**
 * This bookingSchema constant stores the defination of data that will be
 * saved to the database (MongoDB)
 */
const bookingSchema = new Schema(
  {
    type: { type: String /*, required: true */ },
    date: { /*, required: true */ type: Date },
    time: { type: String /*, required: true */ },
    location: { type: String /*, required: true */ },
    service_provider: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String
      // ref: 'User'
    },
    customer: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'User'
      type: String
    },
    status: {
      type: String,
      // required: true,
      default: "Not Started"
    },
    paid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Creates and export the Booking model that is built using booking schema above
export const Booking = model("booking", bookingSchema);
