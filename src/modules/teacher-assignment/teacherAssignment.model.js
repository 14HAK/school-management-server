import mongoose from "mongoose";

const teacherAssignmentSchema = new mongoose.Schema(
  {
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    academicYearId: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
      // required only for Class 9, Class 10, SSC — enforced in service layer
      // once class.hasGroups is known
    },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    isClassTeacher: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      default: "ACTIVE",
    },
    remarks: {
      type: String,
      trim: true,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Duplicate assignments are not allowed — same teacher+class+section+subject+year cannot exist twice.
teacherAssignmentSchema.index(
  { teacherId: 1, academicYearId: 1, classId: 1, sectionId: 1, subjectId: 1 },
  { unique: true }
);
teacherAssignmentSchema.index({ classId: 1, sectionId: 1 });
teacherAssignmentSchema.index({ subjectId: 1 });

const TeacherAssignment = mongoose.model("TeacherAssignment", teacherAssignmentSchema);

export default TeacherAssignment;
