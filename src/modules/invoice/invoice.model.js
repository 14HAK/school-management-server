import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    studentFeeId: { type: mongoose.Schema.Types.ObjectId, ref: "StudentFee", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "SENT", "PAID", "CANCELLED"],
      default: "DRAFT",
    },
    issuedDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
