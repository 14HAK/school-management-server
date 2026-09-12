import mongoose from "mongoose";

const teacherAttendanceSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    date: { type: Date, required: true },
    attendanceStatus: {
      type: String,
      required: true,
      enum: ["PRESENT", "ABSENT", "LATE", "LEAVE", "HOLIDAY", "HALF_DAY"],
    },
    checkInTime: { type: String, default: null },
    checkOutTime: { type: String, default: null },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    remarks: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "VERIFIED", "LOCKED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

teacherAttendanceSchema.pre("validate", function assertCheckoutAfterCheckin(next) {
  if (this.checkInTime && this.checkOutTime && this.checkOutTime < this.checkInTime) {
    return next(new Error("Check-out time cannot be earlier than check-in time."));
  }
  next();
});

teacherAttendanceSchema.index({ teacherId: 1, date: 1 }, { unique: true });

const TeacherAttendance = mongoose.model("TeacherAttendance", teacherAttendanceSchema);

export default TeacherAttendance;
