import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      required: true,
      type: String
    },
    providerName: {
      type: String,
      required: true
    },
    providerEmail: {
      required: true,
      type: String
    },
    amount: {
      type: Number,
      required: true
    },
    paymentType: {
      type: String,
      required: true
    },
    paymentStatus: {
      type: String,
      required: true
    },
    serviceName: {
      type: String,
      required: true
    },
    serviceLocation: {
      type: String,
      required: true
    },
    serviceDate: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export const Payment = model('payment', paymentSchema);
