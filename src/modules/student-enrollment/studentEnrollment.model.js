import mongoose from "mongoose";

const studentEnrollmentSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      // required only for Class 9, Class 10, SSC — enforced in service layer
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "PROMOTED", "TRANSFERRED", "COMPLETED", "DROPPED"],
      default: "PENDING",
    },
    admissionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    remarks: {
      type: String,
      trim: true,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      // per spec: "A deleted enrollment must never remove academic history" —
      // soft delete only, and even then the record is retained, just hidden
      // from default active listings.
    },
  },
  { timestamps: true }
);

// Roll Number is unique within Academic Year + Class + Section, per spec.
studentEnrollmentSchema.index(
  { academicYearId: 1, classId: 1, sectionId: 1, rollNumber: 1 },
  { unique: true }
);
studentEnrollmentSchema.index({ studentId: 1, academicYearId: 1 });

const StudentEnrollment = mongoose.model("StudentEnrollment", studentEnrollmentSchema);

export default StudentEnrollment;
