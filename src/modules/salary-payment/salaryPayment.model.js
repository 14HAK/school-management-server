import mongoose from "mongoose";
import { PAYMENT_METHOD_VALUES } from "../payment/payment.model.js";

const salaryPaymentSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    salaryStructureId: { type: mongoose.Schema.Types.ObjectId, ref: "SalaryStructure", default: null },
    paymentMonth: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "paymentMonth must be in YYYY-MM format."],
    },
    paymentDate: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true, min: 0.01 },
    paymentMethod: { type: String, required: true, enum: PAYMENT_METHOD_VALUES },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PAID",
    },
  },
  { timestamps: true }
);

// One salary payment per employee per month.
salaryPaymentSchema.index({ employeeId: 1, paymentMonth: 1 }, { unique: true });

const SalaryPayment = mongoose.model("SalaryPayment", salaryPaymentSchema);

export default SalaryPayment;
