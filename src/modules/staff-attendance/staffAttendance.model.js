import mongoose from "mongoose";

const staffAttendanceSchema = new mongoose.Schema(
  {
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
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

staffAttendanceSchema.pre("validate", function assertCheckoutAfterCheckin(next) {
  if (this.checkInTime && this.checkOutTime && this.checkOutTime < this.checkInTime) {
    return next(new Error("Check-out time cannot be earlier than check-in time."));
  }
  next();
});

staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

const StaffAttendance = mongoose.model("StaffAttendance", staffAttendanceSchema);

export default StaffAttendance;
