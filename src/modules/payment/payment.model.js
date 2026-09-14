import mongoose from "mongoose";

const PAYMENT_METHODS = ["CASH", "BANK_TRANSFER", "MOBILE_BANKING", "CARD", "ONLINE_PAYMENT", "CHEQUE"];

const paymentSchema = new mongoose.Schema(
  {
    studentFeeId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentFee", required: true },
    paymentMethod: { type: String, required: true, enum: PAYMENT_METHODS },
    transactionId: { type: String, trim: true, default: null }, // external reference (bank/mobile banking ref)
    amount: { type: Number, required: true, min: 0.01 },
    paymentDate: { type: Date, required: true, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    remarks: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["COMPLETED", "REVERSED"],
      default: "COMPLETED",
      // Per spec: "Deleting financial records is prohibited." A mistaken
      // payment is reversed via an offsetting entry, never deleted/edited.
    },
  },
  { timestamps: true }
);

export const PAYMENT_METHOD_VALUES = PAYMENT_METHODS;

paymentSchema.index({ studentFeeId: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
