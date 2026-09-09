import mongoose from "mongoose";

const examResultSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    totalMarks: { type: Number, required: true },
    obtainedMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    grade: { type: String, required: true },
    gpa: { type: Number, required: true },
    position: { type: Number, default: null },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

examResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });

const ExamResult = mongoose.model("ExamResult", examResultSchema);

export default ExamResult;
