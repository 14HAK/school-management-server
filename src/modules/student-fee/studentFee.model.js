import mongoose from "mongoose";

const adjustmentSchema = new mongoose.Schema(
  {
    field: { type: String, required: true }, // "discount" | "fine" | "amount"
    previousValue: { type: Number, required: true },
    newValue: { type: Number, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
    reason: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const studentFeeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    feeStructureId: { type: mongoose.Schema.Types.ObjectId, ref: "FeeStructure", required: true },
    amount: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    fine: { type: Number, default: 0, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    dueAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "OVERDUE", "CANCELLED"],
      default: "PENDING",
    },
    /**
     * Per spec: "Corrections must be recorded through adjustment entries."
     * Every change to amount/discount/fine after creation appends here
     * rather than silently overwriting — same pattern as exam mark
     * revisions in Phase 6.
     */
    adjustments: [adjustmentSchema],
  },
  { timestamps: true }
);

// A student should not have two fee records for the same fee structure.
studentFeeSchema.index({ studentId: 1, feeStructureId: 1 }, { unique: true });

const StudentFee = mongoose.model("StudentFee", studentFeeSchema);

export default StudentFee;
