import mongoose from "mongoose";

const examScheduleSchema = new mongoose.Schema(
  {
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    examDate: { type: Date, required: true },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "startTime must be in HH:mm format."],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "endTime must be in HH:mm format."],
    },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Academy", required: true },
    fullMarks: { type: Number, required: true, min: 1 },
    passMarks: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["DRAFT", "SCHEDULED", "ONGOING", "COMPLETED", "ARCHIVED"],
      default: "DRAFT",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

examScheduleSchema.pre("validate", function assertPassMarks(next) {
  if (this.passMarks > this.fullMarks) {
    return next(new Error("Pass marks cannot exceed full marks."));
  }
  next();
});

// One subject can have only one exam schedule within the same exam+class+section+group.
examScheduleSchema.index(
  { examId: 1, classId: 1, sectionId: 1, groupId: 1, subjectId: 1 },
  { unique: true }
);

const ExamSchedule = mongoose.model("ExamSchedule", examScheduleSchema);

export default ExamSchedule;
