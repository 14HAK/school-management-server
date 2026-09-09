import mongoose from "mongoose";

const examInvigilatorSchema = new mongoose.Schema(
  {
    examScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "ExamSchedule", required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    role: {
      type: String,
      enum: ["MAIN", "ASSISTANT"],
      default: "MAIN",
    },
    status: {
      type: String,
      enum: ["ASSIGNED", "CONFIRMED", "CANCELLED"],
      default: "ASSIGNED",
    },
  },
  { timestamps: true }
);

// A teacher can only be assigned once per exam schedule (no duplicate invigilator entries).
examInvigilatorSchema.index({ examScheduleId: 1, teacherId: 1 }, { unique: true });

const ExamInvigilator = mongoose.model("ExamInvigilator", examInvigilatorSchema);

export default ExamInvigilator;
