import mongoose from "mongoose";

const revisionSchema = new mongoose.Schema(
  {
    previousMarks: { type: Number, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
    reason: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const examMarkSchema = new mongoose.Schema(
  {
    examScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSchedule", required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    obtainedMarks: { type: Number, required: true, min: 0 },
    remarks: { type: String, trim: true, default: null },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    enteredAt: { type: Date, default: Date.now },
    /**
     * Per 13-exam-engine.md: "Any correction must create a new revision
     * log." Implemented as an embedded history on the mark itself rather
     * than a separate top-level collection — simpler while still satisfying
     * the "never silently overwrite" requirement; each PATCH appends here
     * before applying the new value.
     */
    revisions: [revisionSchema],
  },
  { timestamps: true }
);

// One mark per student per exam schedule.
examMarkSchema.index({ examScheduleId: 1, studentId: 1 }, { unique: true });

const ExamMark = mongoose.model("ExamMark", examMarkSchema);

export default ExamMark;
