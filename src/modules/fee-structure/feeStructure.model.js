import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
    amount: { type: Number, required: true, min: [0.01, "Amount must be greater than zero."] },
    description: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

feeStructureSchema.index({ academicYearId: 1, classId: 1, groupId: 1, name: 1 }, { unique: true });

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

export default FeeStructure;
