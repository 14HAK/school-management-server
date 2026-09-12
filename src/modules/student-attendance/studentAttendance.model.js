import mongoose from "mongoose";

const studentAttendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
    date: { type: Date, required: true },
    attendanceStatus: {
      type: String,
      required: true,
      enum: ["PRESENT", "ABSENT", "LATE", "LEAVE", "HOLIDAY", "HALF_DAY"],
    },
    checkInTime: { type: String, default: null }, // "HH:mm"
    checkOutTime: { type: String, default: null },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    remarks: { type: String, trim: true, default: null },
    /** Draft → Submitted → Verified → Locked, per spec. */
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "VERIFIED", "LOCKED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

studentAttendanceSchema.pre("validate", function assertCheckoutAfterCheckin(next) {
  if (this.checkInTime && this.checkOutTime && this.checkOutTime < this.checkInTime) {
    return next(new Error("Check-out time cannot be earlier than check-in time."));
  }
  next();
});

// One attendance record per student per day, per spec.
studentAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
studentAttendanceSchema.index({ classId: 1, sectionId: 1, date: 1 });

const StudentAttendance = mongoose.model("StudentAttendance", studentAttendanceSchema);

export default StudentAttendance;
