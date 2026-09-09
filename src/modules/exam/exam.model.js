import mongoose from "mongoose";

const EXAM_TYPES = [
  "Class Test",
  "Monthly Test",
  "Model Test",
  "Half Yearly",
  "Annual",
  "Pre-Test",
  "Test Examination",
  "SSC",
  "Custom",
];

const examSchema = new mongoose.Schema(
  {
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    examName: { type: String, required: true, trim: true },
    examType: { type: String, required: true, enum: EXAM_TYPES },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "SCHEDULED", "ONGOING", "COMPLETED", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      // Per spec: "Historical Exam Data must never be deleted" — soft delete
      // only, and even then intended for genuine mistakes, not routine use.
    },
  },
  { timestamps: true }
);

examSchema.index({ academicYearId: 1, examName: 1 }, { unique: true });

export const EXAM_TYPE_VALUES = EXAM_TYPES;

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
